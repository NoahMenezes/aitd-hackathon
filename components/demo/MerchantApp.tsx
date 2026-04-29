"use client";

import React, { useState } from 'react';
import { ShoppingBag, Star, Clock, MapPin, Search } from 'lucide-react';

export const MerchantApp = () => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/add-mock-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: "SWIGGY",
          amount: 450.0
        })
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Order Placed! Check your FinPilot Dashboard for real-time insights.");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Backend not running? Make sure FastAPI is on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 h-[700px] flex flex-col relative group">
      {/* Phone Status Bar */}
      <div className="h-10 px-8 flex items-center justify-between text-[11px] font-bold">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-black rounded-full" />
          <div className="w-4 h-2 bg-black rounded-sm" />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-orange-500" />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold">Home</span>
              <Star size={10} className="fill-black" />
            </div>
            <p className="text-[10px] text-muted-foreground truncate w-32">Indiranagar, Bangalore...</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Search size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-secondary/50 rounded-2xl px-4 py-3 flex items-center gap-3 text-muted-foreground">
          <Search size={18} />
          <span className="text-[13px]">Search for 'Biryani'</span>
        </div>

        {/* Promo */}
        <div className="bg-orange-500 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold italic tracking-tighter">60% OFF</h3>
            <p className="text-[11px] font-medium opacity-90">Up to ₹120 on your first order</p>
            <button className="mt-4 bg-white text-orange-500 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Order Now</button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        {/* Merchant Card */}
        <div className="space-y-4">
          <div className="aspect-video w-full bg-secondary rounded-3xl overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop" 
              alt="Pizza" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Promoted</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold">Pizza Hut</h4>
              <p className="text-xs text-muted-foreground italic">Pizzas, Fast Food, Beverages</p>
            </div>
            <div className="bg-green-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
              <span className="text-xs font-bold">4.2</span>
              <Star size={10} className="fill-white" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-medium border-y border-border/30 py-3">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-green-600" />
              <span>30-35 mins</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
            <span>₹200 for two</span>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Bar */}
      <div className="p-6 bg-white border-t border-border/50">
        <div className="bg-black text-white p-4 rounded-3xl flex items-center justify-between shadow-2xl transition-transform active:scale-95 group-hover:shadow-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium opacity-70">1 Item • Total ₹450</p>
              <p className="text-[13px] font-bold">Checkout</p>
            </div>
          </div>
          <button 
            onClick={handlePurchase}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-muted px-6 py-2.5 rounded-2xl text-[13px] font-bold transition-all shadow-lg"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* Floating Indicator */}
      <div className="absolute top-1/2 left-0 w-1 h-12 bg-orange-500 rounded-r-full -translate-y-1/2" />
    </div>
  );
};
