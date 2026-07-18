import { PNG } from 'pngjs'
import fs from 'node:fs'

// Chroma-keys a flat background color to transparent (with soft edge antialiasing),
// since the raw Canva exports are opaque PNGs (no alpha channel). Then crops to the
// visible artwork's bounding box (+ margin) — the source canvas has large empty
// padding around a small mark, which made it render tiny when scaled by height alone.
function process(inPath, outPath, targetIsWhite, marginFrac = 0.06) {
  let png = PNG.sync.read(fs.readFileSync(inPath))
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2]
    const lum = (r + g + b) / 3
    let alpha
    if (targetIsWhite) alpha = lum < 235 ? 255 : Math.max(0, 255 - (lum - 235) * 17)
    else alpha = lum > 20 ? 255 : Math.max(0, lum * 12.75)
    png.data[i + 3] = Math.round(Math.min(255, Math.max(0, alpha)))
  }

  let minX = png.width, minY = png.height, maxX = 0, maxY = 0
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const a = png.data[(png.width * y + x) * 4 + 3]
      if (a > 10) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const w = maxX - minX + 1, h = maxY - minY + 1
  const mx = Math.round(w * marginFrac), my = Math.round(h * marginFrac)
  const cx = Math.max(0, minX - mx), cy = Math.max(0, minY - my)
  const cw = Math.min(png.width - cx, w + mx * 2), ch = Math.min(png.height - cy, h + my * 2)

  const out = new PNG({ width: cw, height: ch })
  PNG.bitblt(png, out, cx, cy, cw, ch, 0, 0)
  fs.writeFileSync(outPath, PNG.sync.write(out))
  console.log('wrote', outPath, `${cw}x${ch}`, `(cropped from ${png.width}x${png.height})`)
}

process('brand/savvy-homie-logo.png', 'public/logo.png', true)
process('brand/savvy-homie-favicon.png', 'public/favicon.png', false)
