import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4">
            <span className="font-syne font-bold text-xl tracking-tight text-white mix-blend-difference">gully</span>
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
          <p className="text-gray-500 mb-8">trygully.com — A Service of Gully Inc.</p>
          <p className="text-sm text-gray-400 mb-8">Last Updated: January 28, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>Welcome to Gully ("Platform," "Service," "we," "our," or "us"), operated by Gully Inc., a Texas corporation with its principal place of business in Austin, Texas. By accessing or using our website (trygully.com), WhatsApp bot, voice services, mobile applications, or any related services (collectively, "Services"), you agree to be bound by these Terms of Service ("Terms").</p>
            <p>If you do not agree to these Terms, do not use our Services. We reserve the right to modify these Terms at any time. Your continued use of the Services after any changes constitutes acceptance of the new Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p>Gully is a creative professional networking platform that connects freelancers and creative professionals through an AI-powered matching system. Our Services include:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>AI-powered professional matching and introductions via our AI concierge, Taj</li>
              <li>Job and opportunity discovery from internal and external sources</li>
              <li>Profile creation and professional networking</li>
              <li>Messaging through WhatsApp integration and voice calls</li>
              <li>Dashboard for managing connections and opportunities</li>
            </ul>
            <p>We serve creative industries including but not limited to: film/video, photography, music/audio, design, technology, writing, marketing, events, fashion, voice acting, education, wellness, culinary, sports, real estate, legal, and trades.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
            <p>To use our Services, you must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be prohibited from using the Services under applicable law</li>
              <li>Not be located in, or a national or resident of, any country subject to U.S. trade sanctions or export restrictions</li>
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
            <p>We use phone-based authentication via Firebase and WhatsApp. You are responsible for maintaining the security of your phone number and verification codes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Conduct and Prohibited Activities</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide false or misleading information in your profile or communications</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, threaten, or harm other users</li>
              <li>Send spam or unsolicited communications</li>
              <li>Use the Services for illegal purposes</li>
              <li>Circumvent or manipulate our matching algorithms</li>
              <li>Scrape, harvest, or collect user data without authorization</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated means to access the Services without permission</li>
              <li>Post discriminatory, hateful, defamatory, or illegal content</li>
              <li>Post job listings or profiles that violate applicable employment laws</li>
              <li>Share confidential or proprietary information of third parties without authorization</li>
              <li>Engage in fraudulent payment practices or misrepresent services offered</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
            <p>We reserve the right to remove any content and suspend or terminate any account that violates these rules, without prior notice.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Marketplace and Connections</h2>
            
            <h3 className="text-xl font-medium mb-3">6.1 Platform Role</h3>
            <p>Gully acts as a facilitator connecting creative professionals. We are not a party to any agreements between users and do not guarantee the quality, safety, or legality of services offered by users.</p>

            <h3 className="text-xl font-medium mb-3">6.2 No Verification Guarantee</h3>
            <p><strong>We do not routinely verify user identities, backgrounds, licenses, portfolios, credentials, or references.</strong> While we may implement certain verification features, users are solely responsible for conducting their own vetting, background checks, and due diligence before hiring or working with any professional found through Gully. Any "verified" badges or trust scores are internal indicators based on platform activity and should not be considered a comprehensive background check or endorsement.</p>

            <h3 className="text-xl font-medium mb-3">6.3 External Opportunities</h3>
            <p>Some job postings and opportunities displayed on Gully are sourced or aggregated from third-party platforms including but not limited to Reddit, X (Twitter), Craigslist, and Facebook. For these external opportunities:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>We are only forwarding or aggregating these postings and are not the original source</li>
              <li>We do not verify the accuracy, legitimacy, or legality of external postings</li>
              <li>Any relationship formed is directly between you and the original poster or platform</li>
              <li>We are not responsible for outcomes of any engagement with external opportunities</li>
              <li>External postings may be removed or become unavailable at any time</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">6.4 User Responsibility</h3>
            <p>Users are solely responsible for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Evaluating potential connections and opportunities</li>
              <li>Verifying credentials, references, and qualifications of other users</li>
              <li>Negotiating and agreeing to terms of any work arrangements</li>
              <li>Fulfilling obligations in any agreements with other users</li>
              <li>Compliance with applicable laws including tax obligations and employment regulations</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">6.5 No Employment Relationship</h3>
            <p>Gully does not create any employment, agency, partnership, or joint venture relationship between users or between users and Gully.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. AI Services and Matching</h2>
            
            <h3 className="text-xl font-medium mb-3">7.1 AI-Powered Features</h3>
            <p>Our Services use artificial intelligence, including Claude AI by Anthropic, to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Analyze and expand skill descriptions for better matching</li>
              <li>Generate match scores and recommendations</li>
              <li>Provide conversation assistance through our AI concierge, Taj</li>
              <li>Extract relevant information from job postings</li>
              <li>Generate personalized outreach messages</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">7.2 AI Limitations</h3>
            <p>AI-generated content and recommendations are provided for convenience and may contain errors. Users should verify AI-generated information before relying on it. Match recommendations are suggestions only; users make all final decisions about connections. AI matching does not constitute an endorsement of any user or guarantee of compatibility.</p>

            <h3 className="text-xl font-medium mb-3">7.3 Human Review</h3>
            <p>You may request human review of significant AI-driven decisions affecting your account by contacting support@trygully.com.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Services</h2>
            <p>We are continuously improving Gully and may modify the Services at any time:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>We may add, remove, or change features, including AI models, matching algorithms, and communication channels (such as WhatsApp, voice, or web), without prior notice</li>
              <li>Some features may be labeled as "beta," "preview," or "experimental" and are provided "as is" with no guarantees of continued availability</li>
              <li>Beta features may be discontinued, modified, or made generally available at our sole discretion</li>
              <li>We will make reasonable efforts to notify users of significant changes that materially affect their use of the Services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Fees and Payments</h2>
            <p>Currently, basic Gully Services are provided free of charge. We reserve the right to introduce paid features or subscription plans in the future, with reasonable notice to users.</p>
            <p>Any payments between users for services are handled directly between those parties. Gully is not responsible for payment disputes between users.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Intellectual Property</h2>
            
            <h3 className="text-xl font-medium mb-3">10.1 Our Intellectual Property</h3>
            <p>The Services, including all content, features, and functionality (including but not limited to text, graphics, logos, icons, images, audio, video, software, and the design, selection, and arrangement thereof) are owned by Made of Drama Studios Inc. and are protected by copyright, trademark, and other intellectual property laws.</p>

            <h3 className="text-xl font-medium mb-3">10.2 Your Content</h3>
            <p>You retain ownership of content you submit to the Services. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and display your content in connection with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Operating and providing the Services, including matching and recommendations</li>
              <li>Improving our algorithms and user experience</li>
              <li>Promotional and marketing materials (e.g., anonymized examples, testimonials with your consent)</li>
            </ul>
            <p>We will not sell your content as standalone products, and we do not claim ownership over your original content.</p>

            <h3 className="text-xl font-medium mb-3">10.3 User Representations</h3>
            <p>You represent that you own or have the necessary rights to all content you submit and that your content does not violate any third party's intellectual property or other rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Privacy</h2>
            <p>Your use of the Services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our <a href="/privacy" className="text-red-600 hover:underline">Privacy Policy</a> to understand how we collect, use, and protect your information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Third-Party Services</h2>
            <p>Our Services integrate with and may link to third-party services including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>WhatsApp (for messaging and bot interactions)</li>
              <li>Twilio (for communications infrastructure)</li>
              <li>Firebase (for authentication)</li>
              <li>Anthropic (for AI services)</li>
              <li>Various job boards and social platforms (for opportunity aggregation)</li>
            </ul>
            <p>Your use of third-party services is subject to their respective terms and privacy policies. We are not responsible for the content, accuracy, or practices of third-party services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Disclaimers</h2>
            <p><strong>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</strong></p>
            <p>We do not warrant that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The Services will be uninterrupted, secure, or error-free</li>
              <li>Results obtained from the Services will be accurate or reliable</li>
              <li>Any matches or connections will result in successful business relationships</li>
              <li>The quality of any services obtained through connections will meet your expectations</li>
              <li>Users on the platform are who they claim to be or have the credentials they represent</li>
              <li>External job postings are legitimate, accurate, or currently available</li>
              <li>AI-generated content or recommendations are accurate or appropriate for your needs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Limitation of Liability</h2>
            <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, MADE OF DRAMA STUDIOS INC. AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</strong></p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use or inability to use the Services</li>
              <li>Any conduct or content of any user or third party on the Services</li>
              <li>Any content obtained from the Services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Any interactions or transactions between users</li>
              <li>External opportunities or job postings aggregated from third-party sources</li>
            </ul>
            <p><strong>OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100 USD).</strong></p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Made of Drama Studios Inc. and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content submitted to the Services</li>
              <li>Any work arrangements or disputes between you and other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Account Suspension and Termination</h2>
            
            <h3 className="text-xl font-medium mb-3">16.1 Termination by Us</h3>
            <p>We may suspend or terminate your account and access to the Services at any time, with or without cause, with or without notice, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violation of these Terms or our policies</li>
              <li>Repeated no-shows or failure to respond to confirmed connections</li>
              <li>Spam, abuse, harassment, or other harmful behavior</li>
              <li>Low trust scores based on platform activity and user feedback</li>
              <li>Suspected fraudulent or illegal activity</li>
              <li>Extended periods of inactivity</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">16.2 Termination by You</h3>
            <p>You may terminate your account at any time by contacting us at support@trygully.com or through your account settings.</p>

            <h3 className="text-xl font-medium mb-3">16.3 Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your right to use the Services will immediately cease</li>
              <li>We may delete your account and content</li>
              <li>We may retain limited data (e.g., trust indicators, blacklist flags, abuse records) to protect the platform and other users</li>
              <li>Provisions that by their nature should survive termination will survive (including Sections 10, 13, 14, 15, and 17)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">17. Governing Law and Dispute Resolution</h2>
            
            <h3 className="text-xl font-medium mb-3">17.1 Governing Law</h3>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.</p>
            
            <h3 className="text-xl font-medium mb-3">17.2 Arbitration Agreement</h3>
            <p><strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.</strong></p>
            <p>Any disputes arising from these Terms or the Services shall be resolved through binding arbitration in Dallas County, Texas, in accordance with the rules of the American Arbitration Association ("AAA"). The arbitration shall be conducted by a single arbitrator, and the arbitrator's decision shall be final and binding.</p>
            
            <h3 className="text-xl font-medium mb-3">17.3 Class Action Waiver</h3>
            <p><strong>YOU AND MADE OF DRAMA STUDIOS INC. AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.</strong></p>
            
            <h3 className="text-xl font-medium mb-3">17.4 Opt-Out Right</h3>
            <p>You may opt out of this arbitration agreement by sending written notice to legal@trygully.com within thirty (30) days of first accepting these Terms. Your notice must include your name, mailing address, phone number, and a clear statement that you wish to opt out of the arbitration agreement. If you opt out, you may pursue claims in court.</p>
            
            <h3 className="text-xl font-medium mb-3">17.5 Exceptions</h3>
            <p>Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights or other irreparable harm.</p>
            
            <h3 className="text-xl font-medium mb-3">17.6 Venue</h3>
            <p>For any matters not subject to arbitration, you agree to submit to the exclusive jurisdiction of the state and federal courts located in Dallas County, Texas.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">18. Export Controls and Sanctions</h2>
            <p>You represent that you are not located in, under the control of, or a national or resident of any country to which the United States has embargoed goods or services, or on the U.S. Treasury Department's Specially Designated Nationals List or the U.S. Commerce Department's Denied Persons List. You agree not to use the Services in violation of any U.S. export laws or regulations.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">19. General Provisions</h2>
            
            <h3 className="text-xl font-medium mb-3">19.1 Entire Agreement</h3>
            <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and Made of Drama Studios Inc. regarding the Services.</p>

            <h3 className="text-xl font-medium mb-3">19.2 Severability</h3>
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>

            <h3 className="text-xl font-medium mb-3">19.3 Waiver</h3>
            <p>Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision.</p>

            <h3 className="text-xl font-medium mb-3">19.4 Assignment</h3>
            <p>You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.</p>

            <h3 className="text-xl font-medium mb-3">19.5 Notices</h3>
            <p>We may provide notices to you via email, WhatsApp, or through the Services. You may provide notices to us at legal@trygully.com.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">20. Contact Us</h2>
            <p><strong>Made of Drama Studios Inc.</strong><br />
            Dallas, Texas 75001<br />
            United States</p>
            <p>General Support: <a href="mailto:support@trygully.com" className="text-red-600 hover:underline">support@trygully.com</a><br />
            Legal Inquiries: <a href="mailto:legal@trygully.com" className="text-red-600 hover:underline">legal@trygully.com</a><br />
            WhatsApp: <a href="https://wa.me/12134147369" className="text-red-600 hover:underline">+1 (213) 414-7369</a><br />
            Website: <a href="https://trygully.com" className="text-red-600 hover:underline">https://trygully.com</a></p>
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
