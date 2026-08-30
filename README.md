# DigiWorks Launchpad

PHASE 1 OF 3 — Build only this phase. After completion, pause and wait for my confirmation before starting Phase 2.

---

PROJECT CONTEXT

Company: JointHeirs DigiWorks Agency
Tagline: AI Powered Digital Growth Agency
Founder / President & CEO: Ulrich Archie-Bong

Services:
Professional Website Design & Development, Professional Landing Page and Funnel, Professional Graphic Design, Professional Logo Design, Professional Prompt Engineering, Professional Copywriting, AI Business Automation, Social Media Designs, AI Content Creation, Facebook and Instagram Ads, AI Business Consulting, Branding & Identity, Complete Digital Solutions.

Contact:
Address: 76 Lola Holloway Street, Omole Phase 1, Ikeja, Lagos, Nigeria
Phone: 0903 114 7808 | 0805 440 0328
WhatsApp: +234 902 776 9832
Email: jointheirsdigiworks@gmail.com
Facebook: /JointHeirs DigiWorks
Instagram: @jointheirsdigiworks
X & LinkedIn: placeholders

Brand Colors:
- Silver White (#F5F7FA) — clean text / light backgrounds
- Navy Blue (#1B2A4A) — primary brand/action
- Charcoal Gray (#333333) — secondary backgrounds
- Matte Black (#111111) — luxury base
- Dark Navy Blue (#0A1128) — deep immersive backgrounds
- Champagne Gold (#D4AF37) — premium accents, borders, glow
- Dark Orange (#C75000) — secondary CTA/hover accents

Visual Direction:
8K ultra-realistic, cinematic, photorealistic. Realistic African talent, natural Nigerian environments, premium office/creative studio settings. Cinematic lighting, depth of field, brand color grading. No distorted faces, no unrealistic hands, no fake-looking text inside images. Every image must have editable alt text.

Architecture:
Full-stack dynamic website with admin backend. No client login or client dashboard. Visitors submit enquiries; admin manages everything from /admin. Use database, API routes, secure file uploads, admin authentication. All content editable via admin. Use placeholders for founder bio, team names, statistics, pricing — do not invent real data.

---

BUILD IN PHASE 1

1. NAVIGATION
- Sticky premium navbar.
- Left: JointHeirs DigiWorks Agency logo.
- Center/right links: Home, About, Services, Portfolio, Insights, Shop, Founder, Contact.
- Primary CTA button: "Get a Free Quote" (Navy Blue or Gold).
- Secondary CTA button: "Book a Strategy Session" (outline/ghost).
- Include a Light/Dark Mode toggle button in the navbar, visible on desktop and mobile.
- Mobile: Full-screen overlay menu with large typography and service categories.
- Navbar becomes slightly more compact with a dark glass background on scroll.

2. LIGHT MODE & DARK MODE TOGGLE
- Support two themes:
  - Dark Mode (default): Matte Black / Dark Navy Blue backgrounds, Silver White text, Champagne Gold and Dark Orange accents.
  - Light Mode: Silver White / Charcoal Gray backgrounds, Navy Blue / Matte Black text, Champagne Gold and Dark Orange accents.
- Toggle must be premium and accessible, with sun/moon icon and smooth transition.
- Respect user's system preference (prefers-color-scheme) on first visit, but allow manual override.
- Save user selection in localStorage; persist across pages and visits.
- All components must support both themes without breaking readability.
- Admin can later set default theme (Dark, Light, or System Default).

3. PAGES (create shells for all)
- Home
- About Us
- Services
- Service Detail (dynamic placeholder)
- Portfolio / Case Studies
- Case Study Detail (dynamic placeholder)
- Insights / Blog
- Blog Post Detail (dynamic placeholder)
- Founder / Leadership
- Contact
- Request a Quote
- Book a Free Strategy Session
- Shop / Store
- Product Detail
- Cart
- Checkout
- Privacy Policy
- Terms & Conditions
- Admin Login (/admin)
- 404 Page

4. HOMEPAGE HERO — FULL-WIDTH FLIPPING HEADER CARDS (6 cards)
Create a hero with 6 full-width flipping header cards, each occupying the full viewport width.

Card Behaviour:
- Flip/rotate animation (horizontal or vertical) to reveal the next card.
- Smooth, cinematic, premium. 3D flip, fade, subtle parallax.
- Autoplay every 5–7 seconds.
- Pause on hover.
- Manual navigation arrows (left/right).
- Progress indicators (thin gold/orange bars or dots).
- On mobile: swipe horizontally with touch support.

Each card must contain an 8K ultra-realistic cinematic video or animated photographic scene with title and subtitle overlay.

Default 6 cards:
1. Website Design & Development — Title: WEBSITES THAT CONVERT — Subtitle: Premium, high-performing websites engineered for growth.
2. AI Business Automation — Title: AUTOMATE. INNOVATE. SCALE. — Subtitle: Smart systems that save time and multiply revenue.
3. Branding & Identity — Title: BRANDS THAT STAND OUT — Subtitle: Strategic identity design that positions you for excellence.
4. Facebook & Instagram Ads — Title: ADS THAT DELIVER — Subtitle: Data-driven social advertising that turns clicks into customers.
5. Prompt Engineering — Title: ENGINEER INTELLIGENCE — Subtitle: Precision-crafted prompts that unlock AI's full potential.
6. AI Content Creation — Title: CONTENT THAT CONNECTS — Subtitle: Human-quality content at machine speed.

Visual requirements for cards:
- 8K ultra-realistic, cinematic, photorealistic.
- Natural Nigerian environments, premium office settings, professional African talent.
- Cinematic lighting, depth of field, brand color grading.
- No distorted faces, no unrealistic hands, no fake embedded text.
- Each card must have editable alt text, title, subtitle, and CTA via admin.

5. HOMEPAGE OTHER SECTIONS
- Client logo marquee: infinite scrolling marquee of placeholder client logos (editable). Use monochrome logos with hover color.
- About/Founder preview: split layout; left large portrait of Ulrich Archie-Bong with champagne-gold frame; right headline "Your Growth Partner in the Age of AI" with short paragraph. CTA to About page.
- Core services grid: 6–8 featured service cards with icon, service name, short description, "Learn More" link. Dark background with gold hover glow.
- AI Automation Showcase: dedicated dark section with animated workflow diagram (SVG/CSS) showing how automation connects leads, content, ads, and analytics. Include text about time savings and revenue growth.
- Portfolio highlights: 3–4 featured case studies in horizontal slider or grid. Hover reveals project details.
- Testimonials: carousel with champagne-gold quotation marks. Editable placeholders.
- Insights preview: display latest 3 blog posts from dynamic database.
- Final CTA: dark section with headline "Ready to Grow with AI?" and buttons for "Request a Quote" and "Book a Strategy Session".

6. FOOTER WITH IMPRINT
- Multi-column footer:
  - Column 1: JointHeirs DigiWorks Agency — short company description.
  - Column 2: Services — list main services.
  - Column 3: Company — About, Founder, Portfolio, Insights, Shop, Contact.
  - Column 4: Contact info — address, phone, WhatsApp, email, social links.
- Bottom bar:
  - Bottom left corner: imprint text — "Design by Ulrich Archie-Bong - JointHeirs DigiWorks Agency" (small, legible, clickable link to Founder page). In dark mode use Silver White or Champagne Gold; in light mode use Navy Blue or Charcoal Gray.
  - Bottom right/center: © 2026 JointHeirs DigiWorks Agency. All Rights Reserved.

7. FLOATING BUTTONS (placeholders)
- WhatsApp floating button bottom-left using +234 902 776 9832 with prefilled message: "Hello JointHeirs DigiWorks Agency, I would like to make an enquiry."
- JDBot chatbot button bottom-right (visual placeholder for Phase 3). Circular button with brand colors and subtle gold glow.

8. ADMIN LOGIN
- Create secure admin login at /admin (no public registration). Use password hashing and protected routes.

9. SECURITY & PERFORMANCE BASICS
- Validate all forms.
- Use semantic HTML, proper meta tags, Open Graph, structured data placeholders.
- Lazy loading for images, next-gen formats (WebP/AVIF), code splitting, CDN-ready architecture.
- Ensure mobile performance is not destroyed by large backgrounds/videos.

After completing Phase 1, pause and wait for my confirmation before starting Phase 2.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96000b05-69c1-4a13-92d7-43309e7b6c58).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
