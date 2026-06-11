import { apiFetch } from "./api";
import { getUserId } from "./auth";

/**
 * SumoFinance API Client
 * Centralized service for all 34 endpoints.
 */

const getUid = () => {
  const uid = getUserId();
  if (!uid) {
    // If we're on the client and don't have a UID, it might be a public page or login
    // but most of these need a UID.
    return "";
  }
  return uid;
};

// --- 1. Authentication Endpoints (/auth) ---

export const authApi = {
  register: (data: any) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  verify2fa: (data: { user_id: string; otp_code: string }) => apiFetch("/auth/verify-2fa", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  login2fa: (data: { user_id: string; otp_code: string }) => apiFetch("/auth/login/2fa", { method: "POST", body: JSON.stringify(data) }),
};

// --- 2. Dashboard Endpoints (/dashboard) ---

export const dashboardApi = {
  getSummary: (uid: string = getUid()) => apiFetch(`/dashboard/summary/${uid}`),
  getSpendingTrend: (view: "daily" | "weekly" | "monthly" = "monthly", uid: string = getUid()) => 
    apiFetch(`/dashboard/spending-trend/${uid}?view=${view}`),
  getAlerts: (uid: string = getUid()) => apiFetch(`/dashboard/alerts/${uid}`),
  getDashboardState: (uid: string = getUid()) => apiFetch(`/dashboard/${uid}`), // Legacy
};

// --- 3. Insights & Analytics (/insights) ---

export const insightsApi = {
  getCategoryBreakdown: (period?: string, uid: string = getUid()) => 
    apiFetch(`/insights/category-breakdown/${uid}${period ? `?period=${period}` : ""}`),
  getAiObservations: (uid: string = getUid()) => apiFetch(`/insights/ai-observations/${uid}`),
  getComparison: (current: string, previous: string, uid: string = getUid()) => 
    apiFetch(`/insights/comparison/${uid}?current=${current}&previous=${previous}`),
  getMerchantAnalysis: (period?: string, uid: string = getUid()) => 
    apiFetch(`/insights/merchant-analysis/${uid}${period ? `?period=${period}` : ""}`),
  getAnomalies: (period?: string, uid: string = getUid()) => 
    apiFetch(`/insights/anomalies/${uid}${period ? `?period=${period}` : ""}`),
};

// --- 4. Recommendations (/recommendations) ---

export const recommendationsApi = {
  getList: (plan: "easy" | "moderate" | "aggressive" = "moderate", uid: string = getUid()) => 
    apiFetch(`/recommendations/list/${uid}?plan=${plan}`),
  selectPlan: (plan: string, uid: string = getUid()) => 
    apiFetch(`/recommendations/select-plan/${uid}`, { method: "POST", body: JSON.stringify({ plan }) }),
  getStrategySummary: (uid: string = getUid()) => apiFetch(`/recommendations/strategy-summary/${uid}`),
  getHistory: (status?: string, uid: string = getUid()) => 
    apiFetch(`/recommendations/history/${uid}${status ? `?status=${status}` : ""}`),
  getSchemes: (uid: string = getUid()) => apiFetch(`/recommendations/schemes/${uid}`),
};

// --- 5. Simulation & Forecasting (/simulation) ---

export const simulationApi = {
  run: (data: { category: string; target_reduction: number; time_horizon_months: number }, uid: string = getUid()) => 
    apiFetch(`/simulation/run/${uid}`, { method: "POST", body: JSON.stringify(data) }),
  whatIfNotFollowed: (recommendation_id: string, uid: string = getUid()) => 
    apiFetch(`/simulation/what-if-not-followed/${uid}`, { method: "POST", body: JSON.stringify({ recommendation_id }) }),
  getPrediction: (uid: string = getUid()) => apiFetch(`/simulation/prediction/${uid}`),
  interactive: (data: { category: string; slider_value: number }, uid: string = getUid()) => 
    apiFetch(`/simulation/interactive/${uid}`, { method: "POST", body: JSON.stringify(data) }),
};

// --- 6. Conversational AI (/chat) ---

export const chatApi = {
  sendMessage: (message: string, sessionId: string, uid: string = getUid()) => 
    apiFetch(`/chat/${uid}/${sessionId}`, { method: "POST", body: JSON.stringify({ message }) }),
  resetSession: (uid: string = getUid()) => apiFetch(`/chat/${uid}/reset-session`, { method: "POST" }),
};

// --- 7. Goals Management (/goals) ---

export const goalsApi = {
  create: (data: { name: string; target_amount: number; start_date: string; end_date: string }, uid: string = getUid()) => 
    apiFetch(`/goals/${uid}`, { method: "POST", body: JSON.stringify(data) }),
  update: (goalId: string, data: { target_amount?: number; end_date?: string }, uid: string = getUid()) => 
    apiFetch(`/goals/${uid}/${goalId}`, { method: "PATCH", body: JSON.stringify(data) }),
  pause: (goalId: string, action: "pause" | "unpause", uid: string = getUid()) => 
    apiFetch(`/goals/${uid}/${goalId}/pause`, { method: "POST", body: JSON.stringify({ action }) }),
  getProgress: (uid: string = getUid()) => apiFetch(`/progress/${uid}`),
};

// --- 8. Nudges & Notifications (/nudges) ---

export const nudgesApi = {
  getList: (unreadOnly: boolean = false, uid: string = getUid()) => 
    apiFetch(`/nudges/${uid}?unread_only=${unreadOnly}`),
  getUnreadCount: (uid: string = getUid()) => apiFetch(`/nudges/${uid}/unread-count`),
  markAsRead: (nudgeId: string, uid: string = getUid()) => 
    apiFetch(`/nudges/${uid}/${nudgeId}/read`, { method: "POST" }),
};

// --- 9. Transactions & Admin (/transaction, /features, /seed) ---

export const transactionsApi = {
  record: (data: { merchant: string; amount: number; category: string; type: string }, uid: string = getUid()) => 
    apiFetch(`/transaction/${uid}`, { method: "POST", body: JSON.stringify(data) }),
  list: (params: { start?: string; end?: string; category?: string; limit?: number } = {}, uid: string = getUid()) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/transactions/${uid}${query ? `?${query}` : ""}`);
  },
};

export const adminApi = {
  getFeatures: (uid: string = getUid()) => apiFetch(`/features/${uid}`),
  toggleFeature: (flag: string, enabled: boolean, uid: string = getUid()) => 
    apiFetch(`/features/${uid}/${flag}`, { method: "PATCH", body: JSON.stringify({ enabled }) }),
  seed: (uid: string = getUid()) => apiFetch(`/seed/${uid}`, { method: "POST" }),
  createUser: (data: any) => apiFetch("/users", { method: "POST", body: JSON.stringify(data) }), // Legacy
};
