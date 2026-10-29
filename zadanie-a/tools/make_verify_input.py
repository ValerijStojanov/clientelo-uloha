"""Pripraví vstup pre nezávislého overovateľa (L2) — bez zdôvodnenia, confidence a citátov zberového agenta.

python -I tools/make_verify_input.py batch-1 batch-4 > verification/input-1.json
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = {"included": [], "excluded_recheck": []}
for name in sys.argv[1:]:
    with open(os.path.join(ROOT, "data", "raw", f"{name}.json"), encoding="utf-8") as f:
        for r in json.load(f):
            fields = r.get("fields", {})
            if r.get("decision") == "include":
                out["included"].append({
                    "name": r["name"],
                    "claimed_type": r.get("type"), "claimed_subtype": r.get("subtype"),
                    "fields": {k: {"value": v.get("value"), "urls": [s.get("url") for s in v.get("src") or []]}
                               for k, v in fields.items() if v and v.get("value") not in (None, [], {})},
                })
            # Vyradené pre neaktivitu / neoveriteľnosť môžu byť falošne negatívne → znovu overiť.
            elif set(r.get("exclusion_codes") or []) & {"X8", "X9"}:
                out["excluded_recheck"].append({
                    "name": r["name"],
                    "website": (fields.get("website") or {}).get("value"),
                    "claim": "Subjekt nemá žiadnu doloženú novú investíciu od 2024-10-29 (neaktívny) alebo je neoveriteľný.",
                })
sys.stdout.reconfigure(encoding="utf-8")
print(json.dumps(out, ensure_ascii=False, indent=1))
