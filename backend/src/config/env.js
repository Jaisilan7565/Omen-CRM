require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,
  jwtSecret: process.env.JWT_SECRET || "jwt_secret",
  jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) || 86400,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  swaggerEnabled: process.env.SWAGGER_ENABLED === "true",
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || "crm_db",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "jayking46",
  },
};
