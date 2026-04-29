"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Transaction {
  type: string;
  mode: string;
  amount: number;
  currentBalance: number;
  transactionTimestamp: string;
  narration: string;
  reference: string;
}

interface DashboardContextType {
  isLinked: boolean;
  setIsLinked: (val: boolean) => void;
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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [isLinked, setIsLinked] = useState(false);
  const [balance, setBalance] = useState(52450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [foodSpend, setFoodSpend] = useState(7500); // Initializing with HTML value for demo

  const handlePurchase = (merchant: string, amount: number, category: string) => {
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
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);

  return (
    <DashboardContext.Provider value={{
      isLinked, setIsLinked,
      balance, setBalance,
      transactions, setTransactions,
      foodSpend, setFoodSpend,
      handlePurchase,
      isChatOpen, setIsChatOpen,
      chatMessages, setChatMessages
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
