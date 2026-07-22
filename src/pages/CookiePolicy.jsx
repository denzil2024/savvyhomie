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
      <p>{SITE_NAME} doesn't run display advertising yet, so there's no ad-tracking cookie to disclose. What runs today is Google Analytics (GA4), which sets cookies to distinguish returning visitors from new ones and to measure how pages are used, plus essential, functional cookies that keep basic site behavior working correctly as you move between pages. We also run Ahrefs Analytics, a lightweight tool that measures page views and traffic sources alongside GA4. None of this is used to build an advertising profile of you.</p>

      <h2 id="cookies-coming">Cookies We'll Add</h2>
      <p>One thing is planned and not live yet. When it ships, this page gets updated the same day, not eventually:</p>
      <ul>
        <li><strong>Advertising.</strong> Once this site is approved for display ads through a partner such as Mediavine, that partner and its advertising vendors will set cookies to serve and measure ads, some of which may be used to personalize the ads you see based on browsing behavior.</li>
      </ul>

      <h2 id="controlling-cookies">How to Control Them</h2>
      <p>Every modern browser lets you block or delete cookies from its settings menu, either sitewide or per-site. Blocking cookies entirely may break some site features, like staying logged into an embedded widget. For Google Analytics specifically, Google offers a dedicated <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">opt-out browser add-on</a> that stops your visits from being measured on any site, including this one. Once ad cookies go live, this section will include direct opt-out links for that tool too.</p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>This policy is intentionally short right now because the site is genuinely not doing much with cookies yet. As that changes, this page changes with it, and the update date at the top will move. For the broader picture of what information we collect and why, see the <Link to="/privacy-policy/">privacy policy</Link>.</p>
    </LegalLayout>
  )
}
