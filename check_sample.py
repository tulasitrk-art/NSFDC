import json

for lang in ['mr', 'bn', 'gu', 'te', 'hi', 'en']:
    with open(f"frontend/src/lib/i18n/{lang}.json", "r", encoding="utf-8") as f:
        d = json.load(f)
        print(f"=== {lang.upper()} SAMPLE KEYS ===")
        print("intake.title:", d.get("intake", {}).get("title"))
        print("intake.q1_title:", d.get("intake", {}).get("q1_title"))
        print("intake.q6_title:", d.get("intake", {}).get("q6_title"))
        print("intake.q8_title:", d.get("intake", {}).get("q8_title"))
        print("wizard.step1Title:", d.get("wizard", {}).get("step1Title"))
        print("wizard.scNotice:", d.get("wizard", {}).get("scNotice"))
