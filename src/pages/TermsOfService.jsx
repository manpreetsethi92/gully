import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">titlii.social — A Service of Made of Drama Studios Inc.</p>
          <p className="text-sm text-gray-400 mb-8">Last Updated: January 8, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>Welcome to Titlii ("Platform," "Service," "we," "our," or "us"), operated by Made of Drama Studios Inc., a company based in Dallas, Texas. By accessing or using our website (titlii.social), Telegram bot, mobile applications, or any related services (collectively, "Services"), you agree to be bound by these Terms of Service ("Terms").</p>
            <p>If you do not agree to these Terms, do not use our Services. We reserve the right to modify these Terms at any time. Your continued use of the Services after any changes constitutes acceptance of the new Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p>Titlii is a creative professional networking platform that connects freelancers and creative professionals through an AI-powered matching system. Our Services include:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>AI-powered professional matching and introductions</li>
              <li>Job and opportunity discovery from various sources</li>
              <li>Profile creation and professional networking</li>
              <li>Messaging through Telegram bot integration</li>
              <li>Dashboard for managing connections and opportunities</li>
            </ul>
            <p>We serve creative industries including but not limited to: film/video, photography, music, design, technology, writing, marketing, events, and fashion.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
            <p>To use our Services, you must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be prohibited from using the Services under applicable law</li>
              <li>Provide accurate and complete registration information</li>
            </ul>
            <p>By using our Services, you represent and warrant that you meet all eligibility requirements.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Account Registration</h2>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p>We use phone-based authentication via Firebase. You are responsible for maintaining the security of your phone number and verification codes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide false or misleading information in your profile or communications</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Send spam or unsolicited communications</li>
              <li>Use the Services for illegal purposes</li>
              <li>Circumvent or manipulate our matching algorithms</li>
              <li>Scrape, harvest, or collect user data without authorization</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated means to access the Services without permission</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Marketplace and Connections</h2>
            <h3 className="text-xl font-medium mb-3">6.1 Platform Role</h3>
            <p>Titlii acts as a facilitator connecting creative professionals. We are not a party to any agreements between users and do not guarantee the quality, safety, or legality of services offered by users.</p>

            <h3 className="text-xl font-medium mb-3">6.2 User Responsibility</h3>
            <p>Users are solely responsible for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Evaluating potential connections and opportunities</li>
              <li>Negotiating and agreeing to terms of any work arrangements</li>
              <li>Fulfilling obligations in any agreements with other users</li>
              <li>Compliance with applicable laws including tax obligations</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">6.3 No Employment Relationship</h3>
            <p>Titlii does not create any employment, agency, partnership, or joint venture relationship between users or between users and Titlii.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. AI Services and Matching</h2>
            <h3 className="text-xl font-medium mb-3">7.1 AI-Powered Features</h3>
            <p>Our Services use artificial intelligence, including Claude AI by Anthropic, to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Analyze and expand skill descriptions</li>
              <li>Generate match scores and recommendations</li>
              <li>Provide conversation assistance</li>
              <li>Extract relevant information from job postings</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">7.2 Matching Algorithm</h3>
            <p>Our matching algorithm considers multiple factors including skills, location, verification level, availability, and user activity. Match results are recommendations only and do not guarantee suitability or success.</p>

            <h3 className="text-xl font-medium mb-3">7.3 Limitations</h3>
            <p>AI-generated content and recommendations may contain errors or inaccuracies. You should independently verify information before making decisions based on AI outputs.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Fees and Payments</h2>
            <p>Currently, basic Titlii Services are provided free of charge. We reserve the right to introduce paid features or subscription plans in the future, with reasonable notice to users.</p>
            <p>Any payments between users for services are handled directly between those parties. Titlii is not responsible for payment disputes between users.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <h3 className="text-xl font-medium mb-3">9.1 Our Intellectual Property</h3>
            <p>The Services, including all content, features, and functionality (including but not limited to text, graphics, logos, icons, images, audio, video, software, and the design, selection, and arrangement thereof) are owned by Made of Drama Studios Inc. and are protected by copyright, trademark, and other intellectual property laws.</p>

            <h3 className="text-xl font-medium mb-3">9.2 Your Content</h3>
            <p>You retain ownership of content you submit to the Services. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display your content in connection with providing the Services.</p>

            <h3 className="text-xl font-medium mb-3">9.3 User Representations</h3>
            <p>You represent that you own or have the necessary rights to all content you submit and that your content does not violate any third party's intellectual property or other rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Privacy</h2>
            <p>Your use of the Services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our <a href="/privacy" className="text-red-600 hover:underline">Privacy Policy</a> to understand how we collect, use, and protect your information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Third-Party Services</h2>
            <p>Our Services integrate with and may link to third-party services including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Telegram (for bot messaging)</li>
              <li>Firebase (for authentication)</li>
              <li>Various job boards and social platforms</li>
            </ul>
            <p>Your use of third-party services is subject to their respective terms and privacy policies. We are not responsible for the content, accuracy, or practices of third-party services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Disclaimers</h2>
            <p><strong>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</strong></p>
            <p>We do not warrant that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The Services will be uninterrupted, secure, or error-free</li>
              <li>Results obtained from the Services will be accurate or reliable</li>
              <li>Any matches or connections will result in successful business relationships</li>
              <li>The quality of any services obtained through connections will meet your expectations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Limitation of Liability</h2>
            <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, MADE OF DRAMA STUDIOS INC. AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.</strong></p>
            <p>Our total liability for any claims arising from or relating to these Terms or the Services shall not exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) $100 USD.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Made of Drama Studios Inc. and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content submitted to the Services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Termination</h2>
            <p>We may terminate or suspend your account and access to the Services at any time, with or without cause, with or without notice. You may terminate your account at any time by contacting us at support@titlii.social.</p>
            <p>Upon termination:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your right to use the Services will immediately cease</li>
              <li>We may delete your account and content</li>
              <li>Provisions that by their nature should survive termination will survive</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Governing Law and Dispute Resolution</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.</p>
            <p>Any disputes arising from these Terms or the Services shall be resolved through binding arbitration in Dallas, Texas, in accordance with the rules of the American Arbitration Association. You waive any right to participate in a class action lawsuit or class-wide arbitration.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">17. General Provisions</h2>
            <h3 className="text-xl font-medium mb-3">17.1 Entire Agreement</h3>
            <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and Made of Drama Studios Inc. regarding the Services.</p>

            <h3 className="text-xl font-medium mb-3">17.2 Severability</h3>
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>

            <h3 className="text-xl font-medium mb-3">17.3 Waiver</h3>
            <p>Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision.</p>

            <h3 className="text-xl font-medium mb-3">17.4 Assignment</h3>
            <p>You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">18. Contact Us</h2>
            <p><strong>Made of Drama Studios Inc.</strong><br />
            Dallas, Texas</p>
            <p>General Support: <a href="mailto:support@titlii.social" className="text-red-600 hover:underline">support@titlii.social</a><br />
            Legal Inquiries: <a href="mailto:legal@titlii.social" className="text-red-600 hover:underline">legal@titlii.social</a><br />
            Website: <a href="https://titlii.social" className="text-red-600 hover:underline">https://titlii.social</a></p>
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

export default TermsOfService;
