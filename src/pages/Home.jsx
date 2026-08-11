import { Link } from 'react-router-dom'
import { useState } from 'react'
import { posts, categories } from '../lib/content.js'
import Photo from '../components/Photo.jsx'
import EmailSignup from '../components/EmailSignup.jsx'

const PAGE_SIZE = 7 // one lead entry + three pairs

// Real photos for the category strip; slugs without one fall back to placeholder art.
const CAT_IMAGES = {
  'gift-guides': '/cat-gift-guides.webp',
  'kitchen-finds': '/cat-kitchen-finds.webp',
  'organization': '/cat-organization.webp',
  'decor-finds': '/cat-decor-finds.webp',
  'seasonal': '/cat-seasonal.webp',
}

const catOf = (slug) => categories.find((c) => c.slug === slug)

// Category eyebrow + serif headline + excerpt + button. One component for both
// the lead entry and the pairs below it; only the modifier class differs.
function Entry({ post, size }) {
  const cat = catOf(post.category)
  const href = `/blog/${post.slug}/`
  return (
    <article className={`entry entry-${size}`}>
      <Link to={href} className="entry-media">
        {post.cover ? <img src={post.cover} alt={post.title} /> : <Photo seed={post.slug} />}
      </Link>
      {cat && <Link to={`/category/${cat.slug}/`} className="entry-cat">{cat.name}</Link>}
      <h2><Link to={href}>{post.title}</Link></h2>
      <p>{post.description}</p>
      <Link to={href} className="btn-read">Read More</Link>
    </article>
  )
}

export default function Home() {
  const featured = posts[0]
  const feed = posts.slice(1)
  const [shown, setShown] = useState(PAGE_SIZE)
  const visible = feed.slice(0, shown)
  const [lead, ...pairs] = visible
  const featuredCat = featured && catOf(featured.category)
  // One guide per category rather than the five newest. The newest five are all
  // from whichever category is being published right now, so the list repeated
  // the showcase post, repeated the lead entry, and printed the same category
  // label five times. Spread across categories it's a real second door in.
  const popular = categories
    .map((c) => feed.find((p) => p.category === c.slug))
    .filter(Boolean)

  return (
    <>
      {/* Showcase, in two forms.
          With a `hero` photo in frontmatter: full bleed, card floating over it.
          Without one: the cover art shown whole beside the card. The covers are
          finished graphics with the title lettered into them, so laying a card
          over one both hides the artwork and prints the same title twice — and
          they are ~1670px wide, which will not fill a full-bleed well without
          upscaling. Drop a wide photo at `hero:` on any post to get the first
          form; everything else about the section is identical. */}
      {featured && (
        <section className={`showcase${featured.hero ? ' showcase-photo' : ' showcase-split'}`}>
          <div className="showcase-media">
            {featured.hero
              ? <img src={featured.hero} alt="" />
              : featured.cover
                ? <img src={featured.cover} alt={featured.title} />
                : <Photo seed={featured.slug} label="" />}
          </div>
          <div className="showcase-plate">
            <div className="showcase-card">
              {featuredCat && <span className="entry-cat">{featuredCat.name}</span>}
              <h1><Link to={`/blog/${featured.slug}/`}>{featured.title}</Link></h1>
              <p>{featured.description}</p>
              <Link to={`/blog/${featured.slug}/`} className="btn-read">Read More</Link>
            </div>
          </div>
        </section>
      )}

      {/* category strip: photo tiles with a translucent spruce label bar */}
      <section className="cat-strip">
        {categories.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}/`} className={`cs-tile cs-${c.slug}`}>
            {CAT_IMAGES[c.slug] ? <img src={CAT_IMAGES[c.slug]} alt="" /> : <Photo seed={c.slug} label="" />}
            <span className="cs-label">{c.name}</span>
          </Link>
        ))}
      </section>

      {/* main column + sidebar. The sidebar is what makes this layout worth
          having on an ad-supported site: it gives a real 300x600 slot that sits
          beside the reading column instead of interrupting it. */}
      <div className="feed-layout">
        <div className="feed-main">
          {lead && <Entry post={lead} size="lead" />}
          {pairs.length > 0 && (
            <div className="feed-pairs">
              {pairs.map((p) => <Entry key={p.slug} post={p} size="pair" />)}
            </div>
          )}
          {shown < feed.length && (
            <button type="button" className="btn-more" onClick={() => setShown(shown + PAGE_SIZE)}>
              Load More Posts
            </button>
          )}
        </div>

        <aside className="feed-side">
          <div className="side-block side-author">
            <span className="side-photo"><img src="/founder.webp" alt="Carol, founder of SavvyHomie" /></span>
            <p>Hi, I'm Carol. I studied interior design at Parsons, and I've spent just as much time working out what actually makes a home good to live in. Here I share both: the tips that pull a room together, and the finds worth spending on.</p>
            <Link to="/about/" className="btn-read btn-read-alt">More</Link>
          </div>

          <div className="side-block side-list">
            <h3 className="side-h">Join the List</h3>
            <p>One short email a week. The tips and finds worth your time, no filler.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" aria-label="Email address" required />
              <button className="btn" type="submit">Sign Up</button>
            </form>
          </div>

          <div className="ad-slot ad-rail" data-slot="sidebar" />

          <div className="side-block side-popular">
            <h3 className="side-h">Popular Guides</h3>
            <ol>
              {/* No thumbnails here on purpose: the covers are pin graphics with
                  the title lettered into the art, and at sidebar size the crop
                  lands on fragments of that lettering and reads as noise. */}
              {popular.map((p, i) => {
                const cat = catOf(p.category)
                return (
                  <li key={p.slug}>
                    <Link to={`/blog/${p.slug}/`}>
                      <span className="sp-n">No. {i + 1}</span>
                      <span className="sp-t">{p.title}</span>
                      {cat && <span className="sp-c">{cat.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ol>
          </div>
        </aside>
      </div>

      <EmailSignup />
    </>
  )
}
