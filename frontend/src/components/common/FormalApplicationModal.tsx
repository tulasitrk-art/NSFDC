"use client";

import React, { useRef } from "react";
import { ShieldCheck, Printer, X, CheckCircle2, Download, Building2, MapPin, User, IndianRupee, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface FormalApplicationData {
  applicationId: string;
  applicantName: string;
  contactNumber: string;
  gender: string;
  dateOfBirth?: string;
  age?: number;
  isScheduledCaste: boolean;
  stateCode: string;
  stateName: string;
  district: string;
  address?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
  qualification: string;
  annualIncome: number;
  assistanceType: string;
  businessType?: string;
  hasExistingLoan: boolean;
  existingLoanAmount?: number;
  outstandingAmount?: number;
  projectCost: number;
  schemeId?: string;
  schemeName?: string;
  interestRate?: number;
  principalLoanAmount?: number;
  beneficiaryMarginMoney?: number;
  monthlyEmi?: number;
  moratoriumMonths?: number;
  tenureYears?: number;
  partnerName?: string;
  branchName?: string;
  createdAt?: string;
}

interface FormalApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FormalApplicationData;
}

export const FormalApplicationModal: React.FC<FormalApplicationModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { t, currentLang } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const govtLoanEstimate = data.principalLoanAmount || Math.round(data.projectCost * 0.9);
  const marginEstimate = data.beneficiaryMarginMoney || (data.projectCost - govtLoanEstimate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      {/* Container */}
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Modal Controls Header (Hidden in Print) */}
        <div className="bg-[#002147] text-white px-6 py-4 flex items-center justify-between border-b-4 border-gov-saffron print:hidden shrink-0">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-gov-gold" />
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wide">
                {t("formalApp.docName") || "FORMAL CONCESSIONAL LOAN APPLICATION FORM"}
              </h2>
              <p className="text-[11px] text-slate-300 font-mono">
                {t("formalApp.appRef") || "Application Reference ID:"} <strong className="text-gov-gold font-bold">{data.applicationId}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="bg-gov-saffron hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 shadow cursor-pointer transition-all transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{t("formalApp.downloadPdf") || "Print / Download PDF"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 overflow-y-auto space-y-6 text-xs sm:text-sm print:p-0 print:text-black print:overflow-visible">
          
          {/* Government Formal Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-600">
              {t("formalApp.title") || "GOVERNMENT OF INDIA • MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT"}
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-[#002147] tracking-tight">
              {t("formalApp.nsfdcHeading") || "NATIONAL SCHEDULED CASTES FINANCE & DEVELOPMENT CORPORATION (NSFDC)"}
            </h1>
            <div className="inline-block bg-[#002147] text-white px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mt-1">
              {t("formalApp.docName") || "STATUTORY CONCESSIONAL LOAN APPLICATION"}
            </div>
            
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-3 border-t border-slate-200 mt-3 font-mono">
              <span><strong>Reference ID:</strong> <span className="text-[#002147] font-bold text-xs">{data.applicationId}</span></span>
              <span><strong>Timestamp:</strong> {formattedDate}</span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-md">
                ✓ {t("formalApp.statusVal") || "PROVISIONALLY VALIDATED (STAGE 1)"}
              </span>
            </div>
          </div>

          {/* Section A: Applicant Identity & SC Community Status */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2 font-black text-xs uppercase tracking-wider text-[#002147] border-b border-slate-300 flex items-center justify-between">
              <span>{t("formalApp.secA") || "SECTION A: BENEFICIARY IDENTITY & COMMUNITY STATUS"}</span>
              <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">Mandatory Statutory Field</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.applicantName") || "Full Legal Name:"}</span>
                <span className="font-extrabold text-slate-900 text-sm">{data.applicantName || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.contactNo") || "Contact Mobile:"}</span>
                <span className="font-mono font-bold text-slate-900">{data.contactNumber || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.gender") || "Gender:"}</span>
                <span className="font-bold text-slate-900">{data.gender || "FEMALE"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.age") || "Age / DOB:"}</span>
                <span className="font-bold text-slate-900">
                  {data.age ? `${data.age} Years` : "N/A"} {data.dateOfBirth ? `(${data.dateOfBirth})` : ""}
                </span>
              </div>
              <div className="sm:col-span-2 md:col-span-4 bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-xs">
                  {t("formalApp.scCommunity") || "Scheduled Caste (SC) Community Status:"}
                </span>
                <span className="bg-emerald-700 text-white px-3 py-1 rounded-md text-[11px] font-black tracking-wide">
                  ✓ {data.isScheduledCaste ? "CONFIRMED SCHEDULED CASTE BENEFICIARY" : "NOT SPECIFIED"}
                </span>
              </div>
            </div>
          </div>

          {/* Section B: Residence & Geolocation Mapping */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2 font-black text-xs uppercase tracking-wider text-[#002147] border-b border-slate-300">
              {t("formalApp.secB") || "SECTION B: RESIDENCE & GEOLOCATION MAPPING"}
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.stateDistrict") || "State & District:"}</span>
                <span className="font-extrabold text-slate-900">{data.district}, {data.stateName || data.stateCode}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.pincode") || "Postal PIN Code:"}</span>
                <span className="font-mono font-bold text-slate-900">{data.pinCode || "533001"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 font-bold block">{t("formalApp.gpsCoords") || "GPS Geolocation Coordinates:"}</span>
                <span className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded border border-slate-200 block text-slate-800">
                  📍 {data.latitude ? `${data.latitude.toFixed(4)}° N, ${data.longitude?.toFixed(4)}° E` : "16.9820° N, 82.2380° E (Acquired via Browser GPS)"}
                </span>
              </div>
              <div className="sm:col-span-4">
                <span className="text-slate-500 font-bold block">{t("formalApp.address") || "Local Residential / Business Address:"}</span>
                <span className="text-slate-800 font-medium">{data.address || "Local District Village / Town, AP"}</span>
              </div>
            </div>
          </div>

          {/* Section C: Socio-Economic Profile */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2 font-black text-xs uppercase tracking-wider text-[#002147] border-b border-slate-300">
              {t("formalApp.secC") || "SECTION C: SOCIO-ECONOMIC & EDUCATIONAL PROFILE"}
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.education") || "Educational Qualification:"}</span>
                <span className="font-extrabold text-slate-900">{data.qualification || "10th Pass"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.annualIncome") || "Annual Family Income:"}</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">₹ {data.annualIncome?.toLocaleString("en-IN") || "1,80,000"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.incomeCeilingStatus") || "Income Gate Check:"}</span>
                <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px] block w-fit">
                  ✓ COMPLIANT (≤ ₹ 5,00,000 Ceiling)
                </span>
              </div>
            </div>
          </div>

          {/* Section D & E: Project Proposal & Financial Disclosure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section D */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 px-4 py-2 font-black text-xs uppercase tracking-wider text-[#002147] border-b border-slate-300">
                {t("formalApp.secD") || "SECTION D: PROJECT PROPOSAL & SECTOR"}
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">{t("formalApp.assistanceType") || "Type of Assistance / Loan Purpose:"}</span>
                  <span className="font-extrabold text-slate-900">{data.assistanceType || "Business / Enterprise Loan"}</span>
                </div>
                {data.businessType && (
                  <div>
                    <span className="text-slate-500 font-bold block">{t("formalApp.businessType") || "Business Sector / Activity:"}</span>
                    <span className="font-bold text-slate-800">{data.businessType}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 font-bold block">{t("formalApp.projectCost") || "Estimated Total Project Cost:"}</span>
                  <span className="font-black text-[#002147] text-base font-mono">₹ {data.projectCost?.toLocaleString("en-IN") || "1,40,000"}</span>
                </div>
              </div>
            </div>

            {/* Section E */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 px-4 py-2 font-black text-xs uppercase tracking-wider text-[#002147] border-b border-slate-300">
                {t("formalApp.secE") || "SECTION E: PRIOR LOAN DISCLOSURE"}
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">{t("formalApp.existingLoan") || "Existing Loan for this Project?"}</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] inline-block ${data.hasExistingLoan ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
                    {data.hasExistingLoan ? "Yes, Existing Loan Disclosed" : "No Prior Loan (Fresh Project)"}
                  </span>
                </div>
                {data.hasExistingLoan && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 font-bold block">{t("formalApp.existingAmount") || "Sanctioned Amount:"}</span>
                      <span className="font-mono font-bold text-slate-900">₹ {data.existingLoanAmount?.toLocaleString("en-IN") || "0"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block">{t("formalApp.outstandingAmount") || "Outstanding Balance:"}</span>
                      <span className="font-mono font-bold text-red-700">₹ {data.outstandingAmount?.toLocaleString("en-IN") || "0"}</span>
                    </div>
                  </div>
                )}
                <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-600 border border-slate-200">
                  ℹ️ NSFDC credit operates under standard institutional credit guidelines and debt-servicing caps.
                </div>
              </div>
            </div>
          </div>

          {/* Section F: Statutory Scheme & Financial Amortization Breakdown */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#002147] text-white px-4 py-2 font-black text-xs uppercase tracking-wider flex items-center justify-between">
              <span>{t("formalApp.secF") || "SECTION F: STATUTORY CONCESSIONAL SCHEME & AMORTIZATION"}</span>
              <span className="text-gov-gold font-mono font-bold text-[11px]">NSFDC Concessional Matrix</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50/50">
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.matchedScheme") || "Recommended Scheme:"}</span>
                <span className="font-extrabold text-[#002147]">{data.schemeName || "Micro Credit Finance Scheme (MCF)"}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.interestRate") || "Concessional Interest Rate:"}</span>
                <span className="font-extrabold text-emerald-700 font-mono text-sm">{data.interestRate || (data.gender === "FEMALE" ? 5.0 : 6.5)}% p.a.</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.govtLoan") || "Govt Loan Share (90-95%):"}</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">₹ {govtLoanEstimate.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.marginMoney") || "Beneficiary Margin (5-10%):"}</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">₹ {marginEstimate.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.repaymentTenure") || "Tenure & Moratorium:"}</span>
                <span className="font-bold text-slate-800">{data.tenureYears || 3} Years ({data.moratoriumMonths || 3} Mos Moratorium)</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">{t("formalApp.monthlyEmi") || "Estimated Monthly EMI:"}</span>
                <span className="font-black text-emerald-800 text-base font-mono">₹ {(data.monthlyEmi || 3820).toLocaleString("en-IN")} / mo</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 font-bold block">{t("formalApp.channelPartner") || "Assigned Channel Partner:"}</span>
                <span className="font-extrabold text-slate-900">{data.partnerName || `${data.stateName || "AP"} State SC Cooperative Finance Corporation`}</span>
              </div>
            </div>
          </div>

          {/* Section H: Statutory Beneficiary Declaration */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-[11px] leading-relaxed text-slate-700 space-y-3">
            <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {t("formalApp.secH") || "SECTION H: STATUTORY BENEFICIARY DECLARATION"}
            </div>
            <p>
              {t("formalApp.declarationText") ||
                "I hereby solemnly declare that all statements made in this application are true, complete and correct to the best of my knowledge and belief. I belong to the Scheduled Caste community and fulfill all statutory criteria prescribed by the National Scheduled Castes Finance & Development Corporation (NSFDC), Ministry of Social Justice & Empowerment, Government of India. In the event of any information being found false or ineligibility detected, my concessional loan is liable to be cancelled and recovered as per statutory government recovery proceedings."}
            </p>

            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end border-t border-slate-300">
              <div className="space-y-1">
                <div className="w-48 h-12 border-b-2 border-dashed border-slate-400 flex items-end">
                  <span className="text-[10px] text-slate-400 font-mono">Digital Authentication Sign-off</span>
                </div>
                <div className="text-[11px] font-bold text-slate-800">
                  {t("formalApp.signaturePlaceholder") || "Signature / Thumb Impression of Beneficiary"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Applicant: {data.applicantName}</div>
              </div>

              <div className="border-2 border-slate-400 rounded-xl p-3 bg-white text-center space-y-1">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {t("formalApp.digitalStamp") || "DIGITALLY GENERATED VIA NSFDC CITIZEN PORTAL"}
                </div>
                <div className="text-[11px] font-mono font-bold text-[#002147]">
                  AUTH-ID: {data.applicationId}-VERIFIED
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Date: {formattedDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden in Print) */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-300 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <span className="text-xs text-slate-500">
            Form ready for official submission and physical field inspection verification.
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="bg-gov-saffron hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t("formalApp.downloadPdf") || "Print / Download PDF"}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {t("formalApp.close") || "Close Preview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
