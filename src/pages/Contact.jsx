const TRIAGE = [
  { t: 'Found a broken link or wrong price', d: 'Fastest replies live here. Include the post title and I\'ll fix it or pull the pick.' },
  { t: 'Have a product or topic to suggest', d: 'Send the details, a product link or the topic you want covered, and why it\'s worth adding. No guarantees, but I read every one.' },
  { t: 'Pitching a partnership or press', d: 'Say what you\'re pitching in the first line. Vague intros go to the bottom of the pile.' },
]

export default function Contact() {
  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" />Contact<span className="eyebrow-rule" /></span>
        <h1>Drop Me a Line</h1>
        <p>It's just me reading this inbox, so the more specific you can be, the faster I can help. Tell me what you need and I'll get back to you within 24 hours.</p>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="contact-panel">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <span className="lbl">Send a Message</span>
              <div className="cf-row">
                <label>
                  <span>Name</span>
                  <input type="text" name="name" required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" required />
                </label>
              </div>
              <label>
                <span>What's this about?</span>
                <select name="topic" defaultValue="">
                  <option value="" disabled>Choose one</option>
                  <option>Broken link or wrong price</option>
                  <option>Product suggestion</option>
                  <option>Partnership or press</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows={7} required />
              </label>
              <button className="btn" type="submit">Send it</button>
            </form>

            <div className="contact-side">
              <div className="cs-avatar">
                <span className="cs-avatar-img"><img src="/founder.webp" alt="Carol" /></span>
                <div>
                  <p className="cs-name">Carol replies personally</p>
                  <p className="cs-time">Usually within 24 hours</p>
                </div>
              </div>

              <div className="cs-block">
                <span className="lbl">Before You Write</span>
                {TRIAGE.map((t) => (
                  <div className="ct-item" key={t.t}>
                    <h3>{t.t}</h3>
                    <p>{t.d}</p>
                  </div>
                ))}
              </div>

              <div className="cs-block cs-direct">
                <span className="lbl">Direct</span>
                <a href="mailto:hello@savvyhomie.com">hello@savvyhomie.com</a>
                <a href="https://www.pinterest.com/savvyhomie/" target="_blank" rel="noopener noreferrer">Pinterest ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
