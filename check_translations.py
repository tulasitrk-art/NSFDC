import json
import os

langs = ['en', 'hi', 'te', 'ta', 'kn', 'mr', 'bn', 'gu']

print("=== CHECKING frontend/src/lib/i18n ===")
for l in langs:
    path = f"frontend/src/lib/i18n/{l}.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            d = json.load(f)
            intake_len = len(d.get("intake", {}))
            wizard_len = len(d.get("wizard", {}))
            calc_len = len(d.get("calculator", {}))
            print(f"{l}: top_keys={len(d)}, intake_keys={intake_len}, wizard_keys={wizard_len}, calc_keys={calc_len}")
    else:
        print(f"{l}: FILE NOT FOUND: {path}")

print("\n=== CHECKING frontend/src/locales ===")
for l in langs:
    path = f"frontend/src/locales/{l}.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            d = json.load(f)
            intake_len = len(d.get("intake", {}))
            print(f"{l}: top_keys={len(d)}, intake_keys={intake_len}")
