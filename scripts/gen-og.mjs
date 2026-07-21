import { chromium } from 'playwright'
import path from 'node:path'

const file = path.resolve('scripts/og-template.html')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
await page.goto('file://' + file.replace(/\\/g, '/'), { waitUntil: 'networkidle' })
await page.screenshot({ path: 'public/og-image.png' })
await browser.close()
console.log('saved public/og-image.png')
