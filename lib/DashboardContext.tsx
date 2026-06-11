"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from './api';
import { getUserId } from './auth';
import { dashboardApi, transactionsApi } from './sumo-api';

interface Transaction {
  type: string;
  mode: string;
  amount: number;
  currentBalance: number;
  transactionTimestamp: string;
  narration: string;
  reference: string;
}

export type PlanKey = "easy" | "moderate" | "hard";

export interface SelectedPlan {
  key: PlanKey;
  label: string;
  steps: string[];
  yearlySavings: number;
  feasibility: string;
  effort: PlanKey;
  startedAt: string;
}

interface DashboardContextType {
  isLinked: boolean;
  setIsLinked: (val: boolean) => void;
  checkingLink: boolean;
  balance: number;
  setBalance: (val: number) => void;
  transactions: Transaction[];
  setTransactions: (val: Transaction[]) => void;
  foodSpend: number;
  setFoodSpend: (val: number) => void;
  handlePurchase: (merchant: string, amount: number, category: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  chatMessages: { role: "user" | "bot"; content: string }[];
  setChatMessages: (val: { role: "user" | "bot"; content: string }[]) => void;
  selectedPlan: SelectedPlan | null;
  setSelectedPlan: (plan: SelectedPlan | null) => void;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [isLinked, setIsLinkedState] = useState<boolean>(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [foodSpend, setFoodSpend] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [selectedPlan, setSelectedPlanState] = useState<SelectedPlan | null>(null);

  const uid = getUserId();

  useEffect(() => {
    const stored = sessionStorage.getItem("finpilot_linked");
    if (stored === "true") setIsLinkedState(true);
    setCheckingLink(false);
  }, []);

  const refreshData = async () => {
    if (!uid) return;
    try {
      const summary = await dashboardApi.getSummary(uid);
      if (summary) {
        setBalance(summary.balance || summary.current_balance || 0);
        // Assuming food spend comes from somewhere or we calculate it
      }

      const txns = await transactionsApi.list({ limit: 20 }, uid);
      if (Array.isArray(txns)) {
        setTransactions(txns.map((t: any) => ({
          type: t.type?.toUpperCase() || "DEBIT",
          mode: t.mode || "UPI",
          amount: t.amount,
          currentBalance: t.current_balance || 0,
          transactionTimestamp: t.timestamp || t.transactionTimestamp || new Date().toISOString(),
          narration: t.merchant || t.narration || "Transaction",
          reference: t.id || t.reference || Math.random().toString(36).slice(2),
        })));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    if (uid) {
      refreshData();
    }
  }, [uid]);

  const setIsLinked = (val: boolean) => {
    setIsLinkedState(val);
    sessionStorage.setItem("finpilot_linked", String(val));
  };

  useEffect(() => {
    const plan = localStorage.getItem("finpilot_plan");
    if (plan) {
      try {
        setSelectedPlanState(JSON.parse(plan));
      } catch (e) {}
    }
  }, []);

  const setSelectedPlan = (plan: SelectedPlan | null) => {
    setSelectedPlanState(plan);
    if (plan) {
      localStorage.setItem("finpilot_plan", JSON.stringify(plan));
    } else {
      localStorage.removeItem("finpilot_plan");
    }
  };

  const handlePurchase = async (merchant: string, amount: number, category: string) => {
    try {
      if (!uid) throw new Error("No user ID");

      await transactionsApi.record({
        merchant,
        amount,
        category,
        type: "debit"
      }, uid);

      // Refresh data after purchase to get updated balance and txns
      await refreshData();

      if (category === "Food") {
        setFoodSpend(prev => prev + amount);
      }
    } catch (err: any) {
      console.error("Purchase failed", err);
    }
  };

  return (
    <DashboardContext.Provider value={{
      isLinked, setIsLinked, checkingLink,
      balance, setBalance,
      transactions, setTransactions,
      foodSpend, setFoodSpend,
      handlePurchase,
      isChatOpen, setIsChatOpen,
      chatMessages, setChatMessages,
      selectedPlan, setSelectedPlan,
      refreshData,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};


export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
