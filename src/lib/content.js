export const SITE = 'https://savvyhomie.com'
export const SITE_NAME = 'SavvyHomie'
export const TAGLINE = 'Thoughtful tips and finds for a home you love.'
export const PINTEREST_URL = 'https://www.pinterest.com/savvyhomie/'

// `topics` roughly mirrors the live Pinterest boards (boards that ARE a category,
// like "Gift Guides", are covered by the tile itself), but the two aren't forced
// to match word for word: this label is on-site copy, so it stays free of brand
// names like "Amazon" even if the linked Pinterest board is named differently for
// Pinterest's own search behavior. They link to the parent category page until
// each topic has its own pillar post; when one publishes, point its entry at that URL.
export const categories = [
  {
    slug: 'gift-guides',
    name: 'Gift Guides',
    blurb: "Gift guides sorted by the person, not just the occasion. We skip the generic gift-shop filler and focus on things a specific person, coffee lovers, new homeowners, the friend who has everything, would use.",
    topics: ['Gifts for Him', 'Gifts for Her'],
  },
  {
    slug: 'kitchen-finds',
    name: 'Kitchen Finds',
    blurb: 'Gadgets, tools, and kitchen tips that earn their spot on a counter or in a drawer. Every pick is checked against a cheaper option and a flashier one, so what makes the list is worth the space.',
    topics: ['Kitchen Gadgets & Finds'],
  },
  {
    slug: 'organization',
    name: 'Organization & Storage',
    blurb: 'Storage systems and organizing tips for pantries, closets, drawers, and the small spaces that collect clutter fastest. We focus on what fixes daily friction, not what just looks tidy in a photo.',
    topics: ['Small Space Ideas', 'Kitchen Organization', 'Bathroom Organization', 'Home Organization & Storage'],
  },
  {
    slug: 'decor-finds',
    name: 'Home Decor Finds',
    blurb: 'Decor tips and pieces that make a room feel finished without a full remodel budget. Lighting, textiles, and small changes that make the biggest visible difference for what they cost.',
    topics: ['Cozy Bedroom Ideas', 'Everyday Home Finds'],
  },
  {
    slug: 'seasonal',
    name: 'Seasonal',
    blurb: 'Holiday and seasonal guides, published early enough to plan around instead of scrambling last minute. Gift season, spring refreshes, and everything in between.',
    topics: ['Christmas Gift Ideas'],
  },
  {
    slug: 'home-questions',
    name: 'Home Questions',
    blurb: "Real answers to the judgment calls and 'is this normal' questions that come up living in a home: what's actually mold, why a space won't stay clean, and the stuff nobody tells you until you ask.",
    topics: [],
  },
]

export const slugifyTopic = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Hard SEO gate: a sub-topic never gets its own page/route/sitemap entry until it
// has this many real posts. A dedicated page with only 1-3 posts is thin content,
// it hurts ranking more than having no page at all. See FOUNDATION.md "SEO / AEO plan".
export const MIN_POSTS_FOR_TOPIC_PAGE = 4

// The post list is a store, not a module-level import. The server fills it from
// posts-server.js (every post, full bodies); the browser fills it from the inline
// `#sh-data` JSON on the page (light index + the one post being viewed). ES
// module live bindings mean every `import { posts }` sees the filled array.
// Nothing in src/ may import posts-server.js except the two entry files.
export let posts = []
export function setPosts(list) {
  posts = list
}

export function postsInCategory(slug) {
  return posts.filter((p) => p.category === slug)
}

// A topic only gets a real page once it has posts (see FOUNDATION.md's
// sub-topic hard gate) — this returns [] for topics with no posts yet,
// which callers use to decide whether the topic chip is clickable.
export function postsInTopic(categorySlug, topicSlug) {
  return posts.filter((p) => p.category === categorySlug && p.topic && slugifyTopic(p.topic) === topicSlug)
}

