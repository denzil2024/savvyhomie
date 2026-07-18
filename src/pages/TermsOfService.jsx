import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout.jsx'
import { SITE_NAME } from '../lib/content.js'

const SECTIONS = [
  { id: 'acceptance', label: 'Acceptance of Terms' },
  { id: 'using-the-site', label: 'Using the Site' },
  { id: 'not-advice', label: 'Not Professional Advice' },
  { id: 'affiliate-links', label: 'Affiliate Links & Third Parties' },
  { id: 'intellectual-property', label: 'Intellectual Property' },
  { id: 'warranties', label: 'Disclaimer of Warranties' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'changes', label: 'Changes to These Terms' },
  { id: 'contact', label: 'Contact Us' },
]

export default function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="July 2026"
      intro={`The ground rules for using ${SITE_NAME}, kept as short as a legal page reasonably can be.`}
      sections={SECTIONS}
    >
      <h2 id="acceptance">Acceptance of Terms</h2>
      <p>By reading and using this site, you agree to these terms. If you don't agree with them, the only real remedy is to stop using the site, since we don't track individual agreement beyond that.</p>

      <h2 id="using-the-site">Using the Site</h2>
      <p>You're welcome to read, share, and link to anything published here. What's not allowed: scraping the site to republish our writing elsewhere, presenting our content as your own, or using automated tools to pull content at a scale that disrupts the site for other readers.</p>

      <h2 id="not-advice">Not Professional Advice</h2>
      <p>Everything on {SITE_NAME} is general guidance for home and kitchen shopping, based on product research and personal experience. It is not professional interior design, electrical, structural, or safety advice. For anything involving wiring, load-bearing changes, gas lines, or building codes, talk to a licensed professional, not a blog.</p>

      <h2 id="affiliate-links">Affiliate Links & Third-Party Sites</h2>
      <p>Many product links on this site are affiliate links, detailed fully in our <Link to="/affiliate-disclosure/">affiliate disclosure</Link>. Clicking a link takes you to a site we don't control, most often Amazon. We're not responsible for the content, pricing, availability, or policies of any third-party site you reach from here, and product prices and specs can change after we publish.</p>

      <h2 id="intellectual-property">Intellectual Property</h2>
      <p>The writing, design, and original photography on this site belong to {SITE_NAME}, unless otherwise noted. Product images sourced through Amazon's affiliate program remain the property of their respective owners and are used under the terms of that program. Brand names and trademarks mentioned here belong to their respective companies and are used for identification only.</p>

      <h2 id="warranties">Disclaimer of Warranties</h2>
      <p>This site is provided as-is. We work to keep information accurate and current, but we don't guarantee that every price, spec, or product detail is error-free at the moment you're reading it, products get discontinued and prices change faster than any single site can track in real time.</p>

      <h2 id="liability">Limitation of Liability</h2>
      <p>{SITE_NAME} isn't liable for any loss or damage arising from your use of this site or reliance on anything published here, including purchases made through affiliate links. Your relationship with any retailer you buy from is governed by that retailer's own terms.</p>

      <h2 id="changes">Changes to These Terms</h2>
      <p>These terms may be updated as the site grows, for instance, once display advertising or an email newsletter provider is added. The date at the top of this page reflects the latest version, and continued use of the site after a change means you accept the update.</p>

      <h2 id="contact">Contact Us</h2>
      <p>Questions about these terms can go through the <Link to="/contact/">contact page</Link>.</p>
    </LegalLayout>
  )
}
