const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${configuredApiUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function mediaUrl(path: string): string {
  return path.startsWith("/api/") ? apiUrl(path) : path;
}