import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout.jsx'
import { SITE_NAME } from '../lib/content.js'

const SECTIONS = [
  { id: 'what-are-cookies', label: 'What Cookies Are' },
  { id: 'cookies-today', label: 'Cookies We Use Today' },
  { id: 'cookies-coming', label: "Cookies We'll Add" },
  { id: 'controlling-cookies', label: 'How to Control Them' },
  { id: 'changes', label: 'Changes to This Policy' },
]

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      updated="July 2026"
      intro={`The short list of what ${SITE_NAME} stores in your browser, and what's still on the way.`}
      sections={SECTIONS}
    >
      <h2 id="what-are-cookies">What Cookies Are</h2>
      <p>Cookies are small text files a site stores in your browser to remember something between visits, that you closed a banner, that you're mid-way through a form, or that an ad has already been shown to you. They're not unique to this site; nearly every site you visit uses them in some form.</p>

      <h2 id="cookies-today">Cookies We Use Today</h2>
      <p>Honestly, not many. At this stage, {SITE_NAME} doesn't run display advertising and doesn't have a dedicated analytics tool installed, so there's no ad-tracking or analytics cookie to disclose yet. What runs today is limited to essential, functional cookies that keep basic site behavior working correctly as you move between pages. None of them are used to build an advertising profile of you.</p>

      <h2 id="cookies-coming">Cookies We'll Add</h2>
      <p>Two things are planned and not live yet. When each one ships, this page gets updated the same day, not eventually:</p>
      <ul>
        <li><strong>Analytics.</strong> Google Analytics (GA4) is the planned tool for understanding which content is actually useful. It sets cookies to distinguish returning visitors from new ones and to measure how pages are used.</li>
        <li><strong>Advertising.</strong> Once this site is approved for display ads through a partner such as Mediavine, that partner and its advertising vendors will set cookies to serve and measure ads, some of which may be used to personalize the ads you see based on browsing behavior.</li>
      </ul>

      <h2 id="controlling-cookies">How to Control Them</h2>
      <p>Every modern browser lets you block or delete cookies from its settings menu, either sitewide or per-site. Blocking cookies entirely may break some site features, like staying logged into an embedded widget. Once analytics and ad cookies go live, this section will include direct opt-out links for those specific tools rather than only pointing at general browser settings.</p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>This policy is intentionally short right now because the site is genuinely not doing much with cookies yet. As that changes, this page changes with it, and the update date at the top will move. For the broader picture of what information we collect and why, see the <Link to="/privacy-policy/">privacy policy</Link>.</p>
    </LegalLayout>
  )
}
