export const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    //  "https://ivyway-api.onrender.com",
    "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  ivywayAIKey: process.env.NEXT_PUBLIC_IVYWAY_AI_KEY || "ivyway_ai_key_2024",
  ivywayWebURL:
    process.env.NEXT_PUBLIC_IVYWAY_WEB_URL || "http://localhost:8501",
};

export default API_CONFIG;
