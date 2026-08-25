"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { ConstitutionBanner } from "@/components/hero/ConstitutionBanner";
import { PanIndiaBranchMap } from "@/components/map/PanIndiaBranchMap";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldCheck,
  Calculator,
  MapPin,
  Search,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  Building2,
  Award,
  Sparkles,
  FileCheck,
  Navigation,
  FileText,
  Landmark,
  Wallet
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [trackRefInput, setTrackRefInput] = useState("");
  const [trackResult, setTrackResult] = useState<any | null>(null);
  const [officerLeads, setOfficerLeads] = useState<any[]>([]);
  const [selectedOfficerLead, setSelectedOfficerLead] = useState<any | null>(null);
  const [officerSuccess, setOfficerSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Initializing Officer Leads for inline Officer Desk section with user applications first
    let userApps: any[] = [];
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nsfdc_user_applications");
      if (stored) {
        try {
          userApps = JSON.parse(stored);
        } catch (e) {
          console.warn("Failed to parse user applications");
        }
      }
    }

    const defaultLeads = [
      {
        application_id: "SC-2026-AP9042",
        applicant_name: "Mallaiah K.",
        contact_number: "+91 98480 12345",
        gender: "MALE",
        annual_income: 180000.0,
        project_cost: 140000.0,
        scheme_id: "NSFDC_MCF",
        status: "ROUTED_TO_CHANNEL",
        ocr_verified: true,
        partner_name: "AP State SC Cooperative Finance Corp",
        branch_name: "District Central Office Kakinada"
      },
      {
        application_id: "SC-2026-AP8819",
        applicant_name: "Lakshmi Prasanna",
        contact_number: "+91 94401 56789",
        gender: "FEMALE",
        annual_income: 140000.0,
        project_cost: 100000.0,
        scheme_id: "NSFDC_MSY",
        status: "DOCS_VERIFIED",
        ocr_verified: true,
        partner_name: "State Bank of India",
        branch_name: "Kakinada Main Branch"
      }
    ];

    const allLeads = [...userApps, ...defaultLeads.filter((d) => !userApps.some((u: any) => u.application_id === d.application_id))];
    setOfficerLeads(allLeads);
    if (allLeads.length > 0) {
      setSelectedOfficerLead(allLeads[0]);
    }
  }, []);

  const SCHEMES_LIST = [
    {
      id: "NSFDC_MCF",
      title: "Micro Credit Finance Scheme (MCF)",
      description: "Direct micro-credit loans for small business, vending, artisans, and rural micro-enterprises.",
      rate: "5.5% - 6.0%",
      govtShare: "90%",
      maxCost: "₹ 1,40,000"
    },
    {
      id: "NSFDC_MSY",
      title: "Mahila Samriddhi Yojana (MSY)",
      description: "Specialized concessional loan for Scheduled Caste female entrepreneurs with maximum government share.",
      rate: "5.0%",
      govtShare: "95%",
      maxCost: "₹ 1,40,000"
    },
    {
      id: "NSFDC_TL",
      title: "Term Loan Scheme (General)",
      description: "Capital expenditure financing for commercial transport, manufacturing, and agro-processing units.",
      rate: "6.5% - 7.5%",
      govtShare: "90%",
      maxCost: "₹ 50,00,000"
    },
    {
      id: "NSFDC_ELS_D",
      title: "Educational Loan Scheme (Domestic)",
      description: "Higher professional education financing in India (Engineering, Medicine, Law, Management).",
      rate: "4.0%",
      govtShare: "90%",
      maxCost: "₹ 10,00,000"
    },
    {
      id: "NSFDC_ELS_O",
      title: "Overseas Educational Loan Scheme",
      description: "Concessional credit for post-graduate and doctoral studies in foreign universities.",
      rate: "4.0%",
      govtShare: "90%",
      maxCost: "₹ 20,00,000"
    },
    {
      id: "NSFDC_GBS",
      title: "Green Business Scheme (GBS)",
      description: "Financial assistance for eco-friendly business activities (Battery Rickshaws, Solar Energy, Waste Mgmt).",
      rate: "6.0%",
      govtShare: "90%",
      maxCost: "₹ 30,00,000"
    }
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackRefInput.trim()) {
      const cleanId = trackRefInput.trim().toUpperCase();
      setTrackResult({
        application_id: `#${cleanId}`,
        applicant_name: cleanId.includes("1789") ? "Ram" : "Ramesh Kumar SC",
        contact_number: "+91 98480 12345",
        project_cost: 140000.0,
        scheme_id: "NSFDC_MCF",
        status: "ROUTED_TO_CHANNEL",
        partner_name: "AP State SC Cooperative Finance Corp",
        branch_name: "District Central Office Kakinada"
      });
    }
  };

  const handleSignOffInspection = (appId: string) => {
    setOfficerLeads((prev) =>
      prev.map((l) => (l.application_id === appId ? { ...l, status: "FIELD_INSPECTED" } : l))
    );
    if (selectedOfficerLead && selectedOfficerLead.application_id === appId) {
      setSelectedOfficerLead({ ...selectedOfficerLead, status: "FIELD_INSPECTED" });
    }
    setOfficerSuccess(`Field Inspection signed off for ${appId}. Status updated to FIELD_INSPECTED.`);
    setTimeout(() => setOfficerSuccess(null), 5000);
  };

  return (
    <div className="space-y-16 pb-16 animate-fadeIn">
      {/* ========================================================================= */}
      {/* FULL-WIDTH EDGE-TO-EDGE HERO PHOTO CAROUSEL (ID: hero - VERY TOP) */}
      {/* ========================================================================= */}
      <section id="hero" className="w-full scroll-mt-24">
        <HeroCarousel />
      </section>

      {/* Main Portal Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Main Big Official Title Banner */}
        <div className="bg-[#002147] text-white p-6 sm:p-10 rounded-3xl border-b-8 border-gov-saffron shadow-xl relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron text-gov-saffron px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-gov-saffron" />
              <span>{t("govTitle")}</span>
            </div>

            <div className="text-xs font-bold text-slate-300">
              Statutory Apex Corporation under Section 8 Companies Act
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              {t("nsfdcTitle")}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-medium max-w-4xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Quick Action CTA Button Group */}
          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#apply"
              className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-transform transform active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              <span>{t("hero.speakToApply")} ↓</span>
            </a>

            <a
              href="#channels"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm border border-white/20 flex items-center space-x-2 backdrop-blur-sm transition-colors cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-gov-saffron" />
              <span>{t("hero.locateBranch")} ↓</span>
            </a>
          </div>
        </div>

        {/* Decorative Historical Constitution Information Banner */}
        <ConstitutionBanner />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: APPLY FOR CONCESSIONAL LOAN SCHEMES (ID: apply) */}
      {/* ========================================================================= */}
      <section id="apply" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-slate-200 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-gov-saffron bg-gov-navy px-3 py-1 rounded-full">
              Section 1 • {t("apply.badge")}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#002147] mt-1">
              {t("apply.heading")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t("apply.subheading")}
            </p>
          </div>

          <Link
            href="/apply"
            className="bg-[#002147] hover:bg-slate-800 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow"
          >
            <span>{t("hero.speakToApply")} →</span>
          </Link>
        </div>

        {/* 4-Stage Pipeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 bg-gov-saffron/20 border border-gov-saffron text-slate-900 rounded-xl flex items-center justify-center font-black text-sm">
              1
            </div>
            <h4 className="text-base font-extrabold text-[#002147]">{t("home.step1Title")}</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {t("home.step1Desc")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 bg-gov-saffron/20 border border-gov-saffron text-slate-900 rounded-xl flex items-center justify-center font-black text-sm">
              2
            </div>
            <h4 className="text-base font-extrabold text-[#002147]">{t("home.step2Title")}</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {t("home.step2Desc")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 bg-gov-saffron/20 border border-gov-saffron text-slate-900 rounded-xl flex items-center justify-center font-black text-sm">
              3
            </div>
            <h4 className="text-base font-extrabold text-[#002147]">{t("home.step3Title")}</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {t("home.step3Desc")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 bg-gov-saffron/20 border border-gov-saffron text-slate-900 rounded-xl flex items-center justify-center font-black text-sm">
              4
            </div>
            <h4 className="text-base font-extrabold text-[#002147]">{t("home.step4Title")}</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {t("home.step4Desc")}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: INTERACTIVE PAN-INDIA MAP (ID: channels) */}
      {/* ========================================================================= */}
      <section id="channels" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 scroll-mt-24">
        <div className="border-b-2 border-slate-200 pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-gov-saffron bg-gov-navy px-3 py-1 rounded-full">
            Section 2 • {t("channels.badge")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#002147] mt-1">
            {t("channels.heading")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t("channels.subheading")}
          </p>
        </div>

        <PanIndiaBranchMap onSelectBranch={() => {}} />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: STATUTORY SCHEME DIRECTORY (ID: schemes) */}
      {/* ========================================================================= */}
      <section id="schemes" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-slate-200 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-gov-saffron bg-gov-navy px-3 py-1 rounded-full">
              Section 3 • {t("schemes.badge")}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#002147] mt-1">
              {t("schemes.heading")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t("schemes.subheading")}
            </p>
          </div>

          <Link
            href="/schemes"
            className="text-xs font-black text-[#002147] hover:text-gov-saffron flex items-center space-x-1"
          >
            <span>{t("home.viewAllSchemes")} →</span>
          </Link>
        </div>

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHEMES_LIST.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-[#002147] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-slate-100 text-[#002147] text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-slate-300">
                    {scheme.id}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                    {scheme.rate} Interest
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#002147] leading-snug">
                  {scheme.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {scheme.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Govt. Funding</span>
                    <strong className="text-slate-900 font-extrabold">{scheme.govtShare}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Max Project Limit</span>
                    <strong className="text-slate-900 font-extrabold">{scheme.maxCost}</strong>
                  </div>
                </div>

                <Link
                  href={`/apply?scheme=${scheme.id}`}
                  className="w-full bg-[#002147] hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow transition-transform transform active:scale-95"
                >
                  <span>{t("home.applyAndCalculate")} →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CITIZEN TRACKING DESK (ID: track) */}
      {/* ========================================================================= */}
      <section id="track" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 scroll-mt-24">
        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border-2 border-gov-gold/40 shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-gov-gold bg-gov-navy px-3 py-1 rounded-full border border-gov-gold/40">
              Section 4 • {t("track.badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t("track.heading")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              {t("track.subheading")}
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              type="text"
              value={trackRefInput}
              onChange={(e) => setTrackRefInput(e.target.value)}
              placeholder="Enter Reference ID (e.g. SC-2026-AP9042)"
              className="flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 border-2 border-gov-gold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <button
              type="submit"
              className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-8 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>{t("track.trackButton")} →</span>
            </button>
          </form>

          {/* Instant Status Preview Card */}
          {trackResult && (
            <div className="bg-white text-slate-900 p-6 rounded-2xl border-2 border-gov-gold shadow-lg space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Application Reference Number</span>
                  <h3 className="text-xl font-black text-[#002147]">{trackResult.application_id}</h3>
                </div>

                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black uppercase">
                  {trackResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block font-bold">Applicant Name</span>
                  <strong className="text-slate-900 font-extrabold text-sm">{trackResult.applicant_name}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block font-bold">Loan Project Limit</span>
                  <strong className="text-slate-900 font-extrabold text-sm">₹ {trackResult.project_cost?.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block font-bold">Assigned Channel Partner</span>
                  <strong className="text-gov-navy font-bold">{trackResult.partner_name}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500 block font-bold">Branch Office</span>
                  <strong className="text-slate-900 font-bold">{trackResult.branch_name}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: OFFICER DESK (ID: officer) */}
      {/* ========================================================================= */}
      <section id="officer" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 scroll-mt-24">
        <div className="border-b-2 border-slate-200 pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-gov-saffron bg-gov-navy px-3 py-1 rounded-full">
            Section 5 • {t("officer.badge")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#002147] mt-1">
            {t("officer.heading")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t("officer.subheading")}
          </p>
        </div>

        {officerSuccess && (
          <div className="bg-emerald-900 text-white p-4 rounded-xl border border-emerald-400 font-bold text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{officerSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Officer Leads Rail */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
              <span>{t("officer.incomingLeads")}</span>
              <span className="bg-gov-navy text-white px-2 py-0.5 rounded font-extrabold">{officerLeads.length} Leads</span>
            </div>

            <div className="space-y-3">
              {officerLeads.map((l) => {
                const isSelected = selectedOfficerLead?.application_id === l.application_id;
                return (
                  <div
                    key={l.application_id}
                    onClick={() => setSelectedOfficerLead(l)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "border-[#002147] bg-slate-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-gov-navy">{l.application_id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        l.status === "FIELD_INSPECTED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                        {l.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">{l.applicant_name}</h4>
                    <div className="flex justify-between text-xs text-slate-600 font-semibold">
                      <span>Project Cost: ₹ {l.project_cost?.toLocaleString()}</span>
                      <span className="text-gov-saffron font-bold">{l.scheme_id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Detail Verification */}
          <div className="lg:col-span-7">
            {selectedOfficerLead ? (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t("officer.verificationDesk")}</span>
                    <h3 className="text-xl font-black text-[#002147]">{selectedOfficerLead.applicant_name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">Ref ID: {selectedOfficerLead.application_id} • {selectedOfficerLead.contact_number}</p>
                  </div>

                  <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
                    OCR Status: Authenticated SC
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Project Loan Cost</span>
                    <strong className="text-base text-slate-900 font-extrabold">₹ {selectedOfficerLead.project_cost?.toLocaleString()}</strong>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Annual Family Income</span>
                    <strong className="text-base text-emerald-700 font-extrabold">₹ {selectedOfficerLead.annual_income?.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Authenticated SC Community Certificate OCR Record</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 text-[11px] font-mono text-slate-800 space-y-1">
                    <div>Certificate No: <strong>CC-2026-AP-884910</strong></div>
                    <div>Issuing Authority: <strong>Revenue Dept / Tahsildar Office</strong></div>
                    <div>Matched Keywords: <strong>SCHEDULED CASTE, COMMUNITY CERTIFICATE, REVENUE DEPT</strong></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleSignOffInspection(selectedOfficerLead.application_id)}
                    disabled={selectedOfficerLead.status === "FIELD_INSPECTED"}
                    className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs shadow flex items-center justify-center space-x-2 transition-all ${
                      selectedOfficerLead.status === "FIELD_INSPECTED"
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedOfficerLead.status === "FIELD_INSPECTED" ? t("officer.signedOff") : t("officer.signOff")}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
