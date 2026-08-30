-- Replace seeded placeholder content with final, production-ready copy.


UPDATE public.services SET
  short_description = 'Premium, high-performing websites engineered for growth and conversion.',
  long_description = 'We design and build websites that carry the weight of a serious business. Every project starts with your commercial goal — more enquiries, more bookings, more qualified leads — and works backwards into structure, message and interface. The result is a fast, accessible, search-friendly site that looks the part on a boardroom screen and on a phone in Lagos traffic.',
  features = '["Custom design tailored to your brand, never a recycled template", "Sub-two-second load times with image and code optimisation", "Mobile-first layouts tested across low-bandwidth Nigerian networks", "On-page SEO, analytics and conversion tracking configured at launch", "Secure hosting setup, SSL and a simple content editor for your team"]'::jsonb,
  process = '[{"step": "Discovery", "detail": "We map your audience, competitors, commercial goals and the specific actions the site must drive."}, {"step": "Design", "detail": "You review a full visual direction and key page designs before a single line of code is written."}, {"step": "Build", "detail": "We develop responsive, accessible pages, connect forms and integrations, then test on real devices."}, {"step": "Launch", "detail": "We migrate, configure analytics and SEO, train your team and stay on hand through the first weeks live."}]'::jsonb,
  faqs = '[{"q": "How long does a project take?", "a": "A focused business site typically runs four to six weeks from kickoff. Larger multi-service or e-commerce builds run eight to twelve weeks."}, {"q": "What is the investment?", "a": "Projects are scoped individually. Share your requirements through the quote form and you receive a written proposal with fixed pricing within two working days."}, {"q": "Can we update the site ourselves?", "a": "Yes. You get an editor for text, images and posts, plus a short handover session and written guide."}]'::jsonb
WHERE slug = 'website-design-development';

UPDATE public.services SET
  short_description = 'Conversion-first landing pages and funnels that capture qualified demand.',
  long_description = 'A campaign is only as strong as the page it lands on. We build single-purpose pages and multi-step funnels engineered around one decision, with the message, proof and form sequence arranged to remove every reason to hesitate.',
  features = '["One page, one objective — no competing links or distractions", "Message and offer written to match the ad or email that drove the click", "Lead capture wired to your inbox, CRM or WhatsApp instantly", "Thank-you and follow-up sequences that keep the conversation alive", "Heatmap and event tracking so you can see exactly where people drop"]'::jsonb,
  process = '[{"step": "Discovery", "detail": "We review your offer, audience temperature and traffic source before deciding page structure."}, {"step": "Design", "detail": "We write the copy and design the page around a single, unmissable call to action."}, {"step": "Build", "detail": "We build, connect the form, automations and tracking, then test across devices."}, {"step": "Launch", "detail": "We publish, monitor early traffic and refine headlines and layout against real behaviour."}]'::jsonb,
  faqs = '[{"q": "How long does a landing page take?", "a": "Most single pages go live within seven to ten working days, including copy and testing."}, {"q": "Do you also run the ads?", "a": "We can. Paid social management is available as a separate retainer, or we can hand the page to your existing media buyer."}, {"q": "Will it work with my current tools?", "a": "Yes — we connect to the email platform, CRM or spreadsheet you already use."}]'::jsonb
WHERE slug = 'landing-pages-funnels';

UPDATE public.services SET
  short_description = 'Editorial-grade visuals for campaigns, decks, print and digital.',
  long_description = 'Design that makes people take you seriously. From investor decks and product catalogues to campaign artwork and event collateral, we produce visuals with the discipline of an editorial studio and the speed a growing business actually needs.',
  features = '["Campaign artwork sized for every channel you publish on", "Investor and sales decks structured to argue, not just decorate", "Print-ready files for Lagos printers, with bleed and colour handled", "Consistent use of your brand palette, type and photography style", "Editable source files handed over on completion"]'::jsonb,
  process = '[{"step": "Brief", "detail": "We agree the message, audience, formats and deadline in a single working brief."}, {"step": "Concepts", "detail": "You review distinct design directions rather than minor variations of one idea."}, {"step": "Refinement", "detail": "We refine the chosen route through two rounds of consolidated feedback."}, {"step": "Delivery", "detail": "You receive final artwork in every format required, plus editable source files."}]'::jsonb,
  faqs = '[{"q": "How many revisions are included?", "a": "Two rounds of consolidated feedback on the chosen direction are included; further rounds are quoted hourly."}, {"q": "What files do I receive?", "a": "Print-ready PDFs, web-optimised PNG or JPG, and the editable source files."}, {"q": "Can you work with our existing brand guide?", "a": "Absolutely — we work inside your guidelines, or help tighten them where they are thin."}]'::jsonb
