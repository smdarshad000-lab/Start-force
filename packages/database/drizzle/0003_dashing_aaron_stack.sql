ALTER TABLE "ideas" ADD COLUMN "technology_approach" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "technology_domain" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "technology_readiness" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "required_technology" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "existing_implementation" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "validation_method" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "validation_audience" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "validation_sample_size" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "validation_findings" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "validation_evidence" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "collaboration_needs" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "funding" jsonb DEFAULT '{"needsFunding":"","amount":"","type":"","purpose":"","resources":[]}'::jsonb NOT NULL;