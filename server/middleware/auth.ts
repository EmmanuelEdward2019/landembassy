import type { Request, Response, NextFunction } from "express";

const ADMIN_TOKEN = "LANDEMBASSY2024ADMIN";

export function requireAdminToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  next();
}