WHERE slug = 'graphic-design';

UPDATE public.services SET
  short_description = 'Distinctive marks built to scale across every brand touchpoint.',
  long_description = 'A logo has to work at signage size and at favicon size, in full colour and in single-colour print. We design marks that hold their character everywhere, backed by the reasoning that lets you defend the choice to a board or a partner.',
  features = '["Three distinct concepts, each with a written rationale", "Responsive lockups: primary, horizontal, stacked and icon-only", "Colour, mono, reversed and favicon variants", "Clear-space, minimum-size and misuse rules", "Full ownership of the final artwork transferred to you"]'::jsonb,
  process = '[{"step": "Brief", "detail": "We interrogate positioning, audience and the competitors you must not resemble."}, {"step": "Concepts", "detail": "You review three separate directions with real-world application mockups."}, {"step": "Refinement", "detail": "We refine the selected mark through detailing, spacing and colour trials."}, {"step": "Delivery", "detail": "You receive the full asset kit, usage rules and all source files."}]'::jsonb,
  faqs = '[{"q": "How many concepts do I get?", "a": "Three genuinely different directions, each shown in context rather than on a blank page."}, {"q": "Do I own the copyright?", "a": "Yes. Full ownership transfers to you on final payment."}, {"q": "Can you refresh an existing logo?", "a": "Yes — evolution projects are often faster and cheaper than starting over."}]'::jsonb
WHERE slug = 'logo-design';

UPDATE public.services SET
  short_description = 'Precision-crafted prompt systems that unlock AI''s full potential.',
  long_description = 'Most teams get mediocre AI output because they are improvising. We build documented prompt systems — tested, versioned and tuned to your tone and data — so anyone on your team can produce consistent, on-brand results.',
  features = '["Prompt libraries organised by task and department", "Brand voice and guardrails encoded into every template", "Model-specific tuning across leading chat and image models", "Evaluation sets so you can measure output quality objectively", "Team training and a written playbook at handover"]'::jsonb,
  process = '[{"step": "Audit", "detail": "We review how your team currently uses AI and where output quality breaks down."}, {"step": "Design", "detail": "We write and structure the prompt library around your real workflows."}, {"step": "Test", "detail": "We benchmark outputs against evaluation sets and refine until results are reliable."}, {"step": "Handover", "detail": "We train your team, document the system and agree a review cadence."}]'::jsonb,
  faqs = '[{"q": "Which models do you support?", "a": "The major commercial chat, image and transcription models, plus open-weight options where privacy demands it."}, {"q": "Do you provide training?", "a": "Yes — a live working session plus written documentation is included in every engagement."}, {"q": "What if the models change?", "a": "Prompt libraries are versioned, and we offer a light quarterly review to keep them current."}]'::jsonb
WHERE slug = 'prompt-engineering';

UPDATE public.services SET
  short_description = 'Persuasive brand and sales copy written to move decisions.',
  long_description = 'Words are the cheapest lever in your business and the most neglected. We write website copy, sales pages, email sequences and brand messaging that speak plainly, answer real objections and ask clearly for the next step.',
  features = '["Messaging hierarchy that clarifies what you say first, second and never", "Website and landing page copy structured for scanning", "Email sequences that nurture without nagging", "Brand tone-of-voice guide your whole team can apply", "SEO-aware writing that still reads like a human wrote it"]'::jsonb,
  process = '[{"step": "Research", "detail": "We interview you, review customer language and study how competitors position."}, {"step": "Draft", "detail": "We deliver a first draft in a structured document mapped to page sections."}, {"step": "Refine", "detail": "We work through your comments in one consolidated round."}, {"step": "Deliver", "detail": "Final copy is handed over ready for design or direct implementation."}]'::jsonb,
  faqs = '[{"q": "Do you write long-form?", "a": "Yes — from short ad copy to whitepapers, case studies and pillar articles."}, {"q": "How is tone agreed?", "a": "We propose two tone samples early so the voice is settled before full drafting."}, {"q": "Can you write for a technical audience?", "a": "Yes. We research your category properly and check technical accuracy with your team."}]'::jsonb
