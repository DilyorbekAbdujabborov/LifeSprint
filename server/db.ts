import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is required");
}

const pool = new Pool({ connectionString, max: 5 });

export const db = {
  async get(text: string, params: any[] = []) {
    const { rows } = await pool.query(text, params);
    return rows[0] as any | undefined;
  },
  async all(text: string, params: any[] = []) {
    const { rows } = await pool.query(text, params);
    return rows as any[];
  },
  async run(text: string, params: any[] = []) {
    await pool.query(text, params);
    return { changes: 1 };
  },
};

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export default db;
