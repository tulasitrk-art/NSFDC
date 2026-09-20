"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Calculator,
  Volume2,
  Send,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  ArrowLeft,
  Filter,
  FileText,
  ListChecks,
  RotateCcw,
  X
} from "lucide-react";
import { calculateFinancials, FinancialCalculationResponse } from "@/lib/api";
import { ALL_500_SCHEMES, searchAndRecommendSchemes, StatutoryScheme, getSchemeById, getSchemeRequirements } from "@/lib/schemes_db";
import { ALL_CASTE_CATEGORIES, getCasteCategoryById } from "@/lib/caste_categories";

interface EmiCalculatorMatrixProps {
  initialCost?: number;
  initialIncome?: number;
  initialGender?: string;
  initialActivity?: string;
  initialStateCode?: string;
  initialCasteCategory?: string;
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
  initialCasteCategory = "SC",
  onProceedToDispatch,
  onGoBack,
  onGoForward,
}) => {
  const { t, currentLang } = useLanguage();

  const [projectCost, setProjectCost] = useState(initialCost);
  const [annualIncome, setAnnualIncome] = useState(initialIncome);
  const [gender, setGender] = useState(genderNorm(initialGender));
  const [casteCategory, setCasteCategory] = useState(initialCasteCategory || "SC");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeId, setSelectedSchemeId] = useState("NSFDC_MCF");
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [flippedSchemeCards, setFlippedSchemeCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialCasteCategory) {
      setCasteCategory(initialCasteCategory);
    }
  }, [initialCasteCategory]);

  const activeCategoryMeta = getCasteCategoryById(casteCategory);

  const toggleSchemeFlip = (schemeId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setFlippedSchemeCards((prev) => ({
      ...prev,
      [schemeId]: !prev[schemeId],
    }));
  };

  function genderNorm(g: string) {
    if (g === "MALE" || g === "FEMALE" || g === "TRANSGENDER") return g;
    return "FEMALE";
  }

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
      casteCategory,
      query: searchQuery,
    });
    setMatchedSchemesList(list);
    if (list.length > 0 && !list.find((s) => s.id === selectedSchemeId)) {
      setSelectedSchemeId(list[0].id);
    }
  }, [projectCost, annualIncome, gender, initialActivity, initialStateCode, casteCategory, searchQuery]);

  useEffect(() => {
    runCalculation();
  }, [projectCost, annualIncome, gender, casteCategory, selectedSchemeId]);

  const runCalculation = async () => {
    try {
      const res = await calculateFinancials({
        project_cost: projectCost,
        annual_family_income: annualIncome,
        gender,
        scheme_id: selectedSchemeId,
        caste_category: casteCategory,
      });
      setCalcResult(res);
    } catch (e) {
      console.warn("Calculation fallback");
    }
  };

  const currentScheme = getSchemeById(selectedSchemeId);
  const currentReqs = getSchemeRequirements(currentScheme);

  const localizedSchemeTitle = t(`schemes.items.${currentScheme.id}.title`);
  const displaySchemeTitle = localizedSchemeTitle && !localizedSchemeTitle.startsWith("schemes.items") ? localizedSchemeTitle : currentScheme.name;
  const localizedCode = t(`schemes.codes.${currentScheme.code}`);
  const displayCode = localizedCode && !localizedCode.startsWith("schemes.codes") ? localizedCode : currentScheme.code;

  const handleSpeechSummary = () => {
    if (!calcResult || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    let textToSpeak = `Selected scheme is ${calcResult.scheme_name}. Total Project cost is Rupees ${calcResult.project_cost}. Government loan share is ${calcResult.govt_share_percent} percent, amounting to Rupees ${calcResult.principal_loan_amount}. Concessional interest rate is ${calcResult.applied_interest_rate} percent with ${calcResult.moratorium_months} months grace period. Monthly EMI will be Rupees ${calcResult.monthly_emi}.`;

    if (currentLang === "te") {
      textToSpeak = `${displaySchemeTitle} పథకం ఎంపిక చేయబడింది. ప్రాజెక్టు మొత్తం వ్యయం రూపాయిలు ${calcResult.project_cost}. ప్రభుత్వం అందించే అప్పు ${calcResult.principal_loan_amount}. వడ్డీ రేటు ${calcResult.applied_interest_rate} శాతం. నెలకు ఇఎంఐ రూపాయిలు ${calcResult.monthly_emi}.`;
    } else if (currentLang === "hi") {
      textToSpeak = `${displaySchemeTitle} योजना चुनी गई है। सरकारी ऋण राशि रुपये ${calcResult.principal_loan_amount} है। ब्याज दर ${calcResult.applied_interest_rate} प्रतिशत प्रति वर्ष है। मासिक ईएमआई रुपये ${calcResult.monthly_emi} होगी।`;
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("map.backStep") || "← Back Step"}</span>
            </button>
          )}

          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-[#002147]" />
            <h3 className="text-base sm:text-lg font-black text-[#002147]">
              Step 3: {t("wizard.reviewTitle") || "Financial Review & Scheme Calculator"}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {calcResult && (
            <button
              onClick={handleSpeechSummary}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSpeaking ? "bg-amber-400 text-slate-950 border-amber-500 animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-gov-saffron" />
              <span>{isSpeaking ? "Speaking..." : t("calculator.speechSummary") || t("wizard.listenSummary") || "🔊 Listen Summary"}</span>
            </button>
          )}

          {onGoForward && calcResult && (
            <button
              onClick={onGoForward}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>{t("schemes.next") || "Forward Step →"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
            </button>
          )}
        </div>
      </div>

      {/* National 5,000+ Schemes Official Context Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/5 to-slate-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start space-x-3">
        <span className="text-2xl shrink-0 mt-0.5">🇮🇳</span>
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-black text-slate-900 tracking-wide">
            In general: across all central ministries and state governments, India has over 5,000 welfare schemes.
          </div>
          <div className="text-[11px] font-semibold text-slate-600">
            Tailoring concessional credit options for category: <span className="text-gov-navy font-bold">{activeCategoryMeta.label}</span> • Apex Corporation: <span className="text-emerald-700 font-bold">{activeCategoryMeta.apexCorporation.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* Demand, Caste & Sector Match Filter */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t("schemes.searchPlaceholder") || "Search Schemes or Filter by Activity / Category"}</span>
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-slate-500">
              {matchedSchemesList.length} {t("schemes.totalPrograms") || "Matching Programs"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("schemes.searchPlaceholder") || "Type sector or demand (e.g. Dairy, Solar, Education, E-Rickshaw, Retail, Farming, Artisan...)"}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none"
            />
          </div>

          <div>
            <select
              value={casteCategory}
              onChange={(e) => setCasteCategory(e.target.value)}
              aria-label="Filter schemes by caste or social category"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-gov-navy focus:outline-none"
            >
              {ALL_CASTE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.code} – {cat.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Matched Suggested Schemes with 3D Flip Card */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
            {t("calculator.suggestedSchemes") || "Suggested Schemes"} ({activeCategoryMeta.code}, State: {initialStateCode}, Gender: {gender})
          </h4>
          <span className="text-[11px] text-gov-navy font-bold hidden sm:inline">
            Click scheme to calculate EMI • Click &ldquo;Details 🔄&rdquo; to flip card
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedSchemesList.slice(0, 6).map((sch) => {
            const isSelected = selectedSchemeId === sch.id;
            const rate = gender === "FEMALE" ? sch.interestFemale : (sch.interestMale > 50 ? sch.interestFemale : sch.interestMale);
            const titleTrans = t(`schemes.items.${sch.id}.title`);
            const titleName = titleTrans && !titleTrans.startsWith("schemes.items") ? titleTrans : sch.name;
            const isFlipped = Boolean(flippedSchemeCards[sch.id]);

            return (
              <div key={sch.id} className="perspective-1000 min-h-[220px]">
                <div
                  className={`relative w-full h-full card-flip-container ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* FRONT: SUGGESTED SCHEME SUMMARY */}
                  <div
                    onClick={() => setSelectedSchemeId(sch.id)}
                    className={`w-full h-full backface-hidden p-4 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-[#002147] bg-slate-50 ring-2 ring-[#002147]/20 shadow-md scale-101"
                        : "border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl p-1 bg-slate-100 rounded-lg">{sch.icon}</span>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {sch.code}
                            </span>
                            {sch.targetStateCode && sch.targetStateCode !== "ALL" && (
                              <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {sch.targetStateCode}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="bg-gov-saffron/20 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded border border-gov-saffron/40">
                          {rate}% {t("schemes.pa") || "p.a."}
                        </span>
                      </div>

                      <h5 className="text-xs font-black text-slate-900 mt-2 line-clamp-1">{titleName}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-tight">{sch.description}</p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gov-navy font-bold">
                        Max: ₹ {(sch.maxCost / 100000).toFixed(1)}L
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => toggleSchemeFlip(sch.id, e)}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-slate-900 text-[10px] font-extrabold flex items-center space-x-1 border border-amber-200 cursor-pointer shadow-xs"
                          title="Flip card to view details"
                        >
                          <RotateCcw className="w-3 h-3 text-gov-saffron" />
                          <span>{t("schemes.details") || "Details 🔄"}</span>
                        </button>

                        <span className={`text-[10px] font-extrabold ${isSelected ? "text-emerald-700 font-black" : "text-slate-500 hover:text-gov-navy"}`}>
                          {isSelected ? "Selected ✓" : "Select"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK: SUGGESTED SCHEME WANTED SPECIFICATIONS & DETAILS */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 via-[#002147] to-[#0A3663] text-white p-3.5 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between text-xs overflow-hidden"
                  >
                    <div className="flex justify-between items-start border-b border-slate-700/80 pb-1.5 shrink-0">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-extrabold uppercase text-gov-saffron block truncate">
                          {sch.icon} {sch.code} • Scheme Details
                        </span>
                        <h6 className="text-[11px] font-black text-white truncate">{titleName}</h6>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleSchemeFlip(sch.id, e)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 border border-slate-600 shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>↺ Flip</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 my-1 flex-1 overflow-y-auto pr-0.5 text-[10px] scrollbar-thin">
                      <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/50">
                        <span className="text-[9px] text-gov-gold font-bold block uppercase">Eligibility:</span>
                        <p className="text-slate-200 leading-tight">{sch.eligibilityCriteria}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <div className="bg-slate-800/80 p-1 rounded border border-slate-700/50">
                          <span className="text-slate-400 block">Max Cost:</span>
                          <strong className="text-white">₹ {(sch.maxCost / 100000).toFixed(1)}L ({sch.govtSharePercent}% Govt)</strong>
                        </div>
                        <div className="bg-slate-800/80 p-1 rounded border border-slate-700/50">
                          <span className="text-slate-400 block">Margin Req:</span>
                          <strong className="text-white">{sch.marginPercent}%</strong>
                        </div>
                        <div className="bg-slate-800/80 p-1 rounded border border-slate-700/50">
                          <span className="text-slate-400 block">Grace Period:</span>
                          <strong className="text-sky-300">{sch.moratoriumMonths} Mos</strong>
                        </div>
                        <div className="bg-slate-800/80 p-1 rounded border border-slate-700/50">
                          <span className="text-slate-400 block">Repayment:</span>
                          <strong className="text-emerald-400">{sch.repaymentYears} Yrs</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-700/80 shrink-0">
                      <span className="text-[9px] text-gov-gold font-bold">
                        ♀ {sch.interestFemale}% | ♂ {sch.interestMale > 50 ? "Women Only" : `${sch.interestMale}%`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSchemeId(sch.id);
                          toggleSchemeFlip(sch.id);
                        }}
                        className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded text-[10px] cursor-pointer"
                      >
                        Select Scheme ✓
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        {/* Project Cost Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>{t("calculator.totalProjectCost") || "Total Project Cost (₹)"}</span>
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
            <span>₹ 50,00,000 ({t("calculator.maxCap") || "Max Cap"})</span>
          </div>
        </div>

        {/* Annual Income Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>{t("calculator.annualFamilyIncome") || "Annual Family Income (₹)"}</span>
            <span className={annualIncome > (activeCategoryMeta.incomeCeiling || 500000) ? "text-sm font-black text-red-600" : "text-sm font-black text-emerald-700"}>
              ₹ {annualIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <input
            type="range"
            min={30000}
            max={Math.max(800000, (activeCategoryMeta.incomeCeiling || 500000) + 100000)}
            step={10000}
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002147]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>₹ 30,000</span>
            <span className="text-red-600 font-bold">
              ₹ {(activeCategoryMeta.incomeCeiling / 100000).toFixed(1)}L ({activeCategoryMeta.code} Statutory Limit)
            </span>
          </div>
        </div>
      </div>

      {/* Selected Scheme Matrix Card (Direct Clean Non-Flipping Dashboard) */}
      {calcResult && (
        <div className="bg-[#002147] text-white p-6 rounded-2xl border-l-4 border-gov-saffron shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-gov-gold uppercase tracking-wider block">
                {t("calculator.activeMatrix") || "Active Concessional Calculation Matrix"}
              </span>
              <h4 className="text-lg font-black text-white">{displaySchemeTitle}</h4>
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-right">
              <span className="text-[10px] text-slate-300 block uppercase font-bold">{t("calculator.subsidizedRate") || "Subsidized Interest Rate"}</span>
              <strong className="text-xl font-black text-gov-saffron">{calcResult.applied_interest_rate}% {t("schemes.pa") || "p.a."}</strong>
            </div>
          </div>

          {/* Breakdown Matrix Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/10 p-4 rounded-xl border border-white/15 space-y-1">
              <span className="text-slate-300 font-bold uppercase text-[10px]">{t("schemes.govtShare") || "Govt Loan Share"} ({calcResult.govt_share_percent}%)</span>
              <div className="text-base font-black text-emerald-400">₹ {calcResult.principal_loan_amount.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/15 space-y-1">
              <span className="text-slate-300 font-bold uppercase text-[10px]">{t("calculator.selfMargin") || "Self Margin"} ({calcResult.beneficiary_margin_percent}%)</span>
              <div className="text-base font-black text-white">₹ {calcResult.beneficiary_margin_money.toLocaleString("en-IN")}</div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/15 space-y-1">
              <span className="text-slate-300 font-bold uppercase text-[10px]">{t("schemes.moratorium") || "Moratorium"} Grace Period</span>
              <div className="text-base font-black text-sky-300">{calcResult.moratorium_months} {t("schemes.mos") || "Months"}</div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/15 space-y-1">
              <span className="text-slate-300 font-bold uppercase text-[10px]">{t("calculator.monthlyEmi") || "Post-Grace Monthly EMI"}</span>
              <div className="text-base font-black text-gov-saffron">₹ {calcResult.monthly_emi.toLocaleString("en-IN")} / {t("schemes.mos") || "Mo"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={() => calcResult && onProceedToDispatch(calcResult)}
          className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>{t("calculator.confirmDispatch") || t("wizard.confirmDispatch") || "Confirm & Dispatch to Nearest Branch Desk →"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
