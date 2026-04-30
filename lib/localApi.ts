const LOCAL_BASE = "http://localhost:8000";

export async function localFetch(
  path: string,
  options: RequestInit = {}
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const res = await fetch(`${LOCAL_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SandInsight error ${res.status}: ${text}`);
  }
  return res.json();
}
