-- Services (13)
INSERT INTO public.services (slug, name, short_description, long_description, category, sort_order, features, process, faqs) VALUES
('website-design-development','Website Design & Development','Premium, high-performing websites engineered for growth and conversion.','Placeholder overview: we design and build fast, secure, search-friendly websites for ambitious Nigerian and international brands. Every build pairs editorial-grade visual design with clean engineering, analytics and a content system your team can actually use.','Web',1,
 '["Custom design system and brand-true UI","Mobile-first, accessible build","Core Web Vitals performance tuning","On-page SEO and structured data","Analytics, events and conversion tracking","Training and post-launch support"]',
 '[{"title":"Discovery","detail":"Placeholder: goals, audience, competitors and success measures."},{"title":"Architecture","detail":"Placeholder: sitemap, wireframes and content plan."},{"title":"Design","detail":"Placeholder: full visual direction and page designs."},{"title":"Build","detail":"Placeholder: development, integrations and QA."},{"title":"Launch & Grow","detail":"Placeholder: deployment, measurement and iteration."}]',
 '[{"q":"How long does a website take?","a":"Placeholder: typical timelines range from 3 to 8 weeks depending on scope."},{"q":"Do you write the content?","a":"Placeholder: yes, copywriting can be included in scope."},{"q":"Will I be able to edit it myself?","a":"Placeholder: yes, we hand over an admin dashboard and training."}]'),
('landing-pages-funnels','Landing Pages & Funnels','Conversion-first landing pages and funnels that capture qualified demand.','Placeholder overview: campaign pages, lead magnets and multi-step funnels built around a single measurable action.','Web',2,
 '["Offer and message strategy","Conversion-focused page design","Lead capture and CRM handoff","A/B test variants","Speed and mobile optimisation","Conversion reporting"]',
 '[{"title":"Offer Clarity","detail":"Placeholder: define the promise and the audience."},{"title":"Wireframe","detail":"Placeholder: structure the persuasion sequence."},{"title":"Design & Copy","detail":"Placeholder: visuals and words built together."},{"title":"Launch & Test","detail":"Placeholder: publish, measure, iterate."}]',
 '[{"q":"Can you connect it to my ads?","a":"Placeholder: yes, tracking and audiences are configured with the page."},{"q":"Do you handle email follow-up?","a":"Placeholder: automated sequences can be added."}]'),
('graphic-design','Professional Graphic Design','Editorial-grade visuals for campaigns, decks, print and digital.','Placeholder overview: art direction and production design across every format your brand needs.','Creative',3,
 '["Campaign key visuals","Pitch decks and reports","Print-ready artwork","Packaging and collateral","Template systems","Unlimited-format export pack"]',
 '[{"title":"Brief","detail":"Placeholder: objective, format and tone."},{"title":"Direction","detail":"Placeholder: concept routes for approval."},{"title":"Production","detail":"Placeholder: full artwork and revisions."},{"title":"Handover","detail":"Placeholder: source and export files."}]',
 '[{"q":"How many revisions are included?","a":"Placeholder: two rounds per concept as standard."}]'),
('logo-design','Professional Logo Design','Distinctive marks built to scale across every brand touchpoint.','Placeholder overview: strategic logo design with full usage guidance, from favicon to billboard.','Creative',4,
 '["Concept exploration","Primary, secondary and mark lockups","Colour and mono variants","Clear-space and usage rules","Full file pack","Trademark-ready artwork"]',
 '[{"title":"Positioning","detail":"Placeholder: what the mark must communicate."},{"title":"Concepts","detail":"Placeholder: three distinct routes."},{"title":"Refinement","detail":"Placeholder: sharpen the chosen direction."},{"title":"Delivery","detail":"Placeholder: usage guide and files."}]',
 '[{"q":"Do I own the logo?","a":"Placeholder: yes, full rights transfer on final payment."}]'),
('prompt-engineering','Professional Prompt Engineering','Precision-crafted prompt systems that unlock AI''s full potential.','Placeholder overview: reusable prompt libraries, evaluation and guardrails so your team gets consistent AI output.','AI',5,
 '["Use-case mapping","Reusable prompt library","Output evaluation and scoring","Guardrails and tone control","Team playbook","Training session"]',
 '[{"title":"Audit","detail":"Placeholder: current AI usage and gaps."},{"title":"Design","detail":"Placeholder: prompt architecture per use case."},{"title":"Test","detail":"Placeholder: measure quality and consistency."},{"title":"Enable","detail":"Placeholder: documentation and training."}]',
 '[{"q":"Which models do you work with?","a":"Placeholder: all leading commercial and open models."}]'),
