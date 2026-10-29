"""Meranie presnosti pilotu: zber (L0) vs. nezávislé overenie (L2) vs. rozhodnutie L3.

python -I tools/measure.py  → verification/metrics.json + tabuľky na stdout

Vstupy:
  data/raw/batch-*.json              čo tvrdil zberový agent
  verification/l2-part*.json         verdikty nezávislého overovateľa
  verification/l3-adjudication.json  moje (L3) rozhodnutie pri nezhodách + ručné kontroly
"""
import glob
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, "verification")
sys.stdout.reconfigure(encoding="utf-8")


def wilson(k, n, z=1.96):
    if n == 0:
        return (0.0, 0.0)
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (max(0.0, c - h), min(1.0, c + h))


def fmt(k, n):
    lo, hi = wilson(k, n)
    return f"{k}/{n} = {k / n:.0%} (95 % CI {lo:.0%}–{hi:.0%})" if n else "–"


raw = {}
for p in sorted(glob.glob(os.path.join(ROOT, "data", "raw", "batch-*.json"))):
    for r in json.load(open(p, encoding="utf-8")):
        raw[r["name"]] = r

l2, rechecks = {}, {}
for p in sorted(glob.glob(os.path.join(V, "l2-part*.json"))):
    d = json.load(open(p, encoding="utf-8"))
    for r in d if isinstance(d, list) else d.get("included", []):
        l2[r["name"]] = r
    if isinstance(d, dict):
        for r in d.get("excluded_recheck", []):
            rechecks[r["name"]] = r

adj_path = os.path.join(V, "l3-adjudication.json")
adj = json.load(open(adj_path, encoding="utf-8")) if os.path.exists(adj_path) else {"records": {}, "spot_checks": []}

included = [n for n, r in raw.items() if r.get("decision") == "include"]
missing = [n for n in included if n not in l2]

# --- 1. Presnosť polí zberového agenta podľa L2 ---
verdicts = {"supported": 0, "partial": 0, "not_supported": 0, "unavailable": 0}
by_field = {}
for n in included:
    for f, v in (l2.get(n, {}).get("fields") or {}).items():
        vv = v.get("verdict", "unavailable")
        verdicts[vv] = verdicts.get(vv, 0) + 1
        by_field.setdefault(f, {}).setdefault(vv, 0)
        by_field[f][vv] += 1
checked = verdicts["supported"] + verdicts["partial"] + verdicts["not_supported"]

# --- 2. Presnosť zaradenia: zber vs. finálne rozhodnutie (L2 + L3) ---
def final_ok(n):
    # Bol záznam zberového agenta správny tak, ako ho odovzdal? (Jet: entita bola VC len po preštruktúrovaní → chyba.)
    a = adj["records"].get(n)
    if a and "collector_record_correct" in a:
        return a["collector_record_correct"]
    if a and "final_correct" in a:
        return a["final_correct"]
    r = l2.get(n, {})
    return bool(r.get("is_active_investor") is True and r.get("type_correct") is True and r.get("hq_in_cz") is True)

correct = [n for n in included if n in l2 and final_ok(n)]
wrong = [n for n in included if n in l2 and not final_ok(n)]
l2_flagged = [n for n in included if n in l2 and not all(l2[n].get(k) is True for k in ("is_active_investor", "type_correct", "hq_in_cz"))]

# --- 3. Falošne negatívne (vyradení, ktorí mali byť zaradení) ---
fn = [n for n, r in rechecks.items() if (adj["records"].get(n, {}).get("final_correct") if n in adj["records"] else r.get("should_be_included") is True)]

# --- 4. Spoľahlivosť samotného overovateľa (moje ručné kontroly L3) ---
spots = adj.get("spot_checks", [])
spot_agree = sum(1 for s in spots if s.get("agrees_with_l2"))

m = {
    "candidates": len(raw), "included_by_collector": len(included), "not_yet_verified": missing,
    "field_verdicts": verdicts, "field_verdicts_by_field": by_field,
    "field_accuracy_strict": verdicts["supported"] / checked if checked else None,
    "field_accuracy_lenient": (verdicts["supported"] + verdicts["partial"]) / checked if checked else None,
    "record_precision_collector": {"correct": len(correct), "n": len(correct) + len(wrong), "wrong": wrong},
    "l2_flagged_records": l2_flagged,
    "false_negatives": {"found": fn, "rechecked": len(rechecks)},
    "spot_checks": {"agree": spot_agree, "n": len(spots)},
}
json.dump(m, open(os.path.join(V, "metrics.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print(f"Kandidáti: {len(raw)}, zaradení zberom: {len(included)}, ešte neoverení L2: {len(missing)} {missing}")
print(f"Verdikty polí L2: {verdicts}")
print(f"Presnosť polí (len 'supported'):          {fmt(verdicts['supported'], checked)}")
print(f"Presnosť polí (aj 'partial'):              {fmt(verdicts['supported'] + verdicts['partial'], checked)}")
print(f"Presnosť zaradenia zberového agenta:        {fmt(len(correct), len(correct) + len(wrong))}  zle: {wrong}")
print(f"L2 označil ako problém (aktivita/typ/sídlo): {l2_flagged}")
print(f"Falošne negatívne medzi {len(rechecks)} znovu overenými vyradenými: {fn}")
print(f"Ručné kontroly overovateľa (L3): {fmt(spot_agree, len(spots))}")
print("\nPo poliach:")
for f, c in sorted(by_field.items()):
    n = sum(c.values()) - c.get("unavailable", 0)
    print(f"  {f:28s} {c}  → strict {c.get('supported', 0) / n:.0%}" if n else f"  {f:28s} {c}")
