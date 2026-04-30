export const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("sumo_token") : null;

export const setToken = (t: string): void =>
  localStorage.setItem("sumo_token", t);

export const getUserId = (): string | null =>
  typeof window !== "undefined" ? (localStorage.getItem("sumo_user_id") || "testuser") : null;

export const setUserId = (id: string): void =>
  localStorage.setItem("sumo_user_id", id);

export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sumo_token");
  localStorage.removeItem("sumo_user_id");
};

export const isAuthenticated = (): boolean =>
  typeof window !== "undefined" && !!localStorage.getItem("sumo_token");

// Chat session ID — resets on tab close (sessionStorage)
export const getChatSessionId = (): string => {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("sumo_chat_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("sumo_chat_session", id);
  }
  return id;
};
