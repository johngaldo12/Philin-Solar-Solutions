import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// --- CORS: allow configured frontend origins and Replit development origins ---
const rawDomains = process.env["REPLIT_DOMAINS"] || "";
const devDomain = process.env["REPLIT_DEV_DOMAIN"] || "";
const configuredOrigins = process.env["CORS_ALLOWED_ORIGINS"] || "";
const allowedOrigins = new Set<string>();
if (devDomain) {
  allowedOrigins.add(`https://${devDomain}`);
  allowedOrigins.add(`http://${devDomain}`);
}
for (const d of rawDomains.split(",")) {
  const trimmed = d.trim();
  if (!trimmed) continue;
  allowedOrigins.add(`https://${trimmed}`);
  allowedOrigins.add(`http://${trimmed}`);
}
for (const origin of configuredOrigins.split(",")) {
  const trimmed = origin.trim();
  if (trimmed) allowedOrigins.add(trimmed.replace(/\/$/, ""));
}
// Localhost for dev testing
allowedOrigins.add("http://localhost");
allowedOrigins.add("http://localhost:80");

const corsOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  if (!origin || allowedOrigins.has(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error(`CORS blocked: ${origin}`));
};

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --- SESSION SECRET: fail hard if missing ---
const sessionSecret = process.env["SESSION_SECRET"];
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set. Configure it in the Secrets panel.");
}
app.use(cookieParser(sessionSecret));

app.use("/api", router);

export default app;
