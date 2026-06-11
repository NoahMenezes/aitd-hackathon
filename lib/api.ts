import { clearAuth, getToken } from "./auth";

// Use ngrok URL from environment, fallback to localhost for development
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string,
) {
  const authToken = token ?? getToken() ?? undefined;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // skip ngrok warning page
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized — redirecting to login");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  // Handle empty responses (e.g. 204 No Content)
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return res.json();
}
