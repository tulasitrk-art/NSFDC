"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileCheck, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, XCircle, Globe2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { OCRVerificationResponse, verifyCertificateOCR } from "@/lib/api";
import { ALL_CASTE_CATEGORIES, getCasteCategoryById } from "@/lib/caste_categories";

interface StepDocumentUploadProps {
  onVerified: (data: OCRVerificationResponse) => void;
  onGoBack?: () => void;
  onGoForward?: () => void;
  targetCaste?: string;
  onCasteChange?: (casteId: string) => void;
}

export const StepDocumentUpload: React.FC<StepDocumentUploadProps> = ({
  onVerified,
  onGoBack,
  onGoForward,
  targetCaste = "SC",
  onCasteChange,
}) => {
  const { t } = useLanguage();
  const [activeCaste, setActiveCaste] = useState<string>(targetCaste || "SC");
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRVerificationResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (targetCaste && targetCaste !== activeCaste) {
      setActiveCaste(targetCaste);
    }
  }, [targetCaste]);

  const handleCasteChange = (newCaste: string) => {
    setActiveCaste(newCaste);
    setOcrResult(null);
    if (onCasteChange) {
      onCasteChange(newCaste);
    }
  };

  const casteObj = getCasteCategoryById(activeCaste);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setOcrResult(null);
    }
  };

  const processOCRValidation = async () => {
    if (!file) return;
    setIsVerifying(true);
    setOcrResult(null);

    try {
      const result = await verifyCertificateOCR(file, activeCaste);
      setOcrResult(result);
    } catch (e: any) {
      setOcrResult({
        valid: false,
        ocr_verified: false,
        community_match: false,
        confidence_score: 0,
        extracted_text: "",
        error: e?.message || "Failed to process document through backend OCR.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
      {/* Step Header Bar with Top-Left Back & Forward Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back Step</span>
            </button>
          )}

          <div>
            <h3 className="text-base sm:text-lg font-black text-[#002147]">
              Step 2: Community & Eligibility Document OCR
            </h3>
            <p className="text-xs text-slate-500">
              Universal AI Document Verification for All Castes, Communities & Affirmative Classifications
            </p>
          </div>
        </div>

        {onGoForward && ocrResult && ocrResult.valid && (
          <button
            onClick={onGoForward}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Forward Step →</span>
            <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
          </button>
        )}
      </div>

      {/* UNIVERSAL ALL-CASTES VERIFICATION INFORMATIVE BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-[#002147] to-indigo-950 text-white p-5 rounded-2xl border-2 border-gov-gold/40 shadow-md space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-gov-gold font-black text-xs uppercase tracking-wider">
            <Globe2 className="w-4 h-4 text-gov-saffron" />
            <span>Universal Statutory OCR Engine • Active for All Castes & Communities</span>
          </div>
          <span className="bg-gov-saffron/20 border border-gov-saffron text-gov-saffron px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            All 18 Affirmative Groups Supported
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          OCR Verification is <strong className="text-white underline decoration-gov-saffron decoration-2">universal for all social categories and castes</strong> — not just SC. The SAMRIDDHI AI engine verifies official government certificates across <strong>Scheduled Castes (SC)</strong>, <strong>Scheduled Tribes (ST)</strong>, <strong>Other Backward Classes (OBC / OBC-NCL)</strong>, <strong>Economically Weaker Sections (EWS)</strong>, <strong>General / EBC</strong>, <strong>Minorities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)</strong>, <strong>Persons with Disabilities (PwD)</strong>, and <strong>Safai Karamcharis</strong>.
        </p>
      </div>

      {/* Category Confirmation / Switcher on Step 2 */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gov-navy" />
            <span>Certificate Category to Authenticate:</span>
          </label>
          <span className="text-[11px] font-semibold text-slate-500">
            Selected: <strong className="text-[#002147] font-black">{casteObj.label}</strong>
          </span>
        </div>

        <select
          value={activeCaste}
          onChange={(e) => handleCasteChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none cursor-pointer"
        >
          {ALL_CASTE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label} — {cat.apexCorporation.split(" ")[0]}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500">
          You can change the target category at any time. The OCR model adapts keywords and validation rules automatically.
        </p>
      </div>

      {/* Target Document Details Card */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 font-bold block text-[10px] uppercase">Target Verification Document</span>
          <strong className="text-slate-900 font-black text-sm">{casteObj.certificateType}</strong>
          <p className="text-[11px] text-slate-600">
            Category: <strong>{casteObj.label}</strong> • Governing Apex: <strong>{casteObj.apexCorporation.split(" ")[0]}</strong>
          </p>
        </div>
        <span className="text-3xl">{casteObj.icon}</span>
      </div>

      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 sm:p-8 text-center space-y-4 hover:border-[#002147] bg-slate-50/50 transition-all">
        {previewUrl ? (
          <div className="max-w-xs mx-auto space-y-2">
            <img src={previewUrl} alt="Certificate Preview" className="h-40 object-contain mx-auto rounded-lg border border-slate-300 shadow-sm" />
            <div className="text-xs font-bold text-slate-700 truncate">{file?.name}</div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 bg-gov-saffron/20 border border-gov-saffron text-slate-900 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-gov-saffron" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              Drag & Drop {casteObj.shortName} Certificate / Official Document here
            </div>
            <div className="text-[11px] text-slate-500">
              Universal AI OCR Engine automatically detects caste classification, issuing Tahsildar / Revenue office, certificate number & validity
            </div>
            <div className="text-[10px] text-slate-400">Supports PNG, JPG, JPEG, WEBP, PDF up to 10MB</div>
          </div>
        )}

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id="caste-cert-upload"
        />

        <div className="pt-2 flex justify-center gap-3">
          <label
            htmlFor="caste-cert-upload"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors"
          >
            {file ? "Choose Different Document" : "Browse Computer Files"}
          </label>

          {file && !ocrResult && (
            <button
              type="button"
              onClick={processOCRValidation}
              disabled={isVerifying}
              className="bg-[#002147] hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl text-xs shadow flex items-center space-x-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Running Universal Multi-Category OCR...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-gov-saffron" />
                  <span>Run Document Authentication OCR</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* OCR REJECTION ALERT */}
      {ocrResult && !ocrResult.valid && (
        <div className="bg-red-50 border-2 border-red-300 p-5 rounded-2xl space-y-2 text-red-900 animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-black">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{ocrResult.is_expired ? "❌ Certificate Expired" : "Document Verification Incomplete"}</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-red-800">
            {ocrResult.error}
          </p>
          {ocrResult.is_expired && ocrResult.expiry_date && (
            <div className="inline-block bg-red-200 text-red-900 text-[11px] font-black px-2.5 py-1 rounded-md">
              Expired on: {ocrResult.expiry_date}
            </div>
          )}
          <div className="pt-2 text-[11px] font-bold text-red-950">
            Please re-upload a valid/renewed official certificate from the issuing Revenue Department / Tahsildar / Competent Authority for {casteObj.label}.
          </div>
        </div>
      )}

      {/* OCR SUCCESS BADGE */}
      {ocrResult && ocrResult.valid && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl space-y-3 text-emerald-950 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-xs font-black text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>✓ Authenticated {ocrResult.matched_category_label || casteObj.label} ID: <strong>{ocrResult.extracted_certificate_number}</strong></span>
            </div>
            <span className="text-[11px] font-extrabold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {ocrResult.expiry_date ? `Valid till ${ocrResult.expiry_date}` : "Statutory Lifetime Validity"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            {ocrResult.matched_keywords?.map((kw, i) => (
              <span key={i} className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded font-bold">
                ✓ {kw}
              </span>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onVerified(ocrResult)}
              className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-md cursor-pointer"
            >
              <span>{t("wizard.proceedReview") || "Proceed to Scheme & EMI Calculation →"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
