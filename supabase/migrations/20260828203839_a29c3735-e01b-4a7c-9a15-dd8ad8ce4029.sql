CREATE TABLE public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL UNIQUE,
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb,
  message_count integer NOT NULL DEFAULT 0,
  visitor_name text,
  visitor_email text,
  visitor_phone text,
  handoff_channel text,
  handoff_topic text,
  handoff_note text,
  status text NOT NULL DEFAULT 'open',
  admin_note text,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_sessions TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage chat sessions" ON public.chat_sessions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value) VALUES (
  'effects',
  '{"cursor_orb": true, "hero_particles": true, "scroll_progress": true, "smooth_scroll": true, "reveal_animations": true, "hover_glow": true, "magnetic_buttons": true, "parallax_hero": true}'::jsonb
) ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES (
  'email_templates',
  '{"from_name": "JointHeirs DigiWorks", "free_subject": "Your download is ready — {{product}}", "free_body": "Hi {{name}},\n\nThank you for choosing JointHeirs DigiWorks Agency.\n\nYour download for {{product}} is ready:\n{{download_url}}\n\nOrder reference: {{reference}}\nThis secure link expires on {{expires}} and allows up to {{limit}} downloads.\n\nIntelligence. Creativity. Growth.\nJointHeirs DigiWorks Agency", "paid_subject": "Order received — {{product}} ({{reference}})", "paid_body": "Hi {{name}},\n\nWe have received your order for {{product}}.\n\nOrder reference: {{reference}}\nAmount: {{amount}}\n\nOur team will confirm your payment and release your secure download link shortly. You can reply to this email if you need help.\n\nIntelligence. Creativity. Growth.\nJointHeirs DigiWorks Agency"}'::jsonb
) ON CONFLICT (key) DO NOTHING;