('copywriting','Professional Copywriting','Persuasive brand and sales copy written to move decisions.','Placeholder overview: positioning, messaging and long-form copy for websites, ads, email and sales assets.','Creative',6,
 '["Messaging framework","Website and landing page copy","Ad and social copy","Email sequences","Sales scripts and decks","SEO-aware editing"]',
 '[{"title":"Research","detail":"Placeholder: audience language and objections."},{"title":"Message","detail":"Placeholder: core narrative and proof."},{"title":"Draft","detail":"Placeholder: full copy in context."},{"title":"Polish","detail":"Placeholder: revisions and final edit."}]',
 '[{"q":"Do you write in Nigerian market voice?","a":"Placeholder: yes, tone is tuned to the audience and market."}]'),
('ai-business-automation','AI Business Automation','Smart systems that save time and multiply revenue.','Placeholder overview: we map manual workflows and replace them with reliable automation — lead routing, follow-up, reporting, support and internal operations.','AI',7,
 '["Workflow discovery and mapping","Automation build and integration","AI agents and chat assistants","CRM and spreadsheet sync","Monitoring and error handling","Documentation and handover"]',
 '[{"title":"Process Audit","detail":"Placeholder: find the highest-cost manual work."},{"title":"Blueprint","detail":"Placeholder: design the automated flow."},{"title":"Build","detail":"Placeholder: implement and integrate."},{"title":"Monitor","detail":"Placeholder: measure hours and naira saved."}]',
 '[{"q":"Which tools do you automate with?","a":"Placeholder: your existing stack wherever possible."},{"q":"Is my data safe?","a":"Placeholder: access is scoped and documented."}]'),
('social-media-designs','Social Media Designs','Scroll-stopping content systems built for consistency.','Placeholder overview: monthly design systems, templates and content batches that keep your feed sharp and on-brand.','Creative',8,
 '["Monthly content design batches","Reusable brand templates","Carousel and reel covers","Story and highlight sets","Caption support","Scheduling-ready exports"]',
 '[{"title":"Content Pillars","detail":"Placeholder: what you post and why."},{"title":"Template System","detail":"Placeholder: flexible on-brand layouts."},{"title":"Batch Production","detail":"Placeholder: monthly delivery."},{"title":"Review","detail":"Placeholder: performance-led refinement."}]',
 '[{"q":"Do you also post for us?","a":"Placeholder: scheduling and management can be added."}]'),
('ai-content-creation','AI Content Creation','Human-quality content at machine speed.','Placeholder overview: AI-assisted, human-edited content engines for blogs, video scripts, newsletters and product copy.','AI',9,
 '["Content strategy and calendar","AI-assisted drafting","Human editorial pass","SEO structure and internal linking","Image and video asset support","Performance reporting"]',
 '[{"title":"Strategy","detail":"Placeholder: topics tied to demand."},{"title":"Engine","detail":"Placeholder: prompts, briefs and templates."},{"title":"Produce","detail":"Placeholder: draft, edit, publish."},{"title":"Improve","detail":"Placeholder: refresh what performs."}]',
 '[{"q":"Is the content original?","a":"Placeholder: every piece is edited and fact-checked by a human."}]'),
('facebook-instagram-ads','Facebook & Instagram Ads','Data-driven social advertising that turns clicks into customers.','Placeholder overview: full-funnel Meta advertising — creative, targeting, tracking and weekly optimisation.','Growth',10,
 '["Account and pixel setup","Audience and offer strategy","Creative production","Campaign build and testing","Weekly optimisation","Transparent reporting"]',
 '[{"title":"Account Audit","detail":"Placeholder: history, tracking and baseline."},{"title":"Creative & Offer","detail":"Placeholder: angles worth testing."},{"title":"Launch","detail":"Placeholder: structured test campaigns."},{"title":"Scale","detail":"Placeholder: double down on winners."}]',
 '[{"q":"What is the minimum ad budget?","a":"Placeholder: budget guidance is shared during your strategy session."},{"q":"Is ad spend included in the fee?","a":"Placeholder: no, ad spend is paid directly to Meta."}]'),
