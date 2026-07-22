import { chromium } from 'playwright'
import path from 'node:path'

const file = path.resolve('scripts/christmas-pin-template.html')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 2 })
await page.goto('file://' + file.replace(/\\/g, '/'), { waitUntil: 'networkidle' })
await page.screenshot({ path: 'scripts/christmas-pin-draft-1.png' })
await browser.close()
console.log('saved scripts/christmas-pin-draft-1.png')
