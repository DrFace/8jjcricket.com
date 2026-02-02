import { DEFAULT_API_BASE } from "./constant";

export function formatDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FormatDateToArchive(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function ApiBase() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE).replace(
    /\/+$/,
    "",
  );
}

export function URLNormalize(url: string, path: string) {
  if (!url) return "";

  // If URL is already absolute, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const apiBase = ApiBase(); // e.g., http://127.0.0.1:8000/api

  // Remove trailing slash from apiBase
  const cleanApiBase = apiBase.replace(/\/$/, "");

  // Remove leading slash from url
  const cleanUrl = url.replace(/^\/+/, "");

  // If the URL comes from API endpoint (like audios/...), map to storage
  // e.g., audios/abc.png -> /storage/path/..
  const storagePath = cleanUrl.startsWith(`${path}/`)
    ? `/storage/${cleanUrl}`
    : `/${cleanUrl}`;

  return `${cleanApiBase.replace(/\/api$/, "")}${storagePath}`;
}
