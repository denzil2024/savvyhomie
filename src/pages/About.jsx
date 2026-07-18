import { Link } from 'react-router-dom'
import EmailSignup from '../components/EmailSignup.jsx'

const RULES = [
  { t: 'Compared First', d: "Nothing gets listed until it beats a cheaper and a pricier version of itself. When the cheap one wins, I say so." },
  { t: 'Cons Included', d: "The flaws print right next to the praise. If the lid warps in the dishwasher, it says so on the card." },
  { t: 'Short on Purpose', d: "Fifteen picks I can defend beat thirty I can't. Every list is short enough to finish with your coffee." },
]

export default function About() {
  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" />About<span className="eyebrow-rule" /></span>
        <h1>The Pickiest Shopper You Know</h1>
        <p>Trained at Parsons, obsessed with cameras, sharpened in the one-star reviews. SavvyHomie exists so the only thing that reaches your cart is the good stuff.</p>
      </section>

      <section className="band band-white">
        <div className="wrap about-intro">
          <div className="about-photo"><img src="/founder.jpg" alt="Carol, founder of SavvyHomie" /></div>
          <div className="about-story">
            <span className="lbl">Hi, I'm Carol</span>
            <h2>A Design Degree and a Renter's Budget</h2>
            <p>I studied interior design at Parsons. I also live on a normal budget, with a rule that nothing enters my home until it beats a cheaper option in a fair fight. That combination is the whole site.</p>
            <p>Photography and video are my other obsession, and they earn their keep here: after enough hours behind a camera, you can tell when a product photo is doing the selling instead of the product. Half this job is seeing past the staging.</p>
            <p>Before anything makes a list, I read the one-star reviews, the six-month follow-ups, and the questions nobody answered. I put the $18 version next to the $45 one and tell you when the $18 wins. It wins more often than the $45 crowd would like.</p>
            <p>And I keep lists short, because you don't need thirty options. You need the three that survive a drawer slamming shut a thousand times.</p>
          </div>
        </div>
      </section>

      <section className="band band-spruce about-rules">
        <div className="wrap">
          <div className="sec-head"><span className="lbl">The Rules I Shop By</span><h2>Three Promises on Every List</h2></div>
          <div className="founder-points">
            {RULES.map((r, i) => (
              <div className="fp" key={r.t}>
                <span className="fp-n">No. {i + 1}</span>
                <h4>{r.t}</h4>
                <p>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="band band-butter about-money">
        <div className="wrap">
          <span className="lbl">Where the Money Comes From</span>
          <h3>Amazon Pays the Bills. It Doesn't Pick the Lists.</h3>
          <p>When you buy through a link here, Amazon sends this site a small cut. Your price stays the same, the list stays the same, and no brand can buy a spot on it. The paperwork lives in the <Link to="/affiliate-disclosure/">affiliate disclosure</Link>. The method lives in <Link to="/how-we-pick-products/">how we pick products</Link>.</p>
        </div>
      </div>

      <EmailSignup />
    </>
  )
}
