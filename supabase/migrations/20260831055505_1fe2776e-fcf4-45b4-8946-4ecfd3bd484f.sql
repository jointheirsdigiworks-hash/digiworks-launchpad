CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  headline text,
  intro text,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  og_image_url text,
  status text NOT NULL DEFAULT 'draft',
  publish_at timestamp with time zone,
  show_in_nav boolean NOT NULL DEFAULT false,
  show_in_footer boolean NOT NULL DEFAULT false,
  nav_label text,
  sort_order integer NOT NULL DEFAULT 0,
  preview_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pages_status_check CHECK (status IN ('draft', 'scheduled', 'published'))
);

GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read live pages"
  ON public.pages FOR SELECT TO anon
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));

CREATE POLICY "Staff can read all pages"
  ON public.pages FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'viewer')
    OR (status = 'published' AND (publish_at IS NULL OR publish_at <= now()))
  );

CREATE POLICY "Editors manage pages"
  ON public.pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.validate_page_schedule()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'scheduled' AND NEW.publish_at IS NULL THEN
    RAISE EXCEPTION 'A scheduled page needs a publish date and time.';
  END IF;
  IF NEW.status = 'published' AND NEW.publish_at IS NULL THEN
    NEW.publish_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER pages_validate_schedule
  BEFORE INSERT OR UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.validate_page_schedule();

CREATE INDEX pages_live_idx ON public.pages (status, publish_at);