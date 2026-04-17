import React, { useState, useEffect, useCallback, startTransition, Suspense, lazy } from "react";
import { ArrowRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import PhoneMockup from "../components/landing/PhoneMockup";
import LiveTicker from "../components/landing/LiveTicker";
import TajConsole from "../components/landing/TajConsole";
import NetworkGraph from "../components/landing/NetworkGraph";

const AuthModal = lazy(() => import("../components/AuthModal"));

const ANIMATION_TIMING = {
  WORD_ROTATION_INTERVAL: 1800,
  PRELOAD_DELAY: 2000,
  TWO_SIDES_ROTATION: 8000
};

const WORDS = [
  "videographer", "travel nurse", "bartender", "web designer",
  "tutor", "intern", "photographer", "editor",
  "plumber", "producer", "RN", "dog walker",
  "dev", "mentor", "barista", "handyman"
];

// Old Titlii WhatsApp number — still live, matches DashboardLayout.jsx
const WHATSAPP_NUMBER = "12134147369";
const WHATSAPP_DISPLAY = "+1 (213) 414-7369";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Taj!`;

// TODO: replace with real measured number before launch
const BOTH_SIDES_STAT = "38%";

// Auto-rotating scenarios for the "two sides" section.
// Each scenario shows the same match from both ends.
const TWO_SIDES_SCENARIOS = [
  {
    label: "healthcare",
    posting: [
      { from: "user", text: "need a travel RN for my clinic next month. 4 weeks, san diego." },
      { from: "taj", text: "on it. i know 6 RNs licensed in CA with open availability." },
      { from: "taj", text: "sarah's done 3 travel contracts. want her resume?" }
    ],
    finding: [
      { from: "taj", text: "hey sarah — 4-week travel RN contract in san diego. clinic setting. starts may 1." },
      { from: "user", text: "interested. what's the rate?" },
      { from: "taj", text: "$2,800/week + housing stipend. i'll intro you →" }
    ]
  },
  {
    label: "creative",
    posting: [
      { from: "user", text: "need a videographer for a 2-day brand shoot in austin. budget $3k." },
      { from: "taj", text: "pulling DPs in austin with brand work in their reel." },
      { from: "taj", text: "maya shoots exactly your vibe. sending her reel →" }
    ],
    finding: [
      { from: "taj", text: "hey maya — 2-day brand shoot in austin. $3k. starts thursday." },
      { from: "user", text: "yes! send the brief." },
      { from: "taj", text: "brief incoming. i've told them about your reel." }
    ]
  },
  {
    label: "tech",
    posting: [
      { from: "user", text: "looking for a react dev to build an MVP. 2 weeks, $5k." },
      { from: "taj", text: "4 devs in my network do fast MVPs. 2 open this month." },
      { from: "taj", text: "priya just shipped one in 10 days. want to talk to her?" }
    ],
    finding: [
      { from: "taj", text: "hey priya — startup needs a react MVP. 2 weeks, $5k. vibe matches your last project." },
      { from: "user", text: "open calendar this month. tell me more." },
      { from: "taj", text: "setting up a call. they've seen your github." }
    ]
  }
];

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [twoSidesIndex, setTwoSidesIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasModalBeenOpened, setHasModalBeenOpened] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % WORDS.length);
    }, ANIMATION_TIMING.WORD_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTwoSidesIndex((prev) => (prev + 1) % TWO_SIDES_SCENARIOS.length);
    }, ANIMATION_TIMING.TWO_SIDES_ROTATION);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const preload = () => import("../components/AuthModal");
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload);
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(preload, ANIMATION_TIMING.PRELOAD_DELAY);
      return () => clearTimeout(t);
    }
  }, []);

  const handleWebSignup = useCallback(() => {
    setTimeout(() => {
      startTransition(() => {
        setHasModalBeenOpened(true);
        setAuthMode("signup");
        setShowAuthModal(true);
      });
    }, 0);
  }, []);

  const handleSignIn = useCallback(() => {
    setTimeout(() => {
      startTransition(() => {
        setHasModalBeenOpened(true);
        setAuthMode("signin");
        setShowAuthModal(true);
      });
    }, 0);
  }, []);

  return (
    <div className="overflow-x-hidden bg-white">
      {/* ========== NAV ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1800px] mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4">
            <span className="font-syne font-bold text-xl tracking-tight text-gray-900">gully</span>
          </a>
          <button
            onClick={handleSignIn}
            className="font-mono text-sm tracking-wider text-gray-600 hover:text-[#E50914] transition-colors lowercase"
          >
            sign in
          </button>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
          {/* Left */}
          <div>
            <div className="animate-fade-up mb-6">
              <span className="font-mono text-xs tracking-[0.3em] text-gray-500 lowercase">the superconnector</span>
            </div>
            <h1 className="font-display text-[clamp(3rem,8vw,84px)] leading-[0.92] tracking-tight mb-6 animate-fade-up-delay-1 text-gray-900 lowercase font-normal">
              need a<br />
              <span className="relative inline-block">
                <span
                  className="text-[#E50914] italic transition-all duration-500"
                  key={currentWord}
                  style={{ animation: "word-fade 0.5s ease-out" }}
                >
                  {WORDS[currentWord]}
                </span>
                <span className="text-gray-900">?</span>
              </span>
            </h1>
            <p className="font-syne text-xl md:text-2xl text-gray-700 max-w-xl leading-snug mb-8 animate-fade-up-delay-2 lowercase">
              collabs? or work? or just a hangout?<br />
              <span className="text-gray-900 font-semibold">get pitched 24/7.</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 animate-fade-up-delay-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-[#25D366] hover:bg-[#1fb855] font-syne font-semibold text-base text-white rounded-full transition-colors lowercase"
              >
                <WhatsAppIcon size={18} />
                message taj
              </a>
              <button
                onClick={handleWebSignup}
                className="group inline-flex items-center gap-2 px-6 py-4 bg-transparent text-gray-700 border border-gray-300 hover:border-gray-900 hover:text-gray-900 font-syne font-medium text-sm rounded-full transition-colors lowercase"
              >
                or sign up on web
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
          {/* Right — phone */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ========== LIVE TICKER ========== */}
      <LiveTicker />

      {/* ========== TWO SIDES, ONE THREAD ========== */}
      <section className="py-24 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="font-mono text-xs tracking-[0.3em] text-gray-500 text-center mb-5 lowercase">
            two sides. one thread.
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,52px)] leading-none text-center mb-3 font-normal tracking-tight text-gray-900 lowercase">
            the same match, <em className="text-[#E50914]">both ends.</em>
          </h2>
          <p className="font-syne text-center text-gray-500 max-w-xl mx-auto mb-14 text-[15px] leading-relaxed lowercase">
            you don't pick a side. <span className="text-gray-900 font-semibold">everyone posts. everyone gets found.</span>
          </p>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto" key={twoSidesIndex}>
            {/* Posting */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-gray-400 mb-2.5 lowercase">
                posting a gig
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 flex flex-col gap-2 min-h-[260px] animate-fade-in-soft">
                {TWO_SIDES_SCENARIOS[twoSidesIndex].posting.map((msg, i) => (
                  <ChatBubble key={i} from={msg.from}>{msg.text}</ChatBubble>
                ))}
              </div>
            </div>
            {/* Finding */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-gray-400 mb-2.5 lowercase">
                finding a gig
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 flex flex-col gap-2 min-h-[260px] animate-fade-in-soft">
                {TWO_SIDES_SCENARIOS[twoSidesIndex].finding.map((msg, i) => (
                  <ChatBubble key={i} from={msg.from}>{msg.text}</ChatBubble>
                ))}
              </div>
            </div>
          </div>

          {/* Rotation controls */}
          <div className="max-w-4xl mx-auto mt-5 flex items-center justify-between">
            <button
              onClick={() => setTwoSidesIndex((prev) => (prev - 1 + TWO_SIDES_SCENARIOS.length) % TWO_SIDES_SCENARIOS.length)}
              className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors"
              aria-label="previous scenario"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex items-center gap-2">
              {TWO_SIDES_SCENARIOS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setTwoSidesIndex(i)}
                  className="group flex items-center gap-2"
                  aria-label={`show ${s.label} scenario`}
                >
                  <span className={`font-mono text-[10px] tracking-[0.2em] lowercase transition-colors ${
                    i === twoSidesIndex ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                  }`}>
                    {s.label}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === twoSidesIndex ? "bg-[#E50914]" : "bg-gray-300 group-hover:bg-gray-500"
                  }`} />
                </button>
              ))}
            </div>
            <button
              onClick={() => setTwoSidesIndex((prev) => (prev + 1) % TWO_SIDES_SCENARIOS.length)}
              className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors"
              aria-label="next scenario"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <div className="mt-12 max-w-lg mx-auto text-center px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="font-mono text-[10px] tracking-[0.25em] text-gray-400 mb-2 lowercase">
              a thing we noticed
            </div>
            <p className="text-sm text-gray-700 leading-relaxed lowercase">
              the same profile does both.{" "}
              <span className="font-semibold text-gray-900">{BOTH_SIDES_STAT}</span>{" "}
              of people who post a gig end up finding one too.
            </p>
          </div>
        </div>
      </section>

      {/* ========== MEET TAJ ========== */}
      <section className="py-24 px-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="font-mono text-xs tracking-[0.3em] text-gray-500 text-center mb-5 lowercase">
            meet taj
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,52px)] leading-none text-center mb-3 font-normal tracking-tight text-gray-900 lowercase">
            an ai that's <em className="text-[#E50914]">up at 3am</em><br />
            thinking about your next gig.
          </h2>
          <p className="font-syne text-center text-gray-500 max-w-xl mx-auto mb-12 text-[15px] leading-relaxed lowercase">
            taj remembers you. she knows what you're good at. she's always matchmaking.
          </p>
          <TajConsole />
        </div>
      </section>

      {/* ========== NETWORK GRAPH ========== */}
      <section className="py-24 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="font-mono text-xs tracking-[0.3em] text-gray-500 text-center mb-5 lowercase">
            the web
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,52px)] leading-none text-center mb-3 font-normal tracking-tight text-gray-900 lowercase">
            a living network of<br />
            <em className="text-[#E50914]">people and gigs.</em>
          </h2>
          <p className="font-syne text-center text-gray-500 max-w-md mx-auto mb-10 text-sm lowercase">
            every node is a person. every pulse is a match.
          </p>
          <NetworkGraph />
        </div>
      </section>

      {/* ========== FINAL CTA — QR CODE ========== */}
      <section className="py-24 px-8 border-t border-gray-100">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="font-display text-[clamp(2.5rem,7vw,68px)] leading-none mb-5 font-normal tracking-tight text-gray-900 lowercase">
            say hi to taj.
          </h2>
          <p className="font-syne text-gray-600 text-lg mb-10 leading-relaxed lowercase">
            she's free. she remembers you.<br />
            she's already thinking about your next gig.
          </p>
          <div className="inline-flex flex-col items-center gap-4 p-8 border border-gray-200 rounded-3xl bg-white">
            <div className="p-4 bg-white rounded-xl">
              <QRCodeSVG
                value={WHATSAPP_URL}
                size={180}
                level="M"
                bgColor="#ffffff"
                fgColor="#0a0a0a"
                marginSize={0}
              />
            </div>
            <div className="font-mono text-xs text-gray-500 tracking-[0.15em] lowercase">
              scan · {WHATSAPP_DISPLAY}
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] hover:bg-[#1fb855] text-white font-syne font-semibold text-sm rounded-full transition-colors lowercase"
            >
              <WhatsAppIcon size={16} />
              open whatsapp
            </a>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="px-8 py-10 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-gray-400 tracking-wider lowercase">© 2026 gully</div>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase">privacy</a>
            <a href="/terms" className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase">terms</a>
            <a href="/faq" className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase">faq</a>
            <a href="mailto:taj@trygully.com" className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors lowercase">contact</a>
          </div>
        </div>
      </footer>

      {hasModalBeenOpened && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            mode={authMode}
          />
        </Suspense>
      )}
    </div>
  );
};

// Small reusable chat bubble
const ChatBubble = ({ from, children }) => {
  const isUser = from === "user";
  return (
    <div
      className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-snug ${
        isUser
          ? "self-end bg-[#E50914] text-white rounded-[16px] rounded-br-[4px]"
          : "self-start bg-white border border-gray-100 text-gray-900 rounded-[16px] rounded-bl-[4px]"
      }`}
    >
      {children}
    </div>
  );
};

export default LandingPage;
