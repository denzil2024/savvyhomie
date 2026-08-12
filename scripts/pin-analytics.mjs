// Per-pin Pinterest analytics + health checks. Companion to pin-tracker.mjs:
// pin-tracker answers "what should I post next", this answers "is what we posted working".
//
// Run: node scripts/pin-analytics.mjs
//
// Reports, from real API data (not the CSV export):
//   1. Account totals vs. published benchmarks (save rate is the one that matters in 2026)
//   2. Every pin ranked by impressions, with save/click/outbound
//   3. Age-normalized first-3-day impressions by post-date cohort -> is per-pin reach growing or shrinking
//   4. First-3-day impressions by pin number -> is the 2nd/3rd pin to the same URL still worth posting
//   5. Which pins are still compounding (last-7-day share of lifetime impressions)
//   6. DUPLICATE IMAGE DETECTION - the same image bytes posted twice gets suppressed by Pinterest
//      and, worse, silently reused across two different articles. Both happened on this account.
import { writeFileSync } from 'node:fs'
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
    if (res.status === 429) { await sleep(3000 * (i + 1)); continue }
    const body = await res.json()
    if (!res.ok) throw new Error(`${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 200)}`)
    return body
  }
  throw new Error(`${path} -> gave up after ${tries} tries (rate limited?)`)
}

const end = new Date().toISOString().slice(0, 10)
const start = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
console.log(`=== PIN ANALYTICS (${start} to ${end}) ===\n`)

const boardsRes = await pinterest('/boards?page_size=100')
const rows = []
for (const board of boardsRes.items) {
  const pinsRes = await pinterest(`/boards/${board.id}/pins?page_size=100&pin_filter=all`)
  for (const p of pinsRes.items || []) {
    if (!p.is_owner) continue
    await sleep(320)
    const a = await pinterest(
      `/pins/${p.id}/analytics?start_date=${start}&end_date=${end}&metric_types=IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK`
    )
    const m = a.all?.summary_metrics || {}
    const created = p.created_at?.slice(0, 10) || ''
    const daily = (a.all?.daily_metrics || []).filter((d) => d.date >= created)
    // pinimg URLs embed a content hash - identical hash means identical image bytes
    const url = p.media?.images?.['600x']?.url || p.media?.images?.['150x150']?.url || ''
    const hash = (url.match(/\/([0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]+)\./) || [])[1] || url
    const slugM = (p.link || '').match(/\/blog\/([a-z0-9-]+)\/?/)
    rows.push({
      id: p.id, board: board.name, type: p.creative_type || '?', standard: p.is_standard,
      title: (p.title || '').slice(0, 55), link: p.link || '', created, hash,
      slug: slugM ? slugM[1] : (p.link || '').includes('a.co') ? 'STOREFRONT' : '?',
      imp: m.IMPRESSION ?? 0, save: m.SAVE ?? 0, click: m.PIN_CLICK ?? 0, out: m.OUTBOUND_CLICK ?? 0,
      daysAlive: daily.length,
      first3: daily.slice(0, 3).reduce((s, d) => s + (d.metrics.IMPRESSION || 0), 0),
      last7: daily.slice(-7).reduce((s, d) => s + (d.metrics.IMPRESSION || 0), 0),
    })
  }
}
const seen = {}
for (const r of rows.slice().sort((a, b) => a.created.localeCompare(b.created))) {
  seen[r.slug] = (seen[r.slug] || 0) + 1
  r.pinN = seen[r.slug]
}
writeFileSync('scripts/pin-analytics-latest.json', JSON.stringify(rows, null, 2))

// 1. Totals vs benchmark
const T = rows.reduce((s, r) => ({ imp: s.imp + r.imp, save: s.save + r.save, click: s.click + r.click, out: s.out + r.out }), { imp: 0, save: 0, click: 0, out: 0 })
const pct = (n, d) => d ? ((n / d) * 100).toFixed(2) + '%' : 'n/a'
console.log('--- ACCOUNT TOTALS ---')
console.log(`pins: ${rows.length}   impressions: ${T.imp}   pin clicks: ${T.click}   outbound: ${T.out}   saves: ${T.save}`)
console.log(`save rate:     ${pct(T.save, T.imp).padEnd(8)} (benchmark 0.20%-1.00% - THE ranking signal in 2026)`)
console.log(`outbound rate: ${pct(T.out, T.imp).padEnd(8)} (benchmark 0.20%-1.50%)`)
console.log(`pin click rate:${pct(T.click, T.imp)}`)

