import { marked } from 'marked'

export const SITE = 'https://savvyhomie.com'
export const SITE_NAME = 'SavvyHomie'
export const TAGLINE = 'Thoughtful tips and finds for a home you love.'

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
]

export const slugifyTopic = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Hard SEO gate: a sub-topic never gets its own page/route/sitemap entry until it
// has this many real posts. A dedicated page with only 1-3 posts is thin content,
// it hurts ranking more than having no page at all. See FOUNDATION.md "SEO / AEO plan".
export const MIN_POSTS_FOR_TOPIC_PAGE = 4

const files = import.meta.glob('../../content/posts/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta = {}
  let body = raw
  if (m) {
    body = m[2]
    const lines = m[1].split(/\r?\n/)
    const depthOf = (s) => [...s].reduce((d, ch) => d + (ch === '[' || ch === '{' ? 1 : ch === ']' || ch === '}' ? -1 : 0), 0)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const idx = line.indexOf(':')
      if (idx < 0) continue
      const key = line.slice(0, idx).trim()
      const rest = line.slice(idx + 1).trim()
      if (rest.startsWith('[') || rest.startsWith('{')) {
        let buf = rest
        let depth = depthOf(buf)
        while (depth > 0 && i + 1 < lines.length) {
          i++
          buf += '\n' + lines[i]
          depth += depthOf(lines[i])
        }
        meta[key] = JSON.parse(buf)
      } else {
        meta[key] = rest
      }
    }
  }
  return { meta, body }
}

const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

function parseFaqs(raw) {
  const faqs = []
  const re = /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g
  let m
  while ((m = re.exec(raw))) {
    faqs.push({ question: stripTags(m[1]), answer: stripTags(m[2]) })
  }
  return faqs
}

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(raw)
    // A `<!-- products -->` marker in the body splits the prose: everything
    // above it renders BEFORE the product cards (intro, context), everything
    // below renders after (analysis, how-we-chose, FAQ). Without the marker
    // the whole body renders after the cards, as before.
    const [introMd, ...restMd] = body.split(/<!--\s*products\s*-->/)
    return {
      slug,
      title: meta.title || slug,
      description: meta.description || '',
      category: meta.category || '',
      topic: meta.topic || '',
      date: meta.date || '',
      updated: meta.updated || meta.date || '',
      answer: meta.answer || '',
      readTime: meta.readTime || '',
      cover: meta.cover || '',
      // Optional wide lifestyle photo (~2000px) for the homepage showcase well.
      // The cover is finished pin artwork with the title lettered into it, so it
      // can't sit behind the showcase card; without a `hero` the homepage falls
      // back to showing the cover whole beside the card instead.
      hero: meta.hero || '',
      pin: meta.pin || '',
      products: meta.products || [],
      demo: meta.demo === 'true',
      faqs: parseFaqs(body),
      introHtml: restMd.length ? marked.parse(introMd) : '',
      html: marked.parse(restMd.length ? restMd.join('\n') : body),
    }
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

// `demo: true` in frontmatter keeps a post out of llms.txt — slug prefix and description
// wording were tried first and both proved unreliable (see FOUNDATION.md).
export const realPosts = posts.filter((p) => !p.demo)

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

export function metaFor(url) {
  const clean = url.replace(/\/+$/, '')
  if (clean === '' || url === '/') {
    return {
      title: `${SITE_NAME} · ${TAGLINE}`,
      description: 'Practical home & kitchen tips, gift guides, and honest product picks, pros and cons included.',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE },
    }
  }
  if (clean === '/about') {
    return {
      title: `About Carol · ${SITE_NAME}`,
      description: 'Carol is an interior design graduate of Parsons School of Design. SavvyHomie is her trained eye applied to everyday budgets: practical home tips and honest product picks, cons included.',
      jsonLd: {
        '@context': 'https://schema.org', '@type': 'AboutPage', url: SITE + url,
        mainEntity: {
          '@type': 'Person', name: 'Carol', url: SITE + '/about/',
          alumniOf: { '@type': 'CollegeOrUniversity', name: 'Parsons School of Design' },
          sameAs: ['https://www.pinterest.com/savvyhomie/'],
          description: 'Interior design graduate of Parsons School of Design and founder of SavvyHomie.',
        },
      },
    }
  }
  if (clean === '/contact') {
    return {
      title: `Contact · ${SITE_NAME}`,
      description: 'Get in touch with SavvyHomie: report a broken link or wrong price, suggest a product, or reach out about a partnership.',
      jsonLd: { '@context': 'https://schema.org', '@type': 'ContactPage', url: SITE + url },
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
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: m.title, url: SITE + url },
    }
  }
  const topicMatch = clean.match(/^\/category\/([^/]+)\/([^/]+)$/)
  if (topicMatch) {
    const c = categories.find((x) => x.slug === topicMatch[1])
    const topicName = c?.topics?.find((t) => slugifyTopic(t) === topicMatch[2])
    if (c && topicName) return {
      title: `${topicName} · ${SITE_NAME}`,
      description: `Every ${topicName} guide on ${SITE_NAME}, all sorted so it's easy to find something that fits.`,
      jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: topicName, url: SITE + url },
    }
  }
  const catMatch = clean.match(/^\/category\/([^/]+)$/)
  if (catMatch) {
    const c = categories.find((x) => x.slug === catMatch[1])
    if (c) return {
      title: `${c.name} · ${SITE_NAME}`,
      description: c.blurb,
      jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.name, url: SITE + url },
    }
  }
  const post = posts.find((p) => `/blog/${p.slug}` === clean)
  if (post) {
    const jsonLd = [{
      '@context': 'https://schema.org', '@type': 'Article',
      headline: post.title, description: post.description,
      dateModified: post.updated, datePublished: post.date,
      author: { '@type': 'Person', name: 'Carol', url: SITE + '/about/' },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: SITE + url,
    }]
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
    return {
      title: `${post.title} · ${SITE_NAME}`, description: post.description, jsonLd,
      type: 'article', cover: post.cover, date: post.date,
    }
  }
  return { title: SITE_NAME, description: TAGLINE }
}
