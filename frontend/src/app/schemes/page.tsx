"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent,
  Landmark,
  Layers,
  MapPin,
  CheckCircle2,
  Building2,
  Award
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ALL_STATUTORY_SCHEMES, StatutoryScheme } from "@/lib/schemes_db";

const CATEGORY_TABS = [
  { id: "ALL", label: "All Schemes", icon: "🌐" },
  { id: "MICRO", label: "Micro Credit", icon: "🛒" },
  { id: "MICRO_WOMEN", label: "Women Special", icon: "👩‍💼" },
  { id: "TERM", label: "Term Capex", icon: "🏢" },
  { id: "EDU_DOMESTIC", label: "Higher Education", icon: "🎓" },
  { id: "GREEN_ENERGY", label: "Green & Solar", icon: "🌱" },
  { id: "SANITATION", label: "Sanitation", icon: "🚛" },
  { id: "ARTISAN", label: "Artisan & Crafts", icon: "🎨" },
  { id: "SMALL_BUSINESS", label: "Small Business", icon: "🔧" },
  { id: "AGRI_WOMEN", label: "Agri & Dairy", icon: "🌾" }
];

const STATE_OPTIONS = [
  { code: "ALL", name: "All India (National & State)" },
  { code: "AP", name: "Andhra Pradesh (APSCCFC)" },
  { code: "TS", name: "Telangana (TGSCFC)" },
  { code: "TN", name: "Tamil Nadu (TAHDCO)" },
  { code: "KA", name: "Karnataka (Dr. BR Ambedkar)" },
  { code: "KL", name: "Kerala (KSDC)" },
  { code: "MH", name: "Maharashtra (LASDC / Mahapreit)" },
  { code: "GJ", name: "Gujarat (GSCDC)" },
  { code: "MP", name: "Madhya Pradesh (MPSCDC)" },
  { code: "CG", name: "Chhattisgarh (CGSCDC)" },
  { code: "RJ", name: "Rajasthan (RSCDC)" },
  { code: "UP", name: "Uttar Pradesh (UPSCDC)" },
  { code: "BR", name: "Bihar (BSCDC)" },
  { code: "JH", name: "Jharkhand (JHSCDC)" },
  { code: "WB", name: "West Bengal (WBSCSTDFC)" },
  { code: "OR", name: "Odisha (OSFDC)" },
  { code: "PB", name: "Punjab (PSCFC)" },
  { code: "HR", name: "Haryana (HSCDC)" },
  { code: "HP", name: "Himachal Pradesh (HPSCSTDC)" },
  { code: "UK", name: "Uttarakhand (UKSCDC)" },
  { code: "DL", name: "Delhi NCR (DSCSC)" },
  { code: "AS", name: "Assam (ASCDC)" },
  { code: "TR", name: "Tripura (TSCDC)" },
  { code: "MN", name: "Manipur (MSCDC)" },
  { code: "ML", name: "Meghalaya (MSSCDC)" },
  { code: "NL", name: "Nagaland (NSCDC)" },
  { code: "MZ", name: "Mizoram (MZSCDC)" },
  { code: "AR", name: "Arunachal Pradesh (ARSCDC)" },
  { code: "SK", name: "Sikkim (SSCDC)" },
  { code: "GA", name: "Goa (GSCDC)" },
  { code: "PY", name: "Puducherry (PSCDC)" }
];

const ITEMS_PER_PAGE = 12;

