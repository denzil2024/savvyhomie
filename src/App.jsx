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

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = () => setNavOpen(false)
  return (
    <>
      <ScrollToHash />
      <div className="topbar"><span className="topbar-dot">✦</span> Real tips. Honest picks. No fluff. <span className="topbar-dot">✦</span></div>
      <header className="masthead">
        <div className="wrap mast-inner">
          <Link to="/" className="wordmark" onClick={closeNav}><Logo src="/logo-color.png" /></Link>
          <nav className={`cats${navOpen ? ' open' : ''}`}>
            {categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}/`} onClick={closeNav}>{c.name}</Link>
            ))}
            <Link to="/#subscribe" className="btn nav-cta-menu" onClick={closeNav}>Subscribe</Link>
          </nav>
          <Link to="/#subscribe" className="btn nav-cta" onClick={closeNav}>Subscribe</Link>
          <button className="nav-toggle" aria-label={navOpen ? 'Close menu' : 'Open menu'} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {navOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
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