('ai-business-consulting','AI Business Consulting','Advisory that turns AI capability into commercial advantage.','Placeholder overview: executive-level guidance on where AI creates real margin in your business, and a sequenced roadmap to get there.','AI',11,
 '["AI readiness assessment","Opportunity and ROI modelling","Tooling recommendations","Policy and governance guidance","Implementation roadmap","Team enablement"]',
 '[{"title":"Assess","detail":"Placeholder: people, process and data."},{"title":"Prioritise","detail":"Placeholder: rank by impact and effort."},{"title":"Roadmap","detail":"Placeholder: phased plan with owners."},{"title":"Support","detail":"Placeholder: ongoing advisory."}]',
 '[{"q":"Do you work with non-technical teams?","a":"Placeholder: yes, most of our clients are non-technical."}]'),
('branding-identity','Branding & Identity','Strategic identity design that positions you for excellence.','Placeholder overview: positioning, naming support, visual identity and a brand guideline system built to last.','Creative',12,
 '["Brand strategy and positioning","Visual identity system","Typography and colour","Brand voice guidelines","Application across touchpoints","Full guideline document"]',
 '[{"title":"Immersion","detail":"Placeholder: market, audience, ambition."},{"title":"Strategy","detail":"Placeholder: positioning and narrative."},{"title":"Identity","detail":"Placeholder: full visual system."},{"title":"Guidelines","detail":"Placeholder: rollout and rules."}]',
 '[{"q":"Can you rebrand an existing business?","a":"Placeholder: yes, including phased transitions."}]'),
('complete-digital-solutions','Complete Digital Solutions','One accountable partner for your entire digital stack.','Placeholder overview: a retained partnership covering brand, website, content, ads and automation under a single roadmap and one point of accountability.','Growth',13,
 '["Single accountable team","Quarterly growth roadmap","Brand, web, content and ads","Automation and reporting","Priority turnaround","Monthly performance review"]',
 '[{"title":"Growth Audit","detail":"Placeholder: full digital review."},{"title":"Roadmap","detail":"Placeholder: quarterly priorities."},{"title":"Execute","detail":"Placeholder: sprints across channels."},{"title":"Review","detail":"Placeholder: monthly reporting."}]',
 '[{"q":"Is this a monthly retainer?","a":"Placeholder: yes, with a minimum engagement discussed upfront."}]')
ON CONFLICT (slug) DO NOTHING;

-- Case studies (placeholders)
INSERT INTO public.case_studies (slug, title, client_name, industry, category, result_summary, challenge, solution, results, testimonial_quote, testimonial_author, sort_order) VALUES
('case-study-one','Placeholder Project Title One','Placeholder Client Name','Placeholder Industry','Web Design','Placeholder headline result: a short sentence describing the measurable outcome.','Placeholder challenge: what was holding the client back before the engagement.','Placeholder solution: the approach, deliverables and systems put in place.','[{"label":"Placeholder Metric","value":"00%"},{"label":"Placeholder Metric","value":"00x"},{"label":"Placeholder Metric","value":"00 days"}]','Placeholder testimonial quote from the client about working with the agency.','Placeholder Name, Placeholder Role',1),
('case-study-two','Placeholder Project Title Two','Placeholder Client Name','Placeholder Industry','AI Automation','Placeholder headline result: a short sentence describing the measurable outcome.','Placeholder challenge text.','Placeholder solution text.','[{"label":"Placeholder Metric","value":"00%"},{"label":"Placeholder Metric","value":"00 hrs/mo"}]','Placeholder testimonial quote.','Placeholder Name, Placeholder Role',2),
('case-study-three','Placeholder Project Title Three','Placeholder Client Name','Placeholder Industry','Branding','Placeholder headline result: a short sentence describing the measurable outcome.','Placeholder challenge text.','Placeholder solution text.','[{"label":"Placeholder Metric","value":"00%"},{"label":"Placeholder Metric","value":"00 markets"}]',NULL,NULL,3),
('case-study-four','Placeholder Project Title Four','Placeholder Client Name','Placeholder Industry','Social Media Ads','Placeholder headline result: a short sentence describing the measurable outcome.','Placeholder challenge text.','Placeholder solution text.','[{"label":"Placeholder ROAS","value":"0.0x"},{"label":"Placeholder CPL","value":"₦0,000"}]','Placeholder testimonial quote.','Placeholder Name, Placeholder Role',4)
ON CONFLICT (slug) DO NOTHING;

