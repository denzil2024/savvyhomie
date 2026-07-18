import { Link } from 'react-router-dom'
import EmailSignup from '../components/EmailSignup.jsx'

const STEPS = [
  { t: 'Start With the Reviews Nobody Reads', d: "Not the five-star unboxing videos. The one-star complaints, and the three-star reviews written six months in, after the honeymoon period wears off and the real flaws show up." },
  { t: 'Compare at Least Three Price Tiers', d: "Every category gets a cheap, a mid-range, and an expensive version put side by side. If the $45 one isn't doing anything the $18 one doesn't, the $18 one wins." },
  { t: 'Every Con Gets Written Down', d: "If I can't find a real drawback after real digging, I haven't looked hard enough yet. Nothing makes a list flaw-free." },
  { t: 'Keep the List Short', d: "A list you can finish before your coffee goes cold. If a pick doesn't clearly beat what's already on it, it doesn't get added as a bonus, it gets cut." },
]

export default function HowWePickProducts() {
  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" />Methodology<span className="eyebrow-rule" /></span>
        <h1>How We Pick Products</h1>
        <p>Not a lab, not a scoring rubric. Just one person who reads more reviews than is reasonable before anything gets recommended.</p>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="answer hwp-answer">
            <b>The short version:</b> every product is compared against a cheaper and a pricier alternative, the drawbacks get published next to the strengths, and the list stays short enough to actually finish reading.
          </div>
          <div className="hwp-steps">
            {STEPS.map((s, i) => (
              <div className="hwp-step" key={s.t}>
                <span className="product-n">No. {i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="band band-spruce hwp-correct">
        <div className="wrap">
          <span className="lbl">If We Get It Wrong</span>
          <h3>Tell Me. I'll Fix It, Not Schedule It.</h3>
          <p>Prices change, products get discontinued mid-quarter, and reviews shift after enough people own something for a year. If a pick on this site is wrong, outdated, or worse than I said, <Link to="/contact/">say so</Link> and I'll fix it or pull it, not wait for a routine content refresh six months out.</p>
        </div>
      </div>

      <div className="band band-butter about-money">
        <div className="wrap">
          <span className="lbl">How the Picks Make Money</span>
          <h3>Commission Pays the Bills. It Doesn't Pick the Winners.</h3>
          <p>Affiliate links fund this site, and the full breakdown is in the <Link to="/affiliate-disclosure/">affiliate disclosure</Link>. The method above runs the same regardless of which product ends up paying more: compared first, cons included, short on purpose.</p>
        </div>
      </div>

      <EmailSignup />
    </>
  )
}
