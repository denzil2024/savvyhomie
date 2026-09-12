// Real day-of-week performance across all owned pins (90-day max window the API allows).
// Pinterest's organic /pins/{id}/analytics endpoint has no hour-level granularity (that only
// exists on the separate Ads Analytics product, which this account doesn't use) - day-of-week
// is the finest real signal available for "when is our audience actually active."
// Dates are UTC per Pinterest's own docs, so weekday labels are UTC-day, not US-local-day.
import { loadEnv } from './pinterest-env.mjs'
import { refreshAccessToken } from './pinterest-refresh.mjs'

let { PINTEREST_ACCESS_TOKEN } = loadEnv()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function pinterest(path, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(`https://api.pinterest.com/v5${path}`, {
      headers: { Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}` },
    })
    if (res.status === 401) { PINTEREST_ACCESS_TOKEN = await refreshAccessToken(); continue }
    if (res.status === 429 || res.status === 500) { await sleep(3000 * (i + 1)); continue }
    const body = await res.json()
    if (!res.ok) throw new Error(`${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 200)}`)
    return body
  }
  throw new Error(`${path} -> gave up after ${tries} tries`)
}

const end = new Date().toISOString().slice(0, 10)
const start = new Date(Date.now() - 89 * 86400000).toISOString().slice(0, 10)

const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const byDow = DOW.map(() => ({ imp: 0, out: 0, save: 0, dayCount: 0 }))
const seenDates = new Set()

const boardsRes = await pinterest('/boards?page_size=100')
let count = 0
for (const board of boardsRes.items) {
  const pinsRes = await pinterest(`/boards/${board.id}/pins?page_size=100&pin_filter=all`)
  for (const p of pinsRes.items || []) {
    if (!p.is_owner) continue
    await sleep(320)
    count++
    const a = await pinterest(`/pins/${p.id}/analytics?start_date=${start}&end_date=${end}&metric_types=IMPRESSION,OUTBOUND_CLICK,SAVE`)
    for (const d of a.all?.daily_metrics || []) {
      const dow = new Date(`${d.date}T00:00:00Z`).getUTCDay()
      byDow[dow].imp += d.metrics.IMPRESSION || 0
      byDow[dow].out += d.metrics.OUTBOUND_CLICK || 0
      byDow[dow].save += d.metrics.SAVE || 0
      const dateDowKey = `${d.date}`
      if (!seenDates.has(dateDowKey)) {
        seenDates.add(dateDowKey)
        byDow[dow].dayCount++
      }
    }
  }
}

console.log(`Summed daily metrics across ${count} owned pins, ${start} to ${end} (UTC dates)\n`)
console.log('weekday      calendar-days   total-imp   avg-imp/day   total-out   total-save')
for (let i = 0; i < 7; i++) {
  const v = byDow[i]
  const avgImp = v.dayCount ? Math.round(v.imp / v.dayCount) : 0
  console.log(
    `${DOW[i].padEnd(12)} ${String(v.dayCount).padStart(13)}   ${String(v.imp).padStart(9)}   ${String(avgImp).padStart(11)}   ${String(v.out).padStart(9)}   ${String(v.save).padStart(10)}`
  )
}

const ranked = byDow
  .map((v, i) => ({ day: DOW[i], avgImp: v.dayCount ? v.imp / v.dayCount : 0 }))
  .sort((a, b) => b.avgImp - a.avgImp)
console.log('\nRanked by avg impressions/day (highest first):')
for (const r of ranked) console.log(`  ${r.day}: ${Math.round(r.avgImp)}`)
