import { Pool } from 'pg';

const dbConnect = new Pool({
  user: process.env.PG_DB_USER,
  host: process.env.PG_DB_HOST,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_DB_PASSWORD,
  port: parseInt(process.env.PG_DB_PORT ?? "6543"),
});

export default dbConnect;