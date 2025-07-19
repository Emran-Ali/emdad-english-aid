CREATE TYPE "public"."day" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'student', 'stuff');--> statement-breakpoint
CREATE TABLE "batch_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"day_per_week" integer DEFAULT 3 NOT NULL,
	"days" "day"[] NOT NULL,
	CONSTRAINT "batch_day_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "batch" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"students" integer NOT NULL,
	"year" integer NOT NULL,
	"batch_time" time,
	"batch_day_id" integer,
	"type" varchar(100),
	"status" boolean,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "batch_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_photo" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact_number" varchar(20),
	"password" varchar(255),
	"address" varchar(255),
	"roleId" "role" DEFAULT 'user',
	"provider" varchar(50) DEFAULT 'credentials',
	"google_id" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "batch" ADD CONSTRAINT "batch_batch_day_id_batch_day_id_fk" FOREIGN KEY ("batch_day_id") REFERENCES "public"."batch_day"("id") ON DELETE no action ON UPDATE no action;