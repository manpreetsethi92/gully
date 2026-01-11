import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/butterfly.png" alt="Titlii" className="w-8 h-auto" />
            <span className="text-2xl font-bold tracking-tight" style={{ color: '#E50914' }}>titlii</span>
          </a>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Home
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-gray">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">titlii.social — A Service of Made of Drama Studios Inc.</p>
          <p className="text-sm text-gray-400 mb-8">Last Updated: January 8, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>Made of Drama Studios Inc. ("Company," "we," "our," or "us"), based in Dallas, Texas, operates Titlii (titlii.social). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website, Telegram bot, mobile applications, and related services ("Services").</p>
            <p>By using our Services, you consent to the practices described in this Privacy Policy. If you do not agree, do not use our Services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Account Information: Phone number, name, email address</li>
              <li>Profile Information: Professional skills, experience, portfolio links, profile photos</li>
              <li>Preferences: Location, availability, work types, budget/rate information</li>
              <li>Content: Job postings, work requests, messages, feedback</li>
              <li>Verification Information: Identity verification documents</li>
              <li>Communications: Support inquiries, feedback</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Device Information: Device type, OS, unique identifiers, browser type</li>
              <li>Usage Data: Features accessed, pages viewed, interactions, timestamps</li>
              <li>Log Information: IP addresses, access times, referring URLs, error logs</li>
              <li>Location Data: General location from IP address (not precise GPS without consent)</li>
              <li>Activity Patterns: Response rates, engagement metrics, matching history</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Firebase: Authentication data</li>
              <li>Telegram: User ID, username, bot interactions</li>
              <li>LinkedIn: Publicly available professional information</li>
              <li>Public Job Boards: Aggregated postings from Reddit, X, Craigslist, Facebook</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.4 Cookies and Tracking Technologies</h3>
            <p>We use cookies, web beacons, and similar technologies. You can control cookies through browser settings, but disabling them may limit functionality.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Sensitive Personal Information</h2>
            <p>Under California law (CPRA), "sensitive personal information" includes certain categories requiring heightened protection. We may collect the following sensitive personal information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account log-in credentials (in combination with required security codes)</li>
              <li>Precise geolocation (only with your explicit consent)</li>
              <li>Contents of messages you send through our platform</li>
            </ul>
            <p>We use sensitive personal information only for purposes permitted by law, such as providing our Services and ensuring security. We do not use sensitive personal information for purposes beyond what is necessary to provide the Services or for purposes that are not reasonably expected.</p>
            <p>California residents have the right to limit the use and disclosure of their sensitive personal information. See Section 10 for details.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
            
            <h3 className="text-xl font-medium mb-3">4.1 Providing Services</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Creating and managing your account</li>
              <li>Powering our AI-driven matching algorithm</li>
              <li>Connecting you with opportunities and professionals</li>
              <li>Calculating credibility scores</li>
              <li>Personalizing your experience</li>
              <li>Improving our Services</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">4.2 Communication</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Match notifications and opportunity alerts</li>
              <li>Customer support</li>
              <li>Service announcements</li>
              <li>Marketing communications (with consent where required)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">4.3 Safety and Security</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Detecting and preventing fraud, abuse, and security threats</li>
              <li>Maintaining blacklists and decline backoff protections</li>
              <li>Enforcing Terms of Service</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. AI Processing and Automated Decision-Making</h2>
            
            <h3 className="text-xl font-medium mb-3">5.1 AI-Powered Features</h3>
            <p>We use AI technologies, including Claude AI by Anthropic, to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Expand skill descriptions for better matching</li>
              <li>Generate personalized outreach content</li>
              <li>Score and rank potential matches</li>
              <li>Provide intelligent conversation assistance</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">5.2 Matching Algorithm Factors</h3>
            <p>Our algorithm considers: skills alignment, location groupings, verification levels, credibility scores, industry alignment, work type preferences, availability, budget compatibility, user activity patterns, and new user boosts.</p>

            <h3 className="text-xl font-medium mb-3">5.3 Your Rights Regarding AI Processing</h3>
            <p>You may request information about automated decision-making logic and request human review of certain decisions. Contact privacy@titlii.social.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. How We Share Your Information</h2>
            
            <h3 className="text-xl font-medium mb-3">6.1 With Other Users</h3>
            <p>When matched, we share relevant profile information (name, skills, location, portfolio, availability). You control your public profile content.</p>

            <h3 className="text-xl font-medium mb-3">6.2 With Service Providers</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>MongoDB Atlas (database hosting)</li>
              <li>Firebase (authentication)</li>
              <li>Vercel (frontend hosting)</li>
              <li>Railway (backend hosting)</li>
              <li>Anthropic (AI processing)</li>
              <li>Telegram (bot messaging)</li>
              <li>Apify (web scraping for job aggregation)</li>
              <li>n8n (automation workflows)</li>
            </ul>
            <p>These providers are contractually obligated to protect your information.</p>

            <h3 className="text-xl font-medium mb-3">6.3 For Legal Reasons</h3>
            <p>We may disclose information to comply with laws, enforce our Terms, protect rights/property/safety, or prevent fraud.</p>

            <h3 className="text-xl font-medium mb-3">6.4 Business Transfers</h3>
            <p>In mergers, acquisitions, or asset sales, your information may be transferred. We will notify you.</p>

            <h3 className="text-xl font-medium mb-3">6.5 Sale/Sharing of Personal Information</h3>
            <p><strong>WE DO NOT SELL YOUR PERSONAL INFORMATION.</strong> We have not sold personal information in the preceding 12 months.</p>
            <p>We may share personal information with service providers and business partners for cross-context behavioral advertising. California residents can opt out - see Section 10.</p>

            <h3 className="text-xl font-medium mb-3">6.6 Categories Disclosed in Past 12 Months</h3>
            <p>For business purposes, we have disclosed: Identifiers, professional information, internet activity, geolocation data, and inferences to service providers listed in Section 6.2.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p>We retain personal information as follows:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account Information: Duration of account plus 3 years</li>
              <li>Profile Information: Duration of account plus 1 year</li>
              <li>Transaction/Communication Records: 7 years (legal/tax requirements)</li>
              <li>Usage/Log Data: 2 years</li>
              <li>Aggregated Job Data: Regularly refreshed; retained up to 1 year</li>
            </ul>
            <p>After account deletion, we delete or anonymize information within 30 days, except where retention is legally required.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Security</h2>
            <p>We implement appropriate measures including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure database hosting (MongoDB Atlas)</li>
              <li>Firebase phone authentication</li>
              <li>Environment variable protection for credentials</li>
              <li>Regular security assessments</li>
              <li>Access controls limiting employee access</li>
            </ul>
            <p>However, no method is 100% secure. We cannot guarantee absolute security.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-medium mb-3">9.1 Access and Update</h3>
            <p>Access and update your information through account settings or our Telegram bot. For other information, contact privacy@titlii.social.</p>

            <h3 className="text-xl font-medium mb-3">9.2 Account Deletion</h3>
            <p>Request deletion at support@titlii.social. We process requests within 30 days, except where retention is legally required.</p>

            <h3 className="text-xl font-medium mb-3">9.3 Communication Preferences</h3>
            <p>Opt out of promotional communications via settings or unsubscribe links. Service communications cannot be opted out.</p>

            <h3 className="text-xl font-medium mb-3">9.4 Data Portability</h3>
            <p>Request a copy of your data in machine-readable format at privacy@titlii.social.</p>

            <h3 className="text-xl font-medium mb-3">9.5 Do Not Track Signals</h3>
            <p>Our Services do not currently respond to "Do Not Track" browser signals. However, you can manage tracking through cookie settings and by opting out of interest-based advertising through the Digital Advertising Alliance (optout.aboutads.info) or Network Advertising Initiative (optout.networkadvertising.org).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. California Privacy Rights (CCPA/CPRA)</h2>
            <p>California residents have the following rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):</p>

            <h3 className="text-xl font-medium mb-3">10.1 Right to Know</h3>
            <p>Request information about categories and specific pieces of personal information collected, sources, purposes, and third parties with whom we share it.</p>

            <h3 className="text-xl font-medium mb-3">10.2 Right to Delete</h3>
            <p>Request deletion of your personal information, subject to legal exceptions.</p>

            <h3 className="text-xl font-medium mb-3">10.3 Right to Correct</h3>
            <p>Request correction of inaccurate personal information we maintain about you.</p>

            <h3 className="text-xl font-medium mb-3">10.4 Right to Opt-Out of Sale/Sharing</h3>
            <p>We do NOT sell personal information. You may opt out of sharing for cross-context behavioral advertising by emailing privacy@titlii.social with subject "Opt-Out of Sharing."</p>

            <h3 className="text-xl font-medium mb-3">10.5 Right to Limit Use of Sensitive Personal Information</h3>
            <p>You may limit our use of sensitive personal information to only what is necessary to provide the Services. Email privacy@titlii.social with subject "Limit Sensitive Information."</p>

            <h3 className="text-xl font-medium mb-3">10.6 Right to Non-Discrimination</h3>
            <p>We will not discriminate against you for exercising your privacy rights.</p>

            <h3 className="text-xl font-medium mb-3">10.7 Authorized Agents</h3>
            <p>You may designate an authorized agent to submit requests on your behalf. The agent must provide written authorization signed by you. We may require you to verify your identity directly.</p>

            <h3 className="text-xl font-medium mb-3">10.8 Exercising Your Rights</h3>
            <p>Submit requests to privacy@titlii.social with subject "California Privacy Request." We will verify your identity using information associated with your account. We respond within 45 days (may be extended by 45 days with notice).</p>

            <h3 className="text-xl font-medium mb-3">10.9 Financial Incentives</h3>
            <p>We do not offer financial incentives for the collection, sale, or deletion of personal information.</p>

            <h3 className="text-xl font-medium mb-3">10.10 Shine the Light (CA Civil Code Section 1798.83)</h3>
            <p>California residents may request information about disclosure of personal information to third parties for direct marketing. We do not share personal information with third parties for their direct marketing purposes. Contact privacy@titlii.social for more information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Other State Privacy Rights</h2>
            <p>Residents of Virginia, Colorado, Connecticut, Utah, and other states with comprehensive privacy laws may have similar rights to access, delete, correct, and opt-out. Contact privacy@titlii.social to exercise these rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. International Users</h2>
            <p>Titlii is operated from the United States (Dallas, Texas). If you are outside the U.S., your information may be transferred to and processed in the United States.</p>
            <p>For EEA, UK, or other regions with data protection laws, we process data based on: consent, contract performance, legal obligations, and legitimate interests.</p>
            <p>EEA and UK users may lodge complaints with local data protection authorities.</p>
            <p>Standard Contractual Clauses or other appropriate safeguards apply to international transfers where required.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Children's Privacy</h2>
            <p>Our Services are not for individuals under 18. We do not knowingly collect personal information from children under 18. If we learn we have collected such information, we will delete it promptly. Contact privacy@titlii.social if you believe we have inadvertently collected information from a child.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Third-Party Links and Services</h2>
            <p>Our Services may link to third-party websites and services. This Privacy Policy does not apply to them. Review their privacy policies. We are not responsible for their practices.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy. When we make material changes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>We update the "Last Updated" date</li>
              <li>We notify you via email or through the Services</li>
              <li>We provide opportunity to review before changes take effect</li>
            </ul>
            <p>Your continued use constitutes acceptance.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Contact Us</h2>
            <p><strong>Made of Drama Studios Inc.</strong><br />
            Dallas, Texas</p>
            <p>Privacy Inquiries: <a href="mailto:privacy@titlii.social" className="text-red-600 hover:underline">privacy@titlii.social</a><br />
            General Support: <a href="mailto:support@titlii.social" className="text-red-600 hover:underline">support@titlii.social</a><br />
            Website: <a href="https://titlii.social" className="text-red-600 hover:underline">https://titlii.social</a></p>
            <p>For data access, deletion, correction, or other privacy requests:<br />
            Email: privacy@titlii.social<br />
            Subject line: "Privacy Request"</p>
            <p>We respond within 30 days (45 days for CCPA requests, extendable by 45 days).</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 Made of Drama Studios Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
            <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
