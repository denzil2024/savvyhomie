import fs from 'node:fs'
import path from 'node:path'

const { render, getRoutes, getSitemapEntries, metaFor, pageData, realPosts, SITE, SITE_NAME } = await import('../dist/server/entry-server.js')

const outDir = 'dist/client'
const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
// JSON inside <script>: `<` must not be able to close the tag. \u003c is still
// valid JSON and parses back to `<`.
const jsonForScript = (v) => JSON.stringify(v).replace(/</g, '\u003c')

const routes = getRoutes()
for (const url of routes) {
  const { html } = render(url)
  const m = metaFor(url)
  const isArticle = m.type === 'article'
  const image = m.cover ? SITE + m.cover : SITE + '/og-image.webp'
  const imageW = m.cover ? m.coverW : 1200
  const imageH = m.cover ? m.coverH : 630
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    `<link rel="canonical" href="${SITE + url}">`,
    // The cover is the LCP element on every post; start fetching it before the CSS has even parsed.
    isArticle && m.cover ? `<link rel="preload" as="image" href="${m.cover}" fetchpriority="high">` : '',
    `<meta property="og:title" content="${esc(m.title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:type" content="${isArticle ? 'article' : 'website'}">`,
    `<meta property="og:url" content="${SITE + url}">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:image" content="${image}">`,
    imageW ? `<meta property="og:image:width" content="${imageW}">` : '',
    imageH ? `<meta property="og:image:height" content="${imageH}">` : '',
    isArticle ? `<meta property="article:published_time" content="${m.date}">` : '',
    isArticle && m.updated ? `<meta property="article:modified_time" content="${m.updated}">` : '',
    isArticle ? `<meta property="article:author" content="Carol">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    m.jsonLd ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd)}</script>` : '',
  ].filter(Boolean).join('\n    ')

  const data = `<script id="sh-data" type="application/json">${jsonForScript(pageData(url))}</script>`
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html).replace('<!--app-data-->', data)
  const file = url === '/' ? 'index.html' : url.replace(/^\//, '').replace(/\/$/, '') + '/index.html'
  const target = path.join(outDir, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, page)
  console.log('prerendered', url)
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${getSitemapEntries().map((e) => `  <url><loc>${SITE + e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)

const llms = `# ${SITE_NAME}

> Honest home & kitchen product roundups and gift guides. Every pick compared, pros and cons included, curated by a human editor.

## Guides
${realPosts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/): ${p.description}`).join('\n') || '- First guides coming soon.'}
`
fs.writeFileSync(path.join(outDir, 'llms.txt'), llms)

console.log(`done: ${routes.length} routes, sitemap.xml, llms.txt`)
