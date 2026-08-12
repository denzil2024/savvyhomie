// Posts a real Standard Pin via Pinterest's API (POST /v5/pins) — the one format the Pinterest
// app's "Create Pin" flow no longer lets you choose manually (it silently makes Idea Pins instead).
// This is the only way to actually post a Standard Pin on this account right now.
//
// Usage:
//   node scripts/post-standard-pin.mjs --image "pin-drops/slug/file.png" --board "Board Name" \
//     --title "..." --description "..." --link "https://savvyhomie.com/blog/slug/" --alt "..."
//
// Nothing posts without all five flags supplied explicitly — this hits the live API, no dry-run.
import { readFileSync } from 'node:fs'
import { loadEnv } from './pinterest-env.mjs'
import { refreshAccessToken } from './pinterest-refresh.mjs'

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { out[argv[i].slice(2)] = argv[i + 1]; i++ }
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
const REQUIRED = ['image', 'board', 'title', 'description', 'link', 'alt']
const missing = REQUIRED.filter((k) => !args[k])
if (missing.length) {
  console.error(`Missing required flags: ${missing.map((m) => `--${m}`).join(', ')}`)
  process.exit(1)
}

let { PINTEREST_ACCESS_TOKEN } = loadEnv()
async function pinterest(path, options = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(`https://api.pinterest.com/v5${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}`, ...(options.headers || {}) },
    })
    if (res.status === 401) { PINTEREST_ACCESS_TOKEN = await refreshAccessToken(); continue }
    const body = await res.json()
    if (!res.ok) throw new Error(`${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 400)}`)
    return body
  }
  throw new Error(`${path} -> gave up after ${tries} tries`)
}

// 1. Resolve board name -> board_id
const boardsRes = await pinterest('/boards?page_size=100')
const board = boardsRes.items.find((b) => b.name.toLowerCase() === args.board.toLowerCase())
if (!board) {
  console.error(`Board "${args.board}" not found. Live boards: ${boardsRes.items.map((b) => b.name).join(', ')}`)
  process.exit(1)
}

// 2. Read + base64-encode the image
const ext = args.image.split('.').pop().toLowerCase()
const contentType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : null
if (!contentType) { console.error(`Unsupported image type: .${ext} (use .png or .jpg)`); process.exit(1) }
const data = readFileSync(args.image).toString('base64')

// 3. Create the pin — omitting board_id from media_source is what makes this a Standard Pin,
// not an Idea Pin (Idea Pins aren't creatable through this endpoint at all).
console.log(`Posting Standard Pin to "${board.name}"...`)
const pin = await pinterest('/pins', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    board_id: board.id,
    title: args.title,
    description: args.description,
    link: args.link,
    alt_text: args.alt,
    media_source: { source_type: 'image_base64', content_type: contentType, data },
  }),
})

console.log(`Posted: https://www.pinterest.com/pin/${pin.id}/`)
console.log(`Type check (should be standard): creative_type=${pin.creative_type}`)
