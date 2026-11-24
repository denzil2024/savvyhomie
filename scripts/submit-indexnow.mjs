// Submits changed/new URLs to IndexNow (pings Bing, which shares with other
// participating engines) so pages don't sit waiting for a crawl. Run manually
// after a push, pass slugs changed since the last submission, or --all to
// resubmit the whole sitemap. Key file lives at public/<key>.txt, same key
// used in the API call, per the IndexNow spec.
import { readFileSync } from 'node:fs'

const SITE = 'https://savvyhomie.com'
const KEY = '5712845dac5f4756ba254078a62e3de2'
const KEY_LOCATION = `${SITE}/${KEY}.txt`

function urlsFromSitemap() {
  const xml = readFileSync('dist/client/sitemap.xml', 'utf8')
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
}

function urlsFromArgs(args) {
  return args.map((slug) => {
    if (slug.startsWith('http')) return slug
    if (slug === '/' || slug === '') return `${SITE}/`
    return `${SITE}/blog/${slug.replace(/^\/+|\/+$/g, '')}/`
  })
}

const args = process.argv.slice(2)
const urlList = args[0] === '--all' ? urlsFromSitemap() : urlsFromArgs(args)

if (!urlList.length) {
  console.error('Usage: node scripts/submit-indexnow.mjs <slug> [<slug> ...]  OR  --all')
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'savvyhomie.com',
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
})

console.log(`submitted ${urlList.length} url(s), status ${res.status}`)
if (res.status >= 300) console.log(await res.text())
urlList.forEach((u) => console.log(' -', u))
