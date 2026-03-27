import React, { useState, useEffect, useCallback, startTransition, Suspense, lazy } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
const AuthModal = lazy(() => import("../components/AuthModal"));

const WORDS = ["photographer", "gig", "videographer", "mentor", "designer", "clients", "editor", "beta testers", "producer", "collab"];

const CONVERSATIONS = [
  [
    { sender: "taj", text: "Gurbax mentioned he is looking for a singer to collab on his new EP. Interested?" },
    { sender: "user", text: "yes, tell me more about him, what kind of songs does he make?" },
    { sender: "taj", text: "Mostly electronic, house but he is open to other genres as well. You want to see his profile?" },
    { sender: "user", text: "Yes, send it over" },
    { sender: "taj", text: "Awesome, doing it asap" }
  ],
  [
    { sender: "user", text: "I am a comedian traveling to NYC next weekend. Help me find a spot so I can do an open mic" },
    { sender: "taj", text: "Sure, I have a few venues in mind, let me reach out to them and ask if they have any openings" },
    { sender: "user", text: "Awesome thanks" },
    { sender: "taj", text: "Sure thing!" }
  ],
  [
    { sender: "user", text: "Looking for 10 users to try my new skincare product" },
    { sender: "taj", text: "sure tell me more about these users" },
    { sender: "user", text: "sure, must be influencers with at least 5K followers" },
    { sender: "taj", text: "awesome here are 10 people you might like, lmk and I can message them for you!" }
  ]
];

