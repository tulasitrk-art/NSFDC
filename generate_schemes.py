import json

SECTORS = [
    {"code": "RETAIL", "name": "Small Retail & Micro Vending", "cat": "MICRO", "cost": 140000.0, "share": 95.0, "rf": 5.0, "rm": 6.0, "mor": 3, "ten": 3, "desc": "Small grocery, vegetable vending, tea shop, and micro-retail trade."},
    {"code": "DAIRY", "name": "Dairy & Animal Husbandry", "cat": "TERM", "cost": 500000.0, "share": 90.0, "rf": 5.5, "rm": 6.5, "mor": 6, "ten": 5, "desc": "Milch animal purchase, dairy sheds, fodder development, and poultry micro-units."},
    {"code": "AGRI", "name": "Agriculture & Agro-Processing", "cat": "TERM", "cost": 300000.0, "share": 90.0, "rf": 5.0, "rm": 6.0, "mor": 6, "ten": 4, "desc": "Organic farming, drip irrigation, polyhouse farming, and mini grain/spice milling."},
    {"code": "GREEN", "name": "Green Energy & Clean Mobility", "cat": "GREEN_ENERGY", "cost": 3000000.0, "share": 90.0, "rf": 6.0, "rm": 6.5, "mor": 6, "ten": 5, "desc": "Battery e-Rickshaws, EV charging points, rooftop solar, and eco-friendly machinery."},
    {"code": "SAN", "name": "Mechanized Sanitation & Desilting", "cat": "SANITATION", "cost": 5000000.0, "share": 90.0, "rf": 5.5, "rm": 6.0, "mor": 6, "ten": 7, "desc": "Modern mechanized suction machines, septic jetting trucks, and sanitation safety gear."},
    {"code": "EDU", "name": "Higher & Technical Education", "cat": "EDU_DOMESTIC", "cost": 2000000.0, "share": 90.0, "rf": 4.5, "rm": 5.5, "mor": 12, "ten": 5, "desc": "Professional graduation and post-graduation degrees (Engineering, Medical, Law, MBA)."},
    {"code": "CRAFT", "name": "Handloom & Traditional Crafts", "cat": "ARTISAN", "cost": 140000.0, "share": 95.0, "rf": 4.5, "rm": 5.5, "mor": 3, "ten": 3, "desc": "Handloom weaving, terracotta pottery, wood carving, leather goods, and metal artifacts."},
    {"code": "MFG", "name": "Light Manufacturing & Workshop", "cat": "TERM", "cost": 1500000.0, "share": 90.0, "rf": 6.5, "rm": 7.0, "mor": 6, "ten": 5, "desc": "Steel fabrication, garment stitching, corrugated box packaging, and component assembly."},
    {"code": "TRANS", "name": "Commercial Transport & Logistics", "cat": "TERM", "cost": 2500000.0, "share": 90.0, "rf": 6.5, "rm": 7.5, "mor": 6, "ten": 5, "desc": "Light commercial vehicles, cargo transport, refrigerated vans, and rural passenger service."},
    {"code": "WOMEN", "name": "Women Self Help & Micro-Enterprise", "cat": "MICRO_WOMEN", "cost": 200000.0, "share": 95.0, "rf": 4.0, "rm": 99.0, "mor": 3, "ten": 3, "desc": "Exclusive credit for SC women entrepreneurs, beauty salons, catering, and garment units."}
]

STATES = [
    ("AP", "Andhra Pradesh", "APSCCFC"),
    ("TS", "Telangana", "TGSCFC"),
    ("TN", "Tamil Nadu", "TAHDCO"),
    ("KA", "Karnataka", "Dr. BR Ambedkar SCDC"),
    ("KL", "Kerala", "KSDC"),
    ("MH", "Maharashtra", "LASDC Mahapreit"),
    ("GJ", "Gujarat", "GSCDC"),
    ("MP", "Madhya Pradesh", "MPSCDC"),
    ("CG", "Chhattisgarh", "CGSCDC"),
    ("RJ", "Rajasthan", "RSCDC"),
    ("UP", "Uttar Pradesh", "UPSCDC"),
    ("BR", "Bihar", "BSCDC"),
    ("JH", "Jharkhand", "JHSCDC"),
    ("WB", "West Bengal", "WBSCSTDFC"),
    ("OR", "Odisha", "OSFDC"),
    ("PB", "Punjab", "PSCFC"),
    ("HR", "Haryana", "HSCDC"),
    ("HP", "Himachal Pradesh", "HPSCSTDC"),
    ("UK", "Uttarakhand", "UKSCDC"),
    ("DL", "Delhi", "DSCSC"),
    ("AS", "Assam", "ASCDC"),
    ("TR", "Tripura", "TSCDC"),
    ("MN", "Manipur", "MSCDC"),
    ("ML", "Meghalaya", "MSSCDC"),
    ("NL", "Nagaland", "NSCDC"),
    ("MZ", "Mizoram", "MZSCDC"),
    ("AR", "Arunachal Pradesh", "ARSCDC"),
    ("SK", "Sikkim", "SSCDC"),
    ("GA", "Goa", "GSCDC"),
    ("PY", "Puducherry", "PSCDC")
]

