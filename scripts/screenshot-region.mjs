import { chromium } from 'playwright'

const url = process.argv[2]
const out = process.argv[3]
const width = Number(process.argv[4]) || 1440
const text = process.argv[5]
const offsetTop = Number(process.argv[6]) || -200
const height = Number(process.argv[7]) || 1400

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height } })
await page.goto(url, { waitUntil: 'networkidle' })
const y = await page.evaluate((t) => {
  const els = Array.from(document.querySelectorAll('h2, h3'))
  const el = els.find((e) => e.textContent.includes(t))
  if (!el) return -1
  return el.getBoundingClientRect().top + window.scrollY
}, text)
if (y < 0) {
  console.log('not found:', text)
  process.exit(1)
}
await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), Math.max(0, y + offsetTop))
await page.waitForTimeout(300)
await page.screenshot({ path: out })
await browser.close()
console.log('saved', out, 'at y=', y)
