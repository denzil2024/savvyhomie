import fs from 'node:fs'
import path from 'node:path'

const { render, getRoutes, getSitemapEntries, metaFor, realPosts, SITE, SITE_NAME } = await import('../dist/server/entry-server.js')

const outDir = 'dist/client'
const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const routes = getRoutes()
for (const url of routes) {
  const { html } = render(url)
  const m = metaFor(url)
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    `<link rel="canonical" href="${SITE + url}">`,
    `<meta property="og:title" content="${esc(m.title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${SITE + url}">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    m.jsonLd ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd)}</script>` : '',
  ].join('\n    ')

  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
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
${realPosts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/): ${p.description}`).join('\n') || '- First guides landing soon.'}
`
fs.writeFileSync(path.join(outDir, 'llms.txt'), llms)

console.log(`done: ${routes.length} routes, sitemap.xml, llms.txt`)
