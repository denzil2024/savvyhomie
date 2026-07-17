import { marked } from 'marked'

export const SITE = 'https://savvyhomie.com'
export const SITE_NAME = 'SavvyHomie'
export const TAGLINE = 'Smart finds for a home that works.'

export const categories = [
  { slug: 'gift-guides', name: 'Gift Guides', blurb: 'Gifts people actually keep — by person, occasion, and budget.' },
  { slug: 'kitchen-finds', name: 'Kitchen Finds', blurb: 'Gadgets and tools worth the drawer space.' },
  { slug: 'organization', name: 'Organization & Storage', blurb: 'Systems that end the clutter, room by room.' },
  { slug: 'decor-finds', name: 'Home Decor Finds', blurb: 'Pieces that look expensive without the price tag.' },
  { slug: 'seasonal', name: 'Seasonal', blurb: 'The right finds at the right time of year.' },
]

const files = import.meta.glob('../../content/posts/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta = {}
  let body = raw
  if (m) {
    body = m[2]
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':')
      if (i < 0) continue
      const key = line.slice(0, i).trim()
      const val = line.slice(i + 1).trim()
      meta[key] = key === 'products' ? JSON.parse(val) : val
    }
  }
  return { meta, body }
}

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(raw)
    return {
      slug,
      title: meta.title || slug,
      description: meta.description || '',
      category: meta.category || '',
      date: meta.date || '',
      updated: meta.updated || meta.date || '',
      products: meta.products || [],
      html: marked.parse(body),
    }
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

export function postsInCategory(slug) {
  return posts.filter((p) => p.category === slug)
}

export function getRoutes() {
  return ['/', ...categories.map((c) => `/category/${c.slug}/`), ...posts.map((p) => `/${p.slug}/`)]
}

export function metaFor(url) {
  const clean = url.replace(/\/+$/, '')
  if (clean === '' || url === '/') {
    return {
      title: `${SITE_NAME} — ${TAGLINE}`,
      description: 'Honest home & kitchen product roundups and gift guides. Every pick compared, pros and cons included.',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE },
    }
  }
  const catMatch = clean.match(/^\/category\/([^/]+)$/)
  if (catMatch) {
    const c = categories.find((x) => x.slug === catMatch[1])
    if (c) return {
      title: `${c.name} — ${SITE_NAME}`,
      description: c.blurb,
      jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.name, url: SITE + url },
    }
  }
  const post = posts.find((p) => `/${p.slug}` === clean)
  if (post) {
    const jsonLd = [{
      '@context': 'https://schema.org', '@type': 'Article',
      headline: post.title, description: post.description,
      dateModified: post.updated, datePublished: post.date,
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
    return { title: `${post.title} — ${SITE_NAME}`, description: post.description, jsonLd }
  }
  return { title: SITE_NAME, description: TAGLINE }
}
