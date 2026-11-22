# Home Questions — Standing Outline Template

This is the locked, reusable outline for every post in the `home-questions` category (`CONTENT-PLAN-QUESTIONS.md`). Every new Home Questions post is built on this exact skeleton. Subheads get rewritten to fit the specific topic — the slots, their order, their counts, and their hard rules do not move or get invented ad hoc.

Derived from first principles (what a reader searching a real home problem actually needs, in order) and refined against Dataslayer's own connector-article template as a structural reference (not a content copy — wrong niche, kept only as inspiration for "every slot has a defined job and format").

---

```
Metadata block (frontmatter only — never renders in the article body, read only by search engines/crawlers)
  title — unique, question or statement form
  description — 155-160 chars, contains target keyword, own sentence structure (this + title are what Google shows in search results)
  answer — flat single-line scalar, 3-5 sentences, no markdown (feeds the site's Answer/FAQPage structured data for AEO/AI-citation)

H1 — the real question, title case

Quick Answer — exactly 2 short paragraphs, renders as real body content, first thing on the page
  Paragraph 1: the direct answer, no hedge, no setup
  Paragraph 2: names how many real causes exist and that the right fix depends on which one

TL;DR — 3 to 5 numbered bullets, naming every cause in the exact order covered below

<!-- products -->

Comparison table — OPTIONAL, only if the topic produces genuinely distinct, tell-apart-able symptoms
  4 columns typical (what you see / what it is / where it shows up / how to confirm), one row per real cause
  Omit entirely if the topic doesn't produce one — never forced


## SECTION 1: Is This Serious?
  One H2. A quick severity/urgency read before the reader invests time diagnosing.
    - Which causes are urgent (health/safety/damage risk) vs. which can wait
    - A bulleted "treat this as urgent if..." list, 2-4 items
    - A pro-tip blockquote if there's a genuine red-flag worth calling out — skip if none

## SECTION 2: Identifying / Diagnosing the Issue
  One H2. One H3 per real cause, 4 to 11 total depending on research.
  Each H3:
    - A bolded sentence stating the specific, checkable sign of this cause
    - A bullet list, 3-4 items, concrete sensory/physical tells (smell, texture, location, timing)
    - A pro-tip blockquote where a genuinely non-obvious trick exists for telling it apart from a lookalike — skip if none
  No fixes, no products, no mechanism explanation here — pure "is it this?"

## SECTION 3: The Causes
  One H2, named plainly for the topic. One H3 per cause, same order as Section 2.
  Each H3:
    - A bolded mechanism sentence — the real "why"
    - A bullet list, 2-4 items, contributing factors that make this cause worse or more likely
    - A pro-tip blockquote where a genuine non-obvious factor exists — skip if none
  Still no fixes, no products. This section explains, Section 2 only identified.

## SECTION 4: The Solutions
  One H2. H3 count is its OWN independent number, set only by how many genuinely distinct solutions the real research supports — can be more than, fewer than, or happen to equal Section 2/3's cause count, but is never forced to match it either way. Causes and solutions are counted separately, each from their own research.
  Each H3, MANDATORY full structure, every single time, no skipping:
    - A bolded action sentence — the specific thing to do about this cause
    - A bullet list, 2-3 items, real how-to specifics (how, how often, what to avoid doing wrong)
    - A pro-tip blockquote where a genuine technique/timing/sequencing trick exists — skip only the blockquote if none, never the product
    - A product card — REQUIRED on every single solution, no exceptions. Each product must be genuinely, specifically relevant to that exact cause's fix, not a generic catch-all reused across multiple causes.
  This is the primary section where products appear — every H3 here has one

## SECTION 5: How Long Until It's Actually Gone
  One H2. Per-cause or general, whichever the real content supports.
    - Realistic timeline for each fix to show results
    - What "it's working" looks like vs. "it's not working yet, move to the next step"
    - A pro-tip blockquote if there's a genuine way to tell early vs. late

## SECTION 6: If the Solution Doesn't Work
  One H2
    - What it means if the matched fix didn't resolve it (wrong cause, needs escalation, call a professional, deeper issue underneath)
    - A pro-tip blockquote if there's a genuine next-step trick worth flagging
  One internal link to a genuinely relevant published sibling, woven into this section's prose, confirmed reciprocal

## SECTION 7: Preventing It From Coming Back
  One H2, one H3 per cause or a general habits list, whichever the real content supports
    - Forward-looking habits/maintenance, distinct from the Section 4 fix itself
    - A product card here only if it's a genuinely different maintenance product than Section 4 already used — never a repeat
    - A pro-tip blockquote if there's a genuine habit worth flagging
  Second internal link here if a second genuinely relevant sibling exists

## FAQ
  Real PAA questions only, filtered to on-topic, <details><summary> accordion markup

## Final Thoughts
  2-3 sentences, restates the direct answer, zero new information
```

---

**Standing rules that still apply on top of this template (unchanged from CLAUDE.md):**
- Real top-10 SERP research before any outline is drawn.
- Owner approves the outline (with real section names, not generic placeholders) before any post file is written.
- Claude never sources products — hands the owner plain, single-concept Amazon search terms per Section 4/7 slot after outline approval.
- All of CLAUDE.md's banned-word, voice, and proofreading rules apply in full.
- Every post retrofitted or newly written under this template must still pass the full pre-push checklist (readTime, build verification, pin-tracker registration, reciprocal internal links).
