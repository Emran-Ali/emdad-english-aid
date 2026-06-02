CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"student_name" varchar(255) NOT NULL,
	"student_email" varchar(255) NOT NULL,
	"contact_number" varchar(20) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer,
	"reviewer_name" varchar(255) NOT NULL,
	"reviewer_handle" varchar(255),
	"content" text NOT NULL,
	"rating" integer DEFAULT 5,
	"is_shown" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "success_stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_name" varchar(255) NOT NULL,
	"university" varchar(255) NOT NULL,
	"department" varchar(255) NOT NULL,
	"session" varchar(50) NOT NULL,
	"image" varchar(255),
	"is_shown" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"image" varchar(255),
	"bio" text,
	"order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "batches" ADD COLUMN "is_accepting_students" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;