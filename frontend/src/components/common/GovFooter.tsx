"use client";

import React from "react";
import Link from "next/link";
import { Shield, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export const GovFooter: React.FC = () => {
  return (
    <footer className="bg-[#001529] text-white border-t-4 border-gov-saffron">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Corporation Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gov-saffron rounded flex items-center justify-center font-bold text-slate-950 text-sm">
              NS
            </div>
            <span className="font-bold text-base text-white tracking-tight">NSFDC Portal</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            National Scheduled Castes Finance and Development Corporation (NSFDC) was set up in 1989 under Section 8 of the Companies Act, 2013 (formerly Section 25) as a Company not for profit under the Ministry of Social Justice and Empowerment, Government of India.
          </p>
          <div className="flex items-center space-x-2 text-xs text-gov-gold font-semibold">
            <Shield className="w-4 h-4" />
            <span>GIGW 2.0 & STQC Certified Portal</span>
          </div>
        </div>

        {/* Column 2: Quick Scheme Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gov-saffron uppercase tracking-wider border-b border-white/10 pb-1">
            Concessional Schemes
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><Link href="/schemes" className="hover:text-gov-saffron transition-colors">Micro Credit Finance Scheme (MCF)</Link></li>
            <li><Link href="/schemes" className="hover:text-gov-saffron transition-colors">Mahila Samriddhi Yojana (MSY)</Link></li>
            <li><Link href="/schemes" className="hover:text-gov-saffron transition-colors">Term Loan Scheme (General)</Link></li>
            <li><Link href="/schemes" className="hover:text-gov-saffron transition-colors">Educational Loan Scheme (Domestic)</Link></li>
            <li><Link href="/schemes" className="hover:text-gov-saffron transition-colors">Overseas Educational Loan Scheme</Link></li>
          </ul>
        </div>

        {/* Column 3: Important Government Portals */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gov-saffron uppercase tracking-wider border-b border-white/10 pb-1">
            Government Portals
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><a href="https://socialjustice.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron transition-colors flex items-center space-x-1"><span>Ministry of Social Justice</span><ExternalLink className="w-3 h-3"/></a></li>
            <li><a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron transition-colors flex items-center space-x-1"><span>National Portal of India (india.gov.in)</span><ExternalLink className="w-3 h-3"/></a></li>
            <li><a href="https://jansamarth.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron transition-colors flex items-center space-x-1"><span>JanSamarth Credit Portal</span><ExternalLink className="w-3 h-3"/></a></li>
            <li><a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron transition-colors flex items-center space-x-1"><span>Digital India Initiative</span><ExternalLink className="w-3 h-3"/></a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Grievance */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gov-saffron uppercase tracking-wider border-b border-white/10 pb-1">
            Head Office Contact
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gov-saffron shrink-0 mt-0.5" />
              <span>14th Floor, Scope Minar, Core-1, Laxmi Nagar District Centre, Delhi - 110092</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gov-saffron shrink-0" />
              <span>Toll Free: 1800-11-0380 / 1800-11-0381</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gov-saffron shrink-0" />
              <span>support-nsfdc@nic.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="bg-[#000d1a] border-t border-white/10 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © {new Date().getFullYear()} National Scheduled Castes Finance and Development Corporation, Govt. of India. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/schemes" className="hover:underline">Privacy Policy</Link>
            <span>|</span>
            <Link href="/schemes" className="hover:underline">Terms of Use</Link>
            <span>|</span>
            <Link href="/schemes" className="hover:underline">GIGW Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
