import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('dist/client')
const port = process.env.PORT || 3000

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
}

const allowedCountries = new Set([
  'US', 'GB', 'CA', 'AU',
  'DE', 'FR', 'NL', 'IE', 'CH', 'SE', 'NO', 'DK', 'FI',
  'KE',
])

const botUA = /googlebot|bingbot|duckduckbot|slurp|baiduspider|yandexbot|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|gptbot|claudebot|perplexitybot|ahrefsbot|semrushbot|mj12bot/i

http.createServer((req, res) => {
  const country = req.headers['cf-ipcountry']
  const userAgent = req.headers['user-agent'] || ''
  const isBot = botUA.test(userAgent)
  if (!isBot && country && !allowedCountries.has(country)) {
    res.writeHead(403, { 'content-type': 'text/plain' })
    res.end('Access denied')
    return
  }

  const reqUrl = new URL(req.url, 'http://x')
  const urlPath = decodeURIComponent(reqUrl.pathname)

  // One canonical URL per page. Cloudflare already forces https; this collapses
  // the two remaining duplicates so Google never sees a second 200 for the same
  // content: www -> apex, and /blog/slug -> /blog/slug/ (every prerendered route
  // ends in a slash; files with an extension are left alone).
  const host = (req.headers.host || '').toLowerCase()
  const wantsSlash = !path.extname(urlPath) && !urlPath.endsWith('/')
  if (host.startsWith('www.') || wantsSlash) {
    const target = 'https://' + host.replace(/^www\./, '') + urlPath + (wantsSlash ? '/' : '') + reqUrl.search
    res.writeHead(301, { location: target, 'cache-control': 'public, max-age=86400' })
    res.end()
    return
  }

  let file = path.join(root, urlPath)
  if (!file.startsWith(root)) { res.writeHead(403).end(); return }

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
  if (!fs.existsSync(file) && !path.extname(file)) file = file + '/index.html'

  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    res.end('<h1>404 — page not found</h1><p><a href="/">Back to SavvyHomie</a></p>')
    return
  }

  const ext = path.extname(file)
  const cache = ext === '.html' ? 'public, max-age=300' : 'public, max-age=31536000, immutable'
  res.writeHead(200, { 'content-type': mime[ext] || 'application/octet-stream', 'cache-control': cache })
  fs.createReadStream(file).pipe(res)
}).listen(port, () => console.log(`SavvyHomie serving on :${port}`))
