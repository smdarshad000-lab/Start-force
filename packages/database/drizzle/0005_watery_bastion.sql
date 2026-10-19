DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'idea_access_idea_user_unique'
          AND conrelid = 'public.idea_access'::regclass
    ) THEN
        ALTER TABLE public.idea_access
        ADD CONSTRAINT idea_access_idea_user_unique
        UNIQUE (idea_id, user_id);
    END IF;
END
$$;