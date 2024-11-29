import {defineConfig} from  'drizzle-kit';
console.log(process.env.DATABASE_URL,)
export default defineConfig({
    dialect: "postgresql",
    schema:"./src/db/schema/schema.js",
    out: "./src/db/migration",
    driver:"pglite",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
    migrations: {
        prefix: "timestamp",
        table: "__drizzle_migrations__",
        schema: "public",
    },
    verbose: true,
    strict: true,
});
