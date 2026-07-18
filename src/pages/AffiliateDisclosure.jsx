import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout.jsx'

const SECTIONS = [
  { id: 'short-version', label: 'The Short Version' },
  { id: 'how-it-works', label: 'How Affiliate Links Work' },
  { id: 'editorial-independence', label: 'What This Doesn’t Change' },
  { id: 'other-partnerships', label: 'Other Partnerships' },
  { id: 'ftc', label: 'FTC Compliance' },
  { id: 'questions', label: 'Questions' },
]

export default function AffiliateDisclosure() {
  return (
    <LegalLayout title="Affiliate Disclosure" updated="July 2026" sections={SECTIONS}>
      <div className="answer" id="short-version">
        <b>The short version:</b> SavvyHomie is a participant in the Amazon Services LLC Associates Program. When you click certain links on this site and buy something, we earn a small commission. It costs you nothing extra, and it never changes which product wins a spot on a list.
      </div>

      <h2 id="how-it-works">How Affiliate Links Work</h2>
      <p>Most product links on this site, the "Check price on Amazon" buttons especially, are affiliate links. When you click one and buy anything on Amazon within a set window (not just the item we linked), Amazon pays us a small percentage of that sale. Amazon sets the rate, not us, and it comes out of Amazon's margin, not your wallet.</p>
      <p>You can always tell which posts carry affiliate links: every roundup and product page includes a short disclosure line above the picks.</p>

      <h2 id="editorial-independence">What This Doesn't Change</h2>
      <p>The commission structure creates an obvious incentive to recommend more expensive products, since a higher price usually means a bigger commission. We work against that on purpose:</p>
      <ul>
        <li>Every pick is compared against a cheaper and a pricier alternative before it makes a list, and the cheaper option wins when it's genuinely better value.</li>
        <li>Cons are published next to every product, including the ones we recommend.</li>
        <li>No brand, manufacturer, or seller can pay for placement, a better review, or removal of a negative point. We don't run sponsored posts, and if that ever changes, any sponsored content will be labeled as such, clearly and separately from this disclosure.</li>
      </ul>
      <p>See <Link to="/how-we-pick-products/">how we pick products</Link> for the actual method behind every list.</p>

      <h2 id="other-partnerships">Other Partnerships</h2>
      <p>This site is not yet running display advertising. Once it qualifies for an ad management partner (Mediavine or a similar network), ads will appear alongside content and this section will be updated to name the partner and explain what that means for you. Until then, Amazon Associates is the only paid relationship this site has.</p>

      <h2 id="ftc">FTC Compliance</h2>
      <p>This disclosure follows the Federal Trade Commission's guidance on affiliate marketing and endorsements (16 CFR Part 255). Where required, individual posts also carry an in-content disclosure so the relationship is clear in the place you're actually reading, not just buried on a separate page.</p>

      <h2 id="questions">Questions</h2>
      <p>If anything here is unclear, or you think a product review reads differently than it should given this disclosure, <Link to="/contact/">reach out</Link>. That kind of feedback is exactly what keeps this page honest.</p>
    </LegalLayout>
  )
}
