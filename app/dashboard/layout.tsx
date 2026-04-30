"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardProvider } from "@/lib/DashboardContext";
import ChatbotSidebar from "@/components/ChatbotSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ProtectedRoute>
      <DashboardProvider>
        <div className="min-h-screen bg-transparent relative">
          <Navbar />
          {children}
          <ChatbotSidebar />
        </div>
      </DashboardProvider>
    </ProtectedRoute>
  );
}
