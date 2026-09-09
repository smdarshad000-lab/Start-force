ALTER TABLE "ideas" ADD COLUMN "status" text DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "current_step" integer DEFAULT 1 NOT NULL;