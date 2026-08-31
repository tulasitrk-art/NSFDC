import json
import os

# 1. Copy all_330_schemes.json to backend/app/core/schemes_catalog.json
with open("all_330_schemes.json", "r", encoding="utf-8") as f:
    schemes_data = json.load(f)

backend_catalog_path = "backend/app/core/schemes_catalog.json"
with open(backend_catalog_path, "w", encoding="utf-8") as f:
    json.dump(schemes_data, f, indent=2, ensure_ascii=False)

print(f"Wrote {len(schemes_data)} schemes to {backend_catalog_path}")

# 2. Update backend/app/db/init_db.sql with all 330 schemes
sql_values = []
for s in schemes_data:
    scheme_id = s["scheme_id"].replace("'", "''")
    name = s["scheme_name"].replace("'", "''")
    cat = s["category"].replace("'", "''")
    max_cost = f"{float(s['max_project_cost']):.2f}"
    govt_share = f"{float(s['govt_share_percent']):.2f}"
    margin = f"{float(s['beneficiary_margin_percent']):.2f}"
    rf = f"{float(s['interest_rate_female']):.2f}"
    rm = f"{float(s['interest_rate_male']):.2f}"
    mor = int(s["moratorium_months"])
    ten = int(s["max_tenure_years"])
    desc = s["description"].replace("'", "''")
    sql_values.append(f"('{scheme_id}', '{name}', '{cat}', {max_cost}, {govt_share}, {margin}, {rm}, {rf}, {mor}, {ten}, '{desc}')")

sql_inserts = ",\n".join(sql_values)

with open("backend/app/db/init_db.sql", "r", encoding="utf-8") as f:
    sql_content = f.read()

# Replace the TRUNCATE & INSERT block
start_marker = "-- 1. ALL 10 OFFICIAL NSFDC STATUTORY SCHEMES"
end_marker = "-- 2. CHANNEL PARTNERS ACROSS INDIAN STATES"

start_idx = sql_content.find(start_marker)
end_idx = sql_content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = f"""-- 1. ALL 330 OFFICIAL STATUTORY & STATE CONCESSIONAL SCHEMES
CREATE TABLE IF NOT EXISTS schemes (
    scheme_id VARCHAR(64) PRIMARY KEY,
    scheme_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    max_project_cost NUMERIC(14, 2) NOT NULL,
    govt_share_percent NUMERIC(5, 2) NOT NULL,
    beneficiary_margin_percent NUMERIC(5, 2) NOT NULL,
    interest_rate_male NUMERIC(4, 2) NOT NULL,
    interest_rate_female NUMERIC(4, 2) NOT NULL,
    moratorium_months INT NOT NULL,
    max_tenure_years INT NOT NULL,
    description TEXT
);

TRUNCATE TABLE schemes CASCADE;
INSERT INTO schemes VALUES
{sql_inserts};

"""
    updated_sql = sql_content[:start_idx] + new_block + sql_content[end_idx:]
    with open("backend/app/db/init_db.sql", "w", encoding="utf-8") as f:
        f.write(updated_sql)
    print("Updated backend/app/db/init_db.sql successfully with 330 schemes.")
else:
    print("Could not find markers in init_db.sql")