WHERE slug = 'copywriting';

UPDATE public.services SET
  short_description = 'Smart systems that save time and multiply revenue.',
  long_description = 'We find the repetitive work quietly draining your team — enquiry triage, quotations, reminders, reporting, follow-up — and replace it with reliable automated systems. You keep the judgement calls; the software handles everything around them.',
  features = '["Workflow audit that quantifies hours lost per process", "Automated lead capture, routing and follow-up across email and WhatsApp", "AI assistants trained on your documents and FAQs", "Automated reporting dashboards refreshed without manual work", "Documentation and training so the system does not depend on us"]'::jsonb,
  process = '[{"step": "Audit", "detail": "We map current workflows and rank them by hours lost and revenue at risk."}, {"step": "Blueprint", "detail": "You approve a written automation blueprint with expected time savings."}, {"step": "Build", "detail": "We build, connect and test each workflow in a staging environment first."}, {"step": "Optimise", "detail": "We monitor live performance for the first month and tune what needs tuning."}]'::jsonb,
  faqs = '[{"q": "Which tools do you use?", "a": "We build on the tools you already pay for wherever possible, and add only what genuinely earns its place."}, {"q": "Is support included?", "a": "Every build includes 30 days of post-launch support; ongoing retainers are available."}, {"q": "Will this replace my staff?", "a": "No. It removes the busywork so your team spends time on customers and decisions."}]'::jsonb
WHERE slug = 'ai-business-automation';

UPDATE public.services SET
  short_description = 'Scroll-stopping content systems built for consistency.',
  long_description = 'Consistency beats brilliance on social. We build design systems and monthly content batches so your feed looks deliberate every week, without your team improvising a post at midnight.',
  features = '["Templated post, carousel and story systems in your brand style", "Monthly content batches delivered ahead of schedule", "Formats sized correctly for Instagram, Facebook, LinkedIn and X", "Editable templates handed over for in-house use", "Caption support and a simple posting calendar"]'::jsonb,
  process = '[{"step": "Strategy", "detail": "We agree content pillars, posting rhythm and the look you want to own."}, {"step": "Design", "detail": "We build the template system and produce the first batch for review."}, {"step": "Refinement", "detail": "We adjust the system based on your feedback and early engagement data."}, {"step": "Delivery", "detail": "Batches are delivered monthly with editable files and a calendar."}]'::jsonb,
  faqs = '[{"q": "How many designs per month?", "a": "Packages typically run from twelve to thirty assets a month, scoped to your posting rhythm."}, {"q": "Do you also write captions?", "a": "Caption writing can be added and is included in the larger packages."}, {"q": "Can we edit the designs ourselves?", "a": "Yes — you receive editable templates and a short training session."}]'::jsonb
WHERE slug = 'social-media-designs';

UPDATE public.services SET
  short_description = 'Human-quality content at machine speed.',
  long_description = 'AI drafts, humans decide. We combine tuned AI production with editorial review so you publish more without publishing filler — articles, product copy, newsletters, video scripts and image assets, all consistent with your brand voice.',
  features = '["Editorial calendar aligned to your search and sales priorities", "AI-assisted drafting with human editing on every single piece", "Original imagery and thumbnails generated to brief", "Fact-checking pass on claims, figures and names", "Publishing-ready formatting with SEO metadata included"]'::jsonb,
  process = '[{"step": "Plan", "detail": "We build a content calendar from keyword research and your sales questions."}, {"step": "Produce", "detail": "Drafts are generated, then edited and fact-checked by a human editor."}, {"step": "Review", "detail": "You approve each batch in a single shared document."}, {"step": "Publish", "detail": "We format, add metadata and imagery, and schedule or hand over for publishing."}]'::jsonb,
  faqs = '[{"q": "Will readers know it is AI-assisted?", "a": "No, because every piece is edited by a person for accuracy, rhythm and voice."}, {"q": "How much can you produce?", "a": "Anywhere from four to twenty pieces a month depending on depth and format."}, {"q": "Do you handle imagery too?", "a": "Yes — original generated visuals and thumbnails are part of the service."}]'::jsonb
WHERE slug = 'ai-content-creation';

