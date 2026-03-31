import React, { useState, useEffect, useCallback, startTransition, Suspense, lazy } from "react";
import { ArrowRight } from "lucide-react";
const AuthModal = lazy(() => import("../components/AuthModal"));

const messagePopStyle = `
  @keyframes message-pop {
    0% { opacity: 0; transform: translateY(6px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

// Animation timing constants (in milliseconds)
const ANIMATION_TIMING = {
  MESSAGE_DELAY: 1200,
  CONVERSATION_GAP: 3500,
  INITIAL_DELAY: 600,
  WORD_ROTATION_INTERVAL: 2000,
  PRELOAD_DELAY: 2000
};

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
        const id = setTimeout(showNextMessage, ANIMATION_TIMING.MESSAGE_DELAY);
        timeoutIds.push(id);
      } else {
        const id1 = setTimeout(() => {
          setConvoIndex((prev) => (prev + 1) % CONVERSATIONS.length);
        }, ANIMATION_TIMING.CONVERSATION_GAP);
        timeoutIds.push(id1);
      }
    };

    const startId = setTimeout(showNextMessage, ANIMATION_TIMING.INITIAL_DELAY);
    timeoutIds.push(startId);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [convoIndex]);

  return (
    <div className="relative z-10 w-full lg:max-w-sm lg:drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
      <style>{messagePopStyle}</style>
      <img
        src="/phone-mockup.png"
        alt="Gully chat interface"
        className="w-full h-auto"
        fetchpriority="high"
        decoding="async"
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
  // flowType removed — below-hero sections deleted

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
    }, ANIMATION_TIMING.WORD_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Preload AuthModal chunk after page is idle so first click is instant
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
            <span className="font-syne font-bold text-xl tracking-tight text-white">gully</span>
          </a>
          
          {/* Desktop */}
          <button
            onClick={handleSignIn}
            className="hidden md:block font-mono text-sm tracking-wider text-white hover:text-[#E50914] transition-colors"
          >
            SIGN IN
          </button>
          
          {/* Mobile */}
          <button
            onClick={handleSignIn}
            className="md:hidden font-mono text-sm tracking-wider text-white hover:text-[#E50914] transition-colors"
          >
            SIGN IN
          </button>
        </div>
      </nav>

      {/* ==================== HERO SECTION (WHITE) ==================== */}
      <section className="min-h-screen relative bg-white pt-20 pb-0">
        <div className="w-full lg:max-w-[1800px] lg:mx-auto lg:px-8 relative z-20 lg:flex lg:items-center lg:min-h-screen">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:w-full lg:gap-8">
            {/* Left — text */}
            <div className="max-w-2xl w-full lg:w-auto px-8 lg:px-0 pt-12 lg:pt-0 mb-10 lg:mb-0">
              <div className="animate-fade-up mb-8">
                <span className="font-mono text-xs tracking-[0.3em] text-gray-900 lowercase">
                  the superconnector
                </span>
              </div>
              <h1 className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-tight mb-8 animate-fade-up-delay-1 text-gray-900 lowercase">
                need a
                <br />
                <span className="relative inline-block">
                  <span className="text-[#E50914] transition-all duration-500" key={currentWord}>
                    {WORDS[currentWord]}
                  </span>
                  <span className="text-gray-900">?</span>
                </span>
              </h1>
              <p className="font-syne text-xl md:text-2xl text-gray-500 max-w-xl leading-relaxed mb-12 animate-fade-up-delay-2 lowercase">
                text taj. we post your ad. get matched in minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-6 animate-fade-up-delay-3">
                <button
                  onClick={handleTryUsNow}
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

            {/* Right — phone + footer */}
            <div className="flex flex-col items-center flex-shrink-0 w-full lg:w-[520px] lg:pr-[140px] gap-4">
              <div className="w-full lg:max-w-sm mx-auto">
                <PhoneMockup />
              </div>
              <div className="flex items-center gap-6 pb-8 lg:pb-0">
                <a href="/privacy" className="font-mono text-xs text-gray-400 hover:text-gray-600 transition-colors">privacy</a>
                <a href="/terms" className="font-mono text-xs text-gray-400 hover:text-gray-600 transition-colors">terms</a>
                <a href="/faq" className="font-mono text-xs text-gray-400 hover:text-gray-600 transition-colors">faq</a>
                <a href="mailto:taj@trygully.com" className="font-mono text-xs text-gray-400 hover:text-gray-600 transition-colors">contact</a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
