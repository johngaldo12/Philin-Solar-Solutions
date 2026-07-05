import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

const ADMIN_USERNAME = process.env["ADMIN_USERNAME"];
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error(
    "ADMIN_USERNAME and ADMIN_PASSWORD must be set. Configure them in the Secrets panel.",
  );
}

function checkPassword(plain: string): boolean {
  return plain === ADMIN_PASSWORD;
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
