import { Link, useParams } from 'react-router-dom'
import { categories, postsInCategory } from '../lib/content.js'

export default function Category() {
  const { slug } = useParams()
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return <section className="hero"><h1>Not found</h1></section>
  const list = postsInCategory(slug)
  return (
    <>
      <section className="hero">
        <h1>{cat.name}</h1>
        <p>{cat.blurb}</p>
      </section>
      <div className="section-h">Guides</div>
      {list.length === 0 ? (
        <div className="empty">Guides for this category are landing soon.</div>
      ) : (
        <div className="grid">
          {list.map((p) => (
            <article className="card" key={p.slug}>
              <h3><Link to={`/${p.slug}/`}>{p.title}</Link></h3>
              <p>{p.description}</p>
              <span className="meta">Updated {p.updated}</span>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
