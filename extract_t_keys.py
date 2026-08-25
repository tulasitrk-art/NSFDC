import re
import os
import glob

all_ts_files = glob.glob("frontend/src/**/*.tsx", recursive=True) + glob.glob("frontend/src/**/*.ts", recursive=True)

t_keys = set()
for fpath in all_ts_files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
        matches = re.findall(r't\(\s*["\']([^"\']+)["\']\s*\)', content)
        for m in matches:
            t_keys.add((m, fpath))

print(f"Total unique t() calls in codebase: {len(set(k[0] for k in t_keys))}")
for k, path in sorted(t_keys):
    print(f"{k} (in {os.path.basename(path)})")
