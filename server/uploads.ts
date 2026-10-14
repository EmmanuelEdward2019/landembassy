import type { Request, Response, NextFunction } from "express";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

// Vercel functions accept request bodies up to 4.5MB; the admin UI resizes
// images before upload so they stay well under this.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function uploadsEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Expects the raw image as the request body (express.raw), with its Content-Type.
export async function handleImageUpload(req: Request, res: Response, next: NextFunction) {
  if (!uploadsEnabled()) {
    return res.status(503).json({ error: "Image uploads are not configured (connect Vercel Blob)" });
  }

  const contentType = (req.headers["content-type"] ?? "").split(";")[0].trim();
  const extension = EXTENSIONS[contentType];
  if (!extension) {
    return res.status(415).json({ error: "Only JPEG, PNG and WebP images are supported" });
  }
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    return res.status(400).json({ error: "Empty upload" });
  }

  try {
    const blob = await put(`properties/${randomUUID()}.${extension}`, req.body, {
      access: "public",
      contentType,
    });
    res.status(201).json({ url: blob.url });
  } catch (error) {
    next(error);
  }
}
