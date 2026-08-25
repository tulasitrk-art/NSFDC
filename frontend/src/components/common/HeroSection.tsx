"use client";

import React from "react";
import Link from "next/link";
import { Mic, ArrowRight, TrendingUp, Users, Building2, CheckCircle2, ShieldCheck, Calculator } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
  onVoiceTrigger?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onVoiceTrigger }) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#001529]/95 via-[#002244]/90 to-[#001529]/95 text-white border-b-4 border-gov-saffron">
      {/* Background Subtle Geometric Architectural Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80')` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Government Category Tag */}
            <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron/50 text-gov-saffron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              {t("hero.title")}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* CTA Buttons Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Voice Intake Trigger Button */}
              <Link
                href="/apply?voice=true"
                onClick={onVoiceTrigger}
                className="flex items-center space-x-3 bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border-2 border-yellow-300 group"
              >
                <div className="w-8 h-8 bg-slate-950 text-gov-saffron rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-800">{t("hero.illiteracyAssisted")}</div>
                  <div className="text-sm sm:text-base font-black">
                    {t("hero.speakToApply")}
                  </div>
                </div>
              </Link>

              {/* Dynamic Calculator Link */}
              <Link
                href="/apply"
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/30 transition-all backdrop-blur-sm"
              >
                <Calculator className="w-5 h-5 text-gov-saffron" />
                <span>{t("hero.calculateEmi")}</span>
              </Link>

              {/* Spatial Partner Locator */}
              <Link
                href="/channels"
                className="flex items-center space-x-2 text-slate-200 hover:text-gov-saffron font-semibold px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm"
              >
                <span>{t("hero.locateBranch")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Scheme Quick Info Badge */}
          <div className="lg:col-span-4 bg-sapphire-card/90 border border-sapphire-border p-6 rounded-2xl shadow-2xl backdrop-blur-md space-y-4">
            <div className="text-xs font-bold text-gov-gold uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
              <span>{t("hero.rateCaps")}</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px]">FY 2026-27</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <div>
                  <div className="text-xs text-slate-300 font-semibold">{t("hero.microCredit")}</div>
                  <div className="text-xs text-slate-400">{t("hero.upToMicro")}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-400">5.50% p.a.</div>
                  <div className="text-[10px] text-slate-300">Female Rate</div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <div>
                  <div className="text-xs text-slate-300 font-semibold">{t("hero.mahilaSamriddhi")}</div>
                  <div className="text-xs text-slate-400">{t("hero.govtShare95")}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-gov-saffron">5.00% p.a.</div>
                  <div className="text-[10px] text-slate-300">Concessional</div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <div>
                  <div className="text-xs text-slate-300 font-semibold">{t("hero.domesticEducation")}</div>
                  <div className="text-xs text-slate-400">{t("hero.upToEdu")}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-sky-400">6.00% p.a.</div>
                  <div className="text-[10px] text-slate-300">12 M Moratorium</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-black/30 p-2.5 rounded border border-white/5 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t("hero.incomeCeiling")}</span>
            </div>
          </div>
        </div>

        {/* National Live Metrics Strip */}
        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-xl hover:bg-white/15 transition-all group animate-pulse-glow">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-gov-saffron/20 rounded-lg text-gov-saffron group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("metrics.capitalLabel")}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t("metrics.capital")}
            </div>
            <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center space-x-1">
              <span>{t("metrics.capitalGrowth")}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-xl hover:bg-white/15 transition-all group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-sky-500/20 rounded-lg text-sky-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("metrics.beneficiariesLabel")}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t("metrics.beneficiaries")}
            </div>
            <div className="text-xs text-sky-300 mt-1 font-medium">
              {t("metrics.beneficiariesWomen")}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-xl hover:bg-white/15 transition-all group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("metrics.desksLabel")}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t("metrics.desks")}
            </div>
            <div className="text-xs text-emerald-300 mt-1 font-medium">
              {t("metrics.desksSub")}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-xl hover:bg-white/15 transition-all group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-amber-500/20 rounded-lg text-gov-gold group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("metrics.npaLabel")}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t("metrics.npa")}
            </div>
            <div className="text-xs text-gov-gold mt-1 font-medium">
              {t("metrics.npaSub")}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
