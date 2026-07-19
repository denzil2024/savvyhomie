import { Link } from 'react-router-dom'

const POINTS = [
  { t: 'Tried First', d: "Every tip gets tested at home, and every pick is weighed against a cheaper and a pricier option before it makes the list." },
  { t: 'Cons Included', d: 'The drawbacks sit right next to the strengths on every product, never buried.' },
  { t: 'Short on Purpose', d: "Guides and lists both stay tight. If it doesn't earn its place, it gets left out." },
]

export default function FounderTeaser() {
  return (
    <section className="band band-spruce founder">
      <div className="wrap">
      <svg className="founder-orn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 21V10l8-6 8 6v11M9 21v-7h6v7" />
      </svg>
      <div className="founder-main">
        <div className="founder-photo"><img src="/founder.jpg" alt="Carol, founder of SavvyHomie" /></div>
        <div className="founder-txt">
          <span className="lbl">Who's Behind This</span>
          <h3>Hi, I'm Carol.</h3>
          <p>I studied interior design at Parsons, and I've spent just as much time figuring out what makes a home feel good to live in day to day. SavvyHomie is where I share both sides: the tips that pull a room together, and the finds worth spending on, so your home feels designed without the designer price tag.</p>
          <Link to="/about/" className="founder-link">More about how I work →</Link>
        </div>
      </div>
      <div className="founder-points">
        {POINTS.map((p, i) => (
          <div className="fp" key={p.t}>
            <span className="fp-n">No. {i + 1}</span>
            <h4>{p.t}</h4>
            <p>{p.d}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
