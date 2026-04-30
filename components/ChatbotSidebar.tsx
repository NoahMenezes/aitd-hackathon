"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useDashboard } from "@/lib/DashboardContext";
import { apiFetch } from "@/lib/api";
import { getUserId, getChatSessionId } from "@/lib/auth";
import { toast } from "react-hot-toast";

export default function ChatbotSidebar() {
  const { isChatOpen, setIsChatOpen, chatMessages, setChatMessages } = useDashboard();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const uid = getUserId();
    const sessionId = getChatSessionId();
    if (!uid) {
      toast.error("Please login to use chat.");
      return;
    }
    const userMsg = inputValue.trim();

    const newMessages = [
      ...chatMessages,
      { role: "user" as const, content: userMsg },
    ];
    setChatMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const data = await apiFetch(`/chat/${uid}/${sessionId}`, {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
      setChatMessages([
        ...newMessages,
        { role: "bot", content: data.response ?? "I didn't get that. Try rephrasing." },
      ]);
    } catch (err: any) {
      toast.error("Chat failed — check your connection");
      setChatMessages([
        ...newMessages,
        { role: "bot", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chatbot Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-[80px] right-0 h-[calc(100%-80px)] w-[400px] bg-white border-l border-t border-border shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col rounded-tl-3xl",
          isChatOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Bot size={18} className="text-background" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">FinPilot AI</p>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Strategy Advisor</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:rotate-90 transition-transform p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {chatMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <MessageSquare size={40} className="mb-4" />
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
                msg.role === "user" ? "bg-foreground text-background" : "bg-secondary text-foreground"
              )}>
                {msg.content}
              </div>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-1">
                {msg.role === "user" ? "You" : "FinPilot"}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-2 animate-in fade-in">
              <div className="bg-secondary p-4 rounded-2xl flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-border bg-secondary/30 flex items-center gap-3 shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your spending…"
            disabled={isTyping}
            className="flex-grow bg-white border border-border px-4 py-3 text-xs font-medium rounded-full focus:outline-none focus:ring-1 focus:ring-foreground transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="bg-foreground text-background p-3 rounded-full hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        ref={toggleRef}
        onClick={() => setIsChatOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40 overflow-hidden",
          isChatOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        )}
      >
        <BorderBeam colorFrom="#fff" colorTo="#fff" size={50} duration={4} />
        <MessageSquare size={24} className="relative z-10" />
      </button>
    </>
  );
}
