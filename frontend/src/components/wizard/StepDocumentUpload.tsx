"use client";

import React, { useState } from "react";
import { Upload, FileCheck, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { OCRVerificationResponse, verifyCertificateOCR } from "@/lib/api";

interface StepDocumentUploadProps {
  onVerified: (data: OCRVerificationResponse) => void;
  onGoBack?: () => void;
  onGoForward?: () => void;
}

export const StepDocumentUpload: React.FC<StepDocumentUploadProps> = ({ onVerified, onGoBack, onGoForward }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRVerificationResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      const result = await verifyCertificateOCR(file);
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
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back Step</span>
            </button>
          )}

          <h3 className="text-base sm:text-lg font-black text-[#002147]">
            Step 2: {t("wizard.ocrTitle")}
          </h3>
        </div>

        {onGoForward && ocrResult && ocrResult.valid && (
          <button
            onClick={onGoForward}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <span>Forward Step →</span>
            <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
          </button>
        )}
      </div>

      <p className="text-xs text-slate-600">
        Upload digital copy of applicant's Scheduled Caste (SC) Community Certificate. The system runs automated OCR authentication to verify Tahsildar / Revenue Department seals.
      </p>

      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 sm:p-8 text-center space-y-4 hover:border-[#002147] bg-slate-50/50 transition-all">
        {previewUrl ? (
          <div className="max-w-xs mx-auto space-y-2">
            <img src={previewUrl} alt="SC Certificate Preview" className="h-40 object-contain mx-auto rounded-lg border border-slate-300 shadow-sm" />
            <div className="text-xs font-bold text-slate-700 truncate">{file?.name}</div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 bg-gov-saffron/20 border border-gov-saffron text-slate-900 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-gov-saffron" />
            </div>
            <div className="text-xs font-bold text-slate-800">
              Drag & Drop SC Community Certificate image here
            </div>
            <div className="text-[11px] text-slate-500">Supports PNG, JPG, JPEG, PDF up to 10MB</div>
          </div>
        )}

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id="sc-cert-upload"
        />

        <div className="pt-2 flex justify-center gap-3">
          <label
            htmlFor="sc-cert-upload"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors"
          >
            {file ? "Choose Different Image" : "Browse Computer Files"}
          </label>

          {file && !ocrResult && (
            <button
              type="button"
              onClick={processOCRValidation}
              disabled={isVerifying}
              className="bg-[#002147] hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl text-xs shadow flex items-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Running Pytesseract OCR...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-gov-saffron" />
                  <span>Run SC Certificate Authentication OCR</span>
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
            <span>SC Community Certificate Verification Failed</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-red-800">
            {ocrResult.error}
          </p>
          <div className="pt-2 text-[11px] font-bold text-red-950">
            Please re-upload a clear scanned copy of your official SC Community Certificate issued by the Tahsildar / Revenue Department.
          </div>
        </div>
      )}

      {/* OCR SUCCESS BADGE */}
      {ocrResult && ocrResult.valid && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl space-y-3 text-emerald-950 animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>✓ Authenticated Scheduled Caste Beneficiary Certificate ID: <strong>{ocrResult.extracted_certificate_number}</strong></span>
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
              className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-md"
            >
              <span>{t("wizard.proceedReview")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
