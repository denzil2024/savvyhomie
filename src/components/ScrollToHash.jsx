import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// react-router's client-side page swaps don't reset scroll position the way a
// full browser reload does. Without this, navigating to a new page leaves you
// wherever you were scrolled to on the previous one. This scrolls to top on a
// plain navigation, or to a #hash target when one is present.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [pathname, hash])

  return null
}
