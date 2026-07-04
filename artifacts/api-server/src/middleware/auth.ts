import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

export const ADMIN_USERNAME = "Administrator";
export const ADMIN_PASSWORD = "Solar@2025!";

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
