import { chromium } from 'playwright'
import path from 'node:path'

const file = path.resolve('scripts/frame-mockup.html')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 760, height: 1300 } })
await page.goto('file://' + file.replace(/\\/g, '/'), { waitUntil: 'networkidle' })
await page.screenshot({ path: 'scripts/frame-mockup.png', fullPage: true })
await browser.close()
console.log('saved scripts/frame-mockup.png')
