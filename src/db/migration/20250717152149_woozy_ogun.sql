CREATE TYPE "public"."day" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'student', 'stuff');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "batch_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"day_per_week" integer DEFAULT 3 NOT NULL,
	"days" "day"[] NOT NULL,
	CONSTRAINT "batch_day_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
DROP TABLE "user_roles" CASCADE;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "batch_day_id" integer;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roleId" "role" DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "batch" ADD CONSTRAINT "batch_batch_day_id_batch_day_id_fk" FOREIGN KEY ("batch_day_id") REFERENCES "public"."batch_day"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "batch" DROP COLUMN IF EXISTS "batch_days";