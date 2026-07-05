/**
 * CORS / same-origin helpers for the API.
 *
 * Supports:
 * - REPLIT_DEV_DOMAIN (auto-added as https:// and http://)
 * - REPLIT_DOMAINS (comma-separated domain list, added as https:// and http://)
 * - APP_FRONTEND_ORIGINS (comma-separated full origins, e.g. https://example.com)
 * - localhost origins for local development
 */

export function normalizeOrigin(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    // Only keep scheme + host + port. URL.origin already does this.
    const origin = url.origin;
    if (origin === "null") return null;
    return origin;
  } catch {
    return null;
  }
}

export function parseOriginsEnv(raw: string): string[] {
  const origins: string[] = [];
  for (const part of raw.split(",")) {
    const normalized = normalizeOrigin(part);
    if (normalized) {
      origins.push(normalized);
    }
  }
  return origins;
}

let cachedAllowedOrigins: Set<string> | null = null;

export function getAllowedOrigins(): Set<string> {
  if (cachedAllowedOrigins) return cachedAllowedOrigins;

  const allowedOrigins = new Set<string>();

  const devDomain = process.env["REPLIT_DEV_DOMAIN"];
  if (devDomain) {
    const normalized = normalizeOrigin(`https://${devDomain}`);
    if (normalized) allowedOrigins.add(normalized);
    const normalizedHttp = normalizeOrigin(`http://${devDomain}`);
    if (normalizedHttp) allowedOrigins.add(normalizedHttp);
  }

  const rawDomains = process.env["REPLIT_DOMAINS"] || "";
  for (const d of rawDomains.split(",")) {
    const trimmed = d.trim();
    if (!trimmed) continue;
    const normalized = normalizeOrigin(`https://${trimmed}`);
    if (normalized) allowedOrigins.add(normalized);
    const normalizedHttp = normalizeOrigin(`http://${trimmed}`);
    if (normalizedHttp) allowedOrigins.add(normalizedHttp);
  }

  const rawCustomOrigins = process.env["APP_FRONTEND_ORIGINS"] || "";
  for (const o of parseOriginsEnv(rawCustomOrigins)) {
    allowedOrigins.add(o);
  }

  // Localhost for dev testing
  allowedOrigins.add("http://localhost");
  allowedOrigins.add("http://localhost:80");

  cachedAllowedOrigins = allowedOrigins;
  return allowedOrigins;
}

/**
 * Validate APP_FRONTEND_ORIGINS at startup and throw a clear error
 * if any entry is malformed. This prevents silent authz failures in production.
 */
export function validateAppFrontendOrigins(): void {
  const raw = process.env["APP_FRONTEND_ORIGINS"];
  if (!raw) return;
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (!normalizeOrigin(trimmed)) {
      throw new Error(
        `APP_FRONTEND_ORIGINS contains an invalid origin: "${trimmed}". Use full origins like https://example.com, separated by commas.`,
      );
    }
  }
}

export interface ParsedRequestOrigin {
  // The normalized origin, or null if the header was absent.
  origin: string | null;
  // True if a header was present but could not be parsed as a valid origin.
  invalid: boolean;
}

/**
 * Extract the origin from a request for same-origin checks.
 * - The Origin header is used when present and valid.
 * - If Origin is malformed, we fall back to a valid Referer header.
 * - The Referer header is a full URL, so we parse its origin.
 * - Returns { origin: null, invalid: false } when neither header is present.
 * - Returns { origin: null, invalid: true } when provided headers cannot produce a valid origin.
 */
export function getRequestOrigin(originHeader?: string, refererHeader?: string): ParsedRequestOrigin {
  if (originHeader) {
    const normalizedOrigin = normalizeOrigin(originHeader);
    if (normalizedOrigin) {
      return { origin: normalizedOrigin, invalid: false };
    }
    // Malformed Origin: try to fall back to Referer before marking invalid.
    if (refererHeader) {
      const normalizedReferer = normalizeOrigin(refererHeader);
      if (normalizedReferer) {
        return { origin: normalizedReferer, invalid: false };
      }
    }
    return { origin: null, invalid: true };
  }

  if (refererHeader) {
    const normalizedReferer = normalizeOrigin(refererHeader);
    return { origin: normalizedReferer, invalid: normalizedReferer === null };
  }

  return { origin: null, invalid: false };
}

export function isTrustedOrigin(
  parsed: ParsedRequestOrigin,
  allowedOrigins: Set<string>,
  requireOrigin = false,
): boolean {
  // Malformed headers are treated as untrusted.
  if (parsed.invalid) return false;
  // When requireOrigin is true, requests with no Origin/Referer are denied.
  // This is used for production hotlink protection on private storage objects.
  if (!parsed.origin) return !requireOrigin;
  // If an origin is present, it must be in the trusted set to prevent hotlinking.
  return allowedOrigins.has(parsed.origin);
}
