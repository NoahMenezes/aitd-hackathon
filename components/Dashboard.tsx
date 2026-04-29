"use client";

import React from 'react';
import { 
  Home, 
  CheckSquare, 
  ArrowRightLeft, 
  CreditCard, 
  PieChart, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown, 
  Plus, 
  MoreVertical,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  return (
    <div 
      className="w-full h-full rounded-2xl overflow-hidden p-3 md:p-4 select-none pointer-events-none"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: 'var(--shadow-dashboard)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex flex-col h-full bg-white/40 rounded-xl overflow-hidden border border-white/20">
        {/* Top Bar */}
        <div className="h-12 border-b border-border/50 flex items-center justify-between px-4 bg-white/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center text-white text-[10px] font-bold">F</div>
            <span className="text-[11px] font-semibold">FinPilot</span>
            <ChevronDown size={10} className="text-muted-foreground" />
          </div>
          
          <div className="flex-1 max-w-sm px-4">
            <div className="h-7 bg-secondary/50 rounded-md border border-border/50 flex items-center px-2 gap-2 text-muted-foreground">
              <Search size={10} />
              <span className="text-[10px] flex-1">Search anything...</span>
              <span className="text-[9px] opacity-50">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium">Move Money</span>
            <Bell size={12} className="text-muted-foreground" />
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-medium">JB</div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-40 border-r border-border/50 bg-white/30 flex flex-col p-3 gap-6">
            <div className="space-y-1">
              <SidebarItem icon={<Home size={12} />} label="Home" active />
              <SidebarItem icon={<CheckSquare size={12} />} label="Tasks" badge="10" />
              <SidebarItem icon={<ArrowRightLeft size={12} />} label="Transactions" />
              <SidebarItem icon={<CreditCard size={12} />} label="Payments" hasChevron />
              <SidebarItem icon={<PieChart size={12} />} label="Cards" />
              <SidebarItem icon={<Settings size={12} />} label="Capital" />
              <SidebarItem icon={<Home size={12} />} label="Accounts" hasChevron />
            </div>

            <div className="space-y-1">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Workflows</p>
              <SidebarItem label="Trake rutes" />
              <SidebarItem label="Payments" />
              <SidebarItem label="Notifications" />
              <SidebarItem label="Settings" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-secondary/30 p-4 space-y-4 overflow-hidden">
            <div>
              <h2 className="text-sm font-semibold">Welcome, Jane</h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <ActionButton label="Send" primary />
              <ActionButton label="Request" />
              <ActionButton label="Transfer" />
              <ActionButton label="Deposit" />
              <ActionButton label="Pay Bill" />
              <ActionButton label="Create Invoice" />
              <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
                <Plus size={10} />
                <span>Customize</span>
              </div>
            </div>

            {/* Cards Row */}
            <div className="flex gap-4">
              {/* Balance Card */}
              <div className="flex-1 basis-0 bg-white rounded-xl border border-border/50 p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Mercury Balance</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={8} className="text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight">$8,450,190</span>
                  <span className="text-xs text-muted-foreground">.32</span>
                </div>
                <div className="flex gap-4 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Last 30 Days</span>
                  </div>
                  <div className="text-green-600 font-medium">+$1.8M</div>
                  <div className="text-red-500 font-medium">-$900K</div>
                </div>
                {/* SVG Chart */}
                <div className="h-20 w-full mt-2">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y2="1" x2="0" y1="0">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 35 C 10 32, 20 38, 30 25 C 40 12, 50 28, 60 15 C 70 2, 80 18, 90 10 L 100 5 L 100 40 L 0 40 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0 35 C 10 32, 20 38, 30 25 C 40 12, 50 28, 60 15 C 70 2, 80 18, 90 10 L 100 5"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Accounts Card */}
              <div className="flex-1 basis-0 bg-white rounded-xl border border-border/50 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold">Accounts</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Plus size={12} />
                    <MoreVertical size={12} />
                  </div>
                </div>
                <div className="space-y-0">
                  <AccountRow label="Credit" amount="$98,125.50" />
                  <AccountRow label="Treasury" amount="$6,750,200.00" />
                  <AccountRow label="Operations" amount="$1,592,864.82" />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-border/50 p-4 shadow-sm">
              <h3 className="text-[11px] font-semibold mb-3">Recent Transactions</h3>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-muted-foreground border-b border-border/50">
                    <th className="text-left font-medium pb-2">Date</th>
                    <th className="text-left font-medium pb-2">Description</th>
                    <th className="text-right font-medium pb-2">Amount</th>
                    <th className="text-right font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <TransactionRow date="Apr 24" desc="AWS" amount="-$5,200" status="Pending" statusColor="amber" />
                  <TransactionRow date="Apr 23" desc="Client Payment" amount="+$125,000" status="Completed" statusColor="green" />
                  <TransactionRow date="Apr 22" desc="Payroll" amount="-$85,450" status="Completed" statusColor="green" />
                  <TransactionRow date="Apr 21" desc="Office Supplies" amount="-$1,200" status="Completed" statusColor="green" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, badge, hasChevron }: any) => (
  <div className={cn(
    "flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors",
    active ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
  )}>
    {icon}
    <span className="flex-1">{label}</span>
    {badge && <span className="bg-secondary px-1.5 rounded-full text-[9px] font-medium">{badge}</span>}
    {hasChevron && <ChevronDown size={10} />}
  </div>
);

const ActionButton = ({ label, primary }: any) => (
  <div className={cn(
    "px-3 py-1.5 rounded-full text-[10px] font-medium",
    primary ? "bg-accent text-white" : "bg-white border border-border/50 shadow-sm"
  )}>
    {label}
  </div>
);

const AccountRow = ({ label, amount }: any) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-xs font-medium">{amount}</span>
  </div>
);

const TransactionRow = ({ date, desc, amount, status, statusColor }: any) => (
  <tr>
    <td className="py-2 text-muted-foreground">{date}</td>
    <td className="py-2 font-medium">{desc}</td>
    <td className="py-2 text-right font-medium">{amount}</td>
    <td className="py-2 text-right">
      <span className={cn(
        "px-1.5 py-0.5 rounded-full text-[9px] font-medium",
        statusColor === 'amber' ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
      )}>
        {status}
      </span>
    </td>
  </tr>
);
