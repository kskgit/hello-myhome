CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"annual_income" integer NOT NULL,
	"savings" integer NOT NULL,
	"interest_rate" numeric(4, 2) NOT NULL,
	"loan_term_years" integer NOT NULL,
	"down_payment_ratio" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profiles_created_at_idx" ON "profiles" USING btree ("created_at" DESC NULLS LAST);