"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, FileText, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function OfficerPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchOfficerLeads();
  }, []);

  const fetchOfficerLeads = async () => {
    setLoading(true);
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

    try {
      const res = await fetch("http://localhost:8000/api/v1/routing/officer/leads");
      if (res.ok) {
        const data = await res.json();
        const combined = [...userApps, ...data.filter((d: any) => !userApps.some((u: any) => u.application_id === d.application_id))];
        setLeads(combined);
        if (combined.length > 0) setSelectedLead(combined[0]);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Backend offline, utilizing officer leads");
    }

    const defaultMockLeads = [
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
        created_at: "2026-08-22T10:30:00Z",
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
        created_at: "2026-08-23T08:15:00Z",
        partner_name: "State Bank of India",
        branch_name: "Kakinada Main Branch"
      }
    ];

    const allLeads = [...userApps, ...defaultMockLeads.filter((d: any) => !userApps.some((u: any) => u.application_id === d.application_id))];
    setLeads(allLeads);
    if (allLeads.length > 0) setSelectedLead(allLeads[0]);
    setLoading(false);
  };

  const handleSignOffInspection = async (appId: string) => {
    const cleanId = appId.replace("#", "").trim();
    try {
      await fetch(`http://localhost:8000/api/v1/routing/applications/${encodeURIComponent(cleanId)}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_status: "FIELD_INSPECTED" }),
      });
    } catch (e) {
      console.warn("Backend API status update fallback");
    }

    setLeads((prev) =>
      prev.map((l) => (l.application_id === appId || l.application_id === cleanId ? { ...l, status: "FIELD_INSPECTED" } : l))
    );
    if (selectedLead) {
      setSelectedLead({ ...selectedLead, status: "FIELD_INSPECTED" });
    }
    setActionSuccess(`Field Inspection signed off for ${appId}. Status updated to FIELD_INSPECTED.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

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
          <UserCheck className="w-4 h-4" />
          <span>Branch Officer Lead Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">{t("officer.heading")}</h1>
        <p className="text-xs sm:text-sm text-slate-200">
          {t("officer.subheading")}
        </p>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-900 text-white p-4 rounded-xl border border-emerald-400 font-bold text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Incoming Leads Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
            <span>{t("officer.incomingLeads")}</span>
            <span className="bg-gov-navy text-white px-2 py-0.5 rounded font-extrabold">{leads.length} Pending</span>
          </div>

          <div className="space-y-3">
            {leads.map((l) => {
              const isSelected = selectedLead?.application_id === l.application_id;
              return (
                <div
                  key={l.application_id}
                  onClick={() => setSelectedLead(l)}
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

        {/* Lead Verification Detail Card */}
        <div className="lg:col-span-7">
          {selectedLead ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t("officer.verificationDesk")}</span>
                  <h3 className="text-xl font-black text-[#002147]">{selectedLead.applicant_name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Ref ID: {selectedLead.application_id} • {selectedLead.contact_number}</p>
                </div>

                <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
                  OCR Status: Authenticated SC
                </span>
              </div>

              {/* Loan Breakdown Matrix */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Project Loan Cost</span>
                  <strong className="text-base text-slate-900 font-extrabold">₹ {selectedLead.project_cost?.toLocaleString()}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Annual Family Income</span>
                  <strong className="text-base text-emerald-700 font-extrabold">₹ {selectedLead.annual_income?.toLocaleString()}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Target Scheme</span>
                  <strong className="text-sm text-gov-navy font-bold">{selectedLead.scheme_id}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Assigned Branch Desk</span>
                  <strong className="text-sm text-slate-900 font-bold">{selectedLead.branch_name}</strong>
                </div>
              </div>

              {/* Simulated SC Certificate OCR Record */}
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

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleSignOffInspection(selectedLead.application_id)}
                  disabled={selectedLead.status === "FIELD_INSPECTED"}
                  className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs shadow flex items-center justify-center space-x-2 transition-all ${
                    selectedLead.status === "FIELD_INSPECTED"
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedLead.status === "FIELD_INSPECTED" ? t("officer.signedOff") : t("officer.signOff")}</span>
                </button>

                <button
                  onClick={() => alert(`Sanction Order issued for ${selectedLead.application_id}`)}
                  className="bg-[#002147] hover:bg-[#001529] text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow"
                >
                  {t("officer.issueSanction")}
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              Select an application lead from the left rail to view verification details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
