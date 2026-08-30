ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text NOT NULL DEFAULT '',
  action text NOT NULL,
  resource text NOT NULL,
  record_id text,
  summary text NOT NULL DEFAULT '',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read activity log"
ON public.activity_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Signed in staff can write their own activity"
ON public.activity_log FOR INSERT TO authenticated
WITH CHECK (actor_id = auth.uid());

CREATE INDEX activity_log_created_at_idx ON public.activity_log (created_at DESC);