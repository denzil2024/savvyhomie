# Website Foundation Research — July 2026

Goal: build a content website monetized with display ads. Target ad network path: **Journey by Mediavine → Mediavine → (optionally) Raptive**.

---

## 1. Ad Network Requirements (verified July 2026)

Big news: **both networks dramatically lowered their entry barriers in late 2025 / early 2026.** This changes the plan — monetization can start far earlier than the old 50K-sessions era.

### Journey by Mediavine (our first milestone)
- **1,000 sessions/month** minimum (per GA4) — as of Jan 15, 2026
- Site must be **at least 4 months old**
- Must install and run the **Grow plugin for 30 days** before applying
- Revenue share: **70%** to us, Net-65 payments
- Reported average RPM ≈ $11, varies widely by niche ($8–$50+)

### Full Mediavine
- As of Jan 2026: **revenue-based, not traffic-based** — **$5,000+/year in ad revenue** (roughly 25K+ pageviews/mo in a decent niche). The old 50K sessions rule is gone for new applicants.
- Path is seamless from Journey: they notify you when you're eligible.
- Revenue share up to 90%, dedicated support, better ad controls.

### Raptive
- **25,000 pageviews/month** minimum (dropped from 100K in late 2025)
- Geographic requirement:
  - 25K–99K pageviews: **≥50% traffic from US/UK/CA/AU/NZ**
  - 100K+: ≥40% from those countries
- Domain at least **6 months old** (for the 25K–99K tier)
- Long-form content on the majority of pages; Google Analytics correctly set up; site build makes ad placement easy

### Quality standards common to BOTH (these shape everything we build)
1. **Original, audience-first content with meaningful human involvement** — both networks explicitly screen for this; pure AI-generated content is a rejection risk. Raptive's language: "high-quality, original, meaningful human involvement."
2. **Clean, human, brand-safe traffic** — no bots, no paid junk traffic, verified via GA4. Traffic sources are audited.
3. **Tier-1 geography** — US/UK/CA/AU/NZ traffic monetizes far higher and is a hard requirement at Raptive. Write in English for a US audience.
4. **Good standing with Google AdSense/Ad Exchange** — no policy violations ever; brand-safe topics only (no violence, weapons, adult, hacking).
5. **Reader experience that supports premium ads** — fast site, clean navigation, About page, well-structured articles (headings, images, short paragraphs), long-form content.
6. **Legal/trust pages** — Privacy Policy, About, Contact; ads.txt managed by the network once accepted.