export function getRelatedPosts(slug, category, limit = 3) {
  const current = posts.find((p) => p.slug === slug)
  const pool = posts.filter((p) => p.slug !== slug && p.category === category)
  // Once a post has a topic (e.g. Gifts for Him vs Gifts for Her), related
  // posts must stay inside that same topic only, even if that means fewer
  // than `limit` results — topics are a hard split, never a soft preference,
  // so this never falls back to other topics in the same category.
  if (current?.topic) {
    return pool.filter((p) => p.topic === current.topic).slice(0, limit)
  }
  return pool.slice(0, limit)
}

export function getSitemapEntries() {
  const catLastmod = (slug) => {
    const catPosts = posts.filter((p) => p.category === slug && p.date)
    return catPosts.length ? catPosts.reduce((max, p) => (p.date > max ? p.date : max), catPosts[0].date) : undefined
  }
  const topicEntries = []
  for (const c of categories) {
    for (const t of c.topics || []) {
      const topicSlug = slugifyTopic(t)
      const tPosts = postsInTopic(c.slug, topicSlug)
      if (tPosts.length < MIN_POSTS_FOR_TOPIC_PAGE) continue
      const lastmod = tPosts.reduce((max, p) => (p.date > max ? p.date : max), tPosts[0].date)
      topicEntries.push({ loc: `/category/${c.slug}/${topicSlug}/`, lastmod })
    }
  }
  return [
    { loc: '/' }, { loc: '/about/' }, { loc: '/contact/' },
    { loc: '/privacy-policy/' }, { loc: '/cookie-policy/' }, { loc: '/terms-of-service/' }, { loc: '/affiliate-disclosure/' }, { loc: '/how-we-pick-products/' },
    ...categories.map((c) => ({ loc: `/category/${c.slug}/`, lastmod: catLastmod(c.slug) })),
    ...topicEntries,
    ...posts.map((p) => ({ loc: `/blog/${p.slug}/`, lastmod: p.date || undefined })),
  ]
}

export function getRoutes() {
  return getSitemapEntries().map((e) => e.loc)
}

// Frontmatter `updated` is human-readable ("August 4, 2026"); schema.org wants
// ISO 8601. `date` is already ISO (with or without a time) and passes through.
export function toISODate(s) {
  if (!s) return ''
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s
  const d = new Date(s)
  return isNaN(d) ? '' : d.toISOString().slice(0, 10)
}

const ORG = {
  '@type': 'Organization', '@id': SITE + '/#organization',
  name: SITE_NAME, url: SITE + '/',
  logo: { '@type': 'ImageObject', url: SITE + '/logo-color.png', width: 1692, height: 538 },
  sameAs: [PINTEREST_URL],
}

const breadcrumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })),
})

