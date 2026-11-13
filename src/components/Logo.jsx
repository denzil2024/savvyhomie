import { useState } from 'react'

// /public/logo.png is the plain black mark (used on dark backgrounds via CSS invert).
// /public/logo-color.png is the two-tone black+green variant for light backgrounds.
// Falls back to the styled text wordmark if the file doesn't exist or fails to load.
export default function Logo({ src = '/logo.png' }) {
  const [failed, setFailed] = useState(false)

  if (!failed) {
    return <img className="logo-img" src={src} alt="SavvyHomie" width="1692" height="538" onError={() => setFailed(true)} />
  }
  return <>savvyhomie<span className="dot"> ■</span></>
}
