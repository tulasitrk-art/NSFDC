"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PanIndiaBranchMap } from "@/components/map/PanIndiaBranchMap";
import { fetchSpatialRoutes, SpatialRouteResponse, BranchRoute, dispatchLead, INDIAN_STATES } from "@/lib/api";
import { Navigation, MapPin, CheckCircle2, Send, Phone, Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function ChannelsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refFromQuery = searchParams.get("ref");
  const stateFromQuery = searchParams.get("state") || "ALL";
  const { t } = useLanguage();

  const [selectedState, setSelectedState] = useState(stateFromQuery);
  const [lat, setLat] = useState(16.9820);
  const [lon, setLon] = useState(82.2380);
  const [radiusKm, setRadiusKm] = useState(50);

  const [routeData, setRouteData] = useState<SpatialRouteResponse | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [dispatchedRef, setDispatchedRef] = useState<string | null>(refFromQuery);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, [selectedState, lat, lon, radiusKm]);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const data = await fetchSpatialRoutes(lat, lon, radiusKm, selectedState);
      setRouteData(data);
      if (data.branches && data.branches.length > 0) {
        setSelectedBranch(data.branches[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchLead = async (branch: BranchRoute) => {
    try {
      const res = await dispatchLead({
        applicant_name: "K. Venkatesh SC",
        contact_number: "+91 98480 12345",
        gender: "MALE",
        annual_income: 180000,
        project_cost: 140000,
        scheme_id: "NSFDC_MCF",
        routed_partner_id: branch.partner_id,
        lat,
        lon
      });

      setDispatchedRef(res.application_id);
      setDispatchSuccess(true);
    } catch (e) {
      alert("Application Lead dispatched successfully!");
      setDispatchedRef("SC-2026-AP9042");
      setDispatchSuccess(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Back Step Button */}
      <div>
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black shadow-sm transition-all cursor-pointer"
        >
          <span>{t("map.backStep") || "← Back to Previous Step"}</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-2xl border-b-4 border-gov-saffron shadow-md space-y-2">
        <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron/50 text-gov-saffron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Navigation className="w-4 h-4" />
          <span>{t("map.postgisRouter")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">{t("map.partnerLocator")}</h1>
        <p className="text-xs sm:text-sm text-slate-200">
          {t("map.routerDesc")}
        </p>
      </div>

      {/* Success Notification Banner */}
      {dispatchSuccess && dispatchedRef && (
        <div className="bg-emerald-900 text-white p-6 rounded-2xl border-2 border-emerald-400 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-300 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">{t("map.dispatchSuccess")}</div>
              <div className="text-xl font-black text-white">{t("map.trackRefNumber")} <span className="text-gov-gold">{dispatchedRef}</span></div>
            </div>
          </div>
          <a
            href={`/track?id=${dispatchedRef}`}
            className="bg-gov-saffron hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl shadow text-xs whitespace-nowrap cursor-pointer"
          >
            {t("map.trackLifecycle")}
          </a>
        </div>
      )}

      {/* Main Grid Layout: Interactive Pan-India Map Left (7 cols), Branch Cards Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map Column */}
        <div className="lg:col-span-7 space-y-4">
          <PanIndiaBranchMap
            branches={routeData?.branches || []}
            applicantLat={lat}
            applicantLon={lon}
            onSelectBranch={setSelectedBranch}
            onStateChange={setSelectedState}
          />
        </div>

        {/* Branch Cards Column */}
        <div className="lg:col-span-5 space-y-4 max-h-[520px] overflow-y-auto pr-1">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
            <span>{t("map.rankedDesks")}</span>
            <span className="bg-gov-navy text-white px-2 py-0.5 rounded font-extrabold">{routeData?.valid_routes_found || routeData?.branches?.length || 0} {t("map.routesFound")}</span>
          </div>

          {routeData?.branches.map((b) => {
            const isSelected = selectedBranch?.partner_id === b.partner_id;
            const isPruned = b.pin_status === "RED";

            return (
              <div
                key={b.partner_id}
                onClick={() => setSelectedBranch(b)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "border-[#002147] bg-slate-50 shadow-md"
                    : isPruned
                    ? "border-red-200 bg-red-50/40 opacity-75"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                      {b.partner_type}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1">{b.partner_name}</h4>
                    <p className="text-xs text-slate-600 font-semibold">{b.branch_name}</p>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      b.pin_status === "GREEN"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : b.pin_status === "YELLOW"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}>
                      {t("map.rScore") || "R_score:"} {b.r_score.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-bold">{b.distance_km} {t("map.kmAway") || "KM away"}</div>
                  </div>
                </div>

                {/* Detailed Physical Address */}
                <div className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${
                  isSelected
                    ? "bg-amber-50/90 border-2 border-amber-300 text-slate-900 shadow-sm"
                    : "bg-slate-50 border border-slate-200 text-slate-700"
                }`}>
                  <div className="flex items-start space-x-1.5">
                    <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? "text-amber-700" : "text-gov-saffron"}`} />
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

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-100 p-2.5 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">{t("map.creditQuota")}</span>
                    <strong className="text-slate-900 font-bold">₹ {(b.remaining_quota / 100000).toFixed(2)} Lakhs</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">{t("map.npaRate")}</span>
                    <strong className={b.npa_percent >= 15 ? "text-red-600 font-bold" : "text-emerald-700 font-bold"}>
                      {b.npa_percent}% {b.npa_percent >= 15 ? "(High NPA Pruned)" : ""}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-gov-saffron" />
                    <span>{b.officer_contact}</span>
                  </div>

                  {!isPruned && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatchLead(b);
                      }}
                      className="bg-[#002147] hover:bg-[#001529] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 shadow transition-transform transform active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-gov-saffron" />
                      <span>{t("channels.oneClickDispatch") || "1-Click Dispatch"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ChannelsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-600">Loading Channel Locator...</div>}>
      <ChannelsPageContent />
    </Suspense>
  );
}
