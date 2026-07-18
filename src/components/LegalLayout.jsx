export default function LegalLayout({ title, updated, intro, sections, children }) {
  return (
    <>
      <section className="hero cat-hero">
        <span className="eyebrow lbl"><span className="eyebrow-rule" />Legal<span className="eyebrow-rule" /></span>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {updated && <p className="legal-updated">Last updated {updated}</p>}
      </section>

      <section className="band band-white">
        <div className="wrap legal-wrap">
          {sections && sections.length > 0 && (
            <nav className="legal-toc" aria-label="On this page">
              <span className="lbl"><span className="eyebrow-rule" />On This Page</span>
              <ol>
                {sections.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>
                ))}
              </ol>
            </nav>
          )}
          <div className="prose legal-body">{children}</div>
        </div>
      </section>
    </>
  )
}