-- Team members (3 management placeholders)
INSERT INTO public.team_members (name, designation, bio, sort_order) VALUES
('Team member name placeholder','Head of Creative (placeholder)','Placeholder bio: two or three sentences about this leader''s background and focus areas.',1),
('Team member name placeholder','Head of Growth (placeholder)','Placeholder bio: two or three sentences about this leader''s background and focus areas.',2),
('Team member name placeholder','Head of AI & Automation (placeholder)','Placeholder bio: two or three sentences about this leader''s background and focus areas.',3);

-- Availability slots, Mon-Fri
INSERT INTO public.availability_slots (day_of_week, start_time, end_time) VALUES
(1,'10:00','11:00'),(1,'14:00','15:00'),
(2,'10:00','11:00'),(2,'14:00','15:00'),
(3,'10:00','11:00'),(3,'16:00','17:00'),
(4,'10:00','11:00'),(4,'14:00','15:00'),
(5,'11:00','12:00'),(5,'15:00','16:00');

-- Site settings
INSERT INTO public.site_settings (key, value) VALUES
('founder','{"title":"LEADERSHIP WITH VISION","name":"Ulrich Archie-Bong","role":"Founder, President & Chief Executive Officer","story":["Placeholder paragraph one: the founder story, background and what led to starting JointHeirs DigiWorks Agency.","Placeholder paragraph two: leadership philosophy and the standard the agency holds itself to.","Placeholder paragraph three: vision for AI powered digital growth across Africa and beyond."],"quote":"Placeholder founder quote about excellence, technology and growth."}'),
('robots','{"content":"User-agent: *\nAllow: /\nDisallow: /admin\n"}')
ON CONFLICT (key) DO NOTHING;

-- SEO defaults
INSERT INTO public.seo_settings (path, meta_title, meta_description) VALUES
('/','JointHeirs DigiWorks Agency | AI Powered Digital Growth Agency in Lagos','Lagos-based AI powered digital growth agency delivering websites, branding, content, Meta ads and business automation for ambitious brands.'),
('/services','Digital Marketing & AI Services in Lagos, Nigeria | JointHeirs DigiWorks','Website design, branding, copywriting, Facebook and Instagram ads, AI automation and consulting from a Lagos digital agency.'),
('/portfolio','Portfolio & Case Studies | Lagos Digital Agency | JointHeirs DigiWorks','See measurable results from web design, branding, paid social and AI automation projects delivered in Nigeria and beyond.'),
('/insights','Insights on AI & Digital Growth | JointHeirs DigiWorks Agency','Practical articles and videos on AI, digital marketing, branding and conversion for Nigerian businesses.'),
('/founder','Leadership With Vision | Ulrich Archie-Bong | JointHeirs DigiWorks','Meet Ulrich Archie-Bong, Founder, President and CEO of JointHeirs DigiWorks Agency in Ikeja, Lagos.'),
('/contact','Contact a Digital Agency in Ikeja, Lagos | JointHeirs DigiWorks','Call, WhatsApp or email JointHeirs DigiWorks Agency in Omole Phase 1, Ikeja, Lagos for digital growth support.')
ON CONFLICT (path) DO NOTHING;

-- Blog posts (placeholders)
INSERT INTO public.blog_posts (slug, title, excerpt, body, category, published, published_at, featured, reading_minutes) VALUES
('placeholder-ai-automation-nigerian-business','Placeholder: How AI Automation Saves Nigerian Businesses Time','Placeholder excerpt: a short summary of the article shown on listing cards and in search results.','Placeholder body paragraph one.

Placeholder body paragraph two.

Placeholder body paragraph three.','AI & Automation', true, now() - interval '6 days', true, 5),
('placeholder-website-that-converts','Placeholder: What Makes a Website Actually Convert','Placeholder excerpt: a short summary of the article shown on listing cards and in search results.','Placeholder body paragraph one.

Placeholder body paragraph two.','Web & Conversion', true, now() - interval '12 days', false, 4),
('placeholder-meta-ads-lagos','Placeholder: Running Profitable Meta Ads in Lagos','Placeholder excerpt: a short summary of the article shown on listing cards and in search results.','Placeholder body paragraph one.

Placeholder body paragraph two.','Paid Social', true, now() - interval '20 days', false, 6)
ON CONFLICT (slug) DO NOTHING;