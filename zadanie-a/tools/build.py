"""Zlúči výstupy zberových agentov (data/raw/batch-*.json) do CSV a spraví L1 kontroly.

python -I tools/build.py            # s kontrolou URL a ARES (sieť)
python -I tools/build.py --offline  # bez siete

Výstup: data/investors.csv, data/evidence.csv, data/excluded.csv, verification/l1-report.md
"""
import csv
import glob
import json
import os
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = date(2026, 10, 29)
WINDOW_START = date(2024, 10, 29)  # okno aktivity VC = 24 mesiacov
# Kurz ČNB k 27. 10. 2026 (denni_kurz.txt): koľko EUR za 1 jednotku meny.
EUR_PER = {"EUR": 1.0, "CZK": 1 / 24.340, "USD": 21.834 / 24.340, "GBP": 29.097 / 24.340}
OFFLINE = "--offline" in sys.argv
UA = {"User-Agent": "Mozilla/5.0 (investor-db-verification; contact: research)"}

FIELDS = ["legal_name", "registry_id", "hq_city", "website", "sectors", "stages",
          "ticket", "capital", "last_investment", "independent_deal_evidence"]


def domain(url):
    host = urlparse(url or "").hostname or ""
    return host[4:] if host.startswith("www.") else host


def to_eur(amount, currency):
    if amount is None or currency not in EUR_PER:
        return None
    return round(amount * EUR_PER[currency])


def parse_date(s):
    if not s:
        return None
    m = re.match(r"(\d{4})-(\d{2})(?:-(\d{2}))?", str(s))
    if not m:
        return None
    return date(int(m[1]), int(m[2]), int(m[3] or 1))


def http_status(url):
    try:
        req = urllib.request.Request(url, headers=UA, method="GET")
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:  # timeout, DNS, SSL
        return type(e).__name__


def ares_name(ico):
    try:
        url = f"https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/{ico}"
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
            return json.load(r).get("obchodniJmeno")
    except Exception:
        return None


