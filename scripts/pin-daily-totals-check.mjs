// One-off: real day-by-day account totals (not per-post-date cohort) to check whether a specific
// day (e.g. a day with no new posts) actually saw a genuine impressions/outbound spike, or whether
// that's just normal variance in older pins' ongoing reach.
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
const start = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10)

const boardsRes = await pinterest('/boards?page_size=100')
const byDate = {}
let count = 0
for (const board of boardsRes.items) {
  const pinsRes = await pinterest(`/boards/${board.id}/pins?page_size=100&pin_filter=all`)
  for (const p of pinsRes.items || []) {
    if (!p.is_owner) continue
    await sleep(320)
    count++
    const a = await pinterest(`/pins/${p.id}/analytics?start_date=${start}&end_date=${end}&metric_types=IMPRESSION,OUTBOUND_CLICK,SAVE`)
    for (const d of a.all?.daily_metrics || []) {
      byDate[d.date] = byDate[d.date] || { imp: 0, out: 0, save: 0 }
      byDate[d.date].imp += d.metrics.IMPRESSION || 0
      byDate[d.date].out += d.metrics.OUTBOUND_CLICK || 0
      byDate[d.date].save += d.metrics.SAVE || 0
    }
  }
}
console.log(`Summed daily metrics across ${count} owned pins, ${start} to ${end}\n`)
console.log('date        imp   out   save')
for (const [d, v] of Object.entries(byDate).sort()) {
  console.log(`${d}  ${String(v.imp).padStart(5)} ${String(v.out).padStart(5)} ${String(v.save).padStart(5)}`)
}
