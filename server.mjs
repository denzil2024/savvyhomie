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

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
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
