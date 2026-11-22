import { Link, useParams } from 'react-router-dom'
import { categories, postsInCategory, postsInTopic, slugifyTopic, pageCount, paginate } from '../lib/content.js'
import Photo from '../components/Photo.jsx'
import EmailSignup from '../components/EmailSignup.jsx'

// Shared by the flat list and each topic-grouped section: renders prev/next
// links to the real crawlable /page/n/ URLs, never a client-side "load more"
// that would hide posts past page 1 from search engines.
function Pager({ basePath, page, total }) {
  if (total <= 1) return null
  const urlFor = (p) => (p === 1 ? basePath : `${basePath}page/${p}/`)
  return (
    <nav className="pager" aria-label="Pagination">
      {page > 1 && <Link reloadDocument to={urlFor(page - 1)} className="pager-link">← Previous</Link>}
      <span className="pager-status">Page {page} of {total}</span>
      {page < total && <Link reloadDocument to={urlFor(page + 1)} className="pager-link">Next →</Link>}
    </nav>
  )
}

function PostGrid({ list }) {
  return (
    <div className="grid grid-center">
      {list.map((p) => (
        <article className="card" key={p.slug}>
          <Link reloadDocument to={`/blog/${p.slug}/`}>
            {p.cover ? <img className="card-cover-img" src={p.cover} alt={p.title} width={p.coverW} height={p.coverH} loading="lazy" decoding="async" /> : <Photo seed={p.slug} />}
          </Link>
          <div className="txt">
            <h3><Link reloadDocument to={`/blog/${p.slug}/`}>{p.title}</Link></h3>
            <p>{p.description}</p>
            <span className="meta">Updated {p.updated}{p.readTime ? ` · ${p.readTime}` : ''}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function Category() {
  const { slug, page: pageParam } = useParams()
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return <section className="hero"><h1>Not found</h1></section>
  const list = postsInCategory(slug)
  // Once a category has more than one topic (e.g. Gifts for Him vs Gifts for
  // Her), the guide grid must stay split by topic, never a flat mixed list —
  // same hard rule as everywhere else these topics appear.
  const groupByTopic = cat.topics && cat.topics.length > 1
  const topicGroups = groupByTopic
    ? cat.topics
        .map((t) => ({ name: t, posts: postsInTopic(cat.slug, slugifyTopic(t)) }))
        .filter((g) => g.posts.length > 0)
    : []
  const untagged = groupByTopic ? list.filter((p) => !p.topic) : []
  const page = pageParam ? Number(pageParam) : 1
  const catBase = `/category/${cat.slug}/`
  const totalPages = pageCount(list.length)
  // A page number past the real last page (or a non-numeric one) isn't a
  // different list, it's a 404 — same belt-and-suspenders pattern Topic.jsx
  // uses for its own hard gate.
  if (pageParam && (!Number.isInteger(page) || page < 2 || page > totalPages)) {
    return <section className="hero"><h1>Not found</h1></section>
  }
  const pagedList = groupByTopic ? [] : paginate(list, page)

  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" />Category<span className="eyebrow-rule" /></span>
        <h1>{cat.name}</h1>
        <p>{cat.blurb}</p>
        {cat.topics && cat.topics.length > 0 && (
          <div className="cat-topics">
            {cat.topics.map((t) => {
              const topicSlug = slugifyTopic(t)
              const hasPosts = postsInTopic(cat.slug, topicSlug).length > 0
              return hasPosts
                ? <Link className="chip-solid" key={t} to={`/category/${cat.slug}/${topicSlug}/`}>{t}</Link>
                : <span className="chip-solid chip-soon" key={t}>{t}</span>
            })}
          </div>
        )}
      </section>

      {groupByTopic ? (
        <>
          {topicGroups.map((g) => (
            <section className="band band-white" key={g.name}>
              <div className="wrap">
                <div className="sec-head">
                  <span className="lbl">{g.posts.length} Guide{g.posts.length === 1 ? '' : 's'}</span>
                  <h2>{g.name}</h2>
                </div>
                <PostGrid list={g.posts} />
              </div>
            </section>
          ))}
          {untagged.length > 0 && (
            <section className="band band-white">
              <div className="wrap">
                <div className="sec-head">
                  <span className="lbl">{untagged.length} Guide{untagged.length === 1 ? '' : 's'}</span>
                  <h2>More {cat.name}</h2>
                </div>
                <PostGrid list={untagged} />
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="band band-white">
          <div className="wrap">
            <div className="sec-head">
              <span className="lbl">{list.length > 0 ? `${list.length} Guide${list.length === 1 ? '' : 's'}` : 'Coming Soon'}</span>
              <h2>Latest Guides</h2>
            </div>
            {list.length === 0 ? (
              <div className="empty">Guides for this category are coming soon.</div>
            ) : (
              <>
                <PostGrid list={pagedList} />
                <Pager basePath={catBase} page={page} total={totalPages} />
              </>
            )}
          </div>
        </section>
      )}

      <EmailSignup />
    </>
  )
}