export default function SchemesPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedState, setSelectedState] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered list computed via memoization for high performance
  const filteredSchemes = useMemo(() => {
    return ALL_STATUTORY_SCHEMES.filter((scheme) => {
      // 1. State filter
      if (selectedState !== "ALL") {
        if (scheme.targetStateCode && scheme.targetStateCode !== "ALL" && scheme.targetStateCode !== selectedState) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== "ALL") {
        if (scheme.code.toUpperCase() !== selectedCategory.toUpperCase()) {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchName = scheme.name.toLowerCase().includes(q);
        const matchSector = scheme.sector.toLowerCase().includes(q);
        const matchId = scheme.id.toLowerCase().includes(q);
        const matchDesc = scheme.description.toLowerCase().includes(q);
        if (!matchName && !matchSector && !matchId && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedState]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedState]);

  const totalPages = Math.ceil(filteredSchemes.length / ITEMS_PER_PAGE) || 1;
  const paginatedSchemes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSchemes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSchemes, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back Step Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black shadow-sm transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t("schemes.backToPrevious") || "Back to Previous Step"}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            {t("schemes.catalogSize") || "Catalog Size:"}
          </span>
          <span className="px-3 py-1 rounded-full bg-gov-navy text-white text-xs font-extrabold shadow-sm">
            {ALL_STATUTORY_SCHEMES.length} {t("schemes.activeSchemes") || "Active Schemes"}
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-3xl border-b-4 border-gov-saffron shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
          <Building2 className="w-80 h-80 text-white" />
        </div>

        <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron/50 text-gov-saffron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>{t("schemes.repositoryTitle")}</span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t("schemes.directoryTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {t("schemes.directoryDesc")}
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-slate-300 font-medium">{t("schemes.totalSchemes")}</div>
            <div className="text-lg sm:text-xl font-black text-white">{ALL_STATUTORY_SCHEMES.length}+ {t("schemes.totalPrograms")}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-slate-300 font-medium">{t("schemes.interestRates")}</div>
            <div className="text-lg sm:text-xl font-black text-gov-saffron">{t("schemes.interestRange")}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-slate-300 font-medium">{t("schemes.maxLoanCap")}</div>
            <div className="text-lg sm:text-xl font-black text-emerald-400">{t("schemes.maxCapValue")}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-slate-300 font-medium">{t("schemes.govtShare")}</div>
            <div className="text-lg sm:text-xl font-black text-gov-gold">{t("schemes.govtFunding")}</div>
          </div>
        </div>
      </div>

      {/* Statutory Rules Gate Alert Box */}
      <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 font-black text-amber-950 text-sm">
          <ShieldCheck className="w-5 h-5 text-gov-saffron shrink-0" />
          <span>{t("schemes.rulesAlertTitle")}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-amber-900 font-medium">
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 font-bold mb-0.5">{t("schemes.rule1Title")}</strong>
            {t("schemes.rule1Desc")}
          </div>
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 font-bold mb-0.5">{t("schemes.rule2Title")}</strong>
            {t("schemes.rule2Desc")}
          </div>
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 font-bold mb-0.5">{t("schemes.rule3Title")}</strong>
            {t("schemes.rule3Desc")}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Bar & State Filter & View Mode */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("schemes.searchPlaceholder") || "Search across 330+ schemes by keyword, sector, or scheme name..."}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-gov-navy focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                {t("schemes.clear") || "Clear"}
              </button>
            )}
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gov-saffron shrink-0" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-gov-navy focus:outline-none cursor-pointer"
            >
              {STATE_OPTIONS.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.code === "ALL" ? (t("schemes.allIndia") || st.name) : st.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-gov-navy shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white text-gov-navy shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sector Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_TABS.map((tab) => {
            const catLabel = t(`schemes.categories.${tab.id}`);
            const displayLabel = catLabel && !catLabel.startsWith("schemes.categories") ? catLabel : tab.label;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  selectedCategory === tab.id
                    ? "bg-[#002147] text-white shadow-md"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{displayLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter Summary */}
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-t border-slate-100 pt-3">
          <span>
            {t("schemes.found")} <strong className="text-slate-900 font-extrabold">{filteredSchemes.length}</strong> {t("schemes.matchingSchemes")}
            {selectedState !== "ALL" && ` ${t("schemes.inState")} ${selectedState}`}
            {selectedCategory !== "ALL" && ` ${t("schemes.underCat")} ${t(`schemes.categories.${selectedCategory}`) || selectedCategory}`}
          </span>
          <span>
            {t("schemes.page")} <strong className="text-slate-900 font-extrabold">{currentPage}</strong> {t("schemes.of")} {totalPages}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800">{t("schemes.noSchemesFound")}</h3>
            <p className="text-xs text-slate-500">
              {t("schemes.noSchemesDesc")}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedState("ALL");
            }}
            className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl hover:bg-gov-navy/90 transition-all cursor-pointer"
          >
            {t("schemes.resetFilters")}
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSchemes.map((scheme) => {
            const localizedTitleKey = `schemes.items.${scheme.id}.title`;
            const localizedDescKey = `schemes.items.${scheme.id}.description`;
            const titleTranslation = t(localizedTitleKey);
            const descTranslation = t(localizedDescKey);
            const displayTitle = titleTranslation && !titleTranslation.startsWith("schemes.items") ? titleTranslation : scheme.name;
            const displayDesc = descTranslation && !descTranslation.startsWith("schemes.items") ? descTranslation : scheme.description;

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 hover:border-gov-navy/40 relative group"
              >
                {/* Card Header */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        {scheme.icon || "✨"}
                      </span>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {scheme.code}
                        </span>
                        {scheme.targetStateCode && scheme.targetStateCode !== "ALL" && (
                          <span className="ml-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {scheme.targetStateCode} {t("schemes.state")}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {scheme.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-gov-navy transition-colors">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">
                      {displayDesc}
                    </p>
                  </div>
                </div>

                {/* Financial Parameters Matrix */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{t("schemes.maxLoanCap")}</span>
                      <span className="text-xs font-black text-slate-900">
                        ₹ {scheme.maxCost.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">{t("schemes.govtShare")}</span>
                      <span className="text-xs font-black text-emerald-800">
                        {scheme.govtSharePercent}%
                      </span>
                    </div>
                    <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-700 block uppercase">{t("schemes.femaleRate")}</span>
                      <span className="text-xs font-black text-gov-saffron">
                        {scheme.interestFemale}% {t("schemes.pa")}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{t("schemes.maleRate")}</span>
                      <span className="text-xs font-black text-slate-700">
                        {scheme.interestMale > 50 ? t("schemes.femaleOnly") : `${scheme.interestMale}% ${t("schemes.pa")}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold px-1">
                    <span>{t("schemes.moratorium")}: <strong>{scheme.moratoriumMonths} {t("schemes.mos")}</strong></span>
                    <span>{t("schemes.tenure")}: <strong>{scheme.repaymentYears} {t("schemes.yrs")}</strong></span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/apply?scheme=${scheme.id}`}
                      className="flex-1 bg-[#002147] hover:bg-[#001529] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all text-center cursor-pointer"
                    >
                      <span>{t("schemes.applyUnderScheme")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">{t("schemes.schemeDetails")}</th>
                  <th className="p-4">{t("schemes.category")}</th>
                  <th className="p-4">{t("schemes.state")}</th>
                  <th className="p-4">{t("schemes.maxLoanCap")}</th>
                  <th className="p-4">{t("schemes.govtShare")}</th>
                  <th className="p-4">{t("schemes.femaleRate")}</th>
                  <th className="p-4">{t("schemes.maleRate")}</th>
                  <th className="p-4">{t("schemes.moratorium")}</th>
                  <th className="p-4">{t("schemes.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {paginatedSchemes.map((s) => {
                  const localizedTitleKey = `schemes.items.${s.id}.title`;
                  const titleTranslation = t(localizedTitleKey);
                  const displayTitle = titleTranslation && !titleTranslation.startsWith("schemes.items") ? titleTranslation : s.name;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 max-w-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">{s.icon || "✨"}</span>
                          <div>
                            <strong className="text-slate-900 block font-bold">{displayTitle}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{s.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">
                          {s.code}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {s.targetStateCode || "ALL"}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">
                        ₹ {s.maxCost.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 font-bold text-emerald-700">{s.govtSharePercent}%</td>
                      <td className="p-4 font-extrabold text-gov-saffron">{s.interestFemale}%</td>
                      <td className="p-4 font-bold text-slate-700">
                        {s.interestMale > 50 ? t("schemes.femaleOnly") : `${s.interestMale}%`}
                      </td>
                      <td className="p-4">{s.moratoriumMonths} {t("schemes.mos")}</td>
                      <td className="p-4">
                        <Link
                          href={`/apply?scheme=${s.id}`}
                          className="bg-[#002147] hover:bg-[#001529] text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-all cursor-pointer"
                        >
                          <span>{t("schemes.apply")}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t("schemes.previous")}</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNumber = i + 1;
              if (totalPages > 7) {
                if (currentPage > 4 && currentPage < totalPages - 3) {
                  pageNumber = currentPage - 3 + i;
                } else if (currentPage >= totalPages - 3) {
                  pageNumber = totalPages - 6 + i;
                }
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNumber
                      ? "bg-[#002147] text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
          >
            <span>{t("schemes.next")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
