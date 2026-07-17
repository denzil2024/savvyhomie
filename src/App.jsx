import { Routes, Route, Link } from 'react-router-dom'
import { categories, SITE_NAME } from './lib/content.js'
import Home from './pages/Home.jsx'
import Category from './pages/Category.jsx'
import Post from './pages/Post.jsx'
import './styles.css'

export default function App() {
  return (
    <>
      <header className="masthead">
        <div className="wrap mast-inner">
          <Link to="/" className="wordmark">savvyhomie<span className="dot"> ■</span></Link>
          <nav className="cats">
            {categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}/`}>{c.name}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug/*" element={<Category />} />
          <Route path="/:slug/*" element={<Post />} />
        </Routes>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <p>{SITE_NAME} · About · Contact · Privacy Policy · How We Pick Products · Affiliate Disclosure</p>
          <p>As an Amazon Associate, {SITE_NAME} earns from qualifying purchases.</p>
        </div>
      </footer>
    </>
  )
}
