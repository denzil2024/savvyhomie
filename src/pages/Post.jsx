import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { posts, categories, getRelatedPosts } from '../lib/content.js'
import Photo from '../components/Photo.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import EmailSignup from '../components/EmailSignup.jsx'

const paras = (v) => (Array.isArray(v) ? v : v ? [v] : [])

// The rendered width the CSS would give this image once loaded (natural size scaled
// down to fit the 340x320 photo well, never scaled up), set inline so the box exists
// before the lazy-loaded file arrives. See .product-photo in styles.css.
const photoBox = (p) => (p.imageW && p.imageH ? { width: Math.min(p.imageW, 340, Math.round((320 * p.imageW) / p.imageH)) } : undefined)

function ProductCard({ p, index }) {
  const verdict = paras(p.verdict)
  return (
    <div className="product" id={`pick-${index}`}>
      {p.url ? (
        <a href={p.url} target="_blank" rel="nofollow sponsored noopener">
          {p.image ? <div className="product-photo-well"><img src={p.image} alt={p.name} className="product-photo" width={p.imageW} height={p.imageH} style={photoBox(p)} loading="lazy" decoding="async" /></div> : <Photo seed={p.name} />}
        </a>
      ) : (
        p.image ? <div className="product-photo-well"><img src={p.image} alt={p.name} className="product-photo" width={p.imageW} height={p.imageH} style={photoBox(p)} loading="lazy" decoding="async" /></div> : <Photo seed={p.name} />
      )}
      <div className="txt">
        <div className="product-head">
          <span className="product-n">No. {index}</span>
          {p.award && <span className="product-award">{p.award}</span>}
        </div>
        <h3>{p.name}</h3>
        {p.whofor && <p className="whofor">Best for: {p.whofor}</p>}
        {paras(p.description).map((t) => <p className="product-desc" key={t.slice(0, 24)}>{t}</p>)}
        {(p.pros || p.cons) && (
          <div className="pc">
            <div>
              <div className="h good">Pros</div>
              <ul className="good">{(p.pros || []).map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div>
              <div className="h bad">Cons</div>
              <ul className="bad">{(p.cons || []).map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        )}
        {verdict.length > 0 && (
          <div className="verdict">
            <span className="lbl">Our Verdict</span>
            {verdict.map((t) => <p className="product-desc" key={t.slice(0, 24)}>{t}</p>)}
          </div>
        )}
        {p.url && <a className="cta" href={p.url} target="_blank" rel="nofollow sponsored noopener">Check price on Amazon →</a>}
      </div>
    </div>
  )
}

/* At-a-glance list of the picks with jump links — scan first, read second. */
function Lineup({ products }) {
  return (
    <nav className="lineup" aria-label="The picks at a glance">
      <span className="lbl"><span className="eyebrow-rule" />The Lineup</span>
      <ol>
        {products.map((p, i) => (
          <li key={p.name}>
            <span className="lineup-n">No. {i + 1}</span>
            <a href={`#pick-${i + 1}`}>{p.name}</a>
            {p.award && <span className="lineup-award">{p.award}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function RelatedCard({ post }) {
  const cat = categories.find((c) => c.slug === post.category)
  return (
    <article className="card">
      <Link reloadDocument to={`/blog/${post.slug}/`}>
        {post.cover ? <img className="card-cover-img" src={post.cover} alt={post.title} width={post.coverW} height={post.coverH} loading="lazy" decoding="async" /> : <Photo seed={post.slug} />}
      </Link>
      <div className="txt">
        {cat && <span className="chip">{cat.name}</span>}
        <h3><Link reloadDocument to={`/blog/${post.slug}/`}>{post.title}</Link></h3>
        <span className="meta meta-rule">Updated {post.updated}{post.readTime ? ` · ${post.readTime}` : ''}</span>
      </div>
    </article>
  )
}

export default function Post() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  // A light record (list-view fields only) means this page's inline data was for
  // a different URL, which can only happen via client-side navigation. Load the
  // post's own prerendered page instead of rendering an empty body.
  const light = !!post && !post.html && post.products.length === 0
  useEffect(() => {
    if (light) window.location.assign(`/blog/${post.slug}/`)
  }, [light, post?.slug])
  if (!post) return <section className="hero"><h1>Not found</h1></section>
  if (light) return <section className="hero"><h1>{post.title}</h1></section>
  const cat = categories.find((c) => c.slug === post.category)
  const related = getRelatedPosts(post.slug, post.category, 3)

  return (
    <>
      <ScrollProgress />
      <article className="post">
        <div className="crumbs">
          <Link to="/">Home</Link>
          {cat && <> / <Link to={`/category/${cat.slug}/`}>{cat.name}</Link></>}
        </div>

        <header className="post-header">
          {cat && <Link to={`/category/${cat.slug}/`} className="chip chip-solid">{cat.name}</Link>}
          <h1>{post.title}</h1>
          <p className="post-dek">{post.description}</p>
          <div className="byline-block">
            <span className="byline-avatar"><img src="/founder.webp" alt="Carol, author" width="720" height="1280" /></span>
            <p className="byline-author">By Carol</p>
            <p className="byline-meta">Updated {post.updated}{post.readTime ? ` · ${post.readTime}` : ''} · Every pick independently reviewed</p>
          </div>
        </header>

        <div className={`post-hero-image${post.cover ? ' post-hero-framed' : ''}`}>
          {post.cover ? <img src={post.cover} alt={post.title} width={post.coverW} height={post.coverH} fetchpriority="high" decoding="async" /> : <Photo seed={post.slug} label="" />}
        </div>

        {post.pin && (
          <details className="pin-toggle">
            <summary>Pin this list</summary>
            <img src={post.pin} alt={`${post.title}, pin this list`} width={post.pinW} height={post.pinH} loading="lazy" decoding="async" />
          </details>
        )}

        <div className="post-body">
          <div className="disclosure">We may earn a commission when you buy through links on this page, at no extra cost to you. <Link to="/how-we-pick-products/">How we pick products</Link>.</div>

          {post.answer && <div className="answer"><b>The short answer:</b> {post.answer}</div>}

          {post.products.length >= 2 && <Lineup products={post.products} />}

          {post.introHtml && <div className="prose" dangerouslySetInnerHTML={{ __html: post.introHtml }} />}

          {post.products.map((p, i) => (
            <div key={p.name}>
              {p.category && p.category !== post.products[i - 1]?.category && (
                <h2 className="product-group-head">{p.category}</h2>
              )}
              <ProductCard p={p} index={i + 1} />
            </div>
          ))}

          {post.products.length > 3 && <div className="ad-slot" data-slot="incontent" />}

          <div className={`prose${post.products.length === 0 && !post.introHtml ? ' prose-lead' : ''}`} dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>

      </article>

      {related.length > 0 && (
        <section className="related">
          <div className="related-head">
            <span className="eyebrow lbl"><span className="eyebrow-rule" />Related</span>
            <h2>Keep Reading</h2>
          </div>
          <div className="related-grid">
            {related.map((p) => <RelatedCard post={p} key={p.slug} />)}
          </div>
        </section>
      )}

      <EmailSignup />
    </>
  )
}
