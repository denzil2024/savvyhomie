// Writes src/lib/image-dims.json: { "/products/x.webp": [w, h], ... } for every
// image under public/ that the site references from frontmatter or JSX. The
// build reads it so every <img> can carry real width/height attributes (no
// layout shift, passes Lighthouse "unsized images"). Zero dependencies: reads
// WebP/PNG headers directly, so it runs anywhere the build runs. Re-run after
// adding images (`npm run build` runs it automatically).
import fs from 'node:fs'
import path from 'node:path'

const PUB = 'public'
const OUT = 'src/lib/image-dims.json'
const DIRS = ['', 'products', 'covers', 'pins']

function dims(file) {
  const fd = fs.openSync(file, 'r')
  const b = Buffer.alloc(40)
  fs.readSync(fd, b, 0, 40, 0)
  fs.closeSync(fd)
  if (b.toString('ascii', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)]
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16)
    if (chunk === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
    if (chunk === 'VP8L') {
      const w = 1 + (((b[22] & 0x3f) << 8) | b[21])
      const h = 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6))
      return [w, h]
    }
    if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
  }
  return null
}

const map = {}
for (const d of DIRS) {
  const dir = path.join(PUB, d)
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(webp|png)$/i.test(f)) continue
    const full = path.join(dir, f)
    if (!fs.statSync(full).isFile()) continue
    const wh = dims(full)
    if (wh) map['/' + (d ? d + '/' : '') + f] = wh
  }
}
fs.writeFileSync(OUT, JSON.stringify(map))
console.log(`image-dims: ${Object.keys(map).length} images -> ${OUT}`)
