CREATE TABLE "idea_access" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "idea_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "status" text DEFAULT 'PENDING' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idea_access"
ADD CONSTRAINT "idea_access_idea_id_ideas_id_fk"
FOREIGN KEY ("idea_id")
REFERENCES "public"."ideas"("id")
ON DELETE cascade
ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "idea_access"
ADD CONSTRAINT "idea_access_user_id_users_id_fk"
FOREIGN KEY ("user_id")
REFERENCES "public"."users"("id")
ON DELETE cascade
ON UPDATE no action;