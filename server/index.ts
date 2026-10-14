import { createServer } from "http";
import { createApp } from "./app.js";
import { log } from "./log.js";

(async () => {
  const app = createApp();
  const server = createServer(app);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
  } else {
    const { serveStatic } = await import("./vite.js");
    serveStatic(app);
  }

  // Serves both the API and the client on PORT (default 5000)
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    // SO_REUSEPORT is Linux-only; macOS rejects it with ENOTSUP
    reusePort: process.platform === "linux",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
