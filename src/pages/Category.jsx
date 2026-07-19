import { Link, useParams } from 'react-router-dom'
import { categories, postsInCategory } from '../lib/content.js'
import Photo from '../components/Photo.jsx'
import EmailSignup from '../components/EmailSignup.jsx'

export default function Category() {
  const { slug } = useParams()
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return <section className="hero"><h1>Not found</h1></section>
  const list = postsInCategory(slug)

  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" />Category<span className="eyebrow-rule" /></span>
        <h1>{cat.name}</h1>
        <p>{cat.blurb}</p>
        {cat.topics && cat.topics.length > 0 && (
          <div className="cat-topics">
            {cat.topics.map((t) => <span className="chip-solid" key={t}>{t}</span>)}
          </div>
        )}
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="sec-head">
            <span className="lbl">{list.length > 0 ? `${list.length} Guide${list.length === 1 ? '' : 's'}` : 'Coming Soon'}</span>
            <h2>Latest Guides</h2>
          </div>
          {list.length === 0 ? (
            <div className="empty">Guides for this category are landing soon.</div>
          ) : (
            <div className="grid grid-center">
              {list.map((p) => (
                <article className="card" key={p.slug}>
                  <Link to={`/blog/${p.slug}/`}>
                    {p.cover ? <img className="card-cover-img" src={p.cover} alt={p.title} /> : <Photo seed={p.slug} />}
                  </Link>
                  <div className="txt">
                    <h3><Link to={`/blog/${p.slug}/`}>{p.title}</Link></h3>
                    <p>{p.description}</p>
                    <span className="meta">Updated {p.updated}{p.readTime ? ` · ${p.readTime}` : ''}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <EmailSignup />
    </>
  )
}