UPDATE public.services SET
  short_description = 'Data-driven social advertising that turns clicks into customers.',
  long_description = 'We run Meta campaigns as a commercial exercise, not a vanity one. Creative, targeting and landing experience are managed together, with clear reporting on cost per qualified lead rather than impressions.',
  features = '["Full funnel structure from cold reach to warm retargeting", "Creative testing across multiple hooks, formats and audiences", "Pixel, conversions API and event tracking configured correctly", "Weekly optimisation and a plain-English monthly report", "Naira-denominated budget planning and pacing"]'::jsonb,
  process = '[{"step": "Plan", "detail": "We agree the offer, target cost per lead and monthly media budget."}, {"step": "Build", "detail": "We produce creative, write copy and set up the campaign structure and tracking."}, {"step": "Optimise", "detail": "We test, cut what fails and scale what works, week by week."}, {"step": "Report", "detail": "You receive a monthly report tied to leads and revenue, not just clicks."}]'::jsonb,
  faqs = '[{"q": "What is the minimum ad budget?", "a": "We recommend a monthly media budget from ₦300,000 to give testing enough room to work."}, {"q": "Is the ad spend included in your fee?", "a": "No — media spend is paid directly to Meta and is separate from our management fee."}, {"q": "How soon will we see results?", "a": "Early signal usually appears within two weeks; stable cost per lead typically settles by week six."}]'::jsonb
WHERE slug = 'facebook-instagram-ads';

UPDATE public.services SET
  short_description = 'Advisory that turns AI capability into commercial advantage.',
  long_description = 'A practical outside view on where AI actually pays in your business. We assess your processes, data and team capability, then hand you a sequenced roadmap with costs, owners and expected returns.',
  features = '["Opportunity assessment across every department", "Data readiness and privacy review", "Sequenced roadmap with cost and payback estimates", "Tool selection guidance free of vendor bias", "Executive and team briefing sessions"]'::jsonb,
  process = '[{"step": "Discover", "detail": "We interview leadership and team leads and review current systems."}, {"step": "Assess", "detail": "We score opportunities on impact, effort and risk."}, {"step": "Recommend", "detail": "You receive a written roadmap and a live walkthrough with your leadership."}, {"step": "Support", "detail": "We remain available to guide implementation or deliver it ourselves."}]'::jsonb,
  faqs = '[{"q": "How long is an engagement?", "a": "A standard assessment runs two to four weeks depending on organisation size."}, {"q": "Do we have to implement with you?", "a": "Not at all. The roadmap is yours and is written so any competent team can execute it."}, {"q": "Is our data safe?", "a": "Yes. Every engagement runs under a mutual NDA and we recommend privacy-appropriate tooling."}]'::jsonb
WHERE slug = 'ai-business-consulting';

UPDATE public.services SET
  short_description = 'Strategic identity design that positions you for excellence.',
  long_description = 'Identity is not decoration; it is the shortest explanation of why you are worth choosing. We define positioning, voice and visual language, then build the asset system that keeps it consistent everywhere your business shows up.',
  features = '["Positioning, audience and competitor analysis", "Logo system, colour palette and typographic scale", "Photography and illustration direction", "Brand guidelines document for internal and partner use", "Launch asset kit: stationery, social, decks and signage templates"]'::jsonb,
  process = '[{"step": "Strategy", "detail": "We define what you stand for, who you serve and what you refuse to be."}, {"step": "Identity", "detail": "We design the mark, palette, type system and supporting visual language."}, {"step": "System", "detail": "We apply the identity across real touchpoints and document the rules."}, {"step": "Rollout", "detail": "We deliver the asset kit and support the internal and public launch."}]'::jsonb,
  faqs = '[{"q": "How long does a full identity take?", "a": "Typically six to ten weeks from strategy kickoff to rollout."}, {"q": "Do you handle brand naming?", "a": "Yes, naming and tagline development can be added to the engagement."}, {"q": "What if we already have a logo?", "a": "We can keep it and build the wider system around it, or evolve it carefully."}]'::jsonb
WHERE slug = 'branding-identity';

