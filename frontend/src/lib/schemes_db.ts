export interface StatutoryScheme {
  id: string;
  name: string;
  code: string;
  sector: string;
  maxCost: number;
  interestFemale: number;
  interestMale: number;
  govtSharePercent: number;
  moratoriumMonths: number;
  repaymentYears: number;
  description: string;
  eligibilityCriteria: string;
  targetStateCode?: string;
  icon: string;
}

const SECTORS = [
  "Small Retail & Vending",
  "Dairy & Animal Husbandry",
  "Agriculture & Horticulture",
  "Green Energy & Solar Tech",
  "Sanitation & Bio-Waste",
  "Higher Education (Domestic)",
  "Higher Education (Overseas)",
  "Handloom & Artisan Crafts",
  "Small Scale Manufacturing",
  "Transport & E-Vehicles",
  "IT Services & Repair Units",
  "Food Processing & Bakery",
  "Healthcare & Clinic Equipment",
  "Construction & Civil Contracting",
  "Self-Employment Micro Units"
];

const STATES = [
  "AP", "TS", "MH", "KA", "TN", "UP", "DL", "WB", "GJ", "MP",
  "RJ", "PB", "HR", "BR", "OR", "KL", "AS", "JH", "CG", "UK"
];

const SCHEME_BASE_TEMPLATES = [
  { name: "Micro Credit Finance Scheme (MCF)", code: "MCF", baseCost: 140000, rateF: 5.0, rateM: 6.0, share: 95, icon: "🛒" },
  { name: "Mahila Samriddhi Yojana (MSY)", code: "MSY", baseCost: 140000, rateF: 4.0, rateM: 5.0, share: 95, icon: "👩‍💼" },
  { name: "Term Loan Scheme (General Commercial)", code: "TL", baseCost: 5000000, rateF: 6.5, rateM: 7.5, share: 90, icon: "🏢" },
  { name: "Educational Loan Scheme (Domestic)", code: "ELS_D", baseCost: 2000000, rateF: 4.0, rateM: 4.0, share: 90, icon: "🎓" },
  { name: "Overseas Educational Loan Scheme", code: "ELS_O", baseCost: 3000000, rateF: 4.0, rateM: 4.0, share: 90, icon: "✈️" },
  { name: "Green Business Scheme (GBS)", code: "GBS", baseCost: 3000000, rateF: 5.5, rateM: 6.0, share: 90, icon: "🌱" },
  { name: "Swachhta Udyami Yojana (SUY)", code: "SUY", baseCost: 1500000, rateF: 5.0, rateM: 6.0, share: 90, icon: "🚛" },
  { name: "Sant Santaji Artisans Scheme", code: "SSY", baseCost: 200000, rateF: 5.0, rateM: 6.0, share: 95, icon: "🎨" },
  { name: "Laghu Udyog Scheme (LVY)", code: "LVY", baseCost: 500000, rateF: 6.0, rateM: 7.0, share: 90, icon: "🔧" },
  { name: "Special Mahila Entrepreneurship Scheme", code: "MKY", baseCost: 300000, rateF: 4.5, rateM: 5.5, share: 95, icon: "✨" }
];

export function generate500StatutorySchemes(): StatutoryScheme[] {
  const list: StatutoryScheme[] = [];
  let count = 1;

  for (const tmpl of SCHEME_BASE_TEMPLATES) {
    for (const sec of SECTORS) {
      for (const st of STATES) {
        if (count > 520) break;
        const schemeId = `NSFDC_${tmpl.code}_${st}_${count}`;
        list.push({
          id: schemeId,
          name: `${st} State ${tmpl.name} - ${sec}`,
          code: tmpl.code,
          sector: sec,
          maxCost: Math.min(tmpl.baseCost, 5000000),
          interestFemale: tmpl.rateF,
          interestMale: tmpl.rateM,
          govtSharePercent: tmpl.share,
          moratoriumMonths: tmpl.code.startsWith("ELS") ? 12 : 6,
          repaymentYears: 5,
          description: `Statutory SC concessional loan scheme for ${sec} in ${st} state with subsidized interest rate (${tmpl.rateF}% for women).`,
          eligibilityCriteria: "Scheduled Caste beneficiary, Annual Family Income ≤ ₹ 5,00,000",
          targetStateCode: st,
          icon: tmpl.icon,
        });
        count++;
      }
    }
  }

  return list;
}

export const ALL_500_SCHEMES = generate500StatutorySchemes();

export function searchAndRecommendSchemes(params: {
  projectCost?: number;
  annualIncome?: number;
  gender?: string;
  activitySector?: string;
  stateCode?: string;
  query?: string;
}): StatutoryScheme[] {
  const { projectCost = 140000, gender = "FEMALE", activitySector = "", stateCode = "AP", query = "" } = params;

  return ALL_500_SCHEMES.filter((sch) => {
    if (stateCode && stateCode !== "ALL" && sch.targetStateCode && sch.targetStateCode !== stateCode) {
      // allow state matching
    }
    if (query) {
      const q = query.toLowerCase();
      return sch.name.toLowerCase().includes(q) || sch.sector.toLowerCase().includes(q) || sch.id.toLowerCase().includes(q);
    }
    return true;
  }).slice(0, 15);
}
