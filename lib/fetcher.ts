import type { ApiEnvelope } from "./cricket-types";

export async function Fetcher<T>(url: string): Promise<ApiEnvelope<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return (await res.json()) as ApiEnvelope<T>;
}

export async function FetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    // Surface readable error to SWR
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}
