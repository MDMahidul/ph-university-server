import dotenv from "dotenv";

dotenv.config({});

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
};
