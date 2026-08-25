import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (on pages after cover)
        if self._pageNumber > 1:
            self.drawString(54, 11 * 72 - 36, "NSFDC Concessional Loan Digital Portal - System Architecture Document")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)
            
        # Footer
        text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 54, 36, text)
        self.drawString(54, 36, "CONFIDENTIAL - Ministry of Social Justice & Empowerment, Govt. of India")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 8.5 * 72 - 54, 48)
        
        self.restoreState()

def create_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#1E3A8A")   # Navy Blue
    secondary_color = colors.HexColor("#0D9488") # Teal
    dark_neutral = colors.HexColor("#0F172A")    # Dark Slate
    light_bg = colors.HexColor("#F8FAFC")        # Slate 50
    border_color = colors.HexColor("#E2E8F0")    # Slate 200

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=8
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceAfter=20
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary_color,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=dark_neutral,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=dark_neutral
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )
    
    formula_style = ParagraphStyle(
        'FormulaStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=15,
        spaceAfter=6
    )

    story = []

    # Document Header / Title Box
    story.append(Paragraph("NSFDC Concessional Loan Digital Portal", title_style))
    story.append(Paragraph("System Architecture & Complete Project Specification", subtitle_style))
    story.append(Paragraph("<b>Government of India</b> | Ministry of Social Justice & Empowerment | National Scheduled Castes Finance & Development Corporation", ParagraphStyle('SubGov', parent=body_style, fontSize=9, textColor=colors.HexColor("#64748B"), spaceAfter=15)))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=15))

    # Executive Overview
    story.append(Paragraph("1. Executive Overview", h1_style))
    overview_text = (
        "The <b>NSFDC Concessional Loan Digital Portal</b> is an end-to-end, enterprise-grade digital platform developed for the "
        "<b>National Scheduled Castes Finance & Development Corporation (NSFDC)</b> under the <i>Ministry of Social Justice & Empowerment, Government of India</i>. "
        "The platform digitizes and automates the complete lifecycle of concessional credit allocation for Scheduled Caste (SC) beneficiaries across India—from multi-lingual voice/conversational intake, AI-driven OCR document verification, dynamic EMI amortization calculation, and PostGIS-powered spatial channel partner routing, to branch officer lead processing."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 10))

    # High Level Architecture & Data Flow
    story.append(Paragraph("2. High-Level System Architecture", h1_style))
    story.append(Paragraph("The system follows a containerized, decoupled client-server micro-services architecture orchestrated via Docker Compose:", body_style))
    
    arch_components = [
        "<b>Frontend Client Layer:</b> Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Leaflet GIS Maps, Web Speech API (Speech Recognition & Speech Synthesis).",
        "<b>API Gateway & REST Layer:</b> FastAPI (Python 0.110.0), Uvicorn ASGI server, Pydantic v2 validation schemas, CORS Middleware, Async Router.",
        "<b>Business Logic & Engine Core:</b> Financial Amortization Engine, GIS Spatial Router & Composite Score R_score Engine, PyTesseract OCR Verification Engine, Scheme Recommendation Engine.",
        "<b>Spatial Database Layer:</b> PostgreSQL 16 + PostGIS 3.4 (`postgis/postgis:16-3.4` container) with spatial indexing (GiST index on PostGIS `Point` geometry), custom ENUM types (`partner_tier`, `app_status`), 10 statutory schemes pre-loaded, and multi-state channel partner seeds."
    ]
    for comp in arch_components:
        story.append(Paragraph(f"• {comp}", bullet_style))
    story.append(Spacer(1, 12))

    # Technology Stack Table
    story.append(Paragraph("3. Technology Stack & Tooling Specifications", h1_style))
    
    tech_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology / Package", table_header_style), Paragraph("Version", table_header_style), Paragraph("Purpose / Responsibility", table_header_style)],
        [Paragraph("Frontend", table_cell_style), Paragraph("Next.js / React", table_cell_style), Paragraph("14.1.0 / 18.2.0", table_cell_style), Paragraph("App Router, SSR, Client Components, State Management", table_cell_style)],
        [Paragraph("Frontend", table_cell_style), Paragraph("Tailwind CSS", table_cell_style), Paragraph("3.4.1", table_cell_style), Paragraph("Responsive Glassmorphic UI & Government Palette Styling", table_cell_style)],
        [Paragraph("Frontend", table_cell_style), Paragraph("Leaflet / React-Leaflet", table_cell_style), Paragraph("1.9.4", table_cell_style), Paragraph("Interactive GIS Mapping, Branch Markers & Spatial Polylines", table_cell_style)],
        [Paragraph("Frontend", table_cell_style), Paragraph("Web Speech API", table_cell_style), Paragraph("Native Browser", table_cell_style), Paragraph("Speech Recognition (STT) & Speech Synthesis (TTS) in 8 languages", table_cell_style)],
        [Paragraph("Backend", table_cell_style), Paragraph("FastAPI / Uvicorn", table_cell_style), Paragraph("0.110.0 / 0.28.0", table_cell_style), Paragraph("High-Performance Asynchronous Python REST Web API Server", table_cell_style)],
        [Paragraph("Backend", table_cell_style), Paragraph("Pydantic & Settings", table_cell_style), Paragraph("2.6.4 / 2.2.1", table_cell_style), Paragraph("Data Validation, Schema Enforcement & Env Variables", table_cell_style)],
        [Paragraph("Backend", table_cell_style), Paragraph("SQLAlchemy / GeoAlchemy2", table_cell_style), Paragraph("2.0.28 / 0.14.7", table_cell_style), Paragraph("ORM Data Mapping & Spatial PostGIS Queries", table_cell_style)],
        [Paragraph("Backend", table_cell_style), Paragraph("PyTesseract & Pillow", table_cell_style), Paragraph("0.3.10 / 10.2.0", table_cell_style), Paragraph("OCR Text Extraction & Image Sharpening/Preprocessing", table_cell_style)],
        [Paragraph("Database", table_cell_style), Paragraph("PostgreSQL + PostGIS", table_cell_style), Paragraph("16-3.4", table_cell_style), Paragraph("Relational & Spatial Database with GiST Indexing", table_cell_style)],
        [Paragraph("Container", table_cell_style), Paragraph("Docker Compose", table_cell_style), Paragraph("3.8 Spec", table_cell_style), Paragraph("Multi-container DB, Backend API & Frontend Web deployment", table_cell_style)]
    ]
    
    t_tech = Table(tech_data, colWidths=[1.1*inch, 1.7*inch, 1.1*inch, 3.1*inch])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 14))

    # Core Business Logic Engines
    story.append(Paragraph("4. Deep-Dive into Business Logic Engines", h1_style))
    
    # 4.1 Financial Amortization Engine
    story.append(Paragraph("4.1 Financial Amortization Engine (financial_engine.py)", h2_style))
    fin_desc = (
        "Enforces the <b>Statutory Hard Gate:</b> Annual Family Income ≤ ₹5,00,000 INR. If exceeded, throws an HTTP 422 "
        "<code>STATUTORY_INELIGIBILITY_INCOME_EXCEEDED</code> exception. Formulates government concessional loan share and EMI calculations:"
    )
    story.append(Paragraph(fin_desc, body_style))
    
    fin_formulas = [
        "<b>Principal Loan Amount:</b> P = min(Project Cost × Govt Share %, Max Scheme Cap)",
        "<b>Beneficiary Margin Money:</b> M = max(0, Project Cost - P)",
        "<b>Monthly EMI Calculation:</b> EMI = P × [ r(1+r)^n / ((1+r)^n - 1) ]",
        "<i>where r = (Annual Interest Rate / 100) / 12 and n = (Tenure Years × 12) - Moratorium Months.</i>"
    ]
    for f in fin_formulas:
        story.append(Paragraph(f, formula_style))
    story.append(Spacer(1, 8))

    # 4.2 PostGIS Spatial Router Engine
    story.append(Paragraph("4.2 GIS Spatial Router & Composite Scoring Engine (postgis_router.py)", h2_style))
    gis_desc = (
        "Computes Haversine distances between beneficiary coordinates (lat, lon) and channel partner branches. "
        "Applies <b>Statutory Pruning Gates</b> to exclude branches where <i>Remaining Quota ≤ 0</i> or <i>NPA % ≥ 15.0%</i>. "
        "Computes multi-factor composite ranking index <b>R_score</b>:"
    )
    story.append(Paragraph(gis_desc, body_style))
    
    gis_formulas = [
        "<b>Composite Index:</b> R_score = (0.45 × S_dist) + (0.35 × S_quota) + (0.20 × S_npa)",
        "<b>Distance Sub-score:</b> S_dist = 1 / (1 + Distance_km / 10)",
        "<b>Quota Utilization Sub-score:</b> S_quota = (Allocated Quota - Utilized Quota) / Allocated Quota",
        "<b>NPA Health Sub-score:</b> S_npa = 1 - (NPA % / 15.0)",
        "<b>Status Pin Classification:</b> GREEN (R_score ≥ 0.70), YELLOW (0.50 ≤ R_score < 0.70), RED_PRUNED (Excluded)."
    ]
    for f in gis_formulas:
        story.append(Paragraph(f, formula_style))
    story.append(Spacer(1, 8))

    # 4.3 AI OCR Engine
    story.append(Paragraph("4.3 AI OCR Document Verification Engine (ocr.py)", h2_style))
    ocr_desc = (
        "Uses PyTesseract with PIL pre-processing (2.0x contrast enhancement, sharpening, greyscale). "
        "Validates SC Community Certificates using positive statutory keyword matching (<code>SCHEDULED CASTE</code>, "
        "<code>COMMUNITY CERTIFICATE</code>, <code>TAHSILDAR</code>, <code>MEESEVA</code>) while disqualifying non-eligible categories "
        "(<code>OBC</code>, <code>SCHEDULED TRIBE</code>, <code>GENERAL CATEGORY</code>)."
    )
    story.append(Paragraph(ocr_desc, body_style))
    story.append(Spacer(1, 10))

    # 10 Statutory Schemes Table
    story.append(Paragraph("5. Official Statutory NSFDC Schemes Directory (10 Schemes)", h1_style))
    
    schemes_data = [
        [Paragraph("ID", table_header_style), Paragraph("Scheme Name", table_header_style), Paragraph("Category", table_header_style), Paragraph("Max Cost", table_header_style), Paragraph("Male %", table_header_style), Paragraph("Female %", table_header_style), Paragraph("Morat.", table_header_style), Paragraph("Tenure", table_header_style)],
        [Paragraph("NSFDC_MCF", table_cell_style), Paragraph("Micro Credit Finance", table_cell_style), Paragraph("MICRO", table_cell_style), Paragraph("₹1.4 Lakh", table_cell_style), Paragraph("6.50%", table_cell_style), Paragraph("5.50%", table_cell_style), Paragraph("3 mos", table_cell_style), Paragraph("3 yrs", table_cell_style)],
        [Paragraph("NSFDC_MSY", table_cell_style), Paragraph("Mahila Samriddhi Yojana", table_cell_style), Paragraph("MICRO_WOMEN", table_cell_style), Paragraph("₹1.4 Lakh", table_cell_style), Paragraph("N/A", table_cell_style), Paragraph("5.00%", table_cell_style), Paragraph("3 mos", table_cell_style), Paragraph("3 yrs", table_cell_style)],
        [Paragraph("NSFDC_TL", table_cell_style), Paragraph("Term Loan General Scheme", table_cell_style), Paragraph("TERM", table_cell_style), Paragraph("₹50.0 Lakh", table_cell_style), Paragraph("7.50%", table_cell_style), Paragraph("7.00%", table_cell_style), Paragraph("6 mos", table_cell_style), Paragraph("5 yrs", table_cell_style)],
        [Paragraph("NSFDC_ELS_D", table_cell_style), Paragraph("Educational Loan (Domestic)", table_cell_style), Paragraph("EDU_DOMESTIC", table_cell_style), Paragraph("₹20.0 Lakh", table_cell_style), Paragraph("7.00%", table_cell_style), Paragraph("6.00%", table_cell_style), Paragraph("12 mos", table_cell_style), Paragraph("5 yrs", table_cell_style)],
        [Paragraph("NSFDC_ELS_O", table_cell_style), Paragraph("Educational Loan (Abroad)", table_cell_style), Paragraph("EDU_ABROAD", table_cell_style), Paragraph("₹50.0 Lakh", table_cell_style), Paragraph("7.50%", table_cell_style), Paragraph("6.50%", table_cell_style), Paragraph("12 mos", table_cell_style), Paragraph("7 yrs", table_cell_style)],
        [Paragraph("NSFDC_GBS", table_cell_style), Paragraph("Green Business Scheme", table_cell_style), Paragraph("GREEN_ENERGY", table_cell_style), Paragraph("₹30.0 Lakh", table_cell_style), Paragraph("7.00%", table_cell_style), Paragraph("6.50%", table_cell_style), Paragraph("6 mos", table_cell_style), Paragraph("5 yrs", table_cell_style)],
        [Paragraph("NSFDC_LVY", table_cell_style), Paragraph("Laghu Vyavsay Yojana", table_cell_style), Paragraph("SMALL_BUSINESS", table_cell_style), Paragraph("₹5.0 Lakh", table_cell_style), Paragraph("7.00%", table_cell_style), Paragraph("6.50%", table_cell_style), Paragraph("6 mos", table_cell_style), Paragraph("4 yrs", table_cell_style)],
        [Paragraph("NSFDC_SUY", table_cell_style), Paragraph("Swachhta Udyami Yojana", table_cell_style), Paragraph("SANITATION", table_cell_style), Paragraph("₹50.0 Lakh", table_cell_style), Paragraph("6.00%", table_cell_style), Paragraph("5.50%", table_cell_style), Paragraph("6 mos", table_cell_style), Paragraph("7 yrs", table_cell_style)],
        [Paragraph("NSFDC_SSY", table_cell_style), Paragraph("Shilpi Samriddhi Yojana", table_cell_style), Paragraph("ARTISAN", table_cell_style), Paragraph("₹1.4 Lakh", table_cell_style), Paragraph("6.00%", table_cell_style), Paragraph("5.00%", table_cell_style), Paragraph("3 mos", table_cell_style), Paragraph("3 yrs", table_cell_style)],
        [Paragraph("NSFDC_MKY", table_cell_style), Paragraph("Mahila Kisan Yojana", table_cell_style), Paragraph("AGRI_WOMEN", table_cell_style), Paragraph("₹1.4 Lakh", table_cell_style), Paragraph("N/A", table_cell_style), Paragraph("5.00%", table_cell_style), Paragraph("3 mos", table_cell_style), Paragraph("3 yrs", table_cell_style)]
    ]

    t_schemes = Table(schemes_data, colWidths=[1.1*inch, 1.8*inch, 1.1*inch, 0.85*inch, 0.55*inch, 0.55*inch, 0.55*inch, 0.45*inch])
    t_schemes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), secondary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_schemes)
    story.append(Spacer(1, 14))

    # Channel Partner Network & Tiers
    story.append(Paragraph("6. Pan-India Channel Partner Network & Tiers", h1_style))
    cp_text = (
        "The portal integrates channel partners across all 28 States and UTs, structured into 3 distinct tiers:"
    )
    story.append(Paragraph(cp_text, body_style))
    
    cp_tiers = [
        "<b>State Channelizing Agencies (SCA):</b> State government welfare corporations (e.g., AP State SC Co-op Finance Corp, Telangana SC Co-operative Dev Corp, Mahatma Phule BC Dev Corp MH, TAHDCO TN, UP SC Finance & Dev Corp, DSFDC Delhi).",
        "<b>Public Sector Banks (PSB):</b> Nationalized commercial banks providing extensive branch reach (e.g., State Bank of India, Bank of Maharashtra).",
        "<b>Regional Rural Banks (RRB):</b> Micro and rural branch network (e.g., Chaitanya Godavari Grameena Bank, Telangana Grameena Bank, Karnataka Vikas Grameena Bank)."
    ]
    for tier in cp_tiers:
        story.append(Paragraph(f"• {tier}", bullet_style))
    story.append(Spacer(1, 10))

    # Multi-Lingual & Voice Assistant
    story.append(Paragraph("7. Accessibility: Multi-Lingual & Native Voice Intake Engine", h1_style))
    i18n_text = (
        "To break down literacy barriers for rural SC beneficiaries, the frontend incorporates native localization for "
        "<b>8 Indian Languages</b> (English, Hindi, Bengali, Gujarati, Kannada, Marathi, Tamil, Telugu) and an interactive "
        "<b>Live Voice Assistant</b> leveraging Web Speech API for real-time Speech-to-Text (STT) form auto-filling and Text-to-Speech (TTS) audio guidance."
    )
    story.append(Paragraph(i18n_text, body_style))
    story.append(Spacer(1, 10))

    # Repository Structure
    story.append(Paragraph("8. Project File & Codebase Structure", h1_style))
    
    repo_structure = [
        "<b>nsfdc-concessional-portal/docker-compose.yml:</b> Multi-container orchestration (PostGIS DB, FastAPI Backend, Next.js Frontend).",
        "<b>backend/app/main.py:</b> FastAPI entry point with CORS setup and OpenAPI documentation.",
        "<b>backend/app/core/constants.py:</b> Definitions for 10 NSFDC statutory schemes, income limits, and 28 Indian states.",
        "<b>backend/app/db/init_db.sql:</b> PostGIS schema, spatial extension, ENUM types, and seed data for schemes and channel partner branches.",
        "<b>backend/app/services/financial_engine.py:</b> Statutory income ceiling checks and loan amortization mathematics.",
        "<b>backend/app/services/postgis_router.py:</b> Haversine spatial calculations, statutory pruning gates, and R_score index calculations.",
        "<b>backend/app/api/v1/endpoints/ocr.py:</b> PyTesseract OCR document authentication and community keyword matching.",
        "<b>backend/app/api/v1/endpoints/routing.py:</b> Application lead dispatch, spatial branch locator, and tracking APIs.",
        "<b>frontend/src/app/apply/page.tsx:</b> Step-by-step intake wizard (voice/text, document upload, scheme match, GIS route dispatch).",
        "<b>frontend/src/app/channels/page.tsx:</b> Pan-India channel partner locator map with state filter and radius controls.",
        "<b>frontend/src/app/schemes/page.tsx:</b> Statutory scheme explorer and dynamic EMI calculation sliders.",
        "<b>frontend/src/app/track/page.tsx:</b> Real-time beneficiary application lifecycle tracking desk.",
        "<b>frontend/src/app/officer/page.tsx:</b> Channel partner branch officer lead desk for document inspection and sanction workflows."
    ]
    for item in repo_structure:
        story.append(Paragraph(f"• {item}", bullet_style))
    story.append(Spacer(1, 14))

    # Application Lifecycle Flow
    story.append(Paragraph("9. End-to-End Application Lifecycle Flow", h1_style))
    lifecycle_steps = [
        "1. <b>Beneficiary Intake:</b> Applicant enters project cost, income, and activity purpose via conversational text or voice assistant.",
        "2. <b>Statutory Income Gate:</b> Income checked against ₹5,00,000 ceiling. System matches beneficiary to optimal NSFDC scheme.",
        "3. <b>OCR Document Verification:</b> Beneficiary uploads SC certificate. PyTesseract pre-processes and authenticates keywords in real-time.",
        "4. <b>Amortization Computation:</b> EMI, moratorium period, government loan principal, and beneficiary margin calculated.",
        "5. <b>PostGIS Spatial Routing:</b> System evaluates nearby branches, prunes invalid candidates, calculates R_score, and dispatches lead to top branch.",
        "6. <b>Lifecycle Status Tracking:</b> Reference ID (e.g., SC-2026-AP9042) generated. Branch officer reviews lead and advances status: <code>SUBMITTED → DOCS_VERIFIED → ROUTED_TO_CHANNEL → FIELD_INSPECTED → SANCTIONED → DISBURSED</code>."
    ]
    for step in lifecycle_steps:
        story.append(Paragraph(step, bullet_style))
    story.append(Spacer(1, 20))

    # Footer note
    story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceAfter=10))
    story.append(Paragraph("<i>Document generated automatically for NSFDC Concessional Loan Digital Portal | Govt. of India</i>", ParagraphStyle('EndNote', parent=body_style, fontSize=8, textColor=colors.HexColor("#94A3B8"), alignment=1)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    out_path = os.path.join(os.getcwd(), "NSFDC_Portal_Core_Architecture_Overview.pdf")
    create_pdf(out_path)
