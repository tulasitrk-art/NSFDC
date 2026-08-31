import json

with open("all_330_schemes.json", "r", encoding="utf-8") as f:
    schemes = json.load(f)

# Sector icon map
ICON_MAP = {
    "MICRO": "🛒",
    "MICRO_WOMEN": "👩‍💼",
    "TERM": "🏢",
    "EDU_DOMESTIC": "🎓",
    "EDU_ABROAD": "✈️",
    "GREEN_ENERGY": "🌱",
    "SMALL_BUSINESS": "🔧",
    "SANITATION": "🚛",
    "ARTISAN": "🎨",
    "AGRI_WOMEN": "🌾"
}

ts_schemes = []
for s in schemes:
    scheme_id = s["scheme_id"]
    name = s["scheme_name"]
    cat = s.get("category", "MICRO")
    sec_name = s.get("sector_name", s.get("category", "General Micro Credit"))
    max_cost = float(s["max_project_cost"])
    govt_share = float(s["govt_share_percent"])
    margin = float(s["beneficiary_margin_percent"])
    rm = float(s["interest_rate_male"])
    rf = float(s["interest_rate_female"])
    mor = int(s["moratorium_months"])
    ten = int(s["max_tenure_years"])
    st = s.get("state_code", "ALL")
    desc = s.get("description", "")
    icon = ICON_MAP.get(cat, "✨")

    ts_schemes.append({
        "id": scheme_id,
        "name": name,
        "code": cat,
        "sector": sec_name,
        "maxCost": max_cost,
        "govtSharePercent": govt_share,
        "marginPercent": margin,
        "interestFemale": rf,
        "interestMale": rm,
        "moratoriumMonths": mor,
        "repaymentYears": ten,
        "description": desc,
        "eligibilityCriteria": "Scheduled Caste / Target Beneficiary, Annual Family Income ≤ ₹ 5,00,000",
        "targetStateCode": st,
        "icon": icon
    })

ts_content = f"""// Statutory Concessional Schemes Master Database (330 Schemes)
// Contains 10 Core NSFDC Schemes, 20 Central Apex Schemes, and 300 State SCDC Schemes across 30 States & UTs.

export interface StatutoryScheme {{
  id: string;
  name: string;
  code: string;
  sector: string;
  maxCost: number;
  govtSharePercent: number;
  marginPercent: number;
  interestFemale: number;
  interestMale: number;
  moratoriumMonths: number;
  repaymentYears: number;
  description: string;
  eligibilityCriteria: string;
  targetStateCode?: string;
  icon: string;
}}

export const ALL_STATUTORY_SCHEMES: StatutoryScheme[] = {json.dumps(ts_schemes, indent=2, ensure_ascii=False)};

// Alias for backward compatibility
export const ALL_500_SCHEMES: StatutoryScheme[] = ALL_STATUTORY_SCHEMES;

export function getSchemeById(schemeId: string): StatutoryScheme {{
  return (
    ALL_STATUTORY_SCHEMES.find((s) => s.id === schemeId) ||
    ALL_STATUTORY_SCHEMES[0] // NSFDC_MCF fallback
  );
}}

export function searchAndRecommendSchemes(params: {{
  projectCost?: number;
  annualIncome?: number;
  gender?: string;
  activitySector?: string;
  stateCode?: string;
  category?: string;
  query?: string;
}}): StatutoryScheme[] {{
  const {{
    projectCost = 140000,
    gender = "FEMALE",
    activitySector = "",
    stateCode = "ALL",
    category = "ALL",
    query = "",
  }} = params;

  return ALL_STATUTORY_SCHEMES.filter((sch) => {{
    // State Filter
    if (stateCode && stateCode !== "ALL") {{
      if (sch.targetStateCode && sch.targetStateCode !== "ALL" && sch.targetStateCode !== stateCode) {{
        return false;
      }}
    }}

    // Category Filter
    if (category && category !== "ALL") {{
      if (sch.code.toUpperCase() !== category.toUpperCase()) {{
        return false;
      }}
    }}

    // Query Filter
    if (query && query.trim() !== "") {{
      const q = query.toLowerCase().trim();
      const matchName = sch.name.toLowerCase().includes(q);
      const matchSector = sch.sector.toLowerCase().includes(q);
      const matchId = sch.id.toLowerCase().includes(q);
      const matchDesc = sch.description.toLowerCase().includes(q);
      if (!matchName && !matchSector && !matchId && !matchDesc) {{
        return false;
      }}
    }}

    return true;
  }});
}}
"""

with open("frontend/src/lib/schemes_db.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated frontend/src/lib/schemes_db.ts with {len(ts_schemes)} schemes.")
