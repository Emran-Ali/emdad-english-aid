CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'excused');--> statement-breakpoint
CREATE TYPE "public"."batch_type" AS ENUM('hsc_1st_year', 'hsc_2nd_year', 'admission', 're_admission');--> statement-breakpoint
CREATE TYPE "public"."day" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');--> statement-breakpoint
CREATE TYPE "public"."exam_type" AS ENUM('weekly', 'monthly', 'midterm', 'final', 'practice');--> statement-breakpoint
CREATE TYPE "public"."expense_type" AS ENUM('salary', 'rent', 'utilities', 'materials', 'other');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'bank_transfer', 'mobile_banking', 'card');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'staff', 'student');--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"date" date NOT NULL,
	"status" "attendance_status" NOT NULL,
	"remarks" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "attendance_unique" UNIQUE("batch_id","student_id","date")
);
--> statement-breakpoint
CREATE TABLE "batch_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"day_of_week" "day" NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"room" varchar(50),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "batch_day_unique" UNIQUE("batch_id","day_of_week")
);
--> statement-breakpoint
CREATE TABLE "batch_staff_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"role" varchar(50) NOT NULL,
	"assigned_date" date DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "batch_staff_unique" UNIQUE("batch_id","staff_id")
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_code" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" "batch_type" NOT NULL,
	"academic_year" integer NOT NULL,
	"max_students" integer NOT NULL,
	"current_students" integer DEFAULT 0 NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"batch_time" time NOT NULL,
	"fees" numeric(10, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "batches_batch_code_unique" UNIQUE("batch_code")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"enrollment_date" date DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"completion_date" date,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "batch_student_unique" UNIQUE("batch_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "exam_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"marks_obtained" numeric(5, 2),
	"grade" varchar(10),
	"remarks" text,
	"is_absent" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "exam_student_unique" UNIQUE("exam_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"exam_type" "exam_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"exam_date" date NOT NULL,
	"total_marks" integer NOT NULL,
	"passing_marks" integer NOT NULL,
	"duration" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_type" "expense_type" NOT NULL,
	"description" varchar(500) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"expense_date" date NOT NULL,
	"batch_id" integer,
	"staff_id" integer,
	"receipt_number" varchar(100),
	"approved_by" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"related_id" integer,
	"related_type" varchar(50),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payment_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"enrollment_id" integer NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"number_of_installments" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_plan_id" integer NOT NULL,
	"installment_number" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"due_date" date NOT NULL,
	"paid_date" date,
	"payment_method" "payment_method",
	"transaction_id" varchar(100),
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"remarks" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"designation" varchar(100),
	"department" varchar(100),
	"joining_date" date NOT NULL,
	"salary" numeric(10, 2),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "staff_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "staff_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"student_id" varchar(50) NOT NULL,
	"guardian_name" varchar(255),
	"guardian_contact" varchar(20),
	"emergency_contact" varchar(20),
	"blood_group" varchar(10),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "students_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_photo" varchar(255),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact_number" varchar(20),
	"password" varchar(255),
	"address" varchar(500),
	"role" "role" DEFAULT 'student' NOT NULL,
	"provider" varchar(50) DEFAULT 'credentials',
	"google_id" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_schedules" ADD CONSTRAINT "batch_schedules_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_staff_assignments" ADD CONSTRAINT "batch_staff_assignments_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_staff_assignments" ADD CONSTRAINT "batch_staff_assignments_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_plan_id_payment_plans_id_fk" FOREIGN KEY ("payment_plan_id") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attendance_date_idx" ON "attendance" USING btree ("date");--> statement-breakpoint
CREATE INDEX "batch_type_idx" ON "batches" USING btree ("type");--> statement-breakpoint
CREATE INDEX "batch_year_idx" ON "batches" USING btree ("academic_year");--> statement-breakpoint
CREATE INDEX "enrollment_status_idx" ON "enrollments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "expense_date_idx" ON "expenses" USING btree ("expense_date");--> statement-breakpoint
CREATE INDEX "expense_type_idx" ON "expenses" USING btree ("expense_type");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_due_date_idx" ON "payments" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "role_idx" ON "users" USING btree ("role");