"use client";

import { Navbar } from "@/components/Navbar";
import { DashboardProvider } from "@/lib/DashboardContext";
import ChatbotSidebar from "@/components/ChatbotSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-transparent relative">
        <Navbar />
        {children}
        <ChatbotSidebar />
      </div>
    </DashboardProvider>
  );
}