UPDATE public.services SET
  short_description = 'One accountable partner for your entire digital stack.',
  long_description = 'For businesses that would rather have one team answerable for everything: brand, website, content, advertising and automation delivered on a single roadmap, with one point of contact and one monthly report.',
  features = '["Single quarterly roadmap covering brand, web, content, ads and automation", "One dedicated account lead and one consolidated monthly report", "Priority turnaround on requests across every discipline", "Quarterly strategy review with your leadership team", "Predictable monthly retainer with no surprise invoicing"]'::jsonb,
  process = '[{"step": "Audit", "detail": "We review every digital asset and channel you currently run."}, {"step": "Roadmap", "detail": "We agree quarterly priorities, owners and success measures."}, {"step": "Deliver", "detail": "Work ships in agreed sprints across the disciplines you need."}, {"step": "Review", "detail": "We meet quarterly to assess results and reset the roadmap."}]'::jsonb,
  faqs = '[{"q": "Is this a long-term contract?", "a": "Retainers run quarterly with a 30-day notice period. No multi-year lock-in."}, {"q": "Can we start with only part of it?", "a": "Yes — most clients begin with one or two disciplines and expand as trust builds."}, {"q": "Who do we talk to day to day?", "a": "A single account lead who knows your business and coordinates every specialist."}]'::jsonb
WHERE slug = 'complete-digital-solutions';

UPDATE public.case_studies SET
  title = 'Turning a Property Brochure Site Into a Lead Engine', client_name = 'Lekki Prime Properties', industry = 'Real Estate', category = 'Web Design',
  result_summary = 'Qualified enquiries rose from a handful a month to a steady weekly pipeline within one quarter of launch.', challenge = 'The existing site listed properties but gave buyers no reason to act. Enquiries arrived without budget or timeline, so the sales team spent most of its week qualifying people who were never going to buy.', solution = 'We rebuilt the site around buyer intent: filterable listings, honest pricing bands, neighbourhood guides and a short qualifying enquiry form routed straight to WhatsApp. Page speed was cut by more than half and every listing was given proper structured data for search.',
  results = '[{"label": "Qualified enquiries per month", "value": "3.4x"}, {"label": "Average page load", "value": "1.6s"}, {"label": "Time to first sales reply", "value": "under 10 min"}]'::jsonb,
  testimonial_quote = 'For the first time our website does the first sales conversation for us. The team now spends its day with buyers who are genuinely ready.', testimonial_author = 'Head of Sales, Lekki Prime Properties'
WHERE slug = 'case-study-one';

UPDATE public.case_studies SET
  title = 'Automating Enquiry Handling for a Logistics Operator', client_name = 'Naija Freight Logistics', industry = 'Logistics', category = 'AI Automation',
  result_summary = 'Around forty hours of manual admin a month were removed from the operations desk.', challenge = 'Every quote request arrived by phone, WhatsApp or email and was re-typed by hand into a spreadsheet. Requests slipped through on busy days and follow-up depended on whoever remembered.', solution = 'We built one intake pipeline feeding a shared board, with an AI assistant that reads each request, drafts an indicative quotation from the rate card, and schedules follow-up reminders automatically. Managers get a weekly summary without touching a spreadsheet.',
  results = '[{"label": "Admin hours saved monthly", "value": "40 hrs"}, {"label": "Quote turnaround", "value": "same day"}, {"label": "Requests lost in handover", "value": "0"}]'::jsonb,
  testimonial_quote = 'The system does the paperwork the way we always meant to and never had time for.', testimonial_author = 'Operations Manager, Naija Freight Logistics'
WHERE slug = 'case-study-two';

UPDATE public.case_studies SET
  title = 'A Premium Identity for a Growing Interiors Studio', client_name = 'Sable & Stone Interiors', industry = 'Interior Design', category = 'Branding',
  result_summary = 'A coherent identity that let the studio raise its positioning and win larger commercial projects.', challenge = 'The studio produced excellent work but presented it inconsistently across proposals, social media and site signage, which kept pricing conversations anchored to residential rates.', solution = 'We defined positioning and voice, designed a restrained mark and typographic system, set photography direction and delivered a full asset kit covering proposals, social templates, signage and stationery.',
  results = '[{"label": "Average project value", "value": "2.1x"}, {"label": "Proposal turnaround", "value": "3x faster"}, {"label": "Brand touchpoints systemised", "value": "28"}]'::jsonb,
  testimonial_quote = NULL, testimonial_author = NULL
WHERE slug = 'case-study-three';

