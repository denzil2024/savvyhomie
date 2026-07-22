import { Link } from 'react-router-dom'
import EmailSignup from '../components/EmailSignup.jsx'

const RULES = [
  { t: 'Always Testing Something', d: "There's usually a new gadget on my counter or a room getting rearranged. If it doesn't earn a spot in my own home first, it doesn't make the site." },
  { t: 'Just Me, For Now', d: "SavvyHomie is a one-woman operation. Every post, every pick, and every reply in the inbox comes from me, not a team of writers." },
  { t: 'Updated, Not Abandoned', d: "Prices change and products get discontinued. When that happens here, the post gets fixed, not left to rot." },
]

export default function About() {
  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" />About<span className="eyebrow-rule" /></span>
        <h1>Real Talk. Real Homes. No Fluff.</h1>
        <p>I'm just someone who loves making a home feel good without wasting money on stuff that doesn't hold up. SavvyHomie is where I share what works, tips and product picks both.</p>
      </section>

      <section className="band band-white">
        <div className="wrap about-intro">
          <div className="about-photo"><img src="/founder.webp" alt="Carol, founder of SavvyHomie" /></div>
          <div className="about-story">
            <span className="lbl">Hi, I'm Carol</span>
            <h2>Good Taste on a Normal Budget</h2>
            <p>I went to design school, but the real training came from living on a normal budget and refusing to buy stuff that doesn't hold up. Everything on this site, the quick fixes and the product picks alike, has to earn its place in a real home, not just look good in a photo.</p>
            <p>Photography and video are my other obsession, and they come in handy here. After enough hours behind a camera, you can spot when a product photo is doing the selling instead of the product. Half this job is seeing past the staging.</p>
            <p>Before anything makes a list, I dig through the one-star reviews, the six-month follow-ups, and the questions nobody bothered to answer. I'll put the $18 version next to the $45 one and tell you straight up when the $18 wins. It wins more often than the $45 crowd would like.</p>
            <p>And I keep lists short, because nobody needs thirty options. You need the three that survive a drawer slamming shut a thousand times.</p>
          </div>
        </div>
      </section>

      <section className="band band-spruce about-rules">
        <div className="wrap">
          <div className="sec-head"><span className="lbl">Behind the Scenes</span><h2>A Few More Things Worth Knowing</h2></div>
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
          <h3>Links Pay the Bills. They Don't Pick the Lists.</h3>
          <p>Some links on this site earn a small commission when you buy through them. Your price stays the same, the list stays the same, and no brand gets to buy a spot on it. The paperwork lives in the <Link to="/affiliate-disclosure/">affiliate disclosure</Link>. The method lives in <Link to="/how-we-pick-products/">how we pick products</Link>.</p>
        </div>
      </div>

      <EmailSignup />
    </>
  )
}
