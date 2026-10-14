import type { Request, Response, NextFunction } from "express";
import { createHash, timingSafeEqual } from "crypto";

const MIN_TOKEN_LENGTH = 24;

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

// Read at request time so tests and serverless cold starts pick up the current env.
function getAdminToken(): string | null {
  const token = process.env.ADMIN_TOKEN;
  return token && token.length >= MIN_TOKEN_LENGTH ? token : null;
}

export function requireAdminToken(req: Request, res: Response, next: NextFunction) {
  const adminToken = getAdminToken();
  if (!adminToken) {
    // Fail closed: no admin access until a strong ADMIN_TOKEN is configured.
    return res.status(503).json({ error: "Admin access is not configured" });
  }

  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";

  // Compare fixed-length digests so neither length nor content leaks via timing.
  if (!token || !timingSafeEqual(digest(token), digest(adminToken))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
