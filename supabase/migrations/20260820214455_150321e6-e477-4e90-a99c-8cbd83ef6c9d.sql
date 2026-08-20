-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  hero_image_url text,
  hero_image_alt text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  process jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT SELECT ON public.services TO anon;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active services" ON public.services FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CASE STUDIES
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client_name text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Web Design',
  cover_image_url text,
  cover_image_alt text,
  result_summary text NOT NULL DEFAULT '',
  challenge text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  results jsonb NOT NULL DEFAULT '[]'::jsonb,
  testimonial_quote text,
  testimonial_author text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT SELECT ON public.case_studies TO anon;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published case studies" ON public.case_studies FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can manage case studies" ON public.case_studies FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER case_studies_updated_at BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BLOG POSTS EXTENSIONS
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT 'JointHeirs DigiWorks Agency',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Insights',
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS video_kind text,
  ADD COLUMN IF NOT EXISTS video_poster_url text,
  ADD COLUMN IF NOT EXISTS video_captions_url text,
  ADD COLUMN IF NOT EXISTS video_transcript text,
  ADD COLUMN IF NOT EXISTS video_is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_autoplay boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_muted boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS video_loop boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_controls boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reading_minutes integer NOT NULL DEFAULT 4;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

-- TEAM MEMBERS
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Team member name placeholder',
  designation text NOT NULL DEFAULT 'Designation placeholder',
  bio text NOT NULL DEFAULT 'Short bio placeholder.',
  photo_url text,
  photo_alt text,
  social_url text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT ON public.team_members TO anon;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active team members" ON public.team_members FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT SELECT ON public.site_settings TO anon;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SEO SETTINGS
CREATE TABLE public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  og_image_url text,
  robots text NOT NULL DEFAULT 'index, follow',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_settings TO authenticated;
GRANT SELECT ON public.seo_settings TO anon;
GRANT ALL ON public.seo_settings TO service_role;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read seo settings" ON public.seo_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage seo settings" ON public.seo_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER seo_settings_updated_at BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- MEDIA LIBRARY
CREATE TABLE public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  storage_path text,
  kind text NOT NULL DEFAULT 'image',
  title text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  description text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT ALL ON public.media_library TO service_role;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage media" ON public.media_library FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER media_library_updated_at BEFORE UPDATE ON public.media_library FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ENQUIRIES
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage enquiries" ON public.enquiries FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- QUOTE REQUESTS
CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  service text NOT NULL,
  project_brief text NOT NULL,
  goals text,
  timeline text,
  budget_range text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage quote requests" ON public.quote_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER quote_requests_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  needs text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AVAILABILITY SLOTS
CREATE TABLE public.availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_slots TO authenticated;
GRANT SELECT ON public.availability_slots TO anon;
GRANT ALL ON public.availability_slots TO service_role;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active slots" ON public.availability_slots FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins can manage slots" ON public.availability_slots FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER availability_slots_updated_at BEFORE UPDATE ON public.availability_slots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RATE LIMITS (server only)
CREATE TABLE public.form_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 1
);
CREATE INDEX form_rate_limits_bucket_idx ON public.form_rate_limits (bucket, window_start DESC);
GRANT ALL ON public.form_rate_limits TO service_role;
ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;

