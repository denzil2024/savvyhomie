import { readFileSync, readdirSync } from 'node:fs'
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

// 1. Load every published post: slug, date, title
const postFiles = readdirSync('content/posts').filter((f) => f.endsWith('.md'))
const posts = postFiles.map((f) => {
  const slug = f.replace(/\.md$/, '')
  const raw = readFileSync(`content/posts/${f}`, 'utf8')
  const dateMatch = raw.match(/^date:\s*"?([\d-]+)/m)
  const titleMatch = raw.match(/^title:\s*"?(.*?)"?\s*$/m)
  return {
    slug,
    date: dateMatch ? dateMatch[1] : '',
    title: titleMatch ? titleMatch[1] : slug,
  }
})
// 1b. Amazon storefront collections (no blog post, pins go straight to the storefront link).
// Pin images live in pin-drops/amazon-storefront/<slug>/, not pin-drops/<slug>/, and the live
// pin's `link` is the real a.co storefront URL rather than a savvyhomie.com/blog/<slug>/ URL, so
// these can't be auto-discovered from content/posts the way article posts are. Add a new entry
// here (and drop images in pin-drops/amazon-storefront/<slug>/) whenever a new collection starts.
const STOREFRONT_COLLECTIONS = [
  {
    slug: 'organizational-storage',
    date: '2026-08-09',
    title: 'Amazon Organization & Storage Finds Worth Adding to Cart',
    link: 'https://a.co/d/0iRb1TP7',
  },
]
for (const c of STOREFRONT_COLLECTIONS) {
  posts.push({ slug: c.slug, date: c.date, title: c.title, storefrontLink: c.link })
}
// 1c. Own digital products (Beacons/Gumroad/etc. checkout link, NOT an Amazon storefront pick —
// separate audience intent, separate pin-drops folder, separate board). Add a new entry here
// (and drop images in pin-drops/digital-products/<slug>/) whenever a new product launches.
const DIGITAL_PRODUCTS = [
  {
    slug: 'family-trip-vision-board-kit',
    date: '2026-09-18',
    title: 'Family Trip Vision Board Kit — 23 Printable & Editable Planning Pages',
    link: 'https://shop.beacons.ai/savvyhomie/6e0a01cd-7a60-4199-8e73-9737d8f1c428',
  },
]
for (const c of DIGITAL_PRODUCTS) {
  posts.push({ slug: c.slug, date: c.date, title: c.title, storefrontLink: c.link })
}
posts.sort((a, b) => a.date.localeCompare(b.date))

// 2. Pin-drops inventory per slug (some pillar folders use a "-pillar" suffix that doesn't match the post slug)
const PIN_DROP_FOLDER_ALIASES = {
  'christmas-gift-ideas': 'christmas-gift-ideas-pillar',
  'gifts-for-him': 'gifts-for-him-pillar',
  'gifts-for-her': 'gifts-for-her-pillar',
  'kitchen-gadgets': 'kitchen-gadgets-pillar',
}
const STOREFRONT_SLUGS = new Set(STOREFRONT_COLLECTIONS.map((c) => c.slug))
const DIGITAL_PRODUCT_SLUGS = new Set(DIGITAL_PRODUCTS.map((c) => c.slug))
function pinDropCount(slug) {
  const folder = STOREFRONT_SLUGS.has(slug)
    ? `amazon-storefront/${slug}`
    : DIGITAL_PRODUCT_SLUGS.has(slug)
    ? `digital-products/${slug}`
    : PIN_DROP_FOLDER_ALIASES[slug] || slug
  try {
    return readdirSync(`pin-drops/${folder}`).filter((f) => f.endsWith('.png')).length
  } catch {
    return 0
  }
}

// 3. Live pins from Pinterest, with link field for exact slug matching
const boardsRes = await pinterest('/boards?page_size=100')
const boards = boardsRes.items
const allPins = []
for (const board of boards) {
  const pinsRes = await pinterest(`/boards/${board.id}/pins?page_size=100&pin_filter=all`)
  for (const p of pinsRes.items || []) {
    if (!p.is_owner) continue
    allPins.push({
      board: board.name,
      title: p.title || '',
      link: p.link || '',
      created: p.created_at?.slice(0, 10) || '',
    })
  }
}

// 4. Match live pins to post slugs via exact link substring (storefront collections match by
// their exact a.co link instead, since the link has no relation to the slug text)
for (const post of posts) {
  post.livePins = allPins
    .filter((p) => (post.storefrontLink ? p.link === post.storefrontLink : p.link.includes(`/${post.slug}/`) || p.link.includes(`/${post.slug}`)))
    .sort((a, b) => a.created.localeCompare(b.created))
  post.available = pinDropCount(post.slug)
  post.postedCount = post.livePins.length
  post.boardsUsed = [...new Set(post.livePins.map((p) => p.board))]
}

// 5. Report
console.log('=== PIN TRACKER (live, generated', new Date().toISOString().slice(0, 10), ') ===\n')
console.log(
  'published'.padEnd(11),
  'slug'.padEnd(30),
  'posted/avail'.padEnd(13),
  'boards used'
)
for (const post of posts) {
  const flag = post.postedCount === 0 ? '  <-- ZERO PINS LIVE' : post.postedCount < post.available ? '' : ' (exhausted)'
  console.log(
    post.date.padEnd(11),
    post.slug.padEnd(30),
    `${post.postedCount}/${post.available}`.padEnd(13),
    post.boardsUsed.join(', ') + flag
  )
}

console.log('\n=== NEXT-UP QUEUE (every post\'s pin-2 before any post\'s pin-3, etc; earliest published breaks ties) ===')
// Standing rule (owner, 2026-08-04): never post a pin-N+1 for any post while another post is still
// missing pin-N. So the queue sorts by postedCount ascending FIRST (how many pins that post already
// has live = which "round" it's in), then by published date as the tiebreaker within a round.
const queue = posts
  .filter((p) => p.postedCount < p.available)
  .sort((a, b) => a.postedCount - b.postedCount || a.date.localeCompare(b.date))
if (queue.length === 0) {
  console.log('(none - every post with pin-drops images has them all posted)')
} else {
  queue.forEach((p, i) => {
    console.log(`${i + 1}. ${p.slug} (published ${p.date}) - ${p.postedCount}/${p.available} posted [needs pin-${p.postedCount + 1}], boards used: ${p.boardsUsed.join(', ') || 'none'}`)
  })
}

// 5b. Posting strategy: a batch-by-batch plan, one pin per post per batch,
// never repeating a board within the same batch (same-day cadence rule),
// preferring a board that specific post hasn't used yet.
const CLUSTERS = {
  him: {
    slugs: ['gifts-for-him', 'gifts-for-men', 'gifts-for-boyfriend', 'gifts-for-husband', 'birthday-gifts-for-him', 'christmas-gifts-for-men'],
    boards: ['Gifts for Him', 'Gift Ideas', 'Christmas Gift Ideas'],
  },
  her: {
    slugs: ['gifts-for-her', 'gifts-for-women', 'gifts-for-girlfriend', 'gifts-for-wife', 'birthday-gifts-for-her', 'christmas-gifts-for-women'],
    boards: ['Gifts for Her', 'Gift Ideas', 'Christmas Gift Ideas'],
  },
  miscGift: {
    slugs: ['gifts-for-dog-lovers', 'gifts-for-neighbors', 'gifts-for-wine-lovers', 'teacher-christmas-gifts', 'christmas-gifts-for-coworkers', 'christmas-gift-ideas'],
    boards: ['Gift Ideas', 'Christmas Gift Ideas'],
  },
  kitchen: {
    slugs: ['kitchen-gadgets', 'best-kitchen-gadgets', 'top-kitchen-gadgets', 'cool-kitchen-gadgets', 'amazon-kitchen-gadgets', 'amazon-kitchen-utensils'],
    boards: ['Kitchen Gadgets & Finds', 'Amazon Home Finds'],
  },
  // "Amazon Home Finds" is the live Pinterest board name for the on-site "Everyday Home Finds"
  // topic under Home Decor Finds (see FOUNDATION.md board-alignment section) — NOT gift content.
  homeDecorEveryday: {
    slugs: ['amazon-home-finds', 'amazon-bathroom-finds', 'amazon-must-haves-for-home', 'home-decor-must-haves', 'trendy-home-decor', 'trendy-wall-art'],
    boards: ['Amazon Home Finds', 'Home Decor Ideas'],
  },
  // Cozy Bedroom Ideas is its own topic under Home Decor Finds (round-robin position
  // after Everyday Home Finds closed at 6/6) — separate live board from Amazon Home Finds.
  cozyBedroom: {
    slugs: ['cozy-bedroom-ideas', 'cozy-master-bedroom-ideas', 'cozy-male-bedroom-decor', 'cozy-feminine-bedroom', 'cozy-cottage-bedroom-ideas', 'cozy-bedroom-aesthetic'],
    boards: ['Cozy Bedroom Ideas'],
  },
  // Small Space Ideas topic (round-robin position after Cozy Bedroom Ideas closed at 6/6).
  smallSpace: {
    slugs: ['small-space-organization-ideas', 'small-closet-organization-ideas', 'small-walk-in-closet-organization-ideas', 'small-bedroom-closet-organization-ideas', 'small-closet-hacks', 'small-entryway-storage-ideas'],
    boards: ['Small Space Ideas', 'Home Organization Ideas'],
  },
  // Kitchen Organization topic (new cluster, first post 2026-08-26).
  kitchenOrganization: {
    slugs: ['kitchen-organization-ideas', 'small-pantry-organization-ideas', 'small-pantry-ideas', 'pantry-organization-tips', 'tiny-pantry-ideas', 'organizing-deep-pantry-shelves'],
    boards: ['Kitchen Organization Ideas'],
  },
  // Bathroom Organization topic (new cluster, first post 2026-08-28). No dedicated
  // Pinterest board exists yet, so this rides on the general home organization board.
  bathroomOrganization: {
    slugs: ['bathroom-organization-ideas', 'over-the-toilet-storage-ideas', 'diy-toilet-paper-storage', 'diy-toilet-paper-holder', 'diy-under-sink-organizer-bathroom', 'small-bathroom-vanity-storage'],
    boards: ['Home Organization Ideas'],
  },
  // Home Organization & Storage category (new cluster opened 2026-09-07) - no dedicated
  // Pinterest board yet, so this also rides on the general home organization board.
  homeOrganization: {
    slugs: ['home-organization-ideas', 'house-organization-tips', 'tips-for-decluttering-your-home'],
    boards: ['Home Organization Ideas'],
  },
  // Amazon storefront collections (see STOREFRONT_COLLECTIONS above) - link straight to the
  // storefront, not a blog post, and only ever post to their own dedicated board.
  storefront: {
    slugs: ['organizational-storage'],
    boards: ['Shop My Amazon Picks'],
  },
  // Digital product (Beacons checkout link, not Amazon) - own dedicated board, never mixed
  // with the Amazon storefront picks board since the audience intent is different (buying a
  // $12 printable kit vs. browsing affiliate product recs).
  digitalProducts: {
    slugs: ['family-trip-vision-board-kit'],
    boards: ['Family Trip Vision Board'],
  },
}
function eligibleBoards(slug) {
  for (const c of Object.values(CLUSTERS)) if (c.slugs.includes(slug)) return c.boards
  // No silent catch-all: an unmapped slug getting boards guessed wrong (e.g. bathroom/decor
  // content routed to "Gift Ideas") is exactly the bug this comment exists to prevent. Add the
  // post's real slug to the correct cluster above instead of letting it fall through here.
  throw new Error(`No board cluster defined for slug "${slug}" — add it to CLUSTERS in pin-tracker.mjs before posting, don't guess.`)
}

// lastUsedAt tracks, per item, the most recent batch index each board was used in for THAT post
// (seeded from live post-history order so already-used boards aren't picked again before new ones) —
// board choice always prefers the least-recently-used board, so once a post cycles through every
// board it owns it starts rotating instead of hammering one board batch after batch.
//
// `level` = how many pins that post currently has live = which "round" it's in. Standing rule
// (owner, 2026-08-04): no post gets its pin-N+1 while any other post still needs pin-N. So each
// batch only pulls from whichever level is currently lowest across the whole backlog — a post
// can't level up to N+1 until every post sharing its level N has already gotten its level-N pin.
const planItems = queue.map((p) => {
  const boards = eligibleBoards(p.slug)
  const lastUsedAt = {}
  boards.forEach((b) => (lastUsedAt[b] = -Infinity))
  p.boardsUsed.forEach((b, idx) => {
    if (b in lastUsedAt) lastUsedAt[b] = idx - p.boardsUsed.length
  })
  return { slug: p.slug, level: p.postedCount, remaining: p.available - p.postedCount, boards, lastUsedAt }
})

const batches = []
let guard = 0
while (planItems.some((p) => p.remaining > 0) && guard < 200) {
  const minLevel = Math.min(...planItems.filter((p) => p.remaining > 0).map((p) => p.level))
  const levelItems = planItems.filter((p) => p.remaining > 0 && p.level === minLevel)
  const boardsUsedThisBatch = new Set()
  const batch = []
  for (const item of levelItems) {
    const candidates = item.boards
      .filter((b) => !boardsUsedThisBatch.has(b))
      .sort((a, b) => item.lastUsedAt[a] - item.lastUsedAt[b])
    const board = candidates[0]
    if (!board) continue // every eligible board for this post already used elsewhere this batch
    batch.push({ slug: item.slug, board })
    boardsUsedThisBatch.add(board)
    item.lastUsedAt[board] = guard
    item.remaining--
    item.level++
  }
  if (batch.length === 0) break // nothing schedulable at this level (shouldn't happen with 2+ boards per cluster)
  batches.push(batch)
  guard++
}

console.log('\n=== POSTING STRATEGY (one batch = one sitting/day; a board never repeats within a batch) ===')
batches.forEach((batch, i) => {
  console.log(`\nBatch ${i + 1}:`)
  batch.forEach((item) => console.log(`  - ${item.slug} -> ${item.board}`))
})
console.log(`\n${batches.length} batches clears the current backlog (${queue.reduce((s, p) => s + (p.available - p.postedCount), 0)} pins total).`)

// 5c. Today: which boards are already spent, and what to post right now
const todayStr = new Date().toISOString().slice(0, 10)
const boardsUsedToday = new Set(allPins.filter((p) => p.created === todayStr).map((p) => p.board))
const allBoardNames = boards.map((b) => b.name)
const boardsFreeToday = allBoardNames.filter((b) => !boardsUsedToday.has(b))

console.log(`\n=== TODAY (${todayStr}) ===`)
console.log('Boards already posted to today (skip these):', [...boardsUsedToday].join(', ') || '(none yet)')
console.log('Boards still free today:', boardsFreeToday.join(', '))

console.log(`\nRecommended posts for right now (every free board matched to its lowest-level eligible post, no cross-post blocking):`)
{
  const freeSet = new Set(boardsFreeToday)
  const items = queue.map((p) => ({ slug: p.slug, level: p.postedCount, remaining: p.available - p.postedCount, date: p.date }))
  const todayPicks = []
  let progressed = true
  while (progressed) {
    progressed = false
    items.sort((a, b) => a.level - b.level || a.date.localeCompare(b.date))
    for (const item of items) {
      if (item.remaining <= 0) continue
      let boards
      try {
        boards = eligibleBoards(item.slug).filter((b) => freeSet.has(b))
      } catch {
        continue // unmapped slug - surfaced elsewhere, don't crash the whole report
      }
      if (boards.length === 0) continue
      const board = boards[0]
      todayPicks.push({ slug: item.slug, board })
      freeSet.delete(board)
      item.level++
      item.remaining--
      progressed = true
    }
  }
  if (todayPicks.length === 0) {
    console.log('(no eligible post for any board free today - wait until tomorrow)')
  } else {
    todayPicks.forEach((item) => console.log(`  - ${item.slug} -> ${item.board}`))
  }
}

console.log('\n=== ZERO-PIN POSTS (published, no live pin at all) ===')
const zero = posts.filter((p) => p.postedCount === 0)
if (zero.length === 0) console.log('(none)')
else zero.forEach((p) => console.log(`- ${p.slug} (published ${p.date}, ${p.available} pin-drops images ready)`))

// 6. Account-level performance (last 30 days)
const today = new Date()
const end = today.toISOString().slice(0, 10)
const start = new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10)
const analytics = await pinterest(
  `/user_account/analytics?start_date=${start}&end_date=${end}&metric_types=IMPRESSION,PIN_CLICK,SAVE,OUTBOUND_CLICK&granularity=TOTAL`
)
const totals = analytics.all?.summary_metrics || {}
const daily = (analytics.all?.daily_metrics || []).filter((d) => d.data_status === 'READY')
console.log(`\n=== HOW WE'RE DOING (last 30 days, ${start} to ${end}) ===`)
console.log('Impressions:', totals.IMPRESSION ?? 0)
console.log('Pin clicks:', totals.PIN_CLICK ?? 0)
console.log('Saves:', totals.SAVE ?? 0)
console.log('Outbound clicks (to site):', totals.OUTBOUND_CLICK ?? 0)
if (daily.length) {
  const last7 = daily.slice(-7)
  const prev7 = daily.slice(-14, -7)
  const sum = (arr, k) => arr.reduce((s, d) => s + (d.metrics[k] || 0), 0)
  console.log(
    `Last 7 days impressions: ${sum(last7, 'IMPRESSION')} (previous 7: ${sum(prev7, 'IMPRESSION')})`
  )
}
