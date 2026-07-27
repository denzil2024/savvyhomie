import { Link, useParams } from 'react-router-dom'
import { categories, postsInTopic, slugifyTopic } from '../lib/content.js'
import Photo from '../components/Photo.jsx'
import EmailSignup from '../components/EmailSignup.jsx'

export default function Topic() {
  const { slug, topic } = useParams()
  const cat = categories.find((c) => c.slug === slug)
  const topicName = cat?.topics?.find((t) => slugifyTopic(t) === topic)
  if (!cat || !topicName) return <section className="hero"><h1>Not found</h1></section>
  const list = postsInTopic(slug, topic)

  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" /><Link to={`/category/${cat.slug}/`}>{cat.name}</Link><span className="eyebrow-rule" /></span>
        <h1>{topicName}</h1>
        <p>Every {topicName} guide on the site, all sorted so it's easy to find something that fits.</p>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="sec-head">
            <span className="lbl">{list.length} Guide{list.length === 1 ? '' : 's'}</span>
            <h2>Latest Guides</h2>
          </div>
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
        </div>
      </section>

      <EmailSignup />
    </>
  )
}
