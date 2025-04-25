import {defineConfig} from  'drizzle-kit';
import 'dotenv/config'

export default defineConfig({
    dialect: "postgresql",
    schema:"./src/db/schema/schema.js",
    out: "./src/db/migration",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    migrations: {
        prefix: "timestamp",
        table: "__drizzle_migrations__",
        schema: "public",
    },
    verbose: true,
    strict: true,
});