CORE_10 = [
    {
        "scheme_id": "NSFDC_MCF",
        "scheme_name": "Micro Credit Finance Scheme (MCF)",
        "category": "MICRO",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.50,
        "interest_rate_female": 5.50,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Small retail, vegetable vending, tea shop, artisan trade."
    },
    {
        "scheme_id": "NSFDC_MSY",
        "scheme_name": "Mahila Samriddhi Yojana (MSY)",
        "category": "MICRO_WOMEN",
        "max_project_cost": 140000.00,
        "govt_share_percent": 95.00,
        "beneficiary_margin_percent": 5.00,
        "interest_rate_male": 99.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Specialized concessional micro finance for SC women entrepreneurs and SHGs."
    },
    {
        "scheme_id": "NSFDC_TL",
        "scheme_name": "Term Loan General Scheme",
        "category": "TERM",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.50,
        "interest_rate_female": 7.00,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Medium capital for dairy farms, commercial transport, and small manufacturing."
    },
    {
        "scheme_id": "NSFDC_ELS_D",
        "scheme_name": "Educational Loan Scheme (Domestic)",
        "category": "EDU_DOMESTIC",
        "max_project_cost": 2000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 6.00,
        "moratorium_months": 12,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Professional & technical degrees in India (Engineering, Medical, Law)."
    },
    {
        "scheme_id": "NSFDC_ELS_O",
        "scheme_name": "Educational Loan Scheme (Abroad)",
        "category": "EDU_ABROAD",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.50,
        "interest_rate_female": 6.50,
        "moratorium_months": 12,
        "max_tenure_years": 7,
        "state_code": "ALL",
        "description": "Higher studies in accredited foreign universities."
    },
    {
        "scheme_id": "NSFDC_GBS",
        "scheme_name": "Green Business Scheme",
        "category": "GREEN_ENERGY",
        "max_project_cost": 3000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 6.50,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Financing for battery e-Rickshaws, solar polyhouse, and eco-friendly machinery."
    },
    {
        "scheme_id": "NSFDC_LVY",
        "scheme_name": "Laghu Vyavsay Yojana",
        "category": "SMALL_BUSINESS",
        "max_project_cost": 500000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 7.00,
        "interest_rate_female": 6.50,
        "moratorium_months": 6,
        "max_tenure_years": 4,
        "state_code": "ALL",
        "description": "Rural workshops, tailoring centers, and repair centers."
    },
    {
        "scheme_id": "NSFDC_SUY",
        "scheme_name": "Swachhta Udyami Yojana",
        "category": "SANITATION",
        "max_project_cost": 5000000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.50,
        "moratorium_months": 6,
        "max_tenure_years": 7,
        "state_code": "ALL",
        "description": "Mechanized cleaning machinery and sanitation transport vehicles for safai karamcharis."
    },
    {
        "scheme_id": "NSFDC_SSY",
        "scheme_name": "Shilpi Samriddhi Yojana",
        "category": "ARTISAN",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 6.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Handloom, terracotta, metal craft, and traditional artisans."
    },
    {
        "scheme_id": "NSFDC_MKY",
        "scheme_name": "Mahila Kisan Yojana",
        "category": "AGRI_WOMEN",
        "max_project_cost": 140000.00,
        "govt_share_percent": 90.00,
        "beneficiary_margin_percent": 10.00,
        "interest_rate_male": 99.00,
        "interest_rate_female": 5.00,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Agriculture, goat rearing, floriculture exclusively for SC women farmers."
    }
]

