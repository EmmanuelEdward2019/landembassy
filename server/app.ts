import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes.js";
import { log } from "./log.js";

// Builds the Express app without listening, so it can run both as a long-lived
// server (server/index.ts) and as a Vercel serverless function (api/index.ts).
export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  // Behind exactly one proxy (Vercel / Replit) so rate limiting sees the real client IP
  app.set("trust proxy", 1);

  app.use(
    helmet({
      // The CSP for HTML pages is set where the pages are served (vercel.json /
      // serveStatic); in development it would block Vite's HMR client.
      contentSecurityPolicy: false,
    }),
  );
  app.use(express.json({ limit: "20kb" }));
  app.use(express.urlencoded({ extended: false, limit: "20kb" }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;

    res.on("finish", () => {
      if (path.startsWith("/api")) {
        // Bodies are deliberately not logged: they contain customer PII
        log(`${req.method} ${path} ${res.statusCode} in ${Date.now() - start}ms`);
      }
    });

    next();
  });

  registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    // Don't leak internal error details to clients
    const message = status < 500 ? err.message || "Bad Request" : "Internal Server Error";

    if (status >= 500) {
      console.error(err);
    }
    res.status(status).json({ error: message });
  });

  return app;
}