**What "AI content" means to them (verified from official policies):**
- Neither network bans AI. Banned: "low-quality, mass-produced, unedited or undisclosed AI content" (Mediavine). Raptive's "meaningful human involvement" = every piece reviewed, fact-checked, and edited by a human before publishing, regardless of whether AI drafted it.
- Enforcement is real and ongoing, not application-only: Mediavine terminated publishers in March 2024 via third-party content-quality tools + human review; Raptive monitors the whole network continuously and removes violators.
- What triggers flags is the *pattern*, not individual articles: implausible publishing velocity on a new domain, no original photos, untested recipes/projects, no first-person experience, thin author identity.
- Our rules: AI in the workflow is fine; every article gets human editing + fact-checking + first-hand elements (original photos, tested projects, personal observations); believable publishing pace; real author name/bio; disclose extensive AI use (Raptive recommendation).
- Sources: [Raptive AI policy](https://help.raptive.com/hc/en-us/articles/23945568132123-What-are-Raptive-s-policies-around-AI-generated-content) · [Mediavine AI stance](https://www.mediavine.com/ai-and-our-commitment-to-a-creator-first-future/) · [Mediavine AI bans (SEJ)](https://www.searchenginejournal.com/mediavine-bans-publisher-for-overuse-of-ai-generated-content/526343/) · [Raptive enforcement](https://raptive.com/blog/enforcing-and-maintaining-raptives-quality-standards/)

**Design implications from day 1:**
- GA4 installed correctly from launch (traffic history is audited)
- WordPress is the safe platform choice (Grow plugin is WP-native; both networks integrate best with it)
- Fast, lightweight theme with ad-friendly layout (sidebar + in-content slots, no cramped design)
- Long-form (1,500+ word) content as the default format
- Author bylines, real About page, evidence of a human behind the site (E-E-A-T + network review)
- Buy the domain now — the 4-month (Journey) and 6-month (Raptive) age clocks start ticking at first content/registration

---

## 2. The AI-Search Reality (what changed, and what still works)

- **68% of Google searches now end without a click** (up from 60% in 2024). Organic CTR drops ~34% when an AI Overview appears.
- Hit hardest: **generic informational queries** ("what is X", "how does X work") — AI answers these in-SERP.
- Least affected: **visual, transactional, personal-experience, and specific-intent queries** — things AI can't satisfy (a recipe you'll actually cook, a room you want to see, a pattern you'll follow, first-person testing).
- **Recipe/food saw the fastest AI Overview growth of any category in 2025** — the biggest classic niche is now the most disrupted at the generic level.
- New-domain SEO timeline is unchanged: ~3–6 months of sandbox, meaningful organic traffic months 6–12, typically after 20–30+ well-targeted articles.

**Strategic conclusion: a new site in 2026 cannot be Google-SEO-first.** The winning playbook is **distribution-first**:
1. **Pinterest as primary early channel** — works from day 1, no domain authority needed, sends outbound clicks by design (~631M users), skews US female = Tier-1 traffic that Mediavine/Raptive love. Works like SEO (evergreen, keyword-driven), not like social.
2. **Email list from day 1** — owned audience, highest-converting channel, proves "real audience" to networks.
3. **Google SEO as the months-6-12 compounder** — target long-tail, specific, experience-based queries that AI Overviews handle poorly.
4. **Google Discover + Facebook groups** as bonus channels once content volume exists.

This makes the niche decision almost self-answering: **it must be a niche that wins on Pinterest.**

---

## 3. Niche Selection

### RPM benchmarks by niche (Mediavine/Raptive, 2025–26 reports)
| Niche | Typical RPM | Notes |
|---|---|---|
| Personal finance | $25–45 | Highest RPM, but YMYL = slowest/hardest to rank as a new site; weak on Pinterest |
| Food & drink | $15–25 (drinks content reported $40–49) | Massive on both networks; strong Pinterest; most AI-disrupted at generic level |
| Home & garden / DIY / decor | $15–25 | Highly commercial, visual, Pinterest-native |
| Lifestyle / parenting | $12–20 | Raptive's #1 categories by Comscore |
| Crafts (sewing, quilting, crochet) | $10–20 | Most popular craft niches on both networks; loyal, project-driven audiences |
| Travel | $10–20 | Seasonal, AI-disrupted for itinerary/info queries |
| Entertainment / gaming | low ($5–10) | Explicitly flagged as low-RPM — avoid |

Seasonality note: Q4 RPMs run ~1.5–2× the annual average across all niches; Q1 is the trough.

### Scoring the candidates (fast traffic × RPM × AI-resilience × network fit)

- **Finance:** best RPM, worst everything else for a new site (YMYL, no Pinterest engine, AI Overviews eat definitional queries). ❌ for this project.
- **Broad food/recipes:** best network fit and Pinterest engine, but the most crowded space and fastest-growing AI Overview category. Viable **only as a tight sub-niche**.
- **Home/garden/DIY/decor:** visual (AI-resistant), Pinterest-native, highly commercial, solid RPM, evergreen. ✅ strongest all-around.
- **Crafts/hobby sub-niches:** less competition post-AI-shakeup, devoted audiences, pattern/tutorial content that AI can't replace, strong Pinterest. ✅ strong, slightly lower RPM ceiling.
- **Drinks/cocktails (food sub-niche):** reported $40–49 RPM, visual, Pinterest-strong, less saturated than recipes-in-general. ✅ interesting high-RPM angle (note: alcohol content is allowed but slightly narrows some advertiser pools; mocktails/coffee/smoothies sidestep this).

### REVISED DECISION (July 2026): Product roundups & gift guides (home + kitchen)
Zero-budget constraint ruled out original photography, so the niche pivoted from drinks recipes to **"best products" roundups and gift guides in home/kitchen** — e.g., "best gifts for coffee lovers," "kitchen organizers under $25," seasonal gift guides. Images come legitimately from the Amazon Associates program (licensed product images via their tools). Pinterest-strong, big Q4 spike, affiliate income stacks on top of display ads. The human-involvement requirement is met through genuine research, comparison, and curation in the writing itself.

### (superseded) Original decision: Non-alcoholic drinks & beverage recipes
Chosen niche: **drinks — mocktails, coffee & espresso drinks, smoothies, teas, lemonades, seasonal/holiday drinks.** Alcohol-light or alcohol-free on purpose: alcohol is a "sensitive category" with fewer advertisers, so non-alc content keeps the reported $40–49 drinks RPM without the advertiser-pool penalty.

Why drinks beat the other finalists:
- **RPM:** drinks content reports the highest RPM of any food sub-niche ($40–49 vs $15–25 for food generally). Food & Drink is 47% of Mediavine's publisher base — the networks' home turf.
- **Content feasibility (the decider):** every article = a tested recipe + original photos, produced in under an hour with cheap ingredients. This authentically satisfies the "meaningful human involvement" requirement at scale — vs. home organization (needs real rooms/makeovers per post) and crochet (many hours of crafting per project).
- **Pinterest:** food/drink is a top-3 Pinterest category (18B+ recipe saves); drinks pins are visually striking and evergreen.
- **AI-Overview resilience:** users need the recipe card, ratios, and photos on-page; drinks queries are visual and specific.
- **Seasonality engine:** holiday drinks, summer refreshers, pumpkin-spice season, Dry January — recurring spikes all year, with the Q4 RPM peak landing on the niche's biggest traffic season. Dry January lands in the Q1 RPM trough and fills it.
- **Runner-ups:** home organization/decor (#1 Pinterest category — best alternative if we get access to real spaces for original photography); crochet (Pinterest Predicts 2026 trend, but slowest content velocity).

**Photography plan:** all original, shot in-house. Smartphone + window light + ~$150 one-time setup (tripod, glassware, props). Batch workflow: one afternoon = 6–8 drinks made and shot from 3–4 angles = ~2 weeks of articles and 20+ unique pins. No stock photos ever (network reviewers spot them; Pinterest downranks reused images); no AI images (covered by the same human-involvement policies as text). Process shots + a 30-sec vertical video per drink feed Pinterest video pins from the same session.

**Topic depth:** 600+ mapped topics across 9 pillars — mocktails (100+), coffee drinks incl. Starbucks copycats (100+), smoothies/juices (80+), teas & matcha (60+), lemonades & sodas (50+), hot & cozy drinks (40+), syrups/basics/how-tos (50+), seasonal & holiday (80+, refreshed yearly), roundups (40+, built from existing posts — zero new photography). Plus a self-refilling trend stream (TikTok/Pinterest viral drinks). Existence proof: entire blogs run on mocktails alone; established drink sites carry hundreds of recipes.


Pick a **visual, project-driven sub-niche in the home/garden/DIY or food-adjacent space** — specific enough to dominate on Pinterest and in long-tail search, broad enough to support 300+ articles. The pattern that wins in 2026:

> **Specific audience + visual outcome + repeat need** (e.g., "small-space vegetable gardening," "budget home organization," "cozy drinks & mocktails," "beginner crochet projects")

Every article should answer a query where the reader *needs the page* (a pattern, a plan, a recipe card, a before/after) — not a query an AI Overview can answer in two sentences.

---

## 4. Roadmap Implications

| Phase | Timeline | Milestone |
|---|---|---|
| 0. Foundation | Now | Pick sub-niche, buy domain (starts age clock), WordPress + GA4 + Grow plugin, legal pages |
| 1. Content sprint | Months 1–4 | 30–50 long-form posts, Pinterest from day 1 (multiple pins/post), email capture live |
| 2. Journey application | Month 4–5 | Need: 1,000 sessions/mo + 4-month-old site + 30 days of Grow data — very reachable via Pinterest alone |
| 3. First ad revenue | Months 5–12 | Journey ads live (~$11 avg RPM); SEO begins compounding; scale to 25K+ pageviews |
| 4. Full Mediavine / Raptive | Months 12–24 | $5K/yr revenue run-rate (Mediavine) or 25K pageviews + 50% Tier-1 (Raptive) |

---

## Sources
- [Mediavine official requirements](https://www.mediavine.com/mediavine-requirements/) · [New Mediavine requirements announcement](https://www.mediavine.com/blog/new-mediavine-requirements/)
- [Journey by Mediavine deep-dive (Productive Blogging, 2026)](https://www.productiveblogging.com/everything-you-need-to-know-about-journey-by-mediavine/)
- [Raptive drops requirement to 25K pageviews (Search Engine Journal)](https://www.searchenginejournal.com/raptive-drops-traffic-requirement-by-75-to-25000-views/558780/) · [Raptive eligibility (official)](https://help.raptive.com/hc/en-us/articles/360032840891-Who-is-eligible-for-Raptive) · [Raptive announcement](https://raptive.com/blog/opening-the-door-to-more-creators-who-meet-raptive-quality-standards/)
- [Mediavine & Raptive requirement changes (This Week in Blogging)](https://thisweekinblogging.com/mediavine-raptive-requirements/)
- [23 profitable niches from 5,000+ Mediavine/Raptive sites (The Website Flip)](https://thewebsiteflip.com/guide/profitable-niches-raptive-mediavine/) · [High RPM niches](https://www.prodreaminvestor.com/high-rpm-niches/) · [Mediavine vs Raptive RPM comparison](https://thisweekinblogging.com/mediavine-vs-raptive/)
- [SparkToro: <1/3 of Google searches send a click in 2026](https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/) · [AI SEO statistics 2026](https://www.position.digital/blog/ai-seo-statistics/) · [Food blog SEO in the AI era](https://memberkitchens.com/updates/food-blog-seo-guide)
- [Realistic new-blog SEO timeline 2026](https://wolfpackadvising.com/blog/how-to-plan-your-seo-timeline-for-maximum-traffic-in-2026/) · [Distribution-first blogging order](https://kamaldeen.com/articles/new-bloggers-building-backwards-2026)
