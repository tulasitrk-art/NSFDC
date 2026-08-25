"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { GovTopBar } from "@/components/common/GovTopBar";
import { GovHeader } from "@/components/common/GovHeader";
import { GovFooter } from "@/components/common/GovFooter";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-md">
      <head>
        <title>NSFDC Concessional Loan Digital Portal | Govt. of India</title>
        <meta name="description" content="National Scheduled Castes Finance & Development Corporation Concessional Credit Portal under Ministry of Social Justice & Empowerment." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen bg-[#F4F7FA] font-sans antialiased text-slate-800">
        <LanguageProvider>
          {/* GIGW Accessibility Top Bar */}
          <GovTopBar />
          
          {/* Official Emblem & Navigation Header */}
          <GovHeader />

          {/* Main Page Content */}
          <main id="main-content" className="flex-grow">
            {children}
          </main>

          {/* Official GIGW Footer */}
          <GovFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
