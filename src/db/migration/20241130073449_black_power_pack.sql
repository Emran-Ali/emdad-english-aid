CREATE TABLE IF NOT EXISTS "batch" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"students" integer NOT NULL,
	"year" integer NOT NULL,
	"batch_time" time,
	"batch_days" integer,
	"type" varchar(100),
	"status" boolean,
	CONSTRAINT "batch_id_unique" UNIQUE("id")
);
