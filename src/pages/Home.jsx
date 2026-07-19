import { Link } from 'react-router-dom'
import { posts, categories } from '../lib/content.js'
import Photo from '../components/Photo.jsx'
import CategoryTile from '../components/CategoryTile.jsx'
import FounderTeaser from '../components/FounderTeaser.jsx'
import SeasonalBanner from '../components/SeasonalBanner.jsx'
import EmailSignup from '../components/EmailSignup.jsx'

export default function Home() {
  const featured = posts[0]
  // 9 = three full rows of three in the More Guides grid, no ragged last row
  const rest = posts.slice(1, 10)
  const featuredCat = featured && categories.find((c) => c.slug === featured.category)

  return (
    <>
      <section className="hero hero-compact">
        <div className="hero-inner">
          <svg className="hero-deco hero-deco-l" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 12v10H4V12M2 7h20v5H2V7Zm10 15V7M12 7C9 7 7 5 7 3.5S8 1 9.5 1 12 3 12 7ZM12 7c3 0 5-2 5-3.5S15.5 1 14 1 12 3 12 7Z" />
          </svg>
          <svg className="hero-deco hero-deco-r" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 21V10l8-6 8 6v11M9 21v-7h6v7" />
          </svg>
          <p className="eyebrow lbl"><span className="eyebrow-rule" />Home Tips &amp; Curated Finds<span className="eyebrow-rule" /></p>
          <h1>Home tips and gift finds, <em>chosen with care</em>.</h1>
          <p className="hero-sub">Simple tips for a home that feels put together, plus gift guides and picks we've carefully compared, cons included.</p>
          <span className="hero-orn" aria-hidden="true"><i /></span>
          <div className="hero-trust">
            <span>Independently Researched</span>
            <span className="rule" aria-hidden="true" />
            <span>No Sponsored Picks</span>
            <span className="rule" aria-hidden="true" />
            <span>Updated for 2026</span>
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="sec-head"><span className="lbl">Start Here</span><h2>Browse by Category</h2></div>
          <div className="hero-cats">
            {categories.map((c) => <CategoryTile key={c.slug} slug={c.slug} name={c.name} topics={c.topics} />)}
          </div>
        </div>
      </section>

      <FounderTeaser />

      {featured ? (
        <>
          <div className="sec-head"><span className="lbl">Fresh off the List</span><h2>The Latest Guide</h2></div>
          <article className="feat-card">
            <Link to={`/blog/${featured.slug}/`} className="feat-media">
              {featured.cover ? <img src={featured.cover} alt={featured.title} /> : <Photo seed={featured.slug} />}
            </Link>
            <div className="feat-txt">
              {featuredCat && <span className="chip">{featuredCat.name}</span>}
              <h3><Link to={`/blog/${featured.slug}/`}>{featured.title}</Link></h3>
              <p>{featured.description}</p>
              <span className="meta">Updated {featured.updated}{featured.readTime ? ` · ${featured.readTime}` : ''}</span>
              <Link to={`/blog/${featured.slug}/`} className="feat-link">Read the guide →</Link>
            </div>
          </article>
        </>
      ) : (
        <div className="empty">First guides are landing soon. The content workflow is next.</div>
      )}

      <div className="ad-slot" data-slot="incontent" />

      {/* Renders once there are at least 2 posts beyond the featured one; a lone card in a 3-column grid reads as broken. */}
      {rest.length >= 2 && (
        <>
          <div className="sec-head"><span className="lbl">Keep Browsing</span><h2>More Guides</h2></div>
          <div className="grid">
            {rest.map((p) => {
              const cat = categories.find((c) => c.slug === p.category)
              return (
                <article className="card" key={p.slug}>
                  <Link to={`/blog/${p.slug}/`}>{p.cover ? <img className="card-cover-img" src={p.cover} alt={p.title} /> : <Photo seed={p.slug} />}</Link>
                  <div className="txt">
                    {cat && <span className="chip">{cat.name}</span>}
                    <h3><Link to={`/blog/${p.slug}/`}>{p.title}</Link></h3>
                    <p>{p.description}</p>
                    <span className="meta">Updated {p.updated}{p.readTime ? ` · ${p.readTime}` : ''}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}

      <SeasonalBanner />

      <EmailSignup />
    </>
  )
}
