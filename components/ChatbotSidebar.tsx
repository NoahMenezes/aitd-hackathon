"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useDashboard } from "@/lib/DashboardContext";
import { usePathname } from "next/navigation";

export default function ChatbotSidebar() {
  const { isChatOpen, setIsChatOpen, chatMessages, setChatMessages } = useDashboard();
  const [inputValue, setInputValue] = useState("");
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isChatOpen &&
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsChatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isChatOpen, setIsChatOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [
      ...chatMessages,
      { role: "user" as const, content: inputValue },
    ];
    setChatMessages(newMessages);
    setInputValue("");

    setTimeout(() => {
      setChatMessages([
        ...newMessages,
        { role: "bot", content: "That's a great question. Based on your spending trends, maintaining this discipline for 6 months will significantly improve your credit score potential." },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* AI Chatbot Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed top-[150px] right-0 h-[calc(100%-150px)] w-[400px] bg-white border-l border-t border-border shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col rounded-tl-3xl",
          isChatOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Chat Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Bot size={18} className="text-background" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">FinPilot AI</p>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Strategy Advisor</h3>
            </div>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="hover:rotate-90 transition-transform p-1 text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {chatMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <MessageSquare size={48} className="mb-4" />
              <p className="text-xs font-semibold uppercase tracking-wider">Ask me anything about your finances</p>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} className={cn(
              "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2",
              msg.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "max-w-[85%] p-4 text-xs font-medium leading-relaxed rounded-2xl shadow-sm",
                msg.role === "user" 
                  ? "bg-foreground text-background" 
                  : "bg-secondary text-foreground"
              )}>
                {msg.content}
              </div>
              <div className="flex items-center gap-2 px-1">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {msg.role === "user" ? "You" : "FinPilot"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-border bg-secondary flex items-center gap-3">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-grow bg-white border border-border px-4 py-3 text-xs font-medium rounded-full focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          />
          <button 
            type="submit"
            className="bg-foreground text-background p-3 rounded-full hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Chat Toggle Button - Restored for all pages */}
      <button 
        ref={toggleRef}
        onClick={() => setIsChatOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40 group overflow-hidden",
          isChatOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <BorderBeam colorFrom="#fff" colorTo="#fff" size={50} duration={4} />
        <MessageSquare size={24} className="relative z-10" />
      </button>
    </>
  );
}