APEX_CENTRAL = [
    {
        "scheme_id": "NSKFDC_MSY",
        "scheme_name": "NSKFDC Mahila Adhikarita Yojana",
        "category": "MICRO_WOMEN",
        "max_project_cost": 200000.0,
        "govt_share_percent": 95.0,
        "beneficiary_margin_percent": 5.0,
        "interest_rate_male": 99.0,
        "interest_rate_female": 4.0,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Concessional micro finance exclusively for women safai karamcharis and manual scavengers."
    },
    {
        "scheme_id": "NSKFDC_SRMS",
        "scheme_name": "SRMS Rehabilitation Self-Employment Loan",
        "category": "SANITATION",
        "max_project_cost": 1500000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 5.0,
        "interest_rate_female": 4.0,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Rehabilitation loan with capital subsidy for manual scavengers taking up alternative vocations."
    },
    {
        "scheme_id": "NSKFDC_SANV",
        "scheme_name": "NSKFDC Sanitation Mechanization Vehicle Scheme",
        "category": "SANITATION",
        "max_project_cost": 5000000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 6.0,
        "interest_rate_female": 5.0,
        "moratorium_months": 6,
        "max_tenure_years": 7,
        "state_code": "ALL",
        "description": "Financing mechanized suction and hydro-jetting machines to eliminate manual cleaning."
    },
    {
        "scheme_id": "NBCFDC_MSY",
        "scheme_name": "NBCFDC New Swarnima Scheme for Women",
        "category": "MICRO_WOMEN",
        "max_project_cost": 200000.0,
        "govt_share_percent": 95.0,
        "beneficiary_margin_percent": 5.0,
        "interest_rate_male": 99.0,
        "interest_rate_female": 5.0,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Term credit for backward classes women entrepreneurs to establish self-employment units."
    },
    {
        "scheme_id": "NBCFDC_TL",
        "scheme_name": "NBCFDC General Term Loan Scheme",
        "category": "TERM",
        "max_project_cost": 1500000.0,
        "govt_share_percent": 85.0,
        "beneficiary_margin_percent": 15.0,
        "interest_rate_male": 7.0,
        "interest_rate_female": 6.5,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Medium term loans for small transport, workshop, repair trade, and agro-based industries."
    },
    {
        "scheme_id": "NBCFDC_MICRO",
        "scheme_name": "NBCFDC Micro Finance Scheme",
        "category": "MICRO",
        "max_project_cost": 125000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 6.5,
        "interest_rate_female": 5.5,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Micro credit for target group through SCAs and State Cooperative Banks."
    },
    {
        "scheme_id": "NSTFDC_ADIVASI",
        "scheme_name": "Adivasi Mahila Sashaktikaran Yojana (AMSY)",
        "category": "MICRO_WOMEN",
        "max_project_cost": 200000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 99.0,
        "interest_rate_female": 4.0,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Concessional credit scheme for economic empowerment of Scheduled Tribe women."
    },
    {
        "scheme_id": "NSTFDC_TERM",
        "scheme_name": "NSTFDC Term Loan Scheme for STs",
        "category": "TERM",
        "max_project_cost": 5000000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 6.0,
        "interest_rate_female": 5.5,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Term financing for viable economic activities undertaken by Scheduled Tribe beneficiaries."
    },
    {
        "scheme_id": "NMDFC_VIRASAT",
        "scheme_name": "NMDFC Virasat Scheme for Artisans",
        "category": "ARTISAN",
        "max_project_cost": 1000000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 5.0,
        "interest_rate_female": 4.0,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Concessional credit to traditional craftsmen and artisans for modern tools and working capital."
    },
    {
        "scheme_id": "NMDFC_CREDIT",
        "scheme_name": "NMDFC Concessional Term Credit",
        "category": "TERM",
        "max_project_cost": 3000000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 6.0,
        "interest_rate_female": 5.5,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Credit line for individual beneficiaries through State Channelising Agencies."
    },
    {
        "scheme_id": "PM_AJAY_LIVELIHOOD",
        "scheme_name": "PM-AJAY Livelihood Enterprise Scheme",
        "category": "SMALL_BUSINESS",
        "max_project_cost": 500000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 5.5,
        "interest_rate_female": 5.0,
        "moratorium_months": 6,
        "max_tenure_years": 4,
        "state_code": "ALL",
        "description": "PM Anusuchit Jaati Abhyuday Yojana credit-linked subsidy for SC income generation projects."
    },
    {
        "scheme_id": "PM_AJAY_INFRA",
        "scheme_name": "PM-AJAY Cluster Micro Enterprise Scheme",
        "category": "TERM",
        "max_project_cost": 2500000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 6.0,
        "interest_rate_female": 5.5,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Cluster level business setup in SC-majority villages with state subsidy support."
    },
    {
        "scheme_id": "PM_VISHWAKARMA_1",
        "scheme_name": "PM Vishwakarma Artisan Credit Phase-I",
        "category": "ARTISAN",
        "max_project_cost": 100000.0,
        "govt_share_percent": 95.0,
        "beneficiary_margin_percent": 5.0,
        "interest_rate_male": 5.0,
        "interest_rate_female": 5.0,
        "moratorium_months": 3,
        "max_tenure_years": 2,
        "state_code": "ALL",
        "description": "Collateral-free enterprise credit at 5% concessional rate with interest subvention by MoMSME."
    },
    {
        "scheme_id": "PM_VISHWAKARMA_2",
        "scheme_name": "PM Vishwakarma Artisan Credit Phase-II",
        "category": "ARTISAN",
        "max_project_cost": 200000.0,
        "govt_share_percent": 95.0,
        "beneficiary_margin_percent": 5.0,
        "interest_rate_male": 5.0,
        "interest_rate_female": 5.0,
        "moratorium_months": 3,
        "max_tenure_years": 3,
        "state_code": "ALL",
        "description": "Phase 2 credit for trained artisans with digital transaction incentives and marketing support."
    },
    {
        "scheme_id": "PMEGP_MFG",
        "scheme_name": "PMEGP Manufacturing Enterprise Loan",
        "category": "TERM",
        "max_project_cost": 5000000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 7.0,
        "interest_rate_female": 6.5,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Prime Minister Employment Generation Programme with 35% special category subsidy for SC/ST."
    },
    {
        "scheme_id": "PMEGP_SERV",
        "scheme_name": "PMEGP Service & Business Loan",
        "category": "SMALL_BUSINESS",
        "max_project_cost": 2000000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 7.0,
        "interest_rate_female": 6.5,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "PMEGP service sector unit support with 35% margin money capital subsidy in rural areas."
    },
    {
        "scheme_id": "STANDUP_INDIA_SC",
        "scheme_name": "Stand-Up India SC/ST Enterprise Loan",
        "category": "TERM",
        "max_project_cost": 5000000.0,
        "govt_share_percent": 85.0,
        "beneficiary_margin_percent": 15.0,
        "interest_rate_male": 7.25,
        "interest_rate_female": 6.75,
        "moratorium_months": 12,
        "max_tenure_years": 7,
        "state_code": "ALL",
        "description": "Greenfield enterprise bank loans between 10 Lakhs and 1 Crore for SC/ST and Women entrepreneurs."
    },
    {
        "scheme_id": "MUDRA_SHISHU_SC",
        "scheme_name": "PMMY MUDRA Shishu Concessional Credit",
        "category": "MICRO",
        "max_project_cost": 50000.0,
        "govt_share_percent": 95.0,
        "beneficiary_margin_percent": 5.0,
        "interest_rate_male": 6.0,
        "interest_rate_female": 5.5,
        "moratorium_months": 3,
        "max_tenure_years": 2,
        "state_code": "ALL",
        "description": "Zero-collateral micro credit for micro merchants, tailors, vegetable vendors, and cobblers."
    },
    {
        "scheme_id": "MUDRA_KISHORE_SC",
        "scheme_name": "PMMY MUDRA Kishore Enterprise Loan",
        "category": "SMALL_BUSINESS",
        "max_project_cost": 500000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 7.0,
        "interest_rate_female": 6.5,
        "moratorium_months": 6,
        "max_tenure_years": 4,
        "state_code": "ALL",
        "description": "Working capital and machinery loans for expanding small enterprises."
    },
    {
        "scheme_id": "PM_SURYA_GHAR_SC",
        "scheme_name": "PM Surya Ghar Rooftop Solar Micro-Loan",
        "category": "GREEN_ENERGY",
        "max_project_cost": 300000.0,
        "govt_share_percent": 90.0,
        "beneficiary_margin_percent": 10.0,
        "interest_rate_male": 5.5,
        "interest_rate_female": 5.0,
        "moratorium_months": 6,
        "max_tenure_years": 5,
        "state_code": "ALL",
        "description": "Concessional rooftop solar installation and green business loan with direct DBT subsidy."
    }
]

