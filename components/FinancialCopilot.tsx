"use client";

import React, { useState } from "react";

const FinancialCopilot = () => {
  const [activeScreen, setActiveScreen] = useState("home");

  const showScreen = (id: string) => {
    setActiveScreen(id);
  };

  const updateSim = (val: number) => {
    // Update simulation values based on slider
    // For now, static
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="screen-nav flex gap-2 mb-6 flex-wrap">
          <button
            className={`nav-btn px-4 py-2 rounded-full border text-sm transition-all ${
              activeScreen === "home"
                ? "bg-white text-black border-gray-300 font-medium"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => showScreen("home")}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn px-4 py-2 rounded-full border text-sm transition-all ${
              activeScreen === "insights"
                ? "bg-white text-black border-gray-300 font-medium"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => showScreen("insights")}
          >
            Spending insights
          </button>
          <button
            className={`nav-btn px-4 py-2 rounded-full border text-sm transition-all ${
              activeScreen === "simulate"
                ? "bg-white text-black border-gray-300 font-medium"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => showScreen("simulate")}
          >
            Simulation
          </button>
          <button
            className={`nav-btn px-4 py-2 rounded-full border text-sm transition-all ${
              activeScreen === "recs"
                ? "bg-white text-black border-gray-300 font-medium"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => showScreen("recs")}
          >
            Recommendations
          </button>
        </div>

        {/* Dashboard Screen */}
        {activeScreen === "home" && (
          <div className="screen">
            <p className="text-xs text-gray-500 mb-4">April 2026</p>

            <div className="metric-row grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="metric bg-white rounded-lg p-4 border border-gray-200">
                <div className="metric-label text-xs text-gray-500 mb-1">Total spent</div>
                <div className="metric-value text-2xl font-medium text-black">₹21,400</div>
                <div className="metric-sub text-xs text-gray-400">this month</div>
              </div>
              <div className="metric bg-white rounded-lg p-4 border border-gray-200">
                <div className="metric-label text-xs text-gray-500 mb-1">You could save</div>
                <div className="metric-value text-2xl font-medium text-green-600">₹5,200</div>
                <div className="metric-sub text-xs text-gray-400">per month</div>
              </div>
              <div className="metric bg-white rounded-lg p-4 border border-gray-200">
                <div className="metric-label text-xs text-gray-500 mb-1">Savings rate</div>
                <div className="metric-value text-2xl font-medium text-black">12%</div>
                <div className="metric-sub text-xs text-gray-400">avg is 20%</div>
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-lg p-5 mb-4">
              <div className="text-lg font-medium text-black mb-2">You are spending a lot on food</div>
              <div className="text-sm text-gray-600 mb-4">Food takes up 35% of your monthly spend — higher than usual.</div>
              <button
                className="nav-btn bg-white text-black border border-gray-300 px-4 py-2 rounded-full text-sm font-medium"
                onClick={() => showScreen("simulate")}
              >
                See how to improve →
              </button>
            </div>

            <div className="no-change-box bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800 mb-1">If you don't change anything...</p>
              <p className="text-sm text-red-700">You'll spend ₹2,56,800 on food alone this year.</p>
            </div>
          </div>
        )}

        {/* Insights Screen */}
        {activeScreen === "insights" && (
          <div className="screen">
            <div className="card bg-white border border-gray-200 rounded-lg p-5 mb-4">
              <div className="card-title text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Where your money goes</div>
              <div className="space-y-3">
                <div className="bar-row flex items-center gap-3">
                  <span className="bar-label text-xs text-gray-600 w-20">Food</span>
                  <div className="bar-track flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bar-fill h-full bg-yellow-500" style={{ width: "72%" }}></div>
                  </div>
                  <span className="bar-amount text-xs font-medium text-black w-16 text-right">₹7,500</span>
                </div>
                <div className="bar-row flex items-center gap-3">
                  <span className="bar-label text-xs text-gray-600 w-20">Shopping</span>
                  <div className="bar-track flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bar-fill h-full bg-blue-500" style={{ width: "48%" }}></div>
                  </div>
                  <span className="bar-amount text-xs font-medium text-black w-16 text-right">₹4,900</span>
                </div>
                <div className="bar-row flex items-center gap-3">
                  <span className="bar-label text-xs text-gray-600 w-20">Transport</span>
                  <div className="bar-track flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bar-fill h-full bg-green-500" style={{ width: "28%" }}></div>
                  </div>
                  <span className="bar-amount text-xs font-medium text-black w-16 text-right">₹2,800</span>
                </div>
                <div className="bar-row flex items-center gap-3">
                  <span className="bar-label text-xs text-gray-600 w-20">Subscriptions</span>
                  <div className="bar-track flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bar-fill h-full bg-pink-500" style={{ width: "20%" }}></div>
                  </div>
                  <span className="bar-amount text-xs font-medium text-black w-16 text-right">₹2,100</span>
                </div>
                <div className="bar-row flex items-center gap-3">
                  <span className="bar-label text-xs text-gray-600 w-20">Others</span>
                  <div className="bar-track flex-1 h-2 bg-gray-400 rounded-full overflow-hidden">
                    <div className="bar-fill h-full bg-gray-500" style={{ width: "14%" }}></div>
                  </div>
                  <span className="bar-amount text-xs font-medium text-black w-16 text-right">₹1,400</span>
                </div>
              </div>
            </div>

            <div className="card-title text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">What we noticed</div>
            <div className="space-y-3">
              <div className="insight-card border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded">
                <div className="insight-title text-sm font-medium text-yellow-900 mb-1">Weekend food spike</div>
                <div className="insight-body text-xs text-yellow-800">You spend 2x more on food on weekends vs weekdays</div>
              </div>
              <div className="insight-card border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded">
                <div className="insight-title text-sm font-medium text-yellow-900 mb-1">Subscriptions you may not use</div>
                <div className="insight-body text-xs text-yellow-800">3 recurring charges detected with low usage patterns</div>
              </div>
              <div className="insight-card border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                <div className="insight-title text-sm font-medium text-blue-900 mb-1">Shopping is rising</div>
                <div className="insight-body text-xs text-blue-800">Up 18% compared to last month</div>
              </div>
              <div className="insight-card border-l-4 border-green-500 bg-green-50 p-3 rounded">
                <div className="insight-title text-sm font-medium text-green-900 mb-1">Transport is in control</div>
                <div className="insight-body text-xs text-green-800">Steady spend — no action needed here</div>
              </div>
            </div>
          </div>
        )}

        {/* Simulation Screen */}
        {activeScreen === "simulate" && (
          <div className="screen">
            <div className="card bg-white border border-gray-200 rounded-lg p-5">
              <div className="card-title text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">What if you reduce food spending?</div>

              <div className="sim-control mb-6">
                <div className="sim-label-row flex justify-between items-center mb-2">
                  <span className="sim-label text-sm font-medium text-black">Reduce food by</span>
                  <span className="sim-pct text-sm font-medium text-blue-600">20%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  defaultValue="20"
                  step="5"
                  className="w-full"
                  onChange={(e) => updateSim(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="result-box flex justify-between items-center bg-gray-100 border border-gray-200 rounded-lg p-4 mb-2">
                <span className="result-label text-sm text-gray-600">Monthly saving</span>
                <span className="result-val text-lg font-medium text-green-600">₹1,500</span>
              </div>
              <div className="result-box flex justify-between items-center bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4">
                <span className="result-label text-sm text-gray-600">Yearly saving</span>
                <span className="result-val text-lg font-medium text-green-600">₹18,000</span>
              </div>

              <div className="divider h-px bg-gray-200 my-4"></div>
              <div className="card-title text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Compare plans</div>
              <div className="plan-grid grid grid-cols-3 gap-3 mb-4">
                <div className="plan-card border border-gray-200 rounded-lg p-3 text-center">
                  <span className="plan-tag bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mb-2 inline-block">Easy</span>
                  <div className="plan-saving text-base font-medium text-black mb-1">₹9k/yr</div>
                  <div className="plan-change text-xs text-gray-600 mb-2">10% cut</div>
                  <div className="prob-bar h-1 bg-gray-200 rounded-full overflow-hidden mb-1">
                    <div className="prob-fill h-full bg-green-500" style={{ width: "90%" }}></div>
                  </div>
                  <div className="text-xs text-gray-400">90% likely</div>
                </div>
                <div className="plan-card border-2 border-blue-300 rounded-lg p-3 text-center">
                  <span className="plan-tag bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2 inline-block">Best fit</span>
                  <div className="plan-saving text-base font-medium text-black mb-1">₹18k/yr</div>
                  <div className="plan-change text-xs text-gray-600 mb-2">20% cut</div>
                  <div className="prob-bar h-1 bg-gray-200 rounded-full overflow-hidden mb-1">
                    <div className="prob-fill h-full bg-blue-500" style={{ width: "65%" }}></div>
                  </div>
                  <div className="text-xs text-blue-600">65% likely</div>
                </div>
                <div className="plan-card border border-gray-200 rounded-lg p-3 text-center">
                  <span className="plan-tag bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full mb-2 inline-block">Hard</span>
                  <div className="plan-saving text-base font-medium text-black mb-1">₹27k/yr</div>
                  <div className="plan-change text-xs text-gray-600 mb-2">30% cut</div>
                  <div className="prob-bar h-1 bg-gray-200 rounded-full overflow-hidden mb-1">
                    <div className="prob-fill h-full bg-yellow-500" style={{ width: "25%" }}></div>
                  </div>
                  <div className="text-xs text-gray-400">25% likely</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-100 rounded-lg p-3">
                Based on your past behavior, you usually follow moderate changes. The <strong>20% plan</strong> balances savings and consistency.
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Screen */}
        {activeScreen === "recs" && (
          <div className="screen">
            <p className="text-sm text-gray-600 mb-4">Ranked by impact on your finances</p>
            <div className="card bg-white border border-gray-200 rounded-lg p-5 mb-4">
              <div className="rec-item flex items-start gap-3 py-3 border-b border-gray-200">
                <div className="rec-rank w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs font-medium">1</div>
                <div className="rec-body flex-1">
                  <div className="rec-title text-sm font-medium text-black mb-1">Reduce food ordering</div>
                  <div className="rec-desc text-xs text-gray-600 mb-1">Cut 2 Swiggy/Zomato orders per week</div>
                  <div className="rec-impact text-xs font-medium text-green-600 mb-2">Saves ₹18,000/year</div>
                  <button className="why-btn text-xs text-blue-600 border border-blue-300 bg-transparent rounded-full px-3 py-1">Why this? ↗</button>
                </div>
              </div>
              <div className="rec-item flex items-start gap-3 py-3 border-b border-gray-200">
                <div className="rec-rank w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                <div className="rec-body flex-1">
                  <div className="rec-title text-sm font-medium text-black mb-1">Cancel unused subscriptions</div>
                  <div className="rec-desc text-xs text-gray-600 mb-1">3 recurring charges with low usage detected</div>
                  <div className="rec-impact text-xs font-medium text-green-600 mb-2">Saves ₹7,200/year</div>
                  <button className="why-btn text-xs text-blue-600 border border-blue-300 bg-transparent rounded-full px-3 py-1">Why this? ↗</button>
                </div>
              </div>
              <div className="rec-item flex items-start gap-3 py-3">
                <div className="rec-rank w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium">3</div>
                <div className="rec-body flex-1">
                  <div className="rec-title text-sm font-medium text-black mb-1">Set a weekend shopping limit</div>
                  <div className="rec-desc text-xs text-gray-600 mb-1">Your shopping spikes on weekends — a small cap helps</div>
                  <div className="rec-impact text-xs font-medium text-green-600 mb-2">Saves ₹4,800/year</div>
                  <button className="why-btn text-xs text-blue-600 border border-blue-300 bg-transparent rounded-full px-3 py-1">Why this? ↗</button>
                </div>
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-lg p-5">
              <div className="card-title text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Your total potential</div>
              <div className="text-3xl font-medium text-green-600 mb-1">₹30,000/year</div>
              <div className="text-sm text-gray-600 mb-4">If you follow all 3 recommendations</div>
              <div className="divider h-px bg-gray-200 my-4"></div>
              <button className="nav-btn bg-white text-black border border-gray-300 px-4 py-2 rounded-full text-sm font-medium">
                Start saving plan →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialCopilot;