const PhoneMockup = () => {
  const [convoIndex, setConvoIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const animationRef = React.useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.forEach(id => clearTimeout(id));
    }
    
    const timeoutIds = [];
    animationRef.current = timeoutIds;
    
    setVisibleMessages([]);

    const currentConvo = CONVERSATIONS[convoIndex];
    let messageIndex = 0;
    
    const showNextMessage = () => {
      if (messageIndex < currentConvo.length) {
        const msgToAdd = currentConvo[messageIndex];
        setVisibleMessages(prev => [...prev, msgToAdd]);
        messageIndex++;
        const id = setTimeout(showNextMessage, 1200);
        timeoutIds.push(id);
      } else {
        const id1 = setTimeout(() => {
          setConvoIndex((prev) => (prev + 1) % CONVERSATIONS.length);
        }, 3500);
        timeoutIds.push(id1);
      }
    };

    const startId = setTimeout(showNextMessage, 600);
    timeoutIds.push(startId);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [convoIndex]);

  return (
    <div 
      className="relative z-10 max-w-sm"
      style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))' }}
    >
      <img 
        src="/phone-mockup.png" 
        alt="Titlii chat interface"
        className="w-full h-auto"
      />
      
      {/* Message bubbles overlay */}
      <div 
        style={{
          position: 'absolute',
          top: '18%',
          left: '6%',
          right: '6%',
          bottom: '15%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleMessages.map((msg, idx) => (
            <div
              key={`${convoIndex}-${idx}`}
              style={{ 
                maxWidth: '80%',
                padding: '12px 16px',
                fontSize: '16px',
                lineHeight: 1.45,
                color: '#fff',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' 
                  ? 'linear-gradient(135deg, #B06AB3 0%, #9B59B6 50%, #8E44AD 100%)' 
                  : 'linear-gradient(135deg, #4A4A5A 0%, #3D3D4A 50%, #333340 100%)',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: msg.sender === 'user' 
                  ? '0 4px 15px rgba(155, 89, 182, 0.4)' 
                  : '0 4px 15px rgba(0,0,0,0.3)',
                animation: 'message-pop 0.3s ease-out',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasModalBeenOpened, setHasModalBeenOpened] = useState(false);
  const [authMode, setAuthMode] = useState("signup"); // "signup" or "signin"
  const [flowType, setFlowType] = useState('hiring'); // 'hiring' or 'freelancer'

  // Fix mobile Safari white space issue
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#0a0a0a';
    document.body.style.backgroundColor = '#0a0a0a';
    document.documentElement.style.minHeight = '100%';
    document.body.style.minHeight = '100%';

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      document.documentElement.style.minHeight = '';
      document.body.style.minHeight = '';
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Preload AuthModal chunk after page is idle so first click is instant
  useEffect(() => {
    const preload = () => import("../components/AuthModal");
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload);
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(preload, 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleTryUsNow = useCallback(() => {
    // Use requestAnimationFrame to allow browser to paint click feedback first
    // This prevents the 272ms INP blocking issue
    requestAnimationFrame(() => {
      startTransition(() => {
        setHasModalBeenOpened(true);
        setAuthMode("signup");
        setShowAuthModal(true);
      });
    });
  }, []);

  const handleSignIn = useCallback(() => {
    // Use requestAnimationFrame to allow browser to paint click feedback first
    requestAnimationFrame(() => {
      startTransition(() => {
        setHasModalBeenOpened(true);
        setAuthMode("signin");
        setShowAuthModal(true);
      });
    });
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#0a0a0a]">



      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-[1800px] mx-auto px-8 py-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4">
            <img 
              src="/butterfly.png" 
              alt="Titlii" 
              className="w-10 h-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="font-syne font-bold text-xl tracking-tight text-white">titlii</span>
          </a>
          
          {/* Desktop */}
          <button
            onClick={handleSignIn}
            onMouseEnter={() => import("../components/AuthModal")}
            onFocus={() => import("../components/AuthModal")}
            className="hidden md:block font-mono text-sm tracking-wider text-white hover:text-[#E50914] transition-colors"
          >
            SIGN IN
          </button>
          
          {/* Mobile */}
          <button
            onClick={handleSignIn}
            onMouseEnter={() => import("../components/AuthModal")}
            onFocus={() => import("../components/AuthModal")}
            className="md:hidden font-mono text-sm tracking-wider text-white hover:text-[#E50914] transition-colors"
          >
            SIGN IN
          </button>
        </div>
      </nav>

      {/* ==================== HERO SECTION (WHITE) ==================== */}
      <section className="min-h-screen relative flex items-center bg-white pt-20">
        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-8 relative z-20 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow - BLACK */}
            <div className="animate-fade-up mb-8">
              <span className="font-mono text-xs tracking-[0.3em] text-gray-900 lowercase">
                the superconnector
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-tight mb-8 animate-fade-up-delay-1 text-gray-900 lowercase">
              need a
              <br />
              <span className="relative inline-block">
                <span 
                  className="text-[#E50914] transition-all duration-500"
                  key={currentWord}
                >
                  {WORDS[currentWord]}
                </span>
                <span className="text-gray-900">?</span>
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="font-syne text-xl md:text-2xl text-gray-500 max-w-xl leading-relaxed mb-12 animate-fade-up-delay-2 lowercase">
              text taj. we post your ad. get matched in minutes.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-6 animate-fade-up-delay-3">
              <button
                onClick={handleTryUsNow}
                onMouseEnter={() => import("../components/AuthModal")}
                onFocus={() => import("../components/AuthModal")}
                className="group relative px-10 py-5 bg-[#E50914] font-syne font-semibold text-lg tracking-wide text-white overflow-hidden transition-all duration-300 hover:pr-16 lowercase rounded-full"
              >
                <span className="relative z-10">start connecting</span>
                <ArrowRight
                  className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white"
                  size={20}
                />
              </button>
              <div className="font-mono text-xs text-gray-400 flex items-center gap-2 lowercase">
                <span className="w-8 h-px bg-gray-300" />
                free to start
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile butterfly - shows below content on mobile */}
        <div className="lg:hidden absolute bottom-10 right-4 w-32 opacity-30">
          <img src="/butterfly.png" alt="" className="w-full h-auto" />
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-mono text-[10px] tracking-[0.2em] text-gray-400 lowercase">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </section>

      {/* ==================== HOW IT WORKS (DARK) ==================== */}
      <section id="how-it-works" className="py-32 relative bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Phone with animated messages */}
            <div className="relative lg:sticky lg:top-32 flex justify-center lg:justify-center">
              <PhoneMockup />

              {/* Decorative elements */}
              <div className="absolute -bottom-10 left-0 w-32 h-32 border border-[#E50914]/20 rounded-full hidden lg:block" />
            </div>

            {/* Right - Steps */}
            <div className="space-y-20 pt-8 lg:pt-20">
              <div className="font-mono text-xs tracking-[0.3em] text-[#E50914] mb-12 lowercase">
                how it works
              </div>

              {/* Toggle */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setFlowType('hiring')}
                  className={`font-mono text-sm tracking-wider ${flowType === 'hiring' ? 'text-[#E50914]' : 'text-white/50'}`}
                >
                  HIRING
                </button>
                <span className="text-white/30">|</span>
                <button
                  onClick={() => setFlowType('freelancer')}
                  className={`font-mono text-sm tracking-wider ${flowType === 'freelancer' ? 'text-[#E50914]' : 'text-white/50'}`}
                >
                  LOOKING FOR WORK
                </button>
              </div>

              {((flowType === 'hiring' ? [
                {
                  num: "01",
                  title: "message Taj",
                  desc: "Tell our AI concierge exactly who you're looking for. No forms. No filters. Just describe what you need in your own words."
                },
                {
                  num: "02",
                  title: "get matched",
                  desc: "Within minutes, Taj finds the perfect people from our network of verified professionals."
                },
                {
                  num: "03",
                  title: "connect",
                  desc: "We make the intro. You take it from there. Real conversations, real collaborations, real results."
                }
              ] : [
                {
                  num: "01",
                  title: "tell Taj about you",
                  desc: "Share your skills, location, and what kind of work you're looking for. Takes 2 minutes."
                },
                {
                  num: "02",
                  title: "get opportunities",
                  desc: "Taj matches you with requests and gigs that fit your profile. No more scrolling job boards."
                },
                {
                  num: "03",
                  title: "connect",
                  desc: "Say yes to the ones you want. We make the intro. You take it from there."
                }
              ])).map((step, idx) => (
                <div key={idx} className="group hover-lift">
                  <div className="flex items-start gap-8">
                    <span className="font-mono text-sm text-[#E50914]">{step.num}</span>
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl mb-4 text-white group-hover:text-[#E50914] transition-colors">
                        {step.title}
                      </h3>
                      <p className="font-syne text-lg text-white/50 max-w-md leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS (WHITE) ==================== */}
      <section className="py-24 bg-white border-y border-gray-200">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { value: "500+", label: "verified creatives" },
              { value: "17", label: "categories" },
              { value: "10+", label: "US cities" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center md:text-left">
                <div className="font-display text-4xl md:text-6xl text-[#E50914] mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs tracking-[0.15em] text-gray-400 lowercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA (DARK with glow) ==================== */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-[#0a0a0a]">
        {/* Gradient glow behind butterfly */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #E50914 0%, transparent 70%)' }}
        />
        
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Flapping Butterfly - 2x bigger */}
            <div className="mx-auto mb-6 md:mb-12 flex justify-center">
              <div 
                className="butterfly-wrapper butterfly-glow butterfly-flicker w-[280px] h-[200px] md:w-[560px] md:h-[400px]" 
                style={{ 
                  position: 'relative' 
                }}
              >
                {/* Left Wing */}
                <div className="wing-left">
                  <img src="/butterfly.png" alt="" />
                </div>
                {/* Right Wing */}
                <div className="wing-right">
                  <img src="/butterfly.png" alt="" />
                </div>
              </div>
            </div>
            
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-4 md:mb-8 text-white lowercase">
              let titlii take
              <br />
              <span className="text-[#E50914]">you places</span>
            </h2>
            
            <p className="font-syne text-base md:text-xl text-white/50 mb-8 md:mb-12 max-w-lg mx-auto lowercase">
              your next connection is one message away.
            </p>
            
            <button
              onClick={handleTryUsNow}
              onMouseEnter={() => import("../components/AuthModal")}
              onFocus={() => import("../components/AuthModal")}
              className="group inline-flex items-center gap-4 px-10 py-5 md:px-12 md:py-6 bg-[#E50914] font-syne font-semibold text-lg md:text-xl tracking-wide text-white hover:gap-6 transition-all duration-300 lowercase rounded-full"
            >
              start connecting
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER (DARK) ==================== */}
      <footer className="py-6 md:py-4 bg-[#0a0a0a]">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <a href="/privacy" className="font-mono text-xs text-white/40 hover:text-white/60 transition-colors">privacy</a>
            <a href="/terms" className="font-mono text-xs text-white/40 hover:text-white/60 transition-colors">terms</a>
            <a href="/faq" className="font-mono text-xs text-white/40 hover:text-white/60 transition-colors">faq</a>
            <a href="mailto:taj@titlii.social" className="font-mono text-xs text-white/40 hover:text-white/60 transition-colors">contact</a>
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

export default LandingPage;
