import { createApp } from "../server/app.js";

// Vercel serverless entry: vercel.json rewrites /api/* here, and Express
// routes on the original URL.
export default createApp();
