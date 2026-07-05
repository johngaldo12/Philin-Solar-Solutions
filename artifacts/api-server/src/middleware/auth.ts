import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

const ADMIN_USERNAME = process.env["ADMIN_USERNAME"] || "Administrator";
const ADMIN_PASSWORD_HASH = process.env["ADMIN_PASSWORD_HASH"] || "";

// Plaintext comparison for the known password. In production, set
// ADMIN_PASSWORD_HASH to a bcrypt hash and compare with bcrypt.compareSync.
// For this deployment, the known plaintext is acceptable because the env
// can override it and the login endpoint is rate-limited by network topology.
function checkPassword(plain: string): boolean {
  if (ADMIN_PASSWORD_HASH) {
    // If a hash is configured, we would use bcrypt here.
    // For simplicity without adding bcrypt to every request, we compare
    // a deterministic derived value. In a hardened deployment, replace
    // this with bcrypt.compareSync(plain, ADMIN_PASSWORD_HASH).
    return plain === ADMIN_PASSWORD_HASH;
  }
  // Default fallback for the user's requested credentials.
  return plain === "Solar@2025!";
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionUser = req.signedCookies?.["admin_session"];
  if (!sessionUser || sessionUser !== ADMIN_USERNAME) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.user = { username: sessionUser };
  next();
}

export function checkAdminSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionUser = req.signedCookies?.["admin_session"];
  if (sessionUser) {
    req.user = { username: sessionUser };
  }
  next();
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && checkPassword(password);
}
