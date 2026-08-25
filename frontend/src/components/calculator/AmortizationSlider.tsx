"use client";

import React, { useState, useEffect } from "react";
import { Calculator, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";
import { calculateLoanAmortization, AmortizationResult } from "@/lib/api";
import { VoiceReadout } from "@/components/voice/VoiceReadout";

interface AmortizationSliderProps {
  initialCost?: number;
  initialIncome?: number;
  initialGender?: "MALE" | "FEMALE" | "TRANSGENDER";
  currentLang?: string;
  onProceedToDispatch?: (result: AmortizationResult) => void;
}

export const AmortizationSlider: React.FC<AmortizationSliderProps> = ({
  initialCost = 140000,
  initialIncome = 180000,
  initialGender = "FEMALE",
  currentLang = "en",
  onProceedToDispatch
}) => {
  const [projectCost, setProjectCost] = useState<number>(initialCost);
  const [annualIncome, setAnnualIncome] = useState<number>(initialIncome);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "TRANSGENDER">(initialGender);
  const [schemeId, setSchemeId] = useState<string>("NSFDC_MCF");
  
  const [result, setResult] = useState<AmortizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCost) setProjectCost(initialCost);
    if (initialIncome) setAnnualIncome(initialIncome);
    if (initialGender) setGender(initialGender);
  }, [initialCost, initialIncome, initialGender]);

  useEffect(() => {
    const runCalculation = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await calculateLoanAmortization({
          project_cost: projectCost,
          annual_family_income: annualIncome,
          gender,
          scheme_id: schemeId
        });
        setResult(res);
      } catch (err: any) {
        setError(err.message || "Failed to calculate amortization.");
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    runCalculation();
  }, [projectCost, annualIncome, gender, schemeId]);

  const summaryText = result
    ? `మీ రుణం వివరాలు: ప్రాజెక్ట్ ఖర్చు రూపాయలు ${projectCost.toLocaleString()}, ప్రభుత్వం ఇచ్చే రుణం రూపాయలు ${result.principal_loan_amount.toLocaleString()}, వడ్డీ రేటు ${result.applied_interest_rate} శాతము, నెలసరి ఈఎమ్ఐ రూపాయలు ${result.monthly_emi.toLocaleString()}.`
    : "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gov-navy text-white rounded-xl shadow-md">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#001529]">
              Smart Concessional Loan & Amortization Calculator
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Statutory NSFDC Amortization Math Engine with Moratorium Grace Period Breakdown
            </p>
          </div>
        </div>

        {/* TTS Readout */}
        {result && <VoiceReadout textToRead={summaryText} lang={currentLang} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Sliders & Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target Scheme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Select Concessional Scheme:
            </label>
            <select
              value={schemeId}
              onChange={(e) => setSchemeId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm font-bold rounded-xl p-3 focus:ring-2 focus:ring-gov-navy focus:outline-none"
            >
              <option value="NSFDC_MCF">NSFDC Micro Credit Finance Scheme (MCF) - Cap ₹1.40L (90% Loan)</option>
              <option value="NSFDC_MSY">Mahila Samriddhi Yojana (MSY) - Female Beneficiaries Cap ₹1.40L (95% Loan)</option>
              <option value="NSFDC_TL">NSFDC Term Loan General Scheme - Cap ₹50.00L (90% Loan)</option>
              <option value="NSFDC_ELS_D">NSFDC Domestic Education Loan - Cap ₹20.00L (12M Moratorium)</option>
              <option value="NSFDC_ELS_O">NSFDC Overseas Education Loan - Cap ₹50.00L (7 Yrs Tenure)</option>
            </select>
          </div>

          {/* Gender Selector for Concessional Interest Rate */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Beneficiary Gender (Determines Concessional Rate):
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["FEMALE", "MALE", "TRANSGENDER"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    gender === g
                      ? "bg-[#001529] text-white border-[#001529] shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {g === "FEMALE" ? "Female (Concessional 5%)" : g === "MALE" ? "Male (Standard 6.5%)" : "Transgender"}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cost Slider */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase">Total Project Cost</span>
              <span className="text-base font-extrabold text-gov-navy bg-white px-3 py-1 rounded-lg border border-slate-300 shadow-sm">
                ₹ {projectCost.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={30000}
              max={5000000}
              step={10000}
              value={projectCost}
              onChange={(e) => setProjectCost(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-navy"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>₹ 30,000 (Min)</span>
              <span>₹ 1.4 Lakh (Micro Cap)</span>
              <span>₹ 50,00,000 (Term Cap)</span>
            </div>
          </div>

          {/* Annual Family Income Slider */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase">Annual Family Income</span>
              <span className={`text-base font-extrabold px-3 py-1 rounded-lg border shadow-sm ${
                annualIncome > 500000 ? "bg-red-50 text-red-600 border-red-300" : "bg-white text-emerald-600 border-slate-300"
              }`}>
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
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-saffron"
            />
            <div className="flex justify-between text-[10px] font-semibold">
              <span className="text-slate-400">₹ 30,000</span>
              <span className="text-gov-saffron font-bold">₹ 5,00,000 (Statutory Gate Limit)</span>
              <span className="text-red-500 font-bold">₹ 6,00,000 (Ineligible)</span>
            </div>
          </div>

        </div>

        {/* Real-Time Breakdown Output Card Column */}
        <div className="lg:col-span-5">
          {error ? (
            <div className="bg-red-50 border-2 border-red-400 p-6 rounded-2xl space-y-3 text-red-900">
              <div className="flex items-center space-x-2 font-black text-sm">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                <span>Statutory Ineligibility Triggered</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {error}
              </p>
              <div className="bg-white p-3 rounded-lg border border-red-200 text-[11px] font-semibold text-slate-700">
                Statutory Guideline: NSFDC concessional capital is reserved exclusively for SC families with annual income ≤ ₹ 5,00,000.
              </div>
            </div>
          ) : result ? (
            <div className="bg-gradient-to-br from-[#001529] via-[#002244] to-[#001f3f] text-white p-6 rounded-2xl shadow-xl space-y-4 border-2 border-gov-gold">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-gov-gold uppercase tracking-wider">Loan Breakdown</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  ✓ Statutory Eligible
                </span>
              </div>

              {/* Monthly EMI Highlights */}
              <div className="bg-white/10 p-4 rounded-xl border border-white/15 text-center space-y-1">
                <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">Estimated Monthly EMI</span>
                <div className="text-3xl font-extrabold text-gov-saffron tracking-tight">
                  ₹ {result.monthly_emi.toLocaleString("en-IN")} <span className="text-xs text-slate-300 font-normal">/ month</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Post-{result.moratorium_months} Month Moratorium Grace Period
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Government Share Loan ({result.govt_share_percent}%)</span>
                  <strong className="text-sm text-emerald-400 font-black">₹ {result.principal_loan_amount.toLocaleString("en-IN")}</strong>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Margin Money ({result.beneficiary_margin_percent}%)</span>
                  <strong className="text-sm text-amber-300 font-black">₹ {result.beneficiary_margin_money.toLocaleString("en-IN")}</strong>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Concessional Rate</span>
                  <strong className="text-sm text-gov-saffron font-black">{result.applied_interest_rate}% p.a.</strong>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Tenure</span>
                  <strong className="text-sm text-sky-300 font-black">{result.total_tenure_years} Years ({result.active_repayment_months} M active)</strong>
                </div>
              </div>

              {/* Action Button */}
              {onProceedToDispatch && (
                <button
                  onClick={() => onProceedToDispatch(result)}
                  className="w-full bg-gov-saffron hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Proceed to Route Channel Partner Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
