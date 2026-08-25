-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT 'Product title placeholder',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  cover_image_url text,
  cover_image_alt text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text NOT NULL DEFAULT 'Ebooks',
  product_type text NOT NULL DEFAULT 'ebook',
  currency text NOT NULL DEFAULT 'NGN',
  price numeric(12,2) NOT NULL DEFAULT 0,
  file_storage_path text,
  external_url text,
  download_limit integer,
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  purchase_count integer NOT NULL DEFAULT 0,
  download_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can read published products" ON public.products FOR SELECT TO anon, authenticated
  USING (published = true);
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ORDERS (no anon access; download access happens via server routes using the service role)
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_name text,
  buyer_email text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  kind text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'pending',
  provider text,
  provider_reference text,
  download_token text NOT NULL,
  token_expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  download_limit integer NOT NULL DEFAULT 5,
  download_count integer NOT NULL DEFAULT 0,
  ip_address text,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX orders_download_token_idx ON public.orders (download_token);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DOWNLOAD LOGS
CREATE TABLE public.download_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  outcome text NOT NULL DEFAULT 'allowed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.download_logs TO authenticated;
GRANT ALL ON public.download_logs TO service_role;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read download logs" ON public.download_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Store + effects settings (readable by everyone, editable by admins via existing site_settings policies)
INSERT INTO public.site_settings (key, value) VALUES
  ('store', '{"currency":"NGN","capture_email_for_free":true,"default_download_limit":5,"download_link_hours":168,"payment_provider":"paystack","payment_note":"Payment gateway keys are configured as backend secrets by the admin."}'::jsonb),
  ('effects', '{"cursor_orb":true,"hero_particles":true,"scroll_progress":true,"smooth_scroll":true,"reveal_animations":true,"hover_glow":true,"magnetic_buttons":true,"parallax_hero":true}'::jsonb),
  ('brand', '{"message":"Intelligence. Creativity. Growth."}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Placeholder catalogue (no invented pricing claims: all placeholder drafts priced 0)
INSERT INTO public.products (slug, title, short_description, full_description, category, product_type, currency, price, published, featured, sort_order, features)
VALUES
  ('ai-marketing-starter-ebook','Placeholder Ebook Title','Placeholder short description for a downloadable ebook on AI marketing.','Placeholder full description. Replace this text from the admin dashboard.','Ebooks','ebook','NGN',0,true,true,1,'["Placeholder inclusion one","Placeholder inclusion two","Placeholder inclusion three"]'::jsonb),
  ('brand-template-pack','Placeholder Template Pack','Placeholder short description for a template pack for entrepreneurs.','Placeholder full description. Replace this text from the admin dashboard.','Templates','template','NGN',0,true,false,2,'["Placeholder inclusion one","Placeholder inclusion two"]'::jsonb),
  ('growth-video-masterclass','Placeholder Video Product','Placeholder short description for a downloadable video product.','Placeholder full description. Replace this text from the admin dashboard.','Video','video','NGN',0,true,false,3,'["Placeholder inclusion one","Placeholder inclusion two"]'::jsonb),
  ('audio-brand-briefing','Placeholder Audio Product','Placeholder short description for a downloadable audio product.','Placeholder full description. Replace this text from the admin dashboard.','Audio','audio','NGN',0,true,false,4,'["Placeholder inclusion one"]'::jsonb);
