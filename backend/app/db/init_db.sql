-- NSFDC Concessional Loan Portal Database Schema (PostgreSQL 16 + PostGIS)
-- Pan-India Multi-State Schema & 10 Statutory NSFDC Schemes

CREATE EXTENSION IF NOT EXISTS postgis;

DO $$ BEGIN
    CREATE TYPE partner_tier AS ENUM ('SCA', 'PSB', 'RRB');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE app_status AS ENUM ('SUBMITTED', 'DOCS_VERIFIED', 'ROUTED_TO_CHANNEL', 'FIELD_INSPECTED', 'SANCTIONED', 'DISBURSED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. ALL 10 OFFICIAL NSFDC STATUTORY SCHEMES
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
('NSFDC_MCF', 'Micro Credit Finance Scheme (MCF)', 'MICRO', 140000.00, 90.00, 10.00, 6.50, 5.50, 3, 3, 'Small retail, vegetable vending, tea shop, artisan trade.'),
('NSFDC_MSY', 'Mahila Samriddhi Yojana (MSY)', 'MICRO_WOMEN', 140000.00, 95.00, 5.00, 99.00, 5.00, 3, 3, 'Specialized concessional micro finance for SC women entrepreneurs and SHGs.'),
('NSFDC_TL', 'Term Loan General Scheme', 'TERM', 5000000.00, 90.00, 10.00, 7.50, 7.00, 6, 5, 'Medium capital for dairy farms, commercial transport, and small manufacturing.'),
('NSFDC_ELS_D', 'Educational Loan Scheme (Domestic)', 'EDU_DOMESTIC', 2000000.00, 90.00, 10.00, 7.00, 6.00, 12, 5, 'Professional & technical degrees in India (Engineering, Medical, Law).'),
('NSFDC_ELS_O', 'Educational Loan Scheme (Abroad)', 'EDU_ABROAD', 5000000.00, 90.00, 10.00, 7.50, 6.50, 12, 7, 'Higher studies in accredited foreign universities.'),
('NSFDC_GBS', 'Green Business Scheme', 'GREEN_ENERGY', 3000000.00, 90.00, 10.00, 7.00, 6.50, 6, 5, 'Financing for battery e-Rickshaws, solar polyhouse, and eco-friendly machinery.'),
('NSFDC_LVY', 'Laghu Vyavsay Yojana', 'SMALL_BUSINESS', 500000.00, 90.00, 10.00, 7.00, 6.50, 6, 4, 'Rural workshops, tailoring centers, and repair centers.'),
('NSFDC_SUY', 'Swachhta Udyami Yojana', 'SANITATION', 5000000.00, 90.00, 10.00, 6.00, 5.50, 6, 7, 'Mechanized cleaning machinery and sanitation transport vehicles for safai karamcharis.'),
('NSFDC_SSY', 'Shilpi Samriddhi Yojana', 'ARTISAN', 140000.00, 90.00, 10.00, 6.00, 5.00, 3, 3, 'Handloom, terracotta, metal craft, and traditional artisans.'),
('NSFDC_MKY', 'Mahila Kisan Yojana', 'AGRI_WOMEN', 140000.00, 90.00, 10.00, 99.00, 5.00, 3, 3, 'Agriculture, goat rearing, floriculture exclusively for SC women farmers.');

-- 2. CHANNEL PARTNERS ACROSS INDIAN STATES
CREATE TABLE IF NOT EXISTS channel_partners (
    partner_id SERIAL PRIMARY KEY,
    state_code VARCHAR(8) NOT NULL,
    state_name VARCHAR(128) NOT NULL,
    partner_name VARCHAR(255) NOT NULL,
    partner_type partner_tier NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    allocated_quota NUMERIC(14, 2) NOT NULL,
    utilized_quota NUMERIC(14, 2) NOT NULL,
    npa_percentage NUMERIC(5, 2) NOT NULL,
    officer_name VARCHAR(128) NOT NULL,
    officer_phone VARCHAR(32) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_cp_geo ON channel_partners USING GIST(location);

-- SEED MULTI-STATE REPRESENTATIVE BRANCHES
TRUNCATE TABLE channel_partners CASCADE;
INSERT INTO channel_partners (state_code, state_name, partner_name, partner_type, branch_name, location, allocated_quota, utilized_quota, npa_percentage, officer_name, officer_phone) VALUES
-- Andhra Pradesh
('AP', 'Andhra Pradesh', 'AP State SC Co-op Finance Corp', 'SCA', 'District Office Kakinada', ST_SetSRID(ST_MakePoint(82.2420, 16.9950), 4326), 5000000.00, 1200000.00, 2.10, 'K. Rama Rao', '+91 88423 45671'),
('AP', 'Andhra Pradesh', 'State Bank of India', 'PSB', 'Kakinada Main Branch', ST_SetSRID(ST_MakePoint(82.2380, 16.9820), 4326), 10000000.00, 4500000.00, 4.30, 'P. Satyanarayana', '+91 88423 78901'),
('AP', 'Andhra Pradesh', 'Chaitanya Godavari Grameena Bank', 'RRB', 'Kakinada Rural Branch', ST_SetSRID(ST_MakePoint(82.2290, 16.9750), 4326), 3000000.00, 800000.00, 1.80, 'M. Srinivas', '+91 88423 11223'),
-- Telangana
('TS', 'Telangana', 'Telangana SC Co-operative Dev Corp', 'SCA', 'Masab Tank Head Office Hyderabad', ST_SetSRID(ST_MakePoint(78.4480, 17.3990), 4326), 8000000.00, 2000000.00, 1.90, 'T. Balakrishna', '+91 40234 56789'),
('TS', 'Telangana', 'State Bank of India', 'PSB', 'Gunfoundry Hyderabad', ST_SetSRID(ST_MakePoint(78.4790, 17.3910), 4326), 15000000.00, 5000000.00, 3.80, 'G. Madhusudhan', '+91 40234 11223'),
('TS', 'Telangana', 'Telangana Grameena Bank', 'RRB', 'Secunderabad Head Branch', ST_SetSRID(ST_MakePoint(78.4980, 17.4420), 4326), 4000000.00, 1200000.00, 2.40, 'D. Laxman', '+91 40234 44556'),
-- Maharashtra
('MH', 'Maharashtra', 'Mahatma Phule BC Development Corp', 'SCA', 'Nariman Point Mumbai', ST_SetSRID(ST_MakePoint(72.8258, 18.9256), 4326), 12000000.00, 3500000.00, 2.80, 'S. S. Patil', '+91 22220 12345'),
('MH', 'Maharashtra', 'Bank of Maharashtra', 'PSB', 'Shivajinagar Pune Branch', ST_SetSRID(ST_MakePoint(73.8567, 18.5204), 4326), 9000000.00, 2200000.00, 3.10, 'A. Deshmukh', '+91 20255 33445'),
-- Karnataka
('KA', 'Karnataka', 'Dr. B.R. Ambedkar Dev Corp', 'SCA', 'Vasanth Nagar Bengaluru', ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326), 11000000.00, 4000000.00, 2.30, 'R. K. Siddarama', '+91 80222 99881'),
('KA', 'Karnataka', 'Karnataka Vikas Grameena Bank', 'RRB', 'Dharwad Branch', ST_SetSRID(ST_MakePoint(75.0078, 15.4589), 4326), 5000000.00, 1100000.00, 1.90, 'H. Gowda', '+91 83624 55667'),
-- Tamil Nadu
('TN', 'Tamil Nadu', 'TAHDCO Head Office', 'SCA', 'Nungambakkam Chennai', ST_SetSRID(ST_MakePoint(80.2410, 13.0604), 4326), 14000000.00, 3800000.00, 2.00, 'K. Annamalai', '+91 44282 77665'),
-- Uttar Pradesh
('UP', 'Uttar Pradesh', 'UP SC Finance & Dev Corp', 'SCA', 'Hazratganj Lucknow', ST_SetSRID(ST_MakePoint(80.9462, 26.8467), 4326), 20000000.00, 6000000.00, 3.40, 'R. N. Singh', '+91 52222 88990'),
-- Delhi NCR
('DL', 'Delhi', 'Delhi SC/ST/OBC Corp (DSFDC)', 'SCA', 'Ambedkar Bhawan New Delhi', ST_SetSRID(ST_MakePoint(77.2167, 28.6448), 4326), 8000000.00, 2500000.00, 1.70, 'M. K. Verma', '+91 11233 44556');

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    application_id VARCHAR(64) PRIMARY KEY,
    applicant_name VARCHAR(128) NOT NULL,
    phone_number VARCHAR(16) NOT NULL,
    gender VARCHAR(16) NOT NULL,
    state_code VARCHAR(8) NOT NULL,
    district VARCHAR(64) NOT NULL,
    annual_income NUMERIC(12, 2) NOT NULL,
    project_cost NUMERIC(14, 2) NOT NULL,
    scheme_id VARCHAR(64) REFERENCES schemes(scheme_id),
    routed_partner_id INT REFERENCES channel_partners(partner_id),
    status app_status DEFAULT 'SUBMITTED',
    ocr_verified BOOLEAN DEFAULT FALSE,
    certificate_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