def norm(s):
    s = (s or "").lower()
    s = re.sub(r"[,.]|\b(a\.s|s\.r\.o|se|sicav|investiční fond|s proměnným základním kapitálem)\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def apply_l3(records):
    """Aplikuje rozhodnutia L3 (verification/l3-adjudication.json) na výstup zberu.

    Pôvodné hodnoty zberového agenta zostávajú v data/raw/ — tu vzniká finálna verzia.
    """
    path = os.path.join(ROOT, "verification", "l3-adjudication.json")
    if not os.path.exists(path):
        return records
    adj = json.load(open(path, encoding="utf-8"))["records"]
    for r in records:
        a = adj.get(r["name"])
        if not a:
            r["l3_status"] = "overené L2" if r.get("decision") == "include" else ""
            continue
        was_included = r.get("decision") == "include"
        if "final_correct" in a:
            r["decision"] = "include" if a["final_correct"] else "exclude"
        if r["decision"] == "exclude":
            if a.get("exclusion_codes"):
                r["exclusion_codes"] = a["exclusion_codes"]
            r["decision_reason"] = a.get("decision", r.get("decision_reason"))
            if a.get("real_investor_other_type"):
                r["type"] = a["real_investor_other_type"]
            r["l3_status"] = "vyradené L3" if was_included else ("kód opravený L3" if a.get("code_corrected") else "")
            continue
        if a.get("rename"):
            r["name_collector"], r["name"] = r["name"], a["rename"]
        for k in ("subtype", "type_secondary", "confidence", "capital_status"):
            if k in a:
                r[k] = a[k]
        f = r.setdefault("fields", {})
        for fname, c in (a.get("corrections") or {}).items():
            old = f.get(fname) or {}
            f[fname] = {**{k: v for k, v in c.items() if k != "note"},
                        "src": c.get("src") if "src" in c else (old.get("src") if c.get("value") is not None else []),
                        "l3_note": c.get("note")}
        r["l3_status"] = "pridané L3" if not was_included else ("opravené L3" if a.get("corrections") or a.get("rename") else "overené L2+L3")
    return records


def main():
    records = []
    for path in sorted(glob.glob(os.path.join(ROOT, "data", "raw", "batch-*.json"))):
        with open(path, encoding="utf-8") as f:
            records.extend(json.load(f))
    records = apply_l3(records)

    included = [r for r in records if r.get("decision") == "include"]
    excluded = [r for r in records if r.get("decision") != "include"]

    # Všetky URL naraz (paralelne), aby L1 netrvalo večnosť.
    urls = set()
    for r in included:
        for fname in FIELDS:
            for s in (r.get("fields", {}).get(fname) or {}).get("src") or []:
                if s.get("url"):
                    urls.add(s["url"])
    status = {}
    if not OFFLINE:
        with ThreadPoolExecutor(12) as ex:
            for u, st in zip(urls, ex.map(http_status, urls)):
                status[u] = st

    inv_rows, ev_rows, report = [], [], []
    seen_domains = {}
    for i, r in enumerate(included, 1):
        rid = f"CZVC{i:03d}"
        f = r.get("fields", {})
        val = lambda k: (f.get(k) or {}).get("value")
        flags = []

        ticket = val("ticket") or {}
        cap = val("capital") or {}
        t_cur = ticket.get("currency") if isinstance(ticket, dict) else None
        tmin = to_eur(ticket.get("min"), t_cur) if isinstance(ticket, dict) else None
        tmax = to_eur(ticket.get("max"), t_cur) if isinstance(ticket, dict) else None
        cap_eur = to_eur(cap.get("amount"), cap.get("currency")) if isinstance(cap, dict) else None
        last = val("last_investment") or {}
        indep = f.get("independent_deal_evidence") or {}

        # --- L1 kontroly ---
        for fname in FIELDS:
            fv = f.get(fname) or {}
            if fv.get("value") not in (None, [], {}) and not fv.get("src"):
                flags.append(f"{fname}:bez_zdroja")
        ld = parse_date(last.get("date") if isinstance(last, dict) else None)
        if not ld:
            flags.append("posledna_investicia:bez_datumu")
        elif ld < WINDOW_START:
            flags.append("posledna_investicia:mimo_okna_24m")
        site = domain(val("website"))
        indep_src = [domain(s.get("url")) for s in indep.get("src") or []]
        if not indep_src:
            flags.append("nezavisly_dokaz:chyba")
        elif site and all(d.endswith(site) for d in indep_src):
            flags.append("nezavisly_dokaz:je_web_investora")
        if tmax and cap_eur and tmax > cap_eur:
            flags.append("ticket>kapital")
        for req in ("sectors", "stages", "hq_city", "website"):
            if not val(req):
                flags.append(f"{req}:chyba_povinne")
        # Fond len na pre-seed s minimálnym tiketom nad 500 tis. EUR je podozrivý (typicky 50–500 tis.).
        if tmin and tmin > 500_000 and (val("stages") or []) == ["pre-seed"]:
            flags.append("ticket_vs_stage:podozrive")
        if site:
            if site in seen_domains:
                flags.append(f"duplicita:{seen_domains[site]}")
            seen_domains[site] = rid
        ico = str(val("registry_id") or "")
        ares = None
        if ico:
            if not re.fullmatch(r"\d{8}", ico):
                flags.append("ico:zly_format")
            elif not OFFLINE:
                ares = ares_name(ico)
                if not ares:
                    flags.append("ico:nenajdene_v_ARES")
                elif norm(ares)[:12] != norm(val("legal_name"))[:12]:
                    flags.append(f"ico:iny_nazov_v_ARES({ares})")
        dead = sorted({s.get("url") for fn in FIELDS for s in (f.get(fn) or {}).get("src") or []
                       if not isinstance(status.get(s.get("url"), 200), int) or status.get(s.get("url"), 200) >= 400})
        if dead:
            flags.append(f"nedostupne_url:{len(dead)}")

        inv_rows.append({
            "id": rid, "name": r["name"], "legal_name": val("legal_name"), "registry_id": ico or None,
            "type": r.get("type"), "subtype": r.get("subtype"), "type_secondary": r.get("type_secondary"),
            "country": "CZ", "hq_city": val("hq_city"), "website": val("website"),
            "sectors": ";".join(val("sectors") or []), "stages": ";".join(val("stages") or []),
            "ticket_min_eur": tmin, "ticket_max_eur": tmax,
            "ticket_original": (f'{ticket.get("min") or "?"}–{ticket.get("max") or "?"} {t_cur}') if t_cur else None,
            "ticket_basis": (f.get("ticket") or {}).get("basis"),
            "capital_eur": cap_eur,
            "capital_original": f'{cap.get("amount")} {cap.get("currency")}' if isinstance(cap, dict) and cap.get("amount") else None,
            "capital_measure": (f.get("capital") or {}).get("measure"),
            "capital_as_of": (f.get("capital") or {}).get("as_of"),
            "capital_basis": (f.get("capital") or {}).get("basis"),
            "capital_status": r.get("capital_status"),
            "last_investment_company": last.get("company") if isinstance(last, dict) else None,
            "last_investment_date": last.get("date") if isinstance(last, dict) else None,
            "last_investment_round": last.get("round") if isinstance(last, dict) else None,
            "confidence": r.get("confidence"), "l1_flags": ";".join(flags),
            "verification": r.get("l3_status", ""),
        })
        for fname in FIELDS:
            fv = f.get(fname) or {}
            v = fv.get("value")
            for s in fv.get("src") or []:
                ev_rows.append({
                    "record_id": rid, "field": fname,
                    "value": json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else v,
                    "basis": fv.get("basis"), "source_url": s.get("url"), "publisher": s.get("publisher"),
                    "published": s.get("published"), "retrieved": s.get("retrieved"),
                    "quote": s.get("quote"), "http_status": status.get(s.get("url"), "neoverené"),
                    "l3_note": fv.get("l3_note"),
                })
        report.append((rid, r["name"], flags, ares))

    out = lambda name: os.path.join(ROOT, "data", name)
    for name, rows in (("investors.csv", inv_rows), ("evidence.csv", ev_rows)):
        with open(out(name), "w", newline="", encoding="utf-8-sig") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)
    with open(out("excluded.csv"), "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh)
        w.writerow(["name", "website", "exclusion_codes", "reason", "type_if_investor", "verification"])
        for r in excluded:
            w.writerow([r["name"], (r.get("fields", {}).get("website") or {}).get("value"),
                        ";".join(r.get("exclusion_codes") or []), r.get("decision_reason"), r.get("type"),
                        r.get("l3_status", "")])

    n_urls = len(urls)
    ok = sum(1 for s in status.values() if isinstance(s, int) and s < 400)
    lines = ["# L1 — automatické kontroly", "",
             f"Záznamov v DB: **{len(inv_rows)}**, vyradených: **{len(excluded)}**, "
             f"dôkazov (riadkov v evidence.csv): **{len(ev_rows)}**.", ""]
    if not OFFLINE:
        lines += [f"URL zdrojov: {n_urls}, dostupných (HTTP < 400): {ok} ({ok / max(n_urls, 1):.0%}). "
                  "Pozn.: niektoré weby blokujú skripty (403) aj keď v prehliadači fungujú — tie overuje L2.", ""]
    n = max(len(inv_rows), 1)
    filled = lambda k: sum(1 for r in inv_rows if r[k] not in (None, ""))
    lines += ["**Úplnosť polí** (podiel záznamov s hodnotou):", "",
              "| Pole | Vyplnené |", "|---|---|"]
    for k, label in (("sectors", "sektory"), ("stages", "štádiá"), ("ticket_max_eur", "ticket"),
                     ("capital_eur", "kapitál"), ("registry_id", "IČO"), ("last_investment_date", "posledná investícia")):
        lines.append(f"| {label} | {filled(k)}/{len(inv_rows)} ({filled(k) / n:.0%}) |")
    lines += ["", "| ID | Investor | Príznaky L1 | Názov v ARES |", "|---|---|---|---|"]
    for rid, name, flags, ares in report:
        lines.append(f"| {rid} | {name} | {'; '.join(flags) or 'OK'} | {ares or ''} |")
    with open(os.path.join(ROOT, "verification", "l1-report.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    print(f"included={len(inv_rows)} excluded={len(excluded)} evidence={len(ev_rows)} urls={n_urls} ok={ok}")


if __name__ == "__main__":
    main()
