"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { BranchRoute, INDIAN_STATES, fetchSpatialRoutes } from "@/lib/api";
import { Navigation, MapPin, Building2, Phone, CheckCircle2, Award, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const LeafletRouterMap = dynamic(
  () => import("./LeafletRouterMap").then((mod) => mod.LeafletRouterMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-white space-y-2 border border-slate-800">
        <span className="w-6 h-6 border-2 border-gov-saffron border-t-transparent rounded-full animate-spin"></span>
        <span className="text-xs font-bold tracking-wider">Loading Pan-India Interactive Leaflet Map...</span>
      </div>
    ),
  }
);

interface PanIndiaBranchMapProps {
  branches?: BranchRoute[];
  applicantLat?: number;
  applicantLon?: number;
  onSelectBranch: (branch: BranchRoute) => void;
  onStateChange?: (stateCode: string) => void;
}

export const PanIndiaBranchMap: React.FC<PanIndiaBranchMapProps> = ({
  branches: initialBranches,
  applicantLat = 16.9820,
  applicantLon = 82.2380,
  onSelectBranch,
  onStateChange,
}) => {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState("MH");
  const [activeBranches, setActiveBranches] = useState<BranchRoute[]>(initialBranches || []);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [currentLat, setCurrentLat] = useState(18.9256); // Default Maharashtra center
  const [currentLon, setCurrentLon] = useState(72.8258);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch for Maharashtra (MH) or initial state
    handleStateSelect("MH");
  }, []);

  const handleStateSelect = async (code: string) => {
    setSelectedState(code);
    if (onStateChange) onStateChange(code);

    const stateObj = INDIAN_STATES.find((s) => s.code === code);
    let targetLat = applicantLat;
    let targetLon = applicantLon;

    if (stateObj) {
      targetLat = stateObj.lat;
      targetLon = stateObj.lon;
      setCurrentLat(targetLat);
      setCurrentLon(targetLon);
    }

    setLoading(true);
    try {
      const res = await fetchSpatialRoutes(targetLat, targetLon, 50, code);
      if (res && res.branches && res.branches.length > 0) {
        setActiveBranches(res.branches);
        setSelectedBranchId(res.branches[0].partner_id);
        onSelectBranch(res.branches[0]);
      } else {
        setActiveBranches([]);
      }
    } catch (e) {
      console.warn("Spatial router fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (b: BranchRoute) => {
    setSelectedBranchId(b.partner_id);
    const bLat = b.lat ?? b.latitude ?? currentLat;
    const bLon = b.lon ?? b.longitude ?? currentLon;
    setCurrentLat(bLat);
    setCurrentLon(bLon);
    onSelectBranch(b);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-lg overflow-hidden p-6 space-y-6">
      {/* Pan-India State Selector Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 shadow">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-gov-saffron" />
            <h3 className="text-base sm:text-lg font-black text-white">
              {t("map.routerTitle")}
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            {t("map.routerSubtitle")}
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-gov-gold whitespace-nowrap hidden md:inline">{t("map.selectState")}</span>
          <select
            value={selectedState}
            onChange={(e) => handleStateSelect(e.target.value)}
            className="w-full sm:w-auto bg-gov-saffron text-slate-950 font-black px-4 py-2.5 rounded-xl border-2 border-amber-300 shadow-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="ALL">{t("map.allStates") || "All 28 States & UTs (Pan-India)"}</option>
            {INDIAN_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Layout: Left Column Map (7 Cols), Right Column Branch Side Panel (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE MAP (7 COLS) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center text-xs font-extrabold text-[#002147] uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-gov-saffron" />
              <span>{t("map.osmTitle")}</span>
            </span>
            <span className="text-slate-500 font-semibold">{t("map.stateCode")} {selectedState}</span>
          </div>

          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md">
            {loading && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-30 flex items-center justify-center text-white font-bold text-xs space-x-2 rounded-2xl">
                <span className="w-5 h-5 border-2 border-gov-saffron border-t-transparent rounded-full animate-spin"></span>
                <span>{t("map.updatingPins")} {selectedState}...</span>
              </div>
            )}

            <LeafletRouterMap
              branches={activeBranches}
              applicantLat={currentLat}
              applicantLon={currentLon}
              onSelectBranch={handleCardClick}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: BRANCH SIDE INFO RAIL (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center text-xs font-black text-[#002147] uppercase tracking-wider border-b border-slate-200 pb-2">
            <span className="flex items-center space-x-1">
              <Building2 className="w-4 h-4 text-gov-navy" />
              <span>{t("map.branchesInState")}</span>
            </span>
            <span className="bg-gov-saffron text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[11px] shadow-sm">
              {activeBranches.length} {t("map.branchDesks")}
            </span>
          </div>

          {/* Branch Cards Container */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
            {activeBranches.length > 0 ? (
              activeBranches.map((b) => {
                const isSelected = selectedBranchId === b.partner_id;
                const npaVal = b.npa_percentage ?? b.npa_percent ?? 0;
                const quotaVal = b.remaining_quota ?? 5000000;

                return (
                  <div
                    key={b.partner_id}
                    onClick={() => handleCardClick(b)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? "border-[#002147] bg-slate-50 shadow-md ring-2 ring-[#002147]/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Partner Type & R_score Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase border ${
                          b.partner_type === "SCA"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : b.partner_type === "PSB"
                            ? "bg-blue-100 text-blue-900 border-blue-300"
                            : "bg-emerald-100 text-emerald-900 border-emerald-300"
                        }`}>
                          {b.partner_type}
                        </span>
                        <span className="text-xs font-black text-gov-navy leading-tight">{b.partner_name}</span>
                      </div>

                      <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-sm ${
                        b.r_score >= 0.70
                          ? "bg-emerald-600 text-white border-emerald-400"
                          : "bg-amber-500 text-slate-950 border-amber-300"
                      }`}>
                        {t("map.rScore") || "R_score:"} {b.r_score}
                      </span>
                    </div>

                    {/* Branch Title & Location */}
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{b.branch_name}</h4>
                      <p className="text-xs text-slate-500 font-semibold">{b.district || "Central Office"}, {b.state_code}</p>
                    </div>

                    {/* Detailed Physical Address of Selected/Available Branch */}
                    <div className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${
                      isSelected
                        ? "bg-amber-50/90 border-2 border-amber-300 text-slate-900 shadow-sm"
                        : "bg-slate-50 border border-slate-200 text-slate-700"
                    }`}>
                      <div className="flex items-start space-x-1.5">
                        <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-amber-700" : "text-gov-saffron"}`} />
                        <div>
                          <span className={`text-[10px] font-black uppercase block tracking-wider ${isSelected ? "text-amber-900" : "text-slate-500"}`}>
                            {isSelected ? t("map.selectedAddress") : t("map.physicalAddress")}
                          </span>
                          <p className="font-bold text-xs leading-snug text-slate-900">
                            {b.address || `${b.branch_name}, ${b.district || "District Office"}, ${b.state_code}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("map.npaRate")}</span>
                        <strong className="text-emerald-700 font-extrabold">{npaVal}% {t("map.healthyNpa")}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("map.creditQuota")}</span>
                        <strong className="text-slate-900 font-extrabold">₹ {quotaVal.toLocaleString()}</strong>
                      </div>
                    </div>

                    {/* Officer Contact */}
                    {b.officer_contact && (
                      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold pt-1 border-t border-slate-100">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-gov-saffron" />
                          <span>{t("map.officer")} <strong>{b.officer_contact}</strong></span>
                        </div>
                      </div>
                    )}

                    {/* 1-Click Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(b);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gov-saffron text-slate-950 shadow"
                          : "bg-[#002147] hover:bg-slate-800 text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSelected ? t("map.selectedForDispatch") : t("map.selectForDispatch")}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500">
                {t("map.noBranches")} {selectedState}. {t("map.noBranchesPrompt")}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