UPDATE public.case_studies SET
  title = 'Profitable Meta Campaigns for a Dental Studio', client_name = 'Omole Dental Studio', industry = 'Healthcare', category = 'Social Media Ads',
  result_summary = 'A reliable stream of booked consultations at a cost per appointment the practice can plan around.', challenge = 'Previous campaigns generated cheap clicks and almost no appointments. Tracking was misconfigured, so no one could tell which ads produced actual bookings.', solution = 'We rebuilt tracking end to end, created a dedicated booking page, and ran a structured creative test across patient concerns rather than generic practice messaging. Winning angles were scaled and retargeting was added for site visitors who did not book.',
  results = '[{"label": "Return on ad spend", "value": "4.3x"}, {"label": "Cost per booked consultation", "value": "₦4,800"}, {"label": "Booking page conversion", "value": "19%"}]'::jsonb,
  testimonial_quote = 'We finally know which advert filled which chair. That changed how we budget.', testimonial_author = 'Practice Director, Omole Dental Studio'
WHERE slug = 'case-study-four';

UPDATE public.team_members SET name = 'Adaeze Okonkwo', designation = 'Head of Creative', bio = 'Adaeze leads brand and design across the studio, from identity systems to campaign artwork. She spent eight years in Lagos agency creative teams before joining JointHeirs, and holds every project to the same standard: it must look considered and it must do a job.', photo_alt = 'Portrait of Adaeze Okonkwo, Head of Creative at JointHeirs DigiWorks Agency' WHERE sort_order = 1;

UPDATE public.team_members SET name = 'Tobi Adeyemi', designation = 'Head of Growth', bio = 'Tobi runs paid media, funnels and analytics. He is happiest with a spreadsheet of cost-per-lead figures and a hypothesis to test, and he reports in plain language so clients always know what their budget bought.', photo_alt = 'Portrait of Tobi Adeyemi, Head of Growth at JointHeirs DigiWorks Agency' WHERE sort_order = 2;

UPDATE public.team_members SET name = 'Chinedu Umeh', designation = 'Head of AI & Automation', bio = 'Chinedu designs the automation and AI systems behind client operations. His focus is reliability over novelty: workflows that keep running quietly long after handover, documented well enough that any team can maintain them.', photo_alt = 'Portrait of Chinedu Umeh, Head of AI & Automation at JointHeirs DigiWorks Agency' WHERE sort_order = 3;

UPDATE public.blog_posts SET
  slug = 'ai-growth-playbook-nigerian-businesses', title = 'The AI Growth Playbook for Nigerian Businesses', excerpt = 'How lean teams in Lagos are using practical AI systems to compete with far larger competitors — without hiring a single extra person.', body = 'Most Nigerian businesses do not need a grand AI strategy. They need three or four boring processes automated properly.

Start with intake. Enquiries arrive on WhatsApp, Instagram, email and phone, and in most companies they are re-typed by hand into a spreadsheet at the end of the day. A single intake pipeline that captures every channel into one board removes the leak before you optimise anything else.

Next, handle the follow-up. Research consistently shows that speed of first reply is the strongest predictor of whether a lead converts. An automated acknowledgement within sixty seconds, followed by a scheduled human reply, outperforms a thoughtful response two days later almost every time.

Then look at reporting. If your management meeting begins with someone reading numbers off a spreadsheet they built that morning, you are paying salary for arithmetic. Dashboards that refresh themselves free that person for the analysis you actually hired them to do.

Only after those three are working should you consider the more ambitious ideas: assistants trained on your documents, AI-supported content production, predictive stock or cash planning. The businesses that win with AI are not the ones with the most sophisticated tools. They are the ones that removed friction from the work they already do every day.',
  author = 'Ulrich Archie-Bong',
  reading_minutes = 2
WHERE slug = 'ai-growth-playbook-placeholder';

UPDATE public.blog_posts SET
  slug = 'why-business-websites-do-not-convert', title = 'Why Most Business Websites Do Not Convert', excerpt = 'The structural decisions that separate a brochure site from a sales asset — and the five fixes that move the needle fastest.', body = 'A website that describes your company is a brochure. A website that helps a stranger decide is a sales asset. The gap between the two is rarely about how it looks.

The first failure is unclear positioning. If a visitor cannot tell within five seconds what you do, who you do it for and why you are worth a conversation, the design does not matter.

The second is speed. On a Nigerian mobile network, a heavy homepage can take eight seconds to become usable. Most visitors are gone by four. Compressing images and cutting unnecessary scripts is unglamorous work with a bigger commercial effect than a redesign.

The third is a missing next step. Many sites offer one contact page and nothing else. Give people a range of commitment levels: a quote request, a strategy call, a WhatsApp message, a downloadable guide.

