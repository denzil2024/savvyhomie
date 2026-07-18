import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// react-router's client-side page swaps don't auto-scroll to a #hash the way a
// full browser reload does. This restores that behavior after every navigation.
export default function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return null
}
