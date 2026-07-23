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

const rows = []
for (const board of boards) {
  const pinsRes = await pinterest(`/boards/${board.id}/pins?page_size=100&pin_filter=all`)
  for (const p of pinsRes.items || []) {
    const now = new Date()
    const scheduledAt = p.publish_at ? new Date(p.publish_at) : null
    rows.push({
      board: board.name,
      own: p.is_owner ? 'OURS' : 'saved',
      scheduled: scheduledAt && scheduledAt > now ? 'SCHEDULED' : 'live',
      title: p.title || '(no title)',
      link: p.link || '',
      created: p.created_at?.slice(0, 10) || '',
      publishAt: p.publish_at || '',
    })
  }
}

const ownRows = rows.filter((r) => r.own === 'OURS')
const savedRows = rows.filter((r) => r.own === 'saved')
const scheduledRows = rows.filter((r) => r.scheduled === 'SCHEDULED')

console.log('=== BOARD SUMMARY ===')
console.log('board'.padEnd(32), 'pins'.padEnd(6), 'ours'.padEnd(6), 'saved'.padEnd(6), 'scheduled')
for (const b of boards) {
  const own = rows.filter((r) => r.board === b.name && r.own === 'OURS').length
  const saved = rows.filter((r) => r.board === b.name && r.own === 'saved').length
  const sched = rows.filter((r) => r.board === b.name && r.scheduled === 'SCHEDULED').length
  console.log(b.name.padEnd(32), String(b.pin_count).padEnd(6), String(own).padEnd(6), String(saved).padEnd(6), String(sched))
}

console.log('\n=== OUR PINS: LIVE ===')
console.log('date'.padEnd(12), 'board'.padEnd(22), 'title')
for (const r of ownRows.filter((r) => r.scheduled === 'live').sort((a, b) => a.created.localeCompare(b.created))) {
  console.log(r.created.padEnd(12), r.board.padEnd(22), r.title)
}

console.log('\n=== OUR PINS: SCHEDULED ===')
console.log('publish at'.padEnd(20), 'board'.padEnd(22), 'title')
for (const r of scheduledRows.sort((a, b) => a.publishAt.localeCompare(b.publishAt))) {
  console.log(r.publishAt.padEnd(20), r.board.padEnd(22), r.title)
}
if (scheduledRows.length === 0) console.log('(none found)')

console.log('\n=== SAVED / REPINNED (not ours):', savedRows.length, 'total ===')
