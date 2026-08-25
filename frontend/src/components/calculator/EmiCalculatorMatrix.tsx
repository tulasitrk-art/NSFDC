"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Calculator, Volume2, Send, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Search, ArrowLeft, Filter } from "lucide-react";
import { calculateFinancials, FinancialCalculationResponse } from "@/lib/api";
import { ALL_500_SCHEMES, searchAndRecommendSchemes, StatutoryScheme } from "@/lib/schemes_db";

interface EmiCalculatorMatrixProps {
  initialCost?: number;
  initialIncome?: number;
  initialGender?: string;
  initialActivity?: string;
  initialStateCode?: string;
  onProceedToDispatch: (calcResult: FinancialCalculationResponse) => void;
  onGoBack?: () => void;
  onGoForward?: () => void;
}

export const EmiCalculatorMatrix: React.FC<EmiCalculatorMatrixProps> = ({
  initialCost = 140000,
  initialIncome = 180000,
  initialGender = "FEMALE",
  initialActivity = "RETAIL",
  initialStateCode = "AP",
  onProceedToDispatch,
  onGoBack,
  onGoForward,
}) => {
  const { t, currentLang } = useLanguage();

  const [projectCost, setProjectCost] = useState(initialCost);
  const [annualIncome, setAnnualIncome] = useState(initialIncome);
  const [gender, setGender] = useState(initialGender);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeId, setSelectedSchemeId] = useState("NSFDC_MCF_AP_1");

  const [matchedSchemesList, setMatchedSchemesList] = useState<StatutoryScheme[]>([]);
  const [calcResult, setCalcResult] = useState<FinancialCalculationResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const list = searchAndRecommendSchemes({
      projectCost,
      annualIncome,
      gender,
      activitySector: initialActivity,
      stateCode: initialStateCode,
      query: searchQuery,
    });
    setMatchedSchemesList(list);
    if (list.length > 0 && !list.find((s) => s.id === selectedSchemeId)) {
      setSelectedSchemeId(list[0].id);
    }
  }, [projectCost, annualIncome, gender, initialActivity, initialStateCode, searchQuery]);

  useEffect(() => {
    runCalculation();
  }, [projectCost, annualIncome, gender, selectedSchemeId]);

  const runCalculation = async () => {
    try {
      const res = await calculateFinancials({
        project_cost: projectCost,
        annual_family_income: annualIncome,
        gender,
        scheme_id: selectedSchemeId,
      });
      setCalcResult(res);
    } catch (e) {
      console.warn("Calculation fallback");
    }
  };

  const handleSpeechSummary = () => {
    if (!calcResult || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    let textToSpeak = `Selected scheme is ${calcResult.scheme_name}. Total Project cost is Rupees ${calcResult.project_cost}. Government loan share is ${calcResult.govt_share_percent} percent, amounting to Rupees ${calcResult.principal_loan_amount}. Concessional interest rate is ${calcResult.applied_interest_rate} percent with ${calcResult.moratorium_months} months grace period. Monthly EMI will be Rupees ${calcResult.monthly_emi}.`;

    if (currentLang === "te") {
      textToSpeak = `${calcResult.scheme_name} పథకం ఎంపిక చేయబడింది. ప్రాజెక్టు మొత్తం వ్యయం రూపాయిలు ${calcResult.project_cost}. ప్రభుత్వం అందించే అప్పు ${calcResult.principal_loan_amount}. వడ్డీ రేటు ${calcResult.applied_interest_rate} శాతం. నెలకు ఇఎంఐ రూపాయిలు ${calcResult.monthly_emi}.`;
    } else if (currentLang === "hi") {
      textToSpeak = `${calcResult.scheme_name} योजना चुनी गई है। सरकारी ऋण राशि रुपये ${calcResult.principal_loan_amount} है। ब्याज दर ${calcResult.applied_interest_rate} प्रतिशत प्रति वर्ष है। मासिक ईएमआई रुपये ${calcResult.monthly_emi} होगी।`;
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
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
      {/* Top Header Bar with Top-Left Back & Forward Navigation */}
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

          <div className="flex items-center space-x-2 text-[#002147] font-black text-base sm:text-lg">
            <Sparkles className="w-5 h-5 text-gov-saffron" />
            <h3>Step 3: 500+ Statutory SC Schemes & EMI Matrix</h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSpeechSummary}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isSpeaking ? "bg-amber-400 text-slate-950 animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
            }`}
          >
            <Volume2 className="w-4 h-4 text-gov-saffron" />
            <span>{t("wizard.listenSummary")}</span>
          </button>

          {onGoForward && (
            <button
              onClick={onGoForward}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              <span>Forward Step →</span>
              <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
            </button>
          )}
        </div>
      </div>

      {/* Live Scheme Search Input Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-800">
          <span>Search Among 500+ SC Concessional Loan Schemes by Sector or Demand:</span>
          <span className="bg-gov-navy text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">
            {ALL_500_SCHEMES.length} Total Statutory Schemes Seeded
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type sector or demand (e.g. Dairy, Solar, Education, E-Rickshaw, Retail, Farming, Artisan...)"
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Matched Schemes */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
          Suggested Schemes Matching Demand (State: {initialStateCode}, Gender: {gender})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {matchedSchemesList.map((sch) => {
            const isSelected = selectedSchemeId === sch.id;
            const rate = gender === "FEMALE" ? sch.interestFemale : sch.interestMale;
            return (
              <button
                key={sch.id}
                type="button"
                onClick={() => setSelectedSchemeId(sch.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-[#002147] bg-slate-50 ring-2 ring-[#002147]/20 shadow-md scale-102"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xl">{sch.icon}</span>
                  <span className="bg-gov-saffron/20 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded border border-gov-saffron/40">
                    {rate}% p.a.
                  </span>
                </div>

                <h5 className="text-xs font-black text-slate-900 mt-2">{sch.name}</h5>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{sch.description}</p>
                <div className="text-[10px] text-gov-navy font-bold mt-2">
                  Max Limit: ₹ {(sch.maxCost / 100000).toFixed(1)} Lakhs
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        {/* Project Cost Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Total Project Cost (₹)</span>
            <span className="text-sm font-black text-[#002147]">₹ {projectCost.toLocaleString("en-IN")}</span>
          </div>
          <input
            type="range"
            min={20000}
            max={5000000}
            step={10000}
            value={projectCost}
            onChange={(e) => setProjectCost(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002147]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>₹ 20,000</span>
            <span>₹ 50,00,000 (Max Cap)</span>
          </div>
        </div>

        {/* Annual Income Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Annual Family Income (₹)</span>
            <span className={annualIncome > 500000 ? "text-sm font-black text-red-600" : "text-sm font-black text-emerald-700"}>
              ₹ {annualIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <input
            type="range"
            min={30000}
            max={600000}
            step={10000}
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002147]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>₹ 30,000</span>
            <span className="text-red-600 font-bold">₹ 5,00,000 (Statutory Gate Limit)</span>
          </div>
        </div>
      </div>

      {/* Selected Scheme Matrix Card */}
      {calcResult && (
        <div className="space-y-4">
          <div className="bg-[#002147] text-white p-6 rounded-2xl border-l-4 border-gov-saffron shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-gov-gold uppercase tracking-wider block">
                  Active Concessional Calculation Matrix
                </span>
                <h4 className="text-lg font-black text-white">{calcResult.scheme_name}</h4>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-right">
                <span className="text-[10px] text-slate-300 block uppercase font-bold">Subsidized Interest Rate</span>
                <strong className="text-xl font-black text-gov-saffron">{calcResult.applied_interest_rate}% p.a.</strong>
              </div>
            </div>
          </div>

          {/* Breakdown Matrix Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Govt Loan Share ({calcResult.govt_share_percent}%)</span>
              <div className="text-base font-black text-emerald-700">₹ {calcResult.principal_loan_amount.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Self Margin ({calcResult.beneficiary_margin_percent}%)</span>
              <div className="text-base font-black text-slate-900">₹ {calcResult.beneficiary_margin_money.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Moratorium Grace Period</span>
              <div className="text-base font-black text-sky-700">{calcResult.moratorium_months} Months</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Post-Grace Monthly EMI</span>
              <div className="text-base font-black text-gov-saffron">₹ {calcResult.monthly_emi.toLocaleString("en-IN")} / Mo</div>
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={() => calcResult && onProceedToDispatch(calcResult)}
          className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <span>Proceed to Channel Bank Map Dispatch →</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
