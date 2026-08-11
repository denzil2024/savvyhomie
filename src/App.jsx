import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { categories, SITE_NAME, TAGLINE } from './lib/content.js'
import Home from './pages/Home.jsx'
import Category from './pages/Category.jsx'
import Topic from './pages/Topic.jsx'
import Post from './pages/Post.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import AffiliateDisclosure from './pages/AffiliateDisclosure.jsx'
import HowWePickProducts from './pages/HowWePickProducts.jsx'
import Logo from './components/Logo.jsx'
import ScrollToHash from './components/ScrollToHash.jsx'
import './styles.css'

// The nav sets category names in tracked small caps, where the full
// "Organization & Storage" is wide enough to push the row to two lines. These
// shorter labels are display-only — the category pages keep their real names.
const NAV_LABEL = {
  'organization': 'Organization',
  'decor-finds': 'Home Decor',
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)
  return (
    <>
      <ScrollToHash />
      {/* utility strip: brand promise centered, contact/social pinned right */}
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span className="topbar-promise"><span className="topbar-dot">✦</span> Real tips. Honest picks. No fluff. <span className="topbar-dot">✦</span></span>
          <span className="topbar-icons">
            <a href="https://www.pinterest.com/savvyhomie/" target="_blank" rel="noopener noreferrer" aria-label="SavvyHomie on Pinterest">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.2 9.3-.1-.8-.2-2 0-2.9.2-.8 1.2-5.2 1.2-5.2s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.5-4.5-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.5.1.1.1.2.1.3-.1.4-.3 1.1-.3 1.3 0 .2-.2.3-.4.2-1.4-.7-2.3-2.8-2.3-4.5 0-3.6 2.6-7 7.6-7 4 0 7.1 2.8 7.1 6.6 0 4-2.5 7.2-5.9 7.2-1.2 0-2.3-.6-2.6-1.4l-.7 2.7c-.3 1-1 2.3-1.5 3.1.9.3 1.9.4 2.9.4 5.5 0 10-4.5 10-10S17.5 2 12 2Z" /></svg>
            </a>
            <Link to="/contact/" aria-label="Contact">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg>
            </Link>
          </span>
        </div>
      </div>

      {/* centered masthead: wordmark on its own line, nav in a ruled band beneath */}
      <header className="masthead">
        <div className="wrap mast-inner">
          <Link to="/" className="wordmark" onClick={closeNav}><Logo src="/logo-color.png" /></Link>
          <button className="nav-toggle" aria-label={navOpen ? 'Close menu' : 'Open menu'} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {navOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
        <div className="mast-navband">
          <nav className={`cats${navOpen ? ' open' : ''}`}>
            <Link to="/" onClick={closeNav}>Home</Link>
            {categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}/`} onClick={closeNav}>{NAV_LABEL[c.slug] || c.name}</Link>
            ))}
            <Link to="/about/" onClick={closeNav}>About</Link>
            <Link to="/#subscribe" className="btn nav-cta-menu" onClick={closeNav}>Subscribe</Link>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/*" element={<About />} />
          <Route path="/contact/*" element={<Contact />} />
          <Route path="/privacy-policy/*" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy/*" element={<CookiePolicy />} />
          <Route path="/terms-of-service/*" element={<TermsOfService />} />
          <Route path="/affiliate-disclosure/*" element={<AffiliateDisclosure />} />
          <Route path="/how-we-pick-products/*" element={<HowWePickProducts />} />
          <Route path="/category/:slug/:topic/*" element={<Topic />} />
          <Route path="/category/:slug/*" element={<Category />} />
          <Route path="/blog/:slug/*" element={<Post />} />
        </Routes>
      </main>

      <footer className="brand-ft">
        <div className="wrap">
          <div className="ft-inner">
            <div>
              <div className="ft-wordmark"><Logo /></div>
              <p className="ft-tag">{TAGLINE}</p>
              <p className="ft-desc">Practical home &amp; kitchen tips, gift guides, and honest product picks, independently researched and reviewed. As an Amazon Associate, {SITE_NAME} earns from qualifying purchases.</p>
            </div>
            <div>
              <p className="ft-col-t">Shop by Category</p>
              <div className="ft-links">
                {categories.map((c) => <Link key={c.slug} to={`/category/${c.slug}/`}>{c.name}</Link>)}
              </div>
            </div>
            <div>
              <p className="ft-col-t">Company</p>
              <div className="ft-links">
                <Link to="/about/">About</Link>
                <Link to="/contact/">Contact</Link>
                <Link to="/how-we-pick-products/">How We Pick Products</Link>
              </div>
            </div>
            <div>
              <p className="ft-col-t">Follow Along</p>
              <div className="ft-links">
                <Link to="/#subscribe" className="ft-cta">Join the list →</Link>
                <a href="https://www.pinterest.com/savvyhomie/" target="_blank" rel="noopener noreferrer">Pinterest ↗</a>
              </div>
            </div>
          </div>
          <div className="ft-bottom">
            <p className="ft-copy">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
            <div className="ft-legal">
              <Link to="/privacy-policy/">Privacy Policy</Link>
              <Link to="/cookie-policy/">Cookie Policy</Link>
              <Link to="/terms-of-service/">Terms of Service</Link>
              <Link to="/affiliate-disclosure/">Affiliate Disclosure</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