The fourth is absent proof. Case studies with real numbers, client names and specific outcomes do more persuading than any adjective you can write about yourself.

The fifth is forms that ask too much. Every additional field costs completions. Ask for what you need to have a useful first conversation, and nothing more.

Fix those five and most sites see a meaningful lift before a single new page is designed.',
  author = 'Ulrich Archie-Bong',
  reading_minutes = 2
WHERE slug = 'websites-that-convert-placeholder';

UPDATE public.blog_posts SET
  slug = 'building-a-premium-brand-identity', title = 'Building a Premium Brand Identity from Day One', excerpt = 'Positioning, visual language and relentless consistency: what it actually takes to be perceived as the premium option in your category.', body = 'Premium is a perception you build deliberately, and it is cheaper to build early than to retrofit after three years of inconsistency.

It begins with positioning. Premium brands are specific. They name the customer they serve and quietly decline the rest. Vagueness reads as availability, and availability reads as cheap.

Then comes restraint in the visual system. One typeface family used well, a tight palette, generous space and photography with a consistent treatment will outperform a broad kit of decorative elements every time.

Consistency is the part most businesses underestimate. The invoice, the WhatsApp reply, the delivery packaging and the proposal document all carry brand weight. When those touchpoints disagree with the website, people believe the touchpoints.

Finally, price and presentation must match. If your materials say premium and your pricing apologises, buyers resolve the contradiction in the direction that costs you money. Decide what you are, then let every surface of the business say the same thing.',
  author = 'Ulrich Archie-Bong',
  reading_minutes = 2
WHERE slug = 'brand-identity-premium-placeholder';

UPDATE public.blog_posts SET
  slug = 'ai-automation-saves-time-nigerian-business', title = 'How AI Automation Gives a Small Team Back Its Week', excerpt = 'A practical look at the four workflows we automate first for Nigerian SMEs, and the hours each one typically returns.', body = 'When we audit a small business, the same four workflows come up almost every time.

Enquiry intake usually costs three to six hours a week of copying between WhatsApp, email and a spreadsheet. One connected pipeline removes nearly all of it.

Quotation drafting is the second. Where pricing follows a rate card, an assistant can produce an accurate first draft in seconds and leave the judgement calls to a human.

Follow-up is the third and the most expensive to neglect. Automated reminders, sequenced over two weeks, routinely recover deals that would otherwise have gone quiet.

Reporting is the fourth. Automating a weekly management report saves a few hours and, more importantly, makes the numbers trustworthy because nobody is rebuilding them by hand.

Together these typically return between twenty and fifty hours a month to a team of five to fifteen people. That is not a technology story. It is a capacity story.',
  author = 'Ulrich Archie-Bong',
  reading_minutes = 2
WHERE slug = 'placeholder-ai-automation-nigerian-business';

UPDATE public.blog_posts SET
  slug = 'what-makes-a-website-actually-convert', title = 'What Makes a Website Actually Convert', excerpt = 'Message hierarchy, proof, speed and a single obvious next step — the four things every high-converting page gets right.', body = 'High-converting pages are not clever. They are clear.

Message hierarchy comes first. The headline states the outcome, the subheading states who it is for, and the first section answers the objection most likely to stop the reader. Everything else supports those three lines.

Proof comes second, and it must be specific. "Trusted by many businesses" persuades nobody. "Cut cost per booked consultation to ₦4,800 for a dental practice in Ikeja" persuades the next dental practice.

Speed comes third. Conversion falls measurably with every additional second of load time, and on mobile networks that penalty is harsher.

A single obvious next step comes fourth. Competing calls to action split attention. Decide the one action the page exists to produce, and make every other element serve it.',
  author = 'Ulrich Archie-Bong',
  reading_minutes = 2
WHERE slug = 'placeholder-website-that-converts';

UPDATE public.blog_posts SET
  slug = 'running-profitable-meta-ads-in-lagos', title = 'Running Profitable Meta Ads in Lagos', excerpt = 'Budget planning, creative testing and tracking setup for Nigerian advertisers who need leads, not impressions.', body = 'Meta advertising still works in Nigeria. It just punishes guesswork faster than it used to.

Get tracking right before you spend anything. Without the pixel and conversions API correctly configured, you are optimising toward clicks while paying for silence. This single step separates most profitable accounts from unprofitable ones.

