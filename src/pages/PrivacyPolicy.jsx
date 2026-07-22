import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout.jsx'
import { SITE_NAME } from '../lib/content.js'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use-it', label: 'How We Use It' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'third-parties', label: 'Third-Party Services' },
  { id: 'childrens-privacy', label: "Children's Privacy" },
  { id: 'your-choices', label: 'Your Choices' },
  { id: 'security', label: 'Data Retention & Security' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact Us' },
]

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="July 2026"
      intro={`How ${SITE_NAME} collects, uses, and protects the information that reaches this site.`}
      sections={SECTIONS}
    >
      <h2 id="overview">Overview</h2>
      <p>{SITE_NAME} is a small, independently run site. This policy explains what we collect from you, plainly, without the padding most privacy policies use to say nothing. If a section doesn't apply to us yet, we say so instead of writing around it.</p>

      <h2 id="information-we-collect">Information We Collect</h2>
      <p>Two kinds of information reach us:</p>
      <ul>
        <li><strong>What you give us directly.</strong> If you subscribe to the email list, we collect the email address you enter. If you use the contact form, we collect your name, email, and whatever you write to us.</li>
        <li><strong>What's collected automatically.</strong> Like most websites, our hosting provider logs standard technical data for every visit: your IP address, browser type, device, and the pages you view. We also run Google Analytics (GA4) and Ahrefs Analytics to see which pages get read and how people find the site. Neither is used to build an advertising profile of you. See the <Link to="/cookie-policy/">cookie policy</Link> for exactly what each one tracks and how to opt out.</li>
      </ul>

      <h2 id="how-we-use-it">How We Use It</h2>
      <p>Email addresses are used only to send the newsletter you signed up for. Contact form submissions are used only to reply to you. Automatic technical data is used in aggregate, to understand which content is useful and to keep the site running correctly. We do not sell your information to anyone, for any reason.</p>

      <h2 id="cookies">Cookies</h2>
      <p>We use a limited number of cookies today: essential ones that keep the site functioning correctly between pages, plus analytics cookies from Google Analytics. Once display advertising goes live, additional cookies will be added for that. The full breakdown, and how to control it, lives in the <Link to="/cookie-policy/">cookie policy</Link>.</p>

      <h2 id="third-parties">Third-Party Services</h2>
      <p>Some parts of this site connect to outside services, each with its own privacy practices:</p>
      <ul>
        <li><strong>Amazon Associates.</strong> Product links go to Amazon. Amazon's own privacy policy governs what happens once you're on their site.</li>
        <li><strong>Pinterest.</strong> Our Pinterest profile and any embedded pins are subject to Pinterest's privacy policy.</li>
        <li><strong>Google Analytics.</strong> We use GA4 to see traffic and page views. Google's own privacy policy governs how it handles this data.</li>
        <li><strong>Ahrefs Analytics.</strong> A lightweight analytics tool we use alongside GA4 to see overall site traffic.</li>
        <li><strong>Email delivery.</strong> Once an email service provider is connected to power the newsletter, that provider will process subscriber addresses on our behalf, under its own privacy and security terms.</li>
        <li><strong>Future ad partners.</strong> When display advertising goes live through a partner such as Mediavine, that partner and its own advertising vendors may use cookies to serve relevant ads. This section will name the partner directly once that happens.</li>
      </ul>

      <h2 id="childrens-privacy">Children's Privacy</h2>
      <p>This site is intended for a general adult audience and is not directed at children under 13. We do not knowingly collect personal information from children.</p>

      <h2 id="your-choices">Your Choices</h2>
      <p>You can unsubscribe from the email list at any time using the link in any email we send. You can also control or block cookies through your browser settings, though some site features may not work as well with cookies fully disabled. To ask what information we hold about you, or to have it deleted, use the <Link to="/contact/">contact page</Link>.</p>

      <h2 id="security">Data Retention & Security</h2>
      <p>We keep the information described above only as long as it's useful for the purpose it was collected for, for example, an email address stays on the list until you unsubscribe. We take reasonable technical steps to protect it, but no method of transmission or storage online is perfectly secure, and we can't guarantee absolute protection.</p>

      <h2 id="changes">Changes to This Policy</h2>
      <p>This page will change as the site adds real analytics, advertising, or an email provider. The "Last updated" date at the top always reflects the most recent revision, and material changes will be reflected here directly rather than announced separately.</p>

      <h2 id="contact">Contact Us</h2>
      <p>Questions about this policy or your data can go through the <Link to="/contact/">contact page</Link>.</p>
    </LegalLayout>
  )
}
