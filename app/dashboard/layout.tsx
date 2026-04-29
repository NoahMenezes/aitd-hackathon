"use client";

import { Navbar } from "@/components/Navbar";
import { DashboardProvider } from "@/lib/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-transparent">
        <Navbar />
        {children}
      </div>
    </DashboardProvider>
  );
}
