"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/languageContext";
import { Calculator, Volume2, Send, CheckCircle2, ShieldCheck, Landmark } from "lucide-react";
import { calculateFinancials, FinancialCalculationResponse } from "@/lib/api";

interface StepCalculationProps {
  initialCost?: number;
  initialIncome?: number;
  initialGender?: string;
  schemeId?: string;
  onDispatch: (result: FinancialCalculationResponse) => void;
}

export const StepCalculation: React.FC<StepCalculationProps> = ({
  initialCost = 140000,
  initialIncome = 180000,
  initialGender = "FEMALE",
  schemeId = "NSFDC_MCF",
  onDispatch
}) => {
  const { t, currentLang } = useLanguage();

  const [projectCost, setProjectCost] = useState(initialCost);
  const [annualIncome, setAnnualIncome] = useState(initialIncome);
  const [gender, setGender] = useState(initialGender);
  const [selectedScheme, setSelectedScheme] = useState(schemeId);

  const [calcResult, setCalcResult] = useState<FinancialCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    runCalculation();
  }, [projectCost, annualIncome, gender, selectedScheme]);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const res = await calculateFinancials({
        project_cost: projectCost,
        annual_family_income: annualIncome,
        gender,
        scheme_id: selectedScheme
      });
      setCalcResult(res);
    } catch (e) {
      console.warn("Backend calculation fallback");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechSummary = () => {
    if (!calcResult || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    let textToSpeak = `Your application for ${calcResult.scheme_name} has been processed. Total Project cost is Rupees ${calcResult.project_cost}. Government loan share is ${calcResult.govt_share_percent} percent, amounting to Rupees ${calcResult.principal_loan_amount}. Concessional interest rate is ${calcResult.applied_interest_rate} percent per annum with ${calcResult.moratorium_months} months grace period. Your monthly EMI will be Rupees ${calcResult.monthly_emi}.`;

    if (currentLang === "te") {
      textToSpeak = `${calcResult.scheme_name} పథకం కింద మీ దరఖాస్తు సిద్ధంగా ఉంది. ప్రభుత్వం నుండి లభించే అప్పు రూపాయిలు ${calcResult.principal_loan_amount}. వడ్డీ రేటు సంవత్సరానికి ${calcResult.applied_interest_rate} శాతం. నెలకు ఇఎంఐ రూపాయిలు ${calcResult.monthly_emi}.`;
    } else if (currentLang === "hi") {
      textToSpeak = `${calcResult.scheme_name} के तहत आपका आवेदन संसाधित हो गया है। सरकारी ऋण राशि रुपये ${calcResult.principal_loan_amount} है। ब्याज दर ${calcResult.applied_interest_rate} प्रतिशत प्रति वर्ष है। आपकी मासिक ईएमआई रुपये ${calcResult.monthly_emi} होगी।`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    
    if (currentLang === "te") utterance.lang = "te-IN";
    else if (currentLang === "hi") utterance.lang = "hi-IN";
    else utterance.lang = "en-IN";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[#002147] font-black text-base sm:text-lg">
            <Calculator className="w-5 h-5 text-gov-saffron" />
            <h3>{t("wizard.reviewTitle")}</h3>
          </div>
          <p className="text-xs text-slate-500">{t("wizard.modeB")}</p>
        </div>

        {/* TTS Speech Trigger */}
        <button
          onClick={handleSpeechSummary}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isSpeaking ? "bg-amber-400 text-slate-950 animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
          }`}
        >
          <Volume2 className="w-4 h-4 text-gov-saffron" />
          <span>{t("wizard.listenSummary")}</span>
        </button>
      </div>

      {/* Inputs Strip (Mode B Direct Adjustment) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Project Cost (₹)</label>
          <input
            type="number"
            value={projectCost}
            onChange={(e) => setProjectCost(Number(e.target.value))}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-extrabold text-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Annual Family Income (₹)</label>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-extrabold text-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-extrabold text-slate-900"
          >
            <option value="FEMALE">Female (5.0% - 5.5% Concession)</option>
            <option value="MALE">Male (6.5% - 7.5% Standard Rate)</option>
          </select>
        </div>
      </div>

      {/* Financial Matrix Cards */}
      {calcResult && (
        <div className="space-y-4">
          {/* Scheme Banner */}
          <div className="bg-[#002147] text-white p-5 rounded-xl border-l-4 border-gov-saffron flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-gov-gold uppercase tracking-wider block">{t("wizard.matchedScheme")}</span>
              <h4 className="text-base font-black">{calcResult.scheme_name}</h4>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-300 block">Subsidized Interest Rate</span>
              <strong className="text-lg font-black text-gov-saffron">{calcResult.applied_interest_rate}% p.a.</strong>
            </div>
          </div>

          {/* Key Breakdown Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Govt Share ({calcResult.govt_share_percent}%)</span>
              <div className="text-base font-black text-emerald-700">₹ {calcResult.principal_loan_amount.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Beneficiary Margin ({calcResult.beneficiary_margin_percent}%)</span>
              <div className="text-base font-black text-slate-900">₹ {calcResult.beneficiary_margin_money.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Moratorium Grace</span>
              <div className="text-base font-black text-sky-700">{calcResult.moratorium_months} Months</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Post-Grace Monthly EMI</span>
              <div className="text-base font-black text-gov-saffron">₹ {calcResult.monthly_emi.toLocaleString("en-IN")} / Mo</div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm & Dispatch Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={() => calcResult && onDispatch(calcResult)}
          className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Send className="w-4 h-4" />
          <span>{t("wizard.confirmDispatch")}</span>
        </button>
      </div>
    </div>
  );
};
