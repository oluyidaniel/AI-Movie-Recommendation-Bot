import "dotenv/config";

export const config = {
  port:           parseInt(process.env.PORT || "5000", 10),
  nodeEnv:        process.env.NODE_ENV || "development",
  jwt: {
    secret:     process.env.JWT_SECRET || "dev_secret_change_in_prod",
    expiresIn:  process.env.JWT_EXPIRES_IN || "7d",
  },
  redis: {
    url:        process.env.REDIS_URL || "redis://localhost:6379",
  },
  llmService: {
    url:        process.env.LLM_SERVICE_URL || "http://localhost:8000",
  },
  frontend: {
    url:        process.env.FRONTEND_URL || "http://localhost:3000",
  },
  db: {
    path:       process.env.DB_PATH || "./db/cineai.db",
  },
};
