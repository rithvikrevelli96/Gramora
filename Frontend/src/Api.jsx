// API base URL used by axios calls across the app.
// Prefer Vite env var if provided; otherwise fall back to localhost.
export const API =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:8000";
