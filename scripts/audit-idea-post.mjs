import { readFileSync } from 'node:fs'
const slug = process.argv[2]
if (!slug) { console.error('usage: node scripts/audit-idea-post.mjs <slug>'); process.exit(1) }
const raw = readFileSync(`content/posts/${slug}.md`, 'utf8')
const fm = raw.split('---')[1]
const arr = JSON.parse('[' + fm.split('products: [')[1].split(/\n\]/)[0] + ']')

const BANNED = /\b(really|actually|genuinely|most|spans|simply|truly|essentially|perfect|stunning|gorgeous)\b/gi
const JARGON = /\b(anchor|anchors|anchoring|statement piece|cohesive|negative space|faceted|elevate|elevates|curated|effortless|timeless|focal point|transform|showcase|aesthetic|vibe|space(?!s? in the room)|sanctuary|retreat|oasis)\b/gi

const firstWord = (s) => (s.trim().split(/\s+/)[0] || '').replace(/[^A-Za-z']/g, '')
const sentences = (s) => s.split(/(?<=[.!?])\s+/).filter(Boolean)

console.log('=== 1. TITLE OPENING VERBS ===')
const verbs = {}
arr.forEach((p) => { const v = firstWord(p.name).toLowerCase(); verbs[v] = (verbs[v] || 0) + 1 })
Object.entries(verbs).sort((a, b) => b[1] - a[1]).forEach(([v, n]) => console.log(`  ${n > 1 ? '!! ' : '   '}${v}: ${n}`))

console.log('\n=== 2. P1 OPENING WORD ===')
const p1 = {}
arr.forEach((p) => { const w = firstWord(p.description[0]); p1[w] = (p1[w] || 0) + 1 })
Object.entries(p1).sort((a, b) => b[1] - a[1]).forEach(([w, n]) => console.log(`  ${n > 2 ? '!! ' : '   '}${w}: ${n}`))

console.log('\n=== 3. P2 OPENER TYPE (action-led vs product-as-subject) ===')
let action = 0, product = 0
arr.forEach((p, i) => {
  const s = p.description[1].trim()
  const w = firstWord(s)
  const isProductSubject = /^(This|These|That|Those|A|An|The)\b/.test(s)
  if (isProductSubject) { product++; console.log(`  !! PRODUCT-SUBJ  #${i + 1} "${s.slice(0, 62)}..."`) }
  else { action++ }
})
console.log(`  --> action-led: ${action}/25   product-as-subject: ${product}/25`)

console.log('\n=== 4. "This/These [product]" P2 OPENERS ===')
let tc = 0
arr.forEach((p, i) => { if (/^(This|These)\b/.test(p.description[1].trim())) { tc++; console.log(`  #${i + 1} ${p.description[1].slice(0, 55)}`) } })
console.log(`  --> ${tc} of 25`)

console.log('\n=== 5. BANNED WORDS ===')
arr.forEach((p, i) => {
  const hits = [p.name, p.whofor, ...p.description].join(' ').match(BANNED)
  if (hits) console.log(`  #${i + 1}: ${[...new Set(hits.map((h) => h.toLowerCase()))].join(', ')}`)
})

console.log('\n=== 6. INTERIOR-DESIGN JARGON ===')
arr.forEach((p, i) => {
  const hits = [p.name, p.whofor, ...p.description].join(' ').match(JARGON)
  if (hits) console.log(`  #${i + 1}: ${[...new Set(hits.map((h) => h.toLowerCase()))].join(', ')}`)
})

console.log('\n=== 7. SENTENCES + WORDS PER PARAGRAPH (target 2-3 sentences) ===')
arr.forEach((p, i) => {
  p.description.forEach((d, j) => {
    const sc = sentences(d).length, wc = d.split(/\s+/).length
    const flag = sc > 4 || sc < 2 || wc > 62 ? ' !!' : ''
    if (flag) console.log(`  #${i + 1} P${j + 1}: ${sc} sentences, ${wc} words${flag}`)
  })
})

console.log('\n=== 8. NOUN REPEATED 3+ WITHIN AN ENTRY ===')
const STOP = new Set(['the','a','an','and','or','but','of','to','in','on','for','it','its','you','your','that','this','these','with','not','is','are','was','were','be','been','one','all','at','as','so','out','up','down','off','into','from','by','than','then','just','still','even','only','more','less','no','nothing','what','which','when','where','who','how','they','them','their','there','here','has','have','had','does','do','did','get','gets','got','goes','go','going','ends','end','every','each','other','same','right','left','back','over','under','across','after','before','instead','because','if','while','until','about','around','without','something','anything','everything','whatever','wherever','however','way','ways','thing','things','make','makes','made','take','takes','look','looks','reads','read','feel','feels','keep','keeps','stay','stays','set','sets','put','puts','give','gives','need','needs','want','wants','use','uses','used','room','rooms'])
arr.forEach((p, i) => {
  const words = [p.name, ...p.description].join(' ').toLowerCase().match(/[a-z']+/g) || []
  const c = {}
  words.forEach((w) => { if (!STOP.has(w) && w.length > 3) c[w] = (c[w] || 0) + 1 })
  const bad = Object.entries(c).filter(([, n]) => n >= 3)
  if (bad.length) console.log(`  #${i + 1}: ${bad.map(([w, n]) => `${w}(${n})`).join(', ')}`)
})

console.log('\n=== 9. COLON-THEN-LIST (3+ items) ===')
arr.forEach((p, i) => {
  p.description.forEach((d) => {
    if (/:\s+[^,.]+,\s+[^,.]+,\s+/.test(d)) console.log(`  #${i + 1}: ${d.slice(0, 80)}`)
  })
})

console.log('\n=== 10. EM-DASHES ===')
arr.forEach((p, i) => { if ([p.name, ...p.description].join(' ').includes('—')) console.log(`  #${i + 1} has em-dash`) })

console.log('\n=== 11. "instead" COUNT (crutch check) ===')
let ins = 0
arr.forEach((p, i) => {
  const n = ([p.name, ...p.description].join(' ').match(/\binstead\b/gi) || []).length
  if (n) { ins += n; if (n > 1) console.log(`  !! #${i + 1}: ${n}x`) }
})
console.log(`  --> total "instead": ${ins} across 25 entries`)

console.log('\n=== 12. LONG COMMA CHAINS (3+ commas in one sentence) ===')
arr.forEach((p, i) => {
  p.description.forEach((d, j) => {
    sentences(d).forEach((s) => {
      const commas = (s.match(/,/g) || []).length
      if (commas >= 3) console.log(`  #${i + 1} P${j + 1}: ${commas} commas | ${s.slice(0, 85)}`)
    })
  })
})

console.log('\n=== 13. whofor OPENING WORD ===')
const wf = {}
arr.forEach((p) => { const w = firstWord(p.whofor); wf[w] = (wf[w] || 0) + 1 })
Object.entries(wf).sort((a, b) => b[1] - a[1]).forEach(([w, n]) => console.log(`  ${n > 3 ? '!! ' : '   '}${w}: ${n}`))
