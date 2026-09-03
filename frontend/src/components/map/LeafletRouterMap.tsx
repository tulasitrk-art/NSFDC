"use client";

import React, { useEffect, useRef } from "react";
import { BranchRoute } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface LeafletRouterMapProps {
  branches: BranchRoute[];
  applicantLat: number;
  applicantLon: number;
  onSelectBranch?: (branch: BranchRoute) => void;
}

export const LeafletRouterMap: React.FC<LeafletRouterMapProps> = ({
  branches,
  applicantLat,
  applicantLon,
  onSelectBranch
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Dynamically load Leaflet library on client side
    import("leaflet").then((L) => {
      // Fix default marker icon assets
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView([applicantLat, applicantLon], 9);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | NSFDC Spatial Engine',
          maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView([applicantLat, applicantLon], 9);
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          map.removeLayer(layer);
        }
      });

      // Render Applicant Home Location Circle
      const appLocTitle = t("map.applicantLocation") || "Applicant Center Location";
      const appSearchCenter = t("map.spatialSearchCenter") || "Spatial Search Center";
      L.circle([applicantLat, applicantLon], {
        color: "#001529",
        fillColor: "#FF9933",
        fillOpacity: 0.35,
        radius: 8000
      }).addTo(map).bindPopup(`<b>${appLocTitle}</b><br/>${appSearchCenter}`);

      // Color-coded Pin Factory
      const createCustomIcon = (status: string, score: number) => {
        let colorClass = "bg-emerald-600 border-white";
        if (status === "YELLOW") {
          colorClass = "bg-amber-500 border-white";
        } else if (status === "RED_PRUNED" || status === "RED") {
          colorClass = "bg-red-600 border-white";
        }

        return L.divIcon({
          className: "custom-div-icon",
          html: `<div class="w-8 h-8 ${colorClass} text-white font-extrabold text-[10px] rounded-full border-2 shadow-lg flex items-center justify-center transform hover:scale-125 transition-transform">
                  ${score ? score.toFixed(2) : "0.75"}
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      };

      const bounds: any[] = [[applicantLat, applicantLon]];

      // Add Markers for Channel Partner Branches
      branches.forEach((b) => {
        const markerLat = b.lat ?? b.latitude ?? applicantLat;
        const markerLon = b.lon ?? b.longitude ?? applicantLon;
        const npaVal = b.npa_percentage ?? b.npa_percent ?? 0;

        bounds.push([markerLat, markerLon]);

        const markerIcon = createCustomIcon(b.pin_status, b.r_score);
        const marker = L.marker([markerLat, markerLon], { icon: markerIcon }).addTo(map);

        const addressText = b.address || `${b.branch_name}, ${b.district || "District Office"}, ${b.state_code}`;
        const distLabel = t("map.distance") || "Distance:";
        const kmLabel = t("map.kmAway") || "KM away";
        const quotaLabel = t("map.creditQuota") || "Available Quota:";
        const npaLabel = t("map.npaRate") || "Branch NPA:";
        const rScoreLabel = t("map.rScore") || "R_score:";
        const statusLabel = t("map.status") || "Status:";
        const addrLabel = t("map.detailedAddress") || "📍 Detailed Address:";

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 250px;">
            <div style="font-size: 11px; font-weight: bold; color: #001529; text-transform: uppercase;">${b.partner_type} - ${b.partner_name}</div>
            <div style="font-size: 12px; font-weight: bold; color: #1e293b; margin-top: 2px;">${b.branch_name}</div>
            <div style="font-size: 10px; color: #0f172a; background: #f8fafc; padding: 5px 7px; border-radius: 6px; margin: 5px 0; border: 1px solid #cbd5e1; line-height: 1.35;">
              <strong style="color: #002147;">${addrLabel}</strong><br/>${addressText}
            </div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;" />
            <div style="font-size: 11px; color: #475569;">
              <div>• ${distLabel} <strong>${b.distance_km} ${kmLabel}</strong></div>
              <div>• ${quotaLabel} <strong>₹ ${(b.remaining_quota / 100000).toFixed(2)} Lakhs</strong></div>
              <div>• ${npaLabel} <strong>${npaVal}%</strong></div>
              <div>• ${rScoreLabel} <strong>${b.r_score}</strong></div>
              <div>• ${statusLabel} <strong style="color: ${b.pin_status === 'GREEN' ? '#059669' : b.pin_status === 'YELLOW' ? '#d97706' : '#dc2626'}">${b.pin_status}</strong></div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          if (onSelectBranch) onSelectBranch(b);
        });
      });

      if (bounds.length > 1) {
        try {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
        } catch (e) {
          // Ignore fitBounds edge cases
        }
      }
    });
  }, [branches, applicantLat, applicantLon, onSelectBranch, t]);

  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white backdrop-blur-md p-3 rounded-xl border border-white/20 z-20 text-[11px] space-y-1 shadow-xl">
        <div className="font-extrabold text-gov-gold uppercase text-[10px] tracking-wider mb-1">
          {t("map.legendTitle") || "R_score Pin Index Legend"}
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block border border-white"></span>
          <span>{t("map.legendGreen") || "Green: Top Route (R_score ≥ 0.70)"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-amber-500 rounded-full inline-block border border-white"></span>
          <span>{t("map.legendYellow") || "Yellow: Valid Alternative (0.50 ≤ R_score < 0.70)"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-600 rounded-full inline-block border border-white"></span>
          <span>{t("map.legendRed") || "Red: High NPA / Pruned Route"}</span>
        </div>
      </div>
    </div>
  );
};
