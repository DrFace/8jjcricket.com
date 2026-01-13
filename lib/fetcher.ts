import type { ApiEnvelope } from "./cricket-types";

export async function Fetcher<T>(url: string): Promise<ApiEnvelope<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return (await res.json()) as ApiEnvelope<T>;
}
