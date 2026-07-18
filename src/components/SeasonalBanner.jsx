import { Link } from 'react-router-dom'

// Fixed-size, evergreen: swap the season object by month, never grows the page.
function currentSeason() {
  const m = new Date().getMonth() // 0=Jan
  if (m >= 8 && m <= 10) return { label: 'Gift season is coming', copy: "Christmas gift guides land here first, before the rush starts.", slug: 'gift-guides' }
  if (m === 11 || m === 0) return { label: 'Fresh start, tidier home', copy: 'New Year organization ideas for every room.', slug: 'organization' }
  if (m >= 1 && m <= 4) return { label: 'Spring refresh', copy: 'Decor and organizing ideas for the season of new starts.', slug: 'decor-finds' }
  return { label: 'Summer hosting season', copy: 'Kitchen finds for backyard dinners and long weekends.', slug: 'kitchen-finds' }
}

export default function SeasonalBanner() {
  const s = currentSeason()
  return (
    <div className="band band-butter">
      <Link to={`/category/${s.slug}/`} className="wrap seasonal-banner">
        <div>
          <span className="lbl"><span className="eyebrow-rule" />{s.label}</span>
          <h3>{s.copy}</h3>
        </div>
        <span className="btn-ghost">Browse the guides →</span>
      </Link>
    </div>
  )
}
