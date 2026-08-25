"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark, ShieldCheck, MapPin, BookOpen, Search, UserCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const GovHeader: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/#hero", sectionId: "hero", label: t("nav.home"), icon: Landmark },
    { href: "/#apply", sectionId: "apply", label: t("nav.apply"), icon: ShieldCheck },
    { href: "/#channels", sectionId: "channels", label: t("nav.channels"), icon: MapPin },
    { href: "/#schemes", sectionId: "schemes", label: t("nav.schemes"), icon: BookOpen },
    { href: "/#track", sectionId: "track", label: t("nav.track"), icon: Search },
    { href: "/#officer", sectionId: "officer", label: t("nav.officer"), icon: UserCheck },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId?: string) => {
    if (pathname === "/" && sectionId) {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-[33px] z-40">
      {/* Official Emblem & Title Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center space-x-4 group">
          {/* Ashoka Lion Emblem vector */}
          <div className="w-12 h-16 relative flex items-center justify-center bg-[#002147] rounded-lg p-1.5 border-2 border-gov-gold shadow-md shrink-0" style={{ width: '48px', height: '64px', minWidth: '48px' }}>
            <svg viewBox="0 0 100 120" className="w-full h-full text-gov-gold fill-current" style={{ width: '100%', height: '100%', maxWidth: '40px', maxHeight: '56px' }}>
              <path d="M50 5 L65 25 L85 25 L70 45 L80 65 L50 55 L20 65 L30 45 L15 25 L35 25 Z" opacity="0.95" />
              <circle cx="50" cy="80" r="18" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M50 62 L50 98 M32 80 L68 80 M37 67 L63 93 M37 93 L63 67" stroke="currentColor" strokeWidth="2" />
              <rect x="20" y="102" width="60" height="8" rx="2" />
            </svg>
          </div>

          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-[#002147] tracking-tight leading-snug">
              राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-[#002147] tracking-tight">
              National Scheduled Castes Finance & Development Corporation
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              (Ministry of Social Justice & Empowerment, Govt. of India)
            </p>
          </div>
        </Link>

        {/* Right side helpline badge */}
        <div className="hidden lg:flex items-center space-x-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          <div className="bg-gov-saffron text-slate-950 p-2 rounded-full font-bold">
            ☎
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NSFDC Toll-Free Helpline</div>
            <div className="text-sm font-extrabold text-slate-900">1800-11-0380 / 1800-11-0381</div>
          </div>
        </div>
      </div>

      {/* Tricolor Ribbon Line */}
      <div className="h-1 flex w-full">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white border-y border-slate-200"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-[#002147] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                className="flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-4 border-transparent hover:border-gov-saffron hover:bg-white/10 hover:text-gov-saffron transition-all cursor-pointer"
              >
                <Icon className="w-4 h-4 text-gov-saffron" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
