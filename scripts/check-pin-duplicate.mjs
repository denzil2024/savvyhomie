// MANDATORY pre-post check: before ever recommending a local pin-drop file, run this to confirm
// its bytes aren't already live somewhere on the account (under this slug's "next number" or any
// other). Root cause this exists for: a tracker pin-count ("1/10 posted") was trusted to mean
// "pin-1.png is the one live," when actually pin-2.png's bytes had been posted as the first pin by
// mistake days earlier — recommending pin-2.png again created a real duplicate. The tracker counts
// pins, it does not verify which local file is behind each live one. This script does.
//
// Usage: node scripts/check-pin-duplicate.mjs pin-drops/<slug>/<file>.png [more files...]
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { loadEnv } from './pinterest-env.mjs'
import { refreshAccessToken } from './pinterest-refresh.mjs'

const files = process.argv.slice(2)
if (!files.length) { console.error('Usage: node scripts/check-pin-duplicate.mjs <file.png> [more...]'); process.exit(1) }

let { PINTEREST_ACCESS_TOKEN } = loadEnv()
async function pinterest(path, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(`https://api.pinterest.com/v5${path}`, {
      headers: { Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}` },
    })
    if (res.status === 401) { PINTEREST_ACCESS_TOKEN = await refreshAccessToken(); continue }
    if (res.status === 429 || res.status === 500) { await new Promise((r) => setTimeout(r, 3000 * (i + 1))); continue }
    const body = await res.json()
    if (!res.ok) throw new Error(`${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 200)}`)
    return body
  }
  throw new Error(`${path} -> gave up after ${tries} tries`)
}

console.log('Pulling every live pin on the account (this is the only reliable source of truth)...\n')
const boardsRes = await pinterest('/boards?page_size=100')
const liveHashes = [] // { hash, slug, board, id, created }
for (const board of boardsRes.items) {
  const pinsRes = await pinterest(`/boards/${board.id}/pins?page_size=100&pin_filter=all`)
  for (const p of pinsRes.items || []) {
    if (!p.is_owner) continue
    const url = p.media?.images?.['600x']?.url || p.media?.images?.['150x150']?.url || ''
    // pinimg URLs look like .../e0/c3/15/e0c315f6f4275abf4b2c409972fa6397.jpg - the folder
    // prefixes are just the hash's own first bytes; the real hash is the last path segment.
    const hash = (url.match(/\/([0-9a-f]{32,})\./) || [])[1] || url
    liveHashes.push({ hash, board: board.name, id: p.id, created: p.created_at, link: p.link })
  }
}

let anyDupe = false
for (const file of files) {
  const localHash = createHash('md5').update(readFileSync(file)).digest('hex')
  const match = liveHashes.find((h) => h.hash === localHash)
  if (match) {
    anyDupe = true
    console.log(`!! DUPLICATE: ${file}`)
    console.log(`   already live as https://www.pinterest.com/pin/${match.id}/ (posted ${match.created}, board: ${match.board}, links to ${match.link})`)
    console.log(`   DO NOT post this file again.\n`)
  } else {
    console.log(`OK, genuinely new: ${file}\n`)
  }
}
if (anyDupe) process.exitCode = 1
