import { loadEnv } from './pinterest-env.mjs'
import { refreshAccessToken } from './pinterest-refresh.mjs'

let { PINTEREST_ACCESS_TOKEN } = loadEnv()

async function pinterest(path) {
  let res = await fetch(`https://api.pinterest.com/v5${path}`, {
    headers: { Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}` },
  })
  if (res.status === 401) {
    PINTEREST_ACCESS_TOKEN = await refreshAccessToken()
    res = await fetch(`https://api.pinterest.com/v5${path}`, {
      headers: { Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}` },
    })
  }
  const body = await res.json()
  if (!res.ok) throw new Error(`${path} -> ${res.status}: ${JSON.stringify(body)}`)
  return body
}

const boardsRes = await pinterest('/boards?page_size=100')
const boards = boardsRes.items
const allPins = []
for (const board of boards) {
  const pinsRes = await pinterest(`/boards/${board.id}/pins?page_size=100&pin_filter=all`)
  for (const p of pinsRes.items || []) {
    if (!p.is_owner) continue
    allPins.push({
      id: p.id,
      board: board.name,
      title: p.title || '',
      link: p.link || '',
      created: p.created_at?.slice(0, 10) || '',
    })
  }
}

console.log(`=== CHECKING ${allPins.length} LIVE PINS ACROSS ${boards.length} BOARDS ===\n`)

const linkPattern = /^https:\/\/savvyhomie\.com\/blog\/[a-z0-9-]+\/?$/
const bad = []
const goodButUnverified = []

for (const p of allPins) {
  if (!p.link) {
    bad.push({ ...p, reason: 'no link at all' })
    continue
  }
  if (!linkPattern.test(p.link)) {
    bad.push({ ...p, reason: 'wrong URL shape (missing /blog/ prefix or malformed)' })
    continue
  }
  goodButUnverified.push(p)
}

console.log(`Shape-broken links: ${bad.length}`)
for (const p of bad) {
  console.log(`  [${p.board}] "${p.title.slice(0, 50)}" (${p.created}) -> ${p.link || '(empty)'}  [${p.reason}]`)
}

console.log(`\nCorrectly-shaped links: ${goodButUnverified.length}`)

// Now live-check each correctly-shaped link actually resolves (200, not 404)
console.log(`\n=== LIVE HTTP CHECK ON ${goodButUnverified.length} CORRECTLY-SHAPED LINKS ===`)
const httpBad = []
for (const p of goodButUnverified) {
  try {
    const res = await fetch(p.link, { method: 'HEAD', redirect: 'follow' })
    if (!res.ok) {
      httpBad.push({ ...p, status: res.status })
      console.log(`  [${p.board}] "${p.title.slice(0, 50)}" -> ${p.link} -> HTTP ${res.status}`)
    }
  } catch (e) {
    httpBad.push({ ...p, status: 'fetch error: ' + e.message })
    console.log(`  [${p.board}] "${p.title.slice(0, 50)}" -> ${p.link} -> ERROR ${e.message}`)
  }
}
if (httpBad.length === 0) console.log('  (none - all correctly-shaped links resolved fine)')

console.log(`\n=== SUMMARY ===`)
console.log(`Total pins: ${allPins.length}`)
console.log(`Shape-broken: ${bad.length}`)
console.log(`Shape-OK but HTTP-broken: ${httpBad.length}`)
console.log(`Fully OK: ${allPins.length - bad.length - httpBad.length}`)
