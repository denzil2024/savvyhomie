import sharp from 'sharp'
import { readdirSync, unlinkSync, existsSync } from 'node:fs'
import path from 'node:path'

// Converts real content photos (product shots, covers, pins, category
// tiles, founder photo, the OG fallback) to .webp in place, then removes
// the original file. Skips anything that already has a .webp sibling, so
// it's safe to re-run whenever new images are dropped in. Logos/favicon
// are left alone on purpose — tiny UI assets, not the load-time problem.
const targets = [
  { dir: 'public/products', exts: ['.jpg', '.jpeg'] },
  { dir: 'public/covers', exts: ['.jpg', '.jpeg', '.png'] },
  { dir: 'public/pins', exts: ['.jpg', '.jpeg', '.png'] },
]
const singleFiles = ['public/og-image.png', 'public/founder.jpg', 'public/cat-decor-finds.jpg', 'public/cat-gift-guides.jpg', 'public/cat-kitchen-finds.jpg', 'public/cat-organization.jpg', 'public/cat-seasonal.jpg']

let converted = 0
let skipped = 0

async function convert(filePath) {
  const ext = path.extname(filePath)
  const webpPath = filePath.slice(0, -ext.length) + '.webp'
  if (existsSync(webpPath)) { skipped++; return }
  await sharp(filePath).webp({ quality: 82 }).toFile(webpPath)
  unlinkSync(filePath)
  converted++
  console.log('converted', filePath, '->', webpPath)
}

for (const { dir, exts } of targets) {
  if (!existsSync(dir)) continue
  for (const f of readdirSync(dir)) {
    if (exts.includes(path.extname(f).toLowerCase())) {
      await convert(path.join(dir, f))
    }
  }
}
for (const f of singleFiles) {
  if (existsSync(f)) await convert(f)
}

console.log(`done: ${converted} converted, ${skipped} already webp`)
