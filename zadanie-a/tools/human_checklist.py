"""Vygeneruje hárok pre ľudskú kontrolu (L3 človekom): náhodná vzorka polí z finálnej DB.

python -I tools/human_checklist.py [počet_záznamov=10]  → verification/l3-checklist.csv
Recenzent otvorí URL, porovná s hodnotou a vyplní stĺpce human_verdict / human_note.
"""
import csv
import os
import random
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
n = int(sys.argv[1]) if len(sys.argv) > 1 else 10
random.seed(20261029)

inv = list(csv.DictReader(open(os.path.join(ROOT, "data", "investors.csv"), encoding="utf-8-sig")))
ev = list(csv.DictReader(open(os.path.join(ROOT, "data", "evidence.csv"), encoding="utf-8-sig")))
names = {r["id"]: r["name"] for r in inv}
sample = set(r["id"] for r in random.sample(inv, min(n, len(inv))))

rows = [e for e in ev if e["record_id"] in sample and e["field"] in
        ("legal_name", "sectors", "stages", "ticket", "capital", "last_investment", "independent_deal_evidence")]
with open(os.path.join(ROOT, "verification", "l3-checklist.csv"), "w", newline="", encoding="utf-8-sig") as fh:
    w = csv.writer(fh)
    w.writerow(["record_id", "investor", "field", "value", "source_url", "quote", "human_verdict (supported/partial/not_supported)", "human_note"])
    for e in sorted(rows, key=lambda e: (e["record_id"], e["field"])):
        w.writerow([e["record_id"], names[e["record_id"]], e["field"], e["value"], e["source_url"], e["quote"], "", ""])
print(f"{len(sample)} záznamov, {len(rows)} riadkov → verification/l3-checklist.csv")
