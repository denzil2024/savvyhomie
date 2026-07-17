import { Link } from 'react-router-dom'
import { posts, categories, TAGLINE } from '../lib/content.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>{TAGLINE}</h1>
        <p>Honest home &amp; kitchen roundups and gift guides. Every pick compared against its rivals — pros, cons, and who it's actually for.</p>
      </section>

      <div className="section-h">Latest guides</div>
      {posts.length === 0 ? (
        <div className="empty">First guides are landing soon.</div>
      ) : (
        <div className="grid">
          {posts.slice(0, 9).map((p) => {
            const cat = categories.find((c) => c.slug === p.category)
            return (
              <article className="card" key={p.slug}>
                {cat && <span className="chip">{cat.name}</span>}
                <h3><Link to={`/${p.slug}/`}>{p.title}</Link></h3>
                <p>{p.description}</p>
                <span className="meta">Updated {p.updated}</span>
              </article>
            )
          })}
        </div>
      )}

      <div className="section-h">Browse by room &amp; occasion</div>
      <div className="grid">
        {categories.map((c) => (
          <article className="card" key={c.slug}>
            <h3><Link to={`/category/${c.slug}/`}>{c.name}</Link></h3>
            <p>{c.blurb}</p>
          </article>
        ))}
      </div>
    </>
  )
}
