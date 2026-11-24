// One-off: Home Questions posts embed product-card <img> as raw HTML in the
// markdown body (not the `products` frontmatter array), so they never got
// width/height from dimsOf() like roundup-format posts do. This is a real CLS
// risk on every Home Questions post. Adds width/height/loading/decoding
// straight into the stored HTML using the same image-dims.json already used
// elsewhere, then rewrites each file in place.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const dims = JSON.parse(readFileSync('src/lib/image-dims.json', 'utf8'))

const files = readdirSync('content/posts').filter((f) => f.endsWith('.md'))
let changedFiles = 0
let changedImgs = 0

for (const f of files) {
  const path = `content/posts/${f}`
  const raw = readFileSync(path, 'utf8')
  let fileChanged = false

  const next = raw.replace(
    /<img src="(\/products\/[^"]+)" alt="([^"]*)" class="product-photo">/g,
    (whole, src, alt) => {
      const [w, h] = dims[src] || []
      if (!w) return whole // leave unknown images untouched rather than guess
      fileChanged = true
      changedImgs++
      return `<img src="${src}" alt="${alt}" class="product-photo" width="${w}" height="${h}" loading="lazy" decoding="async">`
    }
  )

  if (fileChanged) {
    writeFileSync(path, next)
    changedFiles++
    console.log(`fixed ${f}`)
  }
}

console.log(`\n${changedImgs} images across ${changedFiles} files`)