def generate_all_schemes():
    all_schemes = []
    
    # 1. Add 10 Core NSFDC Schemes
    for item in CORE_10:
        all_schemes.append(item)
        
    # 2. Add 20 Apex & Central Schemes
    for item in APEX_CENTRAL:
        all_schemes.append(item)
        
    # 3. Add 300 State SCDC Schemes (30 states * 10 sectors = 300)
    for st_code, st_name, scdc_name in STATES:
        for sec in SECTORS:
            scheme_id = f"SCDC_{st_code}_{sec['code']}"
            scheme_name = f"{st_name} {scdc_name} - {sec['name']}"
            
            all_schemes.append({
                "scheme_id": scheme_id,
                "scheme_name": scheme_name,
                "category": sec["cat"],
                "sector_name": sec["name"],
                "max_project_cost": sec["cost"],
                "govt_share_percent": sec["share"],
                "beneficiary_margin_percent": round(100.0 - sec["share"], 2),
                "interest_rate_male": sec["rm"],
                "interest_rate_female": sec["rf"],
                "moratorium_months": sec["mor"],
                "max_tenure_years": sec["ten"],
                "state_code": st_code,
                "state_name": st_name,
                "scdc_agency": scdc_name,
                "description": f"State concessional credit scheme by {scdc_name} ({st_name}) for {sec['name']}. {sec['desc']}"
            })
            
    return all_schemes

if __name__ == "__main__":
    schemes = generate_all_schemes()
    print(f"Total schemes generated: {len(schemes)}")
    with open("all_330_schemes.json", "w", encoding="utf-8") as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)
    print("Saved all_330_schemes.json successfully.")