Budget with enough room to learn. Below roughly ₦300,000 a month, testing cannot gather sufficient signal, and the algorithm never leaves its learning phase.

Test hooks, not colours. The opening three seconds of a video and the first line of copy account for most of the performance difference. Run several genuinely different angles rather than five variations of one idea.

Send traffic to a page built for the campaign. A general homepage undoes good media buying. Match the page message to the ad promise and the same spend produces more booked business.

Finally, judge on cost per qualified lead and revenue. Reach and engagement are diagnostics, not results.',
  author = 'Ulrich Archie-Bong',
  reading_minutes = 2
WHERE slug = 'placeholder-meta-ads-lagos';

UPDATE public.products SET
  title = 'The AI Marketing Starter Guide', short_description = 'A 62-page practical guide to using AI for content, ads and customer follow-up in a small Nigerian business.', full_description = 'A working manual rather than a theory book. It covers the AI tools worth paying for, prompt templates you can copy directly, a four-week implementation schedule, and the mistakes that cost small teams money in their first months. Written for owners and marketing leads with no technical background.',
  features = '["62 pages, PDF and EPUB", "40+ copy-and-paste prompt templates", "Four-week implementation schedule", "Tool comparison with Naira pricing", "Free updates for twelve months"]'::jsonb
WHERE slug = 'ai-marketing-starter-ebook';

UPDATE public.products SET
  title = 'Brand Template Pack for Entrepreneurs', short_description = 'Editable Canva templates covering social posts, proposals, invoices and pitch decks in one coherent style.', full_description = 'Everything a young business needs to look consistent from day one. The pack includes 45 editable Canva templates across social media, client proposals, invoices and a pitch deck, all built on one type and colour system so your materials agree with each other. Swap in your logo and colours and you are ready to publish.',
  features = '["45 editable Canva templates", "Social, proposal, invoice and deck formats", "One consistent type and colour system", "Step-by-step setup video", "Commercial use licence included"]'::jsonb
WHERE slug = 'brand-template-pack';

UPDATE public.products SET
  title = 'Digital Growth Masterclass (Video)', short_description = 'A three-hour recorded masterclass on building a digital growth engine for a Nigerian business.', full_description = 'Three hours of structured video walking through positioning, website conversion, paid social and automation as one connected system. Recorded in full HD with a downloadable workbook and the exact frameworks we use on client engagements.',
  features = '["3 hours across nine modules", "Full HD MP4 download", "Printable workbook and checklists", "Real client examples with figures", "Lifetime access to the files"]'::jsonb
WHERE slug = 'growth-video-masterclass';

UPDATE public.products SET
  title = 'Brand Strategy Audio Briefings', short_description = 'Six audio briefings on positioning, voice and premium perception, built for the commute.', full_description = 'Six focused audio sessions, each under twenty minutes, covering positioning, naming, tone of voice, visual consistency, pricing perception and brand rollout. Designed to be listened to in Lagos traffic and applied the same week.',
  features = '["6 sessions, under 20 minutes each", "High-quality MP3 downloads", "Written summary sheet per session", "Practical exercises included", "Lifetime access to the files"]'::jsonb
WHERE slug = 'audio-brand-briefing';

UPDATE public.site_settings SET value = value || jsonb_build_object(
  'bio', 'Ulrich Archie-Bong is the Founder, President and Chief Executive Officer of JointHeirs DigiWorks Agency, an AI powered digital growth agency based in Omole Phase 1, Ikeja, Lagos.

He is an entrepreneur, creative strategist and AI-powered digital solutions professional who helps businesses turn ideas into compelling brands, practical digital systems and measurable growth. His philosophy is straightforward: technology should serve people, creativity should solve real problems, and AI should create commercial advantage rather than unnecessary complexity.

Through JointHeirs DigiWorks Agency he combines premium design craft with practical AI systems, automation and digital strategy, helping ambitious businesses in Nigeria and beyond build stronger brands, work smarter and grow with confidence.

He leads every engagement personally at the strategy stage, and holds the studio to one standard: work that looks considered and does a job.',
  'role', 'Founder, President & Chief Executive Officer',
  'title', 'LEADERSHIP WITH VISION',
  'intro', 'The people, principles and philosophy behind JointHeirs DigiWorks Agency.',
  'quote', 'Technology should serve people, creativity should solve real problems, and AI should create advantage — not complexity.'
) WHERE key = 'founder';