-- SEED SERVICES (13)
INSERT INTO public.services (slug, name, short_description, long_description, category, sort_order, features, process, faqs) VALUES
('website-design-development','Website Design & Development','Premium, high-performing websites engineered for growth and conversion.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Web Design',1,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Discovery","detail":"Placeholder detail"},{"step":"Design","detail":"Placeholder detail"},{"step":"Build","detail":"Placeholder detail"},{"step":"Launch","detail":"Placeholder detail"}]','[{"q":"How long does a project take?","a":"Timeline placeholder."},{"q":"What is the investment?","a":"Pricing placeholder."}]'),
('landing-pages-funnels','Landing Pages & Funnels','Conversion-first landing pages and funnels that capture qualified demand.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Web Design',2,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Discovery","detail":"Placeholder detail"},{"step":"Design","detail":"Placeholder detail"},{"step":"Build","detail":"Placeholder detail"},{"step":"Launch","detail":"Placeholder detail"}]','[{"q":"How long does a project take?","a":"Timeline placeholder."},{"q":"What is the investment?","a":"Pricing placeholder."}]'),
('graphic-design','Professional Graphic Design','Editorial-grade visuals for campaigns, decks, print and digital.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Branding',3,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Brief","detail":"Placeholder detail"},{"step":"Concepts","detail":"Placeholder detail"},{"step":"Refinement","detail":"Placeholder detail"},{"step":"Delivery","detail":"Placeholder detail"}]','[{"q":"How many revisions are included?","a":"Placeholder answer."},{"q":"What files do I receive?","a":"Placeholder answer."}]'),
('logo-design','Professional Logo Design','Distinctive marks built to scale across every brand touchpoint.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Branding',4,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Brief","detail":"Placeholder detail"},{"step":"Concepts","detail":"Placeholder detail"},{"step":"Refinement","detail":"Placeholder detail"},{"step":"Delivery","detail":"Placeholder detail"}]','[{"q":"How many concepts do I get?","a":"Placeholder answer."},{"q":"Do I own the copyright?","a":"Placeholder answer."}]'),
('prompt-engineering','Professional Prompt Engineering','Precision-crafted prompt systems that unlock AI''s full potential.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','AI Automation',5,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Audit","detail":"Placeholder detail"},{"step":"Design","detail":"Placeholder detail"},{"step":"Test","detail":"Placeholder detail"},{"step":"Handover","detail":"Placeholder detail"}]','[{"q":"Which models do you support?","a":"Placeholder answer."},{"q":"Do you provide training?","a":"Placeholder answer."}]'),
('copywriting','Professional Copywriting','Persuasive brand and sales copy written to move decisions.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Copywriting',6,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Research","detail":"Placeholder detail"},{"step":"Draft","detail":"Placeholder detail"},{"step":"Refine","detail":"Placeholder detail"},{"step":"Deliver","detail":"Placeholder detail"}]','[{"q":"Do you write long-form?","a":"Placeholder answer."},{"q":"How is tone agreed?","a":"Placeholder answer."}]'),
('ai-business-automation','AI Business Automation','Smart systems that save time and multiply revenue.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','AI Automation',7,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Audit","detail":"Placeholder detail"},{"step":"Blueprint","detail":"Placeholder detail"},{"step":"Build","detail":"Placeholder detail"},{"step":"Optimise","detail":"Placeholder detail"}]','[{"q":"Which tools do you use?","a":"Placeholder answer."},{"q":"Is support included?","a":"Placeholder answer."}]'),
('social-media-designs','Social Media Designs','Scroll-stopping content systems built for consistency.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Social Media Ads',8,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Strategy","detail":"Placeholder detail"},{"step":"Design","detail":"Placeholder detail"},{"step":"Schedule","detail":"Placeholder detail"},{"step":"Report","detail":"Placeholder detail"}]','[{"q":"How many designs per month?","a":"Placeholder answer."},{"q":"Do you write captions?","a":"Placeholder answer."}]'),
('ai-content-creation','AI Content Creation','Human-quality content at machine speed.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','AI Automation',9,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Plan","detail":"Placeholder detail"},{"step":"Produce","detail":"Placeholder detail"},{"step":"Edit","detail":"Placeholder detail"},{"step":"Publish","detail":"Placeholder detail"}]','[{"q":"Is the content original?","a":"Placeholder answer."},{"q":"Do humans review it?","a":"Placeholder answer."}]'),
('facebook-instagram-ads','Facebook & Instagram Ads','Data-driven social advertising that turns clicks into customers.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Social Media Ads',10,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Audit","detail":"Placeholder detail"},{"step":"Creative","detail":"Placeholder detail"},{"step":"Launch","detail":"Placeholder detail"},{"step":"Scale","detail":"Placeholder detail"}]','[{"q":"What budget do I need?","a":"Placeholder answer."},{"q":"How is performance reported?","a":"Placeholder answer."}]'),
('ai-business-consulting','AI Business Consulting','Advisory that turns AI capability into commercial advantage.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','AI Automation',11,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Assess","detail":"Placeholder detail"},{"step":"Advise","detail":"Placeholder detail"},{"step":"Roadmap","detail":"Placeholder detail"},{"step":"Support","detail":"Placeholder detail"}]','[{"q":"Who is this for?","a":"Placeholder answer."},{"q":"How are sessions run?","a":"Placeholder answer."}]'),
('branding-identity','Branding & Identity','Strategic identity design that positions you for excellence.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Branding',12,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Discover","detail":"Placeholder detail"},{"step":"Define","detail":"Placeholder detail"},{"step":"Design","detail":"Placeholder detail"},{"step":"Deploy","detail":"Placeholder detail"}]','[{"q":"What is included?","a":"Placeholder answer."},{"q":"Do you deliver guidelines?","a":"Placeholder answer."}]'),
('complete-digital-solutions','Complete Digital Solutions','One accountable partner for your entire digital stack.','Detailed service description placeholder — to be provided by JointHeirs DigiWorks Agency.','Complete Digital Solutions',13,'["Feature placeholder one","Feature placeholder two","Feature placeholder three"]','[{"step":"Audit","detail":"Placeholder detail"},{"step":"Plan","detail":"Placeholder detail"},{"step":"Execute","detail":"Placeholder detail"},{"step":"Grow","detail":"Placeholder detail"}]','[{"q":"Can I start with one service?","a":"Placeholder answer."},{"q":"How is it priced?","a":"Placeholder answer."}]');

-- SEED CASE STUDIES (6 placeholders, one per category)
INSERT INTO public.case_studies (slug, title, client_name, industry, category, result_summary, challenge, solution, results, testimonial_quote, testimonial_author, sort_order) VALUES
('case-study-one','Case Study Title Placeholder One','Client name placeholder','Industry placeholder','Web Design','Result summary placeholder.','Challenge placeholder — to be provided by JointHeirs DigiWorks Agency.','Solution placeholder — to be provided by JointHeirs DigiWorks Agency.','[{"label":"Metric placeholder","value":"00%"},{"label":"Metric placeholder","value":"00x"},{"label":"Metric placeholder","value":"00"}]','Client testimonial placeholder.','Client name placeholder',1),
('case-study-two','Case Study Title Placeholder Two','Client name placeholder','Industry placeholder','AI Automation','Result summary placeholder.','Challenge placeholder — to be provided by JointHeirs DigiWorks Agency.','Solution placeholder — to be provided by JointHeirs DigiWorks Agency.','[{"label":"Metric placeholder","value":"00%"},{"label":"Metric placeholder","value":"00x"},{"label":"Metric placeholder","value":"00"}]','Client testimonial placeholder.','Client name placeholder',2),
('case-study-three','Case Study Title Placeholder Three','Client name placeholder','Industry placeholder','Branding','Result summary placeholder.','Challenge placeholder — to be provided by JointHeirs DigiWorks Agency.','Solution placeholder — to be provided by JointHeirs DigiWorks Agency.','[{"label":"Metric placeholder","value":"00%"},{"label":"Metric placeholder","value":"00x"},{"label":"Metric placeholder","value":"00"}]','Client testimonial placeholder.','Client name placeholder',3),
('case-study-four','Case Study Title Placeholder Four','Client name placeholder','Industry placeholder','Social Media Ads','Result summary placeholder.','Challenge placeholder — to be provided by JointHeirs DigiWorks Agency.','Solution placeholder — to be provided by JointHeirs DigiWorks Agency.','[{"label":"Metric placeholder","value":"00%"},{"label":"Metric placeholder","value":"00x"},{"label":"Metric placeholder","value":"00"}]','Client testimonial placeholder.','Client name placeholder',4),
('case-study-five','Case Study Title Placeholder Five','Client name placeholder','Industry placeholder','Copywriting','Result summary placeholder.','Challenge placeholder — to be provided by JointHeirs DigiWorks Agency.','Solution placeholder — to be provided by JointHeirs DigiWorks Agency.','[{"label":"Metric placeholder","value":"00%"},{"label":"Metric placeholder","value":"00x"},{"label":"Metric placeholder","value":"00"}]','Client testimonial placeholder.','Client name placeholder',5),
('case-study-six','Case Study Title Placeholder Six','Client name placeholder','Industry placeholder','Complete Digital Solutions','Result summary placeholder.','Challenge placeholder — to be provided by JointHeirs DigiWorks Agency.','Solution placeholder — to be provided by JointHeirs DigiWorks Agency.','[{"label":"Metric placeholder","value":"00%"},{"label":"Metric placeholder","value":"00x"},{"label":"Metric placeholder","value":"00"}]','Client testimonial placeholder.','Client name placeholder',6);

-- SEED TEAM (3 placeholders)
INSERT INTO public.team_members (name, designation, bio, sort_order) VALUES
('Team member name placeholder','Designation placeholder','Short bio placeholder — to be provided by JointHeirs DigiWorks Agency.',1),
('Team member name placeholder','Designation placeholder','Short bio placeholder — to be provided by JointHeirs DigiWorks Agency.',2),
('Team member name placeholder','Designation placeholder','Short bio placeholder — to be provided by JointHeirs DigiWorks Agency.',3);

-- SEED SETTINGS
INSERT INTO public.site_settings (key, value) VALUES
('founder','{"title":"LEADERSHIP WITH VISION","name":"Ulrich Archie-Bong","role":"President & Chief Executive Officer","bio":"Founder biography will be provided by JointHeirs DigiWorks Agency.","portrait_url":null,"portrait_alt":"Portrait of Ulrich Archie-Bong, President and CEO of JointHeirs DigiWorks Agency"}'),
('contact','{"address":"76 Lola Holloway Street, Omole Phase 1, Ikeja, Lagos, Nigeria","phones":["0903 114 7808","0805 440 0328"],"whatsapp":"+2349027769832","email":"jointheirsdigiworks@gmail.com","business_hours":"Monday to Friday, 9am to 6pm WAT"}'),
('socials','{"facebook":"https://facebook.com/JointHeirsDigiWorks","instagram":"https://instagram.com/jointheirsdigiworks","x":"#","linkedin":"#"}'),
('appearance','{"default_theme":"dark","effects_enabled":true,"logo_url":null}'),
('robots','{"content":"User-agent: *\nAllow: /\nDisallow: /admin\n"}');

INSERT INTO public.availability_slots (day_of_week, start_time, end_time) VALUES
(1,'10:00','11:00'),(2,'10:00','11:00'),(3,'14:00','15:00'),(4,'14:00','15:00'),(5,'11:00','12:00');

-- STORAGE BUCKET
CREATE POLICY "Public can read media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));