// 2. Creative type mix - standard pins convert ~2.5x better to outbound than IDEA pins
console.log('\n--- CREATIVE TYPE MIX ---')
const byType = {}
for (const r of rows) {
  const k = `${r.type} (is_standard=${r.standard})`
  byType[k] = byType[k] || { n: 0, imp: 0, save: 0, out: 0 }
  byType[k].n++; byType[k].imp += r.imp; byType[k].save += r.save; byType[k].out += r.out
}
for (const [k, v] of Object.entries(byType)) {
  console.log(`${k.padEnd(30)} pins:${String(v.n).padEnd(4)} imp:${String(v.imp).padEnd(7)} saves:${String(v.save).padEnd(4)} outbound:${String(v.out).padEnd(4)} outRate:${pct(v.out, v.imp)}`)
}

// 3. Duplicate images
console.log('\n--- DUPLICATE IMAGES (Pinterest suppresses re-uploads of the same bytes) ---')
const byHash = {}
for (const r of rows) { byHash[r.hash] = byHash[r.hash] || []; byHash[r.hash].push(r) }
let dupes = 0
for (const [h, arr] of Object.entries(byHash)) {
  if (arr.length < 2) continue
  dupes++
  const crossArticle = new Set(arr.map((r) => r.slug)).size > 1
  console.log(`\n  ${crossArticle ? '!! CROSS-ARTICLE REUSE !!' : 'same article, 2 boards'}  image ${h}`)
  arr.sort((a, b) => a.created.localeCompare(b.created)).forEach((r) =>
    console.log(`     ${r.created}  imp:${String(r.imp).padEnd(6)} out:${String(r.out).padEnd(4)} ${r.slug.padEnd(28)} ${r.board}`))
}
if (!dupes) console.log('  (none - every pin uses a unique image)')

// 4. Age-normalized initial reach by cohort
console.log('\n--- FIRST-3-DAY IMPRESSIONS BY POST DATE (is per-pin reach growing or shrinking?) ---')
const mature = rows.filter((r) => r.daysAlive >= 4)
const byDate = {}
for (const r of mature) { byDate[r.created] = byDate[r.created] || []; byDate[r.created].push(r.first3) }
for (const [d, arr] of Object.entries(byDate).sort()) {
  console.log(`  ${d}  n=${String(arr.length).padEnd(3)} avg: ${(arr.reduce((s, x) => s + x, 0) / arr.length).toFixed(1)}`)
}

// 5. Is the Nth pin to the same URL still worth it?
console.log('\n--- FIRST-3-DAY IMPRESSIONS BY PIN NUMBER (diminishing returns per URL?) ---')
const byN = {}
for (const r of mature) { byN[r.pinN] = byN[r.pinN] || []; byN[r.pinN].push(r.first3) }
for (const [n, arr] of Object.entries(byN).sort((a, b) => a[0] - b[0])) {
  console.log(`  pin-${String(n).padEnd(3)} n=${String(arr.length).padEnd(3)} avg: ${(arr.reduce((s, x) => s + x, 0) / arr.length).toFixed(1)}`)
}

// 6. Breakouts
console.log('\n--- STILL COMPOUNDING (last-7d impressions as share of lifetime) ---')
rows.filter((r) => r.imp >= 50).sort((a, b) => b.last7 - a.last7).slice(0, 12).forEach((r) =>
  console.log(`  ${String(r.last7).padStart(4)}/${String(r.imp).padEnd(6)} (${pct(r.last7, r.imp).padStart(7)})  ${r.created}  ${r.slug} pin-${r.pinN}`))

// 7. Full table
console.log('\n--- ALL PINS BY IMPRESSIONS ---')
console.log('imp    save  clk   out   date        pin#  slug                           board')
rows.sort((a, b) => b.imp - a.imp).forEach((r) => console.log(
  String(r.imp).padEnd(7), String(r.save).padEnd(5), String(r.click).padEnd(5), String(r.out).padEnd(5),
  r.created.padEnd(11), String(r.pinN).padEnd(5), r.slug.padEnd(30), r.board))
console.log(`\ntotal pins: ${rows.length}  (raw data written to scripts/pin-analytics-latest.json)`)
