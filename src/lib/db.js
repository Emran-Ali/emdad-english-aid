// src/lib/db.js
import { drizzle } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';

// Set up PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure this is set in .env file
});

const db = drizzle(pool);

export { db };
