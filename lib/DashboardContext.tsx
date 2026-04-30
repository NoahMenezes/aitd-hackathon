"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from './api';
import { getUserId } from './auth';

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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Always start as false (matches server render), then sync from sessionStorage after mount
  const [isLinked, setIsLinkedState] = useState<boolean>(false);
  const [checkingLink, setCheckingLink] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("finpilot_linked");
    if (stored === "true") setIsLinkedState(true);
    setCheckingLink(false);
  }, []);

  const setIsLinked = (val: boolean) => {
    setIsLinkedState(val);
    sessionStorage.setItem("finpilot_linked", String(val));
  };
  const [balance, setBalance] = useState(52450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [foodSpend, setFoodSpend] = useState(7500);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [selectedPlan, setSelectedPlanState] = useState<SelectedPlan | null>(null);

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
      const uid = getUserId();
      if (!uid) throw new Error("No user ID");

      await apiFetch(`/transaction/${uid}`, {
        method: "POST",
        body: JSON.stringify({
          merchant,
          amount,
          category,
          type: "debit"
        })
      });

      // Optimistically update local state
      const newBalance = balance - amount;
      const newTxn = {
        type: "DEBIT",
        mode: "UPI",
        amount: amount,
        currentBalance: newBalance,
        transactionTimestamp: new Date().toISOString(),
        narration: `UPI/${merchant.toUpperCase()}/TXN${Math.floor(Math.random() * 100000)}`,
        reference: Math.floor(Math.random() * 10000000000).toString(),
      };

      setBalance(newBalance);
      setTransactions((prev) => [newTxn, ...prev]);

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
