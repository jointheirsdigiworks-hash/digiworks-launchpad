INSERT INTO public.products (
  slug, title, short_description, full_description, cover_image_url, cover_image_alt,
  features, category, product_type, currency, price, download_limit, published, featured, sort_order
) VALUES (
  'ai-powered-entrepreneur-vol-1',
  'The AI-Powered Entrepreneur — Foundation (Volume 1)',
  'Volume 1 of the AI-Powered Entrepreneur series: the foundational playbook for building a lean, AI-assisted business from Lagos to the world.',
  'The AI-Powered Entrepreneur — Foundation is the first volume in Ulrich Archie-Bong''s series on building modern, AI-assisted businesses. It walks you from first principles to a working operating system for your company: how to position an offer buyers actually want, how to design prompts and workflows that replace repetitive work, and how to build a marketing engine that compounds instead of resetting every month. Written for founders, consultants and creative professionals in Nigeria and across Africa, every chapter closes with an action sprint you can run the same week.',
  'uploads/1788064917816-file_00000000a86c8210bb5d8fcc311cb930.png',
  'Cover of The AI-Powered Entrepreneur - Foundation, Volume 1, by Ulrich Archie-Bong',
  '["10 chapters with end-of-chapter action sprints", "40+ ready-to-use business prompts", "AI automation blueprints for sales, content and support", "Offer positioning and pricing worksheets", "Instant PDF and EPUB download"]'::jsonb,
  'Books',
  'ebook',
  'NGN',
  12500,
  5,
  true,
  true,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  cover_image_url = EXCLUDED.cover_image_url,
  cover_image_alt = EXCLUDED.cover_image_alt,
  features = EXCLUDED.features,
  category = EXCLUDED.category,
  published = true,
  updated_at = now();