import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import router from "./routes";
import { logger } from "./lib/logger";
import { getAllowedOrigins, validateAppFrontendOrigins } from "./lib/cors";

const app: Express = express();

// Validate custom origins early so misconfiguration fails fast
validateAppFrontendOrigins();

// --- CORS: lock to known Replit origins plus any custom frontend origins ---
const allowedOrigins = getAllowedOrigins();

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
