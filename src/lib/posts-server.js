// SERVER-ONLY content source. This is the one module allowed to import every
// post's markdown (import.meta.glob) and the markdown parser. It is imported by
// entry-server.jsx (SSR build + prerender) and, in `npm run dev` only, lazily by
// entry-client.jsx. It must never be imported from App/pages/components: doing
// so would put all 66 posts' markdown back into the browser bundle (that was a
// 2.7 MB client JS payload before this split, see FOUNDATION.md status log).
//
// Browsers get their data from the inline `#sh-data` JSON that prerender.mjs
// writes into each page: a light index of every post (title/cover/dates, no
// bodies) plus the full record for the one post on that page. See pageData().
import { marked } from 'marked'
import imageDims from './image-dims.json'

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

// [w, h] for a /public path, or [] when unknown.
export const dimsOf = (src) => imageDims[src] || []

export const allPosts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(raw)
    // A `<!-- products -->` marker in the body splits the prose: everything
    // above it renders BEFORE the product cards (intro, context), everything
    // below renders after (analysis, FAQ, Final Thoughts). Without the marker
    // the whole body renders after the cards.
    const [introMd, ...restMd] = body.split(/<!--\s*products\s*-->/)
    const cover = meta.cover || ''
    const [coverW, coverH] = dimsOf(cover)
    const pin = meta.pin || ''
    const [pinW, pinH] = dimsOf(pin)
    const products = (meta.products || []).map((p) => {
      const [imageW, imageH] = dimsOf(p.image)
      return imageW ? { ...p, imageW, imageH } : p
    })
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
      cover, coverW, coverH,
      // Optional wide lifestyle photo (~2000px) for the homepage showcase well.
      hero: meta.hero || '',
      pin, pinW, pinH,
      products,
      demo: meta.demo === 'true',
      faqs: parseFaqs(body),
      introHtml: restMd.length ? marked.parse(introMd) : '',
      html: marked.parse(restMd.length ? restMd.join('\n') : body),
    }
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

// `demo: true` in frontmatter keeps a post out of llms.txt.
export const realPosts = allPosts.filter((p) => !p.demo)

// Everything list views (home, category, topic, related cards) read; no bodies.
const LIGHT_KEYS = ['slug', 'title', 'description', 'category', 'topic', 'date', 'updated', 'readTime', 'cover', 'coverW', 'coverH', 'hero', 'pin', 'demo']
export function lightPost(p) {
  const out = {}
  for (const k of LIGHT_KEYS) out[k] = p[k]
  out.answer = ''
  out.products = []
  out.faqs = []
  out.introHtml = ''
  out.html = ''
  return out
}

// The JSON a prerendered page inlines for the client to hydrate from. Order
// matches allPosts (date desc) so posts[0] is the same featured post everywhere.
export function pageData(url) {
  const clean = url.replace(/\/+$/, '')
  const current = allPosts.find((p) => `/blog/${p.slug}` === clean)
  return { posts: allPosts.map((p) => (p === current ? p : lightPost(p))) }
}
