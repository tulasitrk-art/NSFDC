export interface CasteCategory {
  id: string;
  code: string;
  label: string;
  shortName: string;
  group: "SC_ST" | "OBC" | "GENERAL_EWS" | "SPECIAL_TRIBES" | "PWD" | "MINORITY";
  groupLabel: string;
  apexCorporation: string;
  ministry: string;
  concessionalRateFemale: number;
  concessionalRateMale: number;
  maxGovtShare: number;
  incomeCeiling: number;
  certificateType: string;
  icon: string;
  description: string;
}

export const ALL_CASTE_CATEGORIES: CasteCategory[] = [
  // 1. SC – Scheduled Castes
  {
    id: "SC",
    code: "SC",
    label: "SC – Scheduled Castes",
    shortName: "Scheduled Castes",
    group: "SC_ST",
    groupLabel: "Scheduled Castes & Tribes",
    apexCorporation: "NSFDC (National Scheduled Castes Finance and Development Corporation)",
    ministry: "Ministry of Social Justice and Empowerment",
    concessionalRateFemale: 5.0,
    concessionalRateMale: 6.5,
    maxGovtShare: 95.0,
    incomeCeiling: 500000.0,
    certificateType: "Government SC Community Certificate (Tahsildar / Revenue Dept)",
    icon: "📜",
    description: "Statutory concessional loans across micro-credit, term loans, education and green business."
  },
  // 2. ST – Scheduled Tribes
  {
    id: "ST",
    code: "ST",
    label: "ST – Scheduled Tribes",
    shortName: "Scheduled Tribes",
    group: "SC_ST",
    groupLabel: "Scheduled Castes & Tribes",
    apexCorporation: "NSTFDC (National Scheduled Tribes Finance and Development Corporation)",
    ministry: "Ministry of Tribal Affairs",
    concessionalRateFemale: 4.0,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 600000.0,
    certificateType: "Government ST Tribe Certificate (Tahsildar / ITDA / SDO)",
    icon: "🏹",
    description: "Adivasi Mahila Sashaktikaran, Tribal SHG Microcredit, Forest produce & Term Loans."
  },
  // 3. OBC – Other Backward Classes
  {
    id: "OBC",
    code: "OBC",
    label: "OBC – Other Backward Classes",
    shortName: "OBC (General)",
    group: "OBC",
    groupLabel: "Other Backward Classes",
    apexCorporation: "NBCFDC (National Backward Classes Finance & Development Corporation)",
    ministry: "Ministry of Social Justice and Empowerment",
    concessionalRateFemale: 5.0,
    concessionalRateMale: 6.5,
    maxGovtShare: 85.0,
    incomeCeiling: 800000.0,
    certificateType: "OBC Community Certificate (State Revenue Authority / Tahsildar)",
    icon: "🏢",
    description: "NBCFDC general loans, small enterprise credit, technical & skill development finance."
  },
  // 4. OBC-NCL – Other Backward Classes (Non-Creamy Layer)
  {
    id: "OBC_NCL",
    code: "OBC-NCL",
    label: "OBC-NCL – Other Backward Classes (Non-Creamy Layer)",
    shortName: "OBC (Non-Creamy Layer)",
    group: "OBC",
    groupLabel: "Other Backward Classes",
    apexCorporation: "NBCFDC (National Backward Classes Finance & Development Corporation)",
    ministry: "Ministry of Social Justice and Empowerment",
    concessionalRateFemale: 4.5,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 800000.0,
    certificateType: "OBC-NCL Certificate issued by Revenue Authority (Annual Family Income ≤ ₹8.00 Lakh)",
    icon: "🌾",
    description: "New Swarnima Yojana for Women, Saksham Scheme, and concessional education loans."
  },
  // 5. OBC-CL – Other Backward Classes (Creamy Layer)
  {
    id: "OBC_CL",
    code: "OBC-CL",
    label: "OBC-CL – Other Backward Classes (Creamy Layer)",
    shortName: "OBC (Creamy Layer)",
    group: "OBC",
    groupLabel: "Other Backward Classes",
    apexCorporation: "Central & State MSME Channels / PMEGP / MUDRA",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    concessionalRateFemale: 7.5,
    concessionalRateMale: 8.5,
    maxGovtShare: 80.0,
    incomeCeiling: 1500000.0,
    certificateType: "OBC Certificate / Income Proof / MSME Udyam Registration",
    icon: "🏭",
    description: "Enterprise loans, PMEGP subsidy, PM MUDRA (Shishu, Kishore, Tarun) & Stand-Up India."
  },
  // 6. EWS – Economically Weaker Sections
  {
    id: "EWS",
    code: "EWS",
    label: "EWS – Economically Weaker Sections",
    shortName: "Economically Weaker Sections",
    group: "GENERAL_EWS",
    groupLabel: "General & Economically Weaker",
    apexCorporation: "Central Welfare & Concessional Credit Channels (PMEGP / PM-SVANidhi)",
    ministry: "Ministry of Social Justice & Empowerment / MoHUA / MSME",
    concessionalRateFemale: 6.0,
    concessionalRateMale: 7.0,
    maxGovtShare: 90.0,
    incomeCeiling: 800000.0,
    certificateType: "Income & Asset Certificate for EWS (Tahsildar / SDO)",
    icon: "🏛️",
    description: "Central EWS Interest Subvention, PMEGP up to 35% margin subsidy, and PM SVANidhi."
  },
  // 7. GEN / OC / UR – General / Open Category / Unreserved
  {
    id: "GEN",
    code: "GEN / OC / UR",
    label: "GEN / OC / UR – General / Open Category / Unreserved",
    shortName: "General / Unreserved",
    group: "GENERAL_EWS",
    groupLabel: "General & Economically Weaker",
    apexCorporation: "National Micro & MSME Credit Channels (PMEGP, MUDRA, Stand-Up, CGTMSE)",
    ministry: "Ministry of MSME / Ministry of Finance",
    concessionalRateFemale: 7.0,
    concessionalRateMale: 8.0,
    maxGovtShare: 85.0,
    incomeCeiling: 1200000.0,
    certificateType: "Income Certificate / Self Declaration / Domicile Certificate",
    icon: "🇮🇳",
    description: "Access across 5,000+ national welfare schemes including PMEGP, PM MUDRA, and Stand-Up India."
  },
  // 8. EBC – Economically Backward Classes
  {
    id: "EBC",
    code: "EBC",
    label: "EBC – Economically Backward Classes",
    shortName: "Economically Backward Classes",
    group: "GENERAL_EWS",
    groupLabel: "General & Economically Weaker",
    apexCorporation: "NBCFDC (EBC Special Window)",
    ministry: "Ministry of Social Justice and Empowerment",
    concessionalRateFemale: 5.0,
    concessionalRateMale: 6.5,
    maxGovtShare: 90.0,
    incomeCeiling: 500000.0,
    certificateType: "EBC Certificate / Income Certificate from Revenue Authority",
    icon: "💼",
    description: "Concessional small business, skill training, and livelihood micro-finance schemes."
  },
  // 9. DNT – De-notified Tribes
  {
    id: "DNT",
    code: "DNT",
    label: "DNT – De-notified Tribes",
    shortName: "De-notified Tribes",
    group: "SPECIAL_TRIBES",
    groupLabel: "Special & Nomadic Tribes",
    apexCorporation: "DWBDNC & SEED Scheme (Scheme for Economic Empowerment of DNTs)",
    ministry: "Ministry of Social Justice and Empowerment",
    concessionalRateFemale: 4.0,
    concessionalRateMale: 5.5,
    maxGovtShare: 95.0,
    incomeCeiling: 500000.0,
    certificateType: "DNT / Vimukta Jati Community Certificate / SEED Registration",
    icon: "⛺",
    description: "SEED Scheme housing, livelihood finance, coaching, and health insurance subsidies."
  },
  // 10. NT – Nomadic Tribes
  {
    id: "NT",
    code: "NT",
    label: "NT – Nomadic Tribes",
    shortName: "Nomadic Tribes",
    group: "SPECIAL_TRIBES",
    groupLabel: "Special & Nomadic Tribes",
    apexCorporation: "DWBDNC / NBCFDC Nomadic Cell",
    ministry: "Ministry of Social Justice and Empowerment",
    concessionalRateFemale: 4.0,
    concessionalRateMale: 5.5,
    maxGovtShare: 95.0,
    incomeCeiling: 500000.0,
    certificateType: "Nomadic Tribe (NT) Certificate / Local Revenue Authority",
    icon: "🏕️",
    description: "Targeted livelihood support, mobile artisan grants, and micro-concessional loans."
  },
  // 11. SNT – Semi-Nomadic Tribes
  {
    id: "SNT",
    code: "SNT",
    label: "SNT – Semi-Nomadic Tribes",
    shortName: "Semi-Nomadic Tribes",
    group: "SPECIAL_TRIBES",
    groupLabel: "Special & Nomadic Tribes",
    apexCorporation: "DWBDNC / NBCFDC Semi-Nomadic Window",
    ministry: "Ministry of Social Justice and Empowerment",
    concessionalRateFemale: 4.0,
    concessionalRateMale: 5.5,
    maxGovtShare: 95.0,
    incomeCeiling: 500000.0,
    certificateType: "Semi-Nomadic Tribe (SNT) Certificate from District Administration",
    icon: "🌄",
    description: "Pastoral, artisan and micro-trading concessional finance packages."
  },
  // 12. PwD / Divyangjan – Persons with Disabilities
  {
    id: "PWD",
    code: "PwD / Divyangjan",
    label: "PwD / Divyangjan – Persons with Disabilities (Affirmative)",
    shortName: "PwD / Divyangjan",
    group: "PWD",
    groupLabel: "Persons with Disabilities",
    apexCorporation: "NHFDC (National Handicapped Finance and Development Corporation / DEPwD)",
    ministry: "Ministry of Social Justice and Empowerment (DEPwD)",
    concessionalRateFemale: 3.5,
    concessionalRateMale: 5.0,
    maxGovtShare: 95.0,
    incomeCeiling: 600000.0,
    certificateType: "UDID Card (Unique Disability ID) / Disability Certificate (≥ 40% Benchmark)",
    icon: "♿",
    description: "Divyangjan Swavalamban Yojana, Vishesh Micro-Credit, Assistive device & self-employment loans."
  },
  // 13. Minorities (NMDFC): MUS – Muslim
  {
    id: "MIN_MUS",
    code: "MUS",
    label: "Minority: MUS – Muslim",
    shortName: "Minority (Muslim)",
    group: "MINORITY",
    groupLabel: "National Minorities (NMDFC)",
    apexCorporation: "NMDFC (National Minorities Development and Finance Corporation)",
    ministry: "Ministry of Minority Affairs",
    concessionalRateFemale: 4.5,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 600000.0,
    certificateType: "Minority Self-Declaration / Community Certificate (Revenue Dept)",
    icon: "🕌",
    description: "Virasat Scheme for Artisans, Mahila Samriddhi, Term Loans, and domestic/overseas education loans."
  },
  // 14. Minorities (NMDFC): CHR – Christian
  {
    id: "MIN_CHR",
    code: "CHR",
    label: "Minority: CHR – Christian",
    shortName: "Minority (Christian)",
    group: "MINORITY",
    groupLabel: "National Minorities (NMDFC)",
    apexCorporation: "NMDFC (National Minorities Development and Finance Corporation)",
    ministry: "Ministry of Minority Affairs",
    concessionalRateFemale: 4.5,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 600000.0,
    certificateType: "Minority Community Certificate / Self-Declaration",
    icon: "⛪",
    description: "Concessional term loans, micro-financing for SHGs, and educational credit support."
  },
  // 15. Minorities (NMDFC): SIK – Sikh
  {
    id: "MIN_SIK",
    code: "SIK",
    label: "Minority: SIK – Sikh",
    shortName: "Minority (Sikh)",
    group: "MINORITY",
    groupLabel: "National Minorities (NMDFC)",
    apexCorporation: "NMDFC (National Minorities Development and Finance Corporation)",
    ministry: "Ministry of Minority Affairs",
    concessionalRateFemale: 4.5,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 600000.0,
    certificateType: "Minority Community Certificate / Self-Declaration",
    icon: "☬",
    description: "Artisan finance, agro-processing credit, and women entrepreneur micro-credit."
  },
  // 16. Minorities (NMDFC): BUD – Buddhist
  {
    id: "MIN_BUD",
    code: "BUD",
    label: "Minority: BUD – Buddhist",
    shortName: "Minority (Buddhist)",
    group: "MINORITY",
    groupLabel: "National Minorities (NMDFC)",
    apexCorporation: "NMDFC (National Minorities Development and Finance Corporation)",
    ministry: "Ministry of Minority Affairs",
    concessionalRateFemale: 4.5,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 600000.0,
    certificateType: "Minority Community Certificate / Self-Declaration",
    icon: "☸️",
    description: "Handicrafts, tourism transport, hospitality, and educational concessional schemes."
  },
  // 17. Minorities (NMDFC): JAI – Jain
  {
    id: "MIN_JAI",
    code: "JAI",
    label: "Minority: JAI – Jain",
    shortName: "Minority (Jain)",
    group: "MINORITY",
    groupLabel: "National Minorities (NMDFC)",
    apexCorporation: "NMDFC (National Minorities Development and Finance Corporation)",
    ministry: "Ministry of Minority Affairs",
    concessionalRateFemale: 4.5,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 600000.0,
    certificateType: "Minority Community Certificate / Self-Declaration",
    icon: "🙏",
    description: "Micro-business trade, retail shop financing, and educational loans."
  },
  // 18. Minorities (NMDFC): PAR – Parsi (Zoroastrian)
  {
    id: "MIN_PAR",
    code: "PAR",
    label: "Minority: PAR – Parsi (Zoroastrian)",
    shortName: "Minority (Parsi)",
    group: "MINORITY",
    groupLabel: "National Minorities (NMDFC)",
    apexCorporation: "NMDFC (National Minorities Development and Finance Corporation)",
    ministry: "Ministry of Minority Affairs",
    concessionalRateFemale: 4.5,
    concessionalRateMale: 6.0,
    maxGovtShare: 90.0,
    incomeCeiling: 600000.0,
    certificateType: "Minority Community Certificate / Self-Declaration",
    icon: "🔥",
    description: "Jiyo Parsi assistance, enterprise financing, and specialized education loans."
  }
];

export function getCasteCategoryById(id: string): CasteCategory {
  const found = ALL_CASTE_CATEGORIES.find((c) => c.id === id || c.code === id);
  return found || ALL_CASTE_CATEGORIES[0]; // Default to SC
}
