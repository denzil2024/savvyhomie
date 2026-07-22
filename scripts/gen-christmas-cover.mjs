import { chromium } from 'playwright'
import path from 'node:path'

const file = path.resolve('scripts/christmas-cover-template.html')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })
await page.goto('file://' + file.replace(/\\/g, '/'), { waitUntil: 'networkidle' })
await page.screenshot({ path: 'public/covers/christmas-gift-ideas.jpg', quality: 90, type: 'jpeg' })
await browser.close()
console.log('saved public/covers/christmas-gift-ideas.jpg')