export function metaFor(url) {
  const clean = url.replace(/\/+$/, '')
  if (clean === '' || url === '/') {
    return {
      title: `${SITE_NAME} · ${TAGLINE}`,
      description: 'Practical home & kitchen tips, gift guides, and honest product picks, pros and cons included.',
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE + '/', publisher: { '@id': ORG['@id'] } },
        { '@context': 'https://schema.org', ...ORG },
      ],
    }
  }
  if (clean === '/about') {
    return {
      title: `About Carol · ${SITE_NAME}`,
      description: 'Carol is an interior design graduate of Parsons School of Design. SavvyHomie is her trained eye applied to everyday budgets: practical home tips and honest product picks, cons included.',
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'AboutPage', url: SITE + url,
        mainEntity: {
          '@type': 'Person', name: 'Carol', url: SITE + '/about/',
          alumniOf: { '@type': 'CollegeOrUniversity', name: 'Parsons School of Design' },
          sameAs: [PINTEREST_URL],
          worksFor: { '@id': ORG['@id'] },
          description: 'Interior design graduate of Parsons School of Design and founder of SavvyHomie.',
        },
      }, breadcrumbs([['Home', '/'], ['About', '/about/']])],
    }
  }
  if (clean === '/contact') {
    return {
      title: `Contact · ${SITE_NAME}`,
      description: 'Get in touch with SavvyHomie: report a broken link or wrong price, suggest a product, or reach out about a partnership.',
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: SITE + url }, breadcrumbs([['Home', '/'], ['Contact', '/contact/']])],
    }
  }
  const LEGAL_META = {
    '/privacy-policy': { title: 'Privacy Policy', description: `How ${SITE_NAME} collects, uses, and protects visitor information.` },
    '/cookie-policy': { title: 'Cookie Policy', description: `What cookies ${SITE_NAME} uses today, and what's planned.` },
    '/terms-of-service': { title: 'Terms of Service', description: `The terms for using ${SITE_NAME}.` },
    '/affiliate-disclosure': { title: 'Affiliate Disclosure', description: `How ${SITE_NAME} earns commission through the Amazon Associates program, and why it doesn't change our picks.` },
    '/how-we-pick-products': { title: 'How We Pick Products', description: `The method behind every roundup on ${SITE_NAME}: compared first, cons included, short on purpose.` },
  }
  if (LEGAL_META[clean]) {
    const m = LEGAL_META[clean]
    return {
      title: `${m.title} · ${SITE_NAME}`,
      description: m.description,
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: m.title, url: SITE + url }, breadcrumbs([['Home', '/'], [m.title, clean + '/']])],
    }
  }
  const topicMatch = clean.match(/^\/category\/([^/]+)\/([^/]+)$/)
  if (topicMatch) {
    const c = categories.find((x) => x.slug === topicMatch[1])
    const topicName = c?.topics?.find((t) => slugifyTopic(t) === topicMatch[2])
    if (c && topicName) return {
      title: `${topicName} · ${SITE_NAME}`,
      description: `Every ${topicName} guide on ${SITE_NAME}, all sorted so it's easy to find something that fits.`,
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: topicName, url: SITE + url },
        breadcrumbs([['Home', '/'], [c.name, `/category/${c.slug}/`], [topicName, clean + '/']]),
      ],
    }
  }
  const catMatch = clean.match(/^\/category\/([^/]+)$/)
  if (catMatch) {
    const c = categories.find((x) => x.slug === catMatch[1])
    if (c) return {
      title: `${c.name} · ${SITE_NAME}`,
      description: c.blurb,
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.name, url: SITE + url },
        breadcrumbs([['Home', '/'], [c.name, clean + '/']]),
      ],
    }
  }
  const post = posts.find((p) => `/blog/${p.slug}` === clean)
  if (post) {
    const cat = categories.find((c) => c.slug === post.category)
    const jsonLd = [{
      '@context': 'https://schema.org', '@type': 'Article',
      headline: post.title, description: post.description,
      image: post.cover ? [SITE + post.cover] : undefined,
      datePublished: toISODate(post.date), dateModified: toISODate(post.updated) || toISODate(post.date),
      author: { '@type': 'Person', name: 'Carol', url: SITE + '/about/' },
      publisher: ORG,
      mainEntityOfPage: SITE + url,
    }]
    jsonLd.push(breadcrumbs([['Home', '/'], ...(cat ? [[cat.name, `/category/${cat.slug}/`]] : []), [post.title, clean + '/']]))
    if (post.products.length) {
      jsonLd.push({
        '@context': 'https://schema.org', '@type': 'ItemList',
        itemListElement: post.products.map((pr, i) => ({
          '@type': 'ListItem', position: i + 1, name: pr.name, url: pr.url,
        })),
      })
    }
    if (post.faqs.length) {
      jsonLd.push({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
          '@type': 'Question', name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      })
    }
    // No " · SavvyHomie" suffix on posts: the titles are already 50-60 chars
    // of real keyword, the suffix pushed 35 of 66 past Google's cutoff.
    return {
      title: post.title, description: post.description, jsonLd,
      type: 'article', cover: post.cover, coverW: post.coverW, coverH: post.coverH, date: post.date, updated: toISODate(post.updated),
    }
  }
  return { title: SITE_NAME, description: TAGLINE }
}
