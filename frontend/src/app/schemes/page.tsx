"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SchemesPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const schemesList = [
    {
      id: "NSFDC_MCF",
      name: "Micro Credit Finance Scheme (MCF)",
      category: "MICRO LOAN",
      maxCost: "₹ 1,40,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "6.50% p.a.",
      rateFemale: "5.50% p.a.",
      moratorium: "3 Months",
      tenure: "3 Years",
      details: "Provides concessional micro-loans for small income-generating activities, petty business, vegetable vending, and artisan self-employment."
    },
    {
      id: "NSFDC_MSY",
      name: "Mahila Samriddhi Yojana (MSY)",
      category: "MICRO (WOMEN)",
      maxCost: "₹ 1,40,000.00",
      govtShare: "95%",
      marginShare: "5%",
      rateMale: "N/A (Female Exclusive)",
      rateFemale: "5.00% p.a.",
      moratorium: "3 Months",
      tenure: "3 Years",
      details: "Exclusive micro-credit scheme designed to empower Scheduled Caste women entrepreneurs with minimal 5% margin money requirement and 5% concessional interest."
    },
    {
      id: "NSFDC_TL",
      name: "Term Loan General Scheme",
      category: "TERM CAPEX",
      maxCost: "₹ 50,00,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "7.50% p.a.",
      rateFemale: "7.00% p.a.",
      moratorium: "6 Months",
      tenure: "5 Years",
      details: "Finances viable income-generating enterprise projects in service, transport, dairy farming, small manufacturing, and agro-processing units."
    },
    {
      id: "NSFDC_ELS_D",
      name: "Educational Loan Scheme (Domestic)",
      category: "EDUCATION (INDIA)",
      maxCost: "₹ 20,00,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "7.00% p.a.",
      rateFemale: "6.00% p.a.",
      moratorium: "12 Months",
      tenure: "5 Years",
      details: "Concessional loans for SC students pursuing full-time professional and technical courses in recognized institutions in India (Engineering, Medical, Law)."
    },
    {
      id: "NSFDC_ELS_O",
      name: "Educational Loan Scheme (Abroad)",
      category: "EDUCATION (ABROAD)",
      maxCost: "₹ 50,00,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "7.50% p.a.",
      rateFemale: "6.50% p.a.",
      moratorium: "12 Months",
      tenure: "7 Years",
      details: "Financial support for SC students selected for higher education abroad in accredited foreign universities."
    },
    {
      id: "NSFDC_GBS",
      name: "Green Business Scheme (GBS)",
      category: "GREEN ENERGY",
      maxCost: "₹ 30,00,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "7.00% p.a.",
      rateFemale: "6.50% p.a.",
      moratorium: "6 Months",
      tenure: "5 Years",
      details: "Financing for battery e-Rickshaws, solar polyhouse, eco-friendly transport vehicles, and green technology machinery."
    },
    {
      id: "NSFDC_LVY",
      name: "Laghu Vyavsay Yojana (LVY)",
      category: "SMALL BUSINESS",
      maxCost: "₹ 5,00,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "7.00% p.a.",
      rateFemale: "6.50% p.a.",
      moratorium: "6 Months",
      tenure: "4 Years",
      details: "Rural workshops, tailoring centers, repair shops, and small business enterprises."
    },
    {
      id: "NSFDC_SUY",
      name: "Swachhta Udyami Yojana (SUY)",
      category: "SANITATION",
      maxCost: "₹ 50,00,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "6.00% p.a.",
      rateFemale: "5.50% p.a.",
      moratorium: "6 Months",
      tenure: "7 Years",
      details: "Mechanized cleaning machinery, suction vehicles, and sanitation transport vehicles for safai karamcharis and sanitation workers."
    },
    {
      id: "NSFDC_SSY",
      name: "Shilpi Samriddhi Yojana (SSY)",
      category: "ARTISAN",
      maxCost: "₹ 1,40,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "6.00% p.a.",
      rateFemale: "5.00% p.a.",
      moratorium: "3 Months",
      tenure: "3 Years",
      details: "Handloom weaving, terracotta pottery, metal craft, and traditional artisan trades."
    },
    {
      id: "NSFDC_MKY",
      name: "Mahila Kisan Yojana (MKY)",
      category: "AGRI (WOMEN)",
      maxCost: "₹ 1,40,000.00",
      govtShare: "90%",
      marginShare: "10%",
      rateMale: "N/A (Female Exclusive)",
      rateFemale: "5.00% p.a.",
      moratorium: "3 Months",
      tenure: "3 Years",
      details: "Agriculture, goat rearing, floriculture, and organic farming exclusively for SC women farmers."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Back Step Button */}
      <div>
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black shadow-sm transition-all cursor-pointer"
        >
          <span>← Back to Previous Step</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-2xl border-b-4 border-gov-saffron shadow-md space-y-2">
        <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron/50 text-gov-saffron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Official Statutory Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">All 10 NSFDC Concessional Credit Schemes</h1>
        <p className="text-xs sm:text-sm text-slate-200">
          Official statutory interest rates, loan caps, moratorium grace periods, and government funding shares for FY 2026-27.
        </p>
      </div>

      {/* Statutory Rules Gate Alert Box */}
      <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-2xl space-y-3">
        <div className="flex items-center space-x-2 font-black text-amber-950 text-sm">
          <ShieldCheck className="w-5 h-5 text-gov-saffron shrink-0" />
          <span>Statutory Eligibility & Hard Gate Protocols</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-900 font-medium">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 font-bold mb-1">Income Ceiling Rule</strong>
            Annual family income must be ≤ ₹ 5,00,000.00 per annum (enforced via API Hard Gate).
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 font-bold mb-1">Caste Verification Rule</strong>
            Must belong to Scheduled Caste (SC) community with OCR certificate proof.
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 font-bold mb-1">Female Concession Rule</strong>
            Additional 0.5% - 1.0% interest concession for female applicants (MSY & MKY).
          </div>
        </div>
      </div>

      {/* Schemes Directory Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#002147] text-white font-bold text-sm flex justify-between items-center">
          <span>Statutory Scheme Master Matrix (10 Schemes)</span>
          <span className="text-xs text-gov-gold font-normal">Active FY 2026-27</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Scheme Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Max Loan Cap</th>
                <th className="p-4">Govt Share</th>
                <th className="p-4">Female Rate</th>
                <th className="p-4">Male Rate</th>
                <th className="p-4">Moratorium</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {schemesList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-gov-navy max-w-xs">{s.name}</td>
                  <td className="p-4"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{s.category}</span></td>
                  <td className="p-4 font-extrabold text-slate-900">{s.maxCost}</td>
                  <td className="p-4 font-bold text-emerald-700">{s.govtShare}</td>
                  <td className="p-4 font-extrabold text-gov-saffron">{s.rateFemale}</td>
                  <td className="p-4 font-bold text-slate-700">{s.rateMale}</td>
                  <td className="p-4">{s.moratorium}</td>
                  <td className="p-4">
                    <Link
                      href={`/apply?scheme=${s.id}`}
                      className="bg-[#002147] hover:bg-[#001529] text-white px-3 py-1.5 rounded text-xs font-bold inline-flex items-center space-x-1"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
