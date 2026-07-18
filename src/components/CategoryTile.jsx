import { Link } from 'react-router-dom'
import Photo from './Photo.jsx'

const ICONS = {
  'gift-guides': 'M20 12v10H4V12M2 7h20v5H2V7Zm10 15V7M12 7C9 7 7 5 7 3.5S8 1 9.5 1 12 3 12 7ZM12 7c3 0 5-2 5-3.5S15.5 1 14 1 12 3 12 7Z',
  'kitchen-finds': 'M7 2v20M4 2v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V2M17 2v20M17 2a5 5 0 0 0-5 5v3a2 2 0 0 0 2 2h3',
  'organization': 'M3 7h7v7H3V7Zm11 0h7v4h-7V7ZM3 17h7v4H3v-4Zm11 3h7v-6h-7v6Z',
  'decor-finds': 'M4 21V10l8-6 8 6v11M9 21v-7h6v7',
  'seasonal': 'M12 2v20M12 2 8 6M12 2l4 4M4 8l16 8M4 8l5 1M4 8l1 5M20 16l-5-1M20 16l-1-5',
}

// Real photos land here as they're picked; slugs without one fall back to the placeholder.
const IMAGES = {
  'gift-guides': '/cat-gift-guides.jpg',
  'kitchen-finds': '/cat-kitchen-finds.jpg',
  'organization': '/cat-organization.jpg',
  'decor-finds': '/cat-decor-finds.jpg',
  'seasonal': '/cat-seasonal.jpg',
}

export default function CategoryTile({ slug, name, topics = [] }) {
  return (
    <div className="cat-tile">
      <Link to={`/category/${slug}/`} className="cat-tile-main">
        <span className="cat-tile-media">
          {IMAGES[slug] ? <img className="cat-tile-photo" src={IMAGES[slug]} alt={name} /> : <Photo seed={slug} label="" />}
        </span>
        <span className="cat-tile-bar">
          <svg className="cat-tile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={ICONS[slug]} />
          </svg>
          {name}
        </span>
      </Link>
      {topics.length > 0 && (
        <span className="cat-tile-topics">
          {topics.map((t) => <Link key={t} className="cat-tile-topic" to={`/category/${slug}/`}>{t}</Link>)}
        </span>
      )}
    </div>
  )
}
