import json
import os

langs = ['en', 'hi', 'te', 'ta', 'kn', 'mr', 'bn', 'gu']

def get_all_keys(d, prefix=""):
    keys = {}
    for k, v in d.items():
        curr = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_all_keys(v, curr))
        else:
            keys[curr] = v
    return keys

with open("frontend/src/lib/i18n/en.json", "r", encoding="utf-8") as f:
    en_data = json.load(f)
en_keys = get_all_keys(en_data)

print(f"Total English keys: {len(en_keys)}")

for l in langs:
    path = f"frontend/src/lib/i18n/{l}.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    keys = get_all_keys(data)
    missing = [k for k in en_keys if k not in keys]
    same_as_en = [k for k in en_keys if k in keys and keys[k] == en_keys[k] and l != 'en']
    print(f"\nLanguage [{l}]: total keys={len(keys)}, missing={len(missing)}, same_as_en={len(same_as_en)}")
    if missing:
        print(f"  Missing sample: {missing[:5]}")
    if same_as_en:
        print(f"  Same as EN sample: {same_as_en[:10]}")
