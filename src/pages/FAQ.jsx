import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      category: "About Titlii",
      questions: [
        {
          q: "What is Titlii?",
          a: "Titlii is a professional matching platform that connects creative professionals with opportunities. Think of it as having a well-connected friend in the industry who knows exactly who you need and can make the introduction instantly."
        },
        {
          q: "Who is Taj?",
          a: "Taj is our AI concierge that lives on WhatsApp and Telegram. You text Taj what you're looking for (or what kind of work you want), and Taj finds the perfect matches from our network of verified professionals."
        },
        {
          q: "How is Titlii different from Upwork or LinkedIn?",
          a: "No endless scrolling. No forms. No algorithms hiding your profile. You tell Taj what you need in plain language, and we match you with vetted professionals who actually fit. It's like texting a friend, not searching a database."
        },
        {
          q: "What categories does Titlii cover?",
          a: "We cover 17 categories including Film & Video, Photography, Music & Audio, Design, Tech, Writing, Marketing, Events, Fashion, Voice Acting, Education, Wellness, Culinary, Sports, Real Estate, Legal, and Trades."
        },
        {
          q: "What cities are you in?",
          a: "All major US markets including Los Angeles, New York, San Francisco, Austin, Dallas, Miami, Chicago, Seattle, Denver, Atlanta, Nashville, and more. We also support remote work."
        }
      ]
    },
    {
      category: "For People Hiring",
      questions: [
        {
          q: "How do I post a request?",
          a: "Just text Taj on WhatsApp or Telegram. Say something like \"I need a videographer in LA for a music video, budget around $2k.\" Taj will ask any clarifying questions and find matches for you."
        },
        {
          q: "How fast will I get matches?",
          a: "Most requests get matches within minutes. You'll receive profile cards of vetted professionals who fit your criteria, and you can reach out to anyone you like."
        },
        {
          q: "What if I don't like the matches?",
          a: "Just tell Taj! Say \"none of these are quite right\" or \"I need someone with more experience in X\" and Taj will refine the search and find better matches."
        },
        {
          q: "How do I connect with someone?",
          a: "Tap the \"Reach out\" button on any profile card. They'll receive your request and can accept or decline. When both sides say yes, we share contact info and you take it from there."
        },
        {
          q: "Is there a fee to hire someone?",
          a: "No fees to post requests or connect with professionals. You pay the professional directly for their work - we don't take a cut of your project."
        }
      ]
    },
    {
      category: "For Creative Professionals",
      questions: [
        {
          q: "How do I get matched with opportunities?",
          a: "Tell Taj about yourself - your skills, location, what kind of work you're looking for. We'll match you with relevant requests and gigs that fit your profile. No more scrolling through job boards."
        },
        {
          q: "How much does it cost to join?",
          a: "Free to join and get matched. Optional: Verification ($4.99/mo) gets you priority in matching and a verified badge. Premium ($12.99/mo) gives you unlimited access and additional features."
        },
        {
          q: "What does verification mean?",
          a: "Verified professionals get a badge on their profile, priority placement in matches, and more visibility to people posting requests. It signals you're serious and trustworthy."
        },
        {
          q: "How do I get more matches?",
          a: "Complete your profile fully, add your skills and portfolio links, and keep your availability updated. The more Taj knows about you, the better the matches."
        },
        {
          q: "Can I say no to opportunities?",
          a: "Absolutely. You control who you connect with. Skip any opportunity that doesn't fit, and only accept the ones you want. We never share your contact info without your approval."
        }
      ]
    },
    {
      category: "Trust & Safety",
      questions: [
        {
          q: "How do you verify professionals?",
          a: "We verify identity, review portfolios and work history, and check social links. Our matching algorithm also considers response rates and successful connections to surface reliable professionals."
        },
        {
          q: "Is my information safe?",
          a: "Yes. We only share your contact info when you explicitly approve a connection. We don't sell your data. See our Privacy Policy for full details on how we protect your information."
        },
        {
          q: "What if someone is unprofessional?",
          a: "Let us know. We track reliability and professionalism. Users who ghost, spam, or behave unprofessionally get flagged and may be removed from the platform."
        },
        {
          q: "How do I contact support?",
          a: "Just text Taj and say \"I need help\" or email us at support@titlii.social. We're a small team and we actually respond."
        }
      ]
    }
  ];

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-500 mb-12">Everything you need to know about Titlii</p>

          {faqs.map((section, sectionIdx) => (
            <section key={sectionIdx} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#E50914' }}>{section.category}</h2>
              <div className="space-y-6">
                {section.questions.map((faq, faqIdx) => (
                  <div key={faqIdx} className="border-b border-gray-100 pb-6">
                    <h3 className="text-lg font-medium mb-2">{faq.q}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="mt-16 p-8 bg-gray-50 rounded-2xl text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">Text Taj on WhatsApp or reach out to our team</p>
            <a 
              href="mailto:support@titlii.social"
              className="inline-block px-6 py-3 rounded-full text-white font-medium transition-colors"
              style={{ backgroundColor: '#E50914' }}
            >
              Contact Support
            </a>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2026 Made of Drama Studios Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
            <a href="/terms" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
            <a href="/faq" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
