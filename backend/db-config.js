import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: true,
  max: 5,
  idleTimeoutMillis: 30000,
});

export default pool;
