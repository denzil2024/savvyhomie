import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:5180/'
const out = process.argv[3] || 'screenshot.png'
const width = Number(process.argv[4]) || 1440

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log('saved', out)
