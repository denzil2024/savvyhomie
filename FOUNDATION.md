# SavvyHomie — Foundation Record

All decisions agreed as of July 15, 2026. Nothing built yet — this is the record we execute from.

## The business
- **Model:** display ad revenue (Journey by Mediavine → Mediavine → Raptive) + Amazon Associates affiliate income on the same posts.
- **Niche:** home & kitchen product roundups and gift guides. No photography needed — product images come legitimately via the Amazon Associates program.
- **Expected RPM:** $12–15 average across the year; 2–3× in Q4 gift season. Affiliate income typically matches or exceeds ad income in this niche.

## Brand
- **Name:** SavvyHomie
- **Domain:** savvyhomie.com — available, ~$10/yr, NOT YET PURCHASED (buying starts the 4-month Journey age clock)
- **Pinterest:** business account created (Content creator, Home Decor industry), profile done, 10+ keyword boards created and public. Website claim pending domain purchase.

## Site categories (5)
1. Gift Guides (Q4 moneymaker)
2. Kitchen Finds
3. Organization & Storage
4. Home Decor Finds
5. Seasonal
Budget angles ("under $25") are post types inside categories, not a category.

## Content workflow (agreed)
1. Pick a search query (query first, title later)
2. Validate: study top 10 Google results + Pinterest for that query — demand, difficulty, who ranks
3. If good → gap analysis: what top results covered, what they missed, what we do better
4. Thorough outline built from the gaps
5. Write in the site's defined voice, tone and style
6. Publish → automated pins

## Content
- First 50 post titles: see CONTENT-PLAN.md (20 kitchen/organization → 10 decor → 20 gift guides published Sep–Oct for Q4). Titles are query candidates — each still goes through the workflow above before writing.
- Every post: 10–15 products, genuine curation (pros AND cons, who each item is for), 1,500+ words, comparison table. Thin copy-paste lists = network rejection.
- Titles are validated against Pinterest Trends + Google autocomplete/PAA per weekly batch BEFORE writing.

## SEO / AEO plan
1. **Topical authority:** each category = cluster (1 pillar page + 15–20 interlinked roundups). One primary keyword per URL, logged in a keyword map to prevent cannibalization. Target long-tail terms low-authority competitors already rank for.
2. **Architecture:** category silos, breadcrumbs, ≤3 clicks from home, every post links to pillar + 3–5 siblings, no orphans.
3. **E-E-A-T:** named author with consistent bio (site + Pinterest), "How We Pick Products" methodology page, selection criteria in every post, pros/cons on every product.
4. **On-page:** keyword in title/H1/URL/intro; ItemList + FAQPage + Article schema; alt text; TOC; direct 2–3 sentence answer block at top.
5. **AEO/GEO:** answer blocks + FAQ per post (quotable by AI engines), consistent entity naming, llms.txt, index on Bing Webmaster Tools (ChatGPT search = Bing), Google Discover eligibility (large images, strong titles).
6. **Technical:** pre-rendered static HTML with full metadata baked in, sitemap.xml, robots.txt, llms.txt, Core Web Vitals green, mobile-first, HTTPS.
7. **Iterate:** GSC + GA4 from day one; quarterly refresh winners / merge losers; gift guides refreshed and re-dated annually.

## Design (agreed)
- **Look:** calm "kitchen journal" — square corners, hairline rules, generous whitespace. Mockup: design-mockup.html (published artifact).
- **Palette:** Flour #FBF8F2 (background) · Walnut #3B3128 (text) · Butter #E9B44C (category chips, highlights, CTAs) · Spruce #3E5C50 (links, buttons) · Linen #E7DFD2 (borders). Dark mode variants included in mockup.
- **Fonts:** Lora (headlines) + Source Sans 3 (body/UI), free, self-hosted in repo — no CDN, no render delay.
- **Homepage:** masthead with wordmark + 5 category nav → leaderboard ad slot → featured post → card grid → email signup strip ("The Savvy List") → footer with trust links + affiliate disclosure.
- **Article template:** breadcrumbs → H1 + byline ("updated" date, review independence line) → answer block (butter left-border) → numbered product cards (image via Amazon, "best for" line, pros AND cons, price CTA) → in-content ad slots → FAQ accordion.
- **Ad slots reserved in layout from day one** (leaderboard, in-content 300×250, more at approval) so ads don't break the design later.

## Tech stack (agreed)
- **React, pre-rendered to static HTML** — everything in code, articles as Markdown files. No WordPress, no Astro.
- **Hosting:** Railway (site + Python automation, auto-deploy from GitHub repo denzil2024/savvyhomie) with Cloudflare in front (DNS/CDN/AI-bot policies). User's preferred workflow.
- **Python automation:** pin image generator (Pillow, 3–5 approved templates, 1000×1500) + Pinterest API v5 poster, 3–5 pins/day human-like schedule, 2–3 pin designs per post. Official API only — no bot flooding.
- Grow JS snippet (Journey requirement) + ad scripts added at approval time.

## Traffic plan
- **Months 1–12 bridge: Pinterest** (keyword-driven, automated pinning, seasonal content 45–60 days early). Expect 2–3 quiet months, then compounding. Only metric: outbound clicks.
- **Months 6+: Google/Bing compound** via the SEO plan. New domains sit in sandbox ~6 months regardless of niche.
- **Email list from day one** as the owned channel.

## Money milestones
1. Domain purchase → age clocks start
2. ~Month 3–4: 1,000 sessions/mo via Pinterest → apply to Journey (site 4+ months old, Grow snippet 30 days)
3. ~Month 5+: first ad revenue; apply to Amazon Associates once site is live with ~20 posts (need 3 sales in 180 days to stay in)
4. 25K pageviews + ≥50% US/UK/CA/AU/NZ traffic + domain 6+ months → Raptive eligible; $5K/yr revenue → full Mediavine

## Execution order (when we start building)
1. Buy savvyhomie.com
2. Scaffold React prerender project + deploy pipeline (Cloudflare/Railway)
3. Legal/trust pages: About (author bio), Contact, Privacy Policy, Affiliate Disclosure, How We Pick Products
4. GA4 + Search Console + Bing Webmaster + claim domain on Pinterest
5. First content batch (keyword-validated) + pin templates approved → automation on
6. Publish cadence per CONTENT-PLAN.md phases
