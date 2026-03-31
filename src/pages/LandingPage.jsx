import React, { useState, useEffect, useCallback, startTransition, Suspense, lazy } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
const AuthModal = lazy(() => import("../components/AuthModal"));

const ANIMATION_TIMING = {
  MESSAGE_DELAY: 1200,
  CONVERSATION_GAP: 3500,
  INITIAL_DELAY: 600,
  WORD_ROTATION_INTERVAL: 2000,
  PRELOAD_DELAY: 2000
};

const WORDS = ["photographer", "gig", "videographer", "mentor", "designer", "clients", "editor", "collab", "producer", "beta testers"];

const CONVERSATIONS = [
  [
    { sender: "taj", text: "Gurbax mentioned he is looking for a singer to collab on his new EP. Interested?" },
    { sender: "user", text: "yes, tell me more about him" },
    { sender: "taj", text: "Mostly electronic, house but open to other genres. Want to see his profile?" },
    { sender: "user", text: "Yes, send it over" },
    { sender: "taj", text: "Awesome, doing it asap 🦋" }
  ],
  [
    { sender: "user", text: "I am a comedian traveling to NYC next weekend. Help me find a spot for an open mic" },
    { sender: "taj", text: "Sure, I have a few venues in mind, let me reach out to them" },
    { sender: "user", text: "Awesome thanks" },
    { sender: "taj", text: "Sure thing!" }
  ],
  [
    { sender: "user", text: "Looking for 10 users to try my new skincare product" },
    { sender: "taj", text: "sure tell me more about these users" },
    { sender: "user", text: "must be influencers with at least 5K followers" },
    { sender: "taj", text: "awesome here are 10 people you might like!" }
  ]
];

const PhoneMockup = () => {
  const [convoIndex, setConvoIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const animationRef = React.useRef(null);

  useEffect(() => {
    if (animationRef.current) animationRef.current.forEach(id => clearTimeout(id));
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
    return () => timeoutIds.forEach(id => clearTimeout(id));
  }, [convoIndex]);

  return (
    <div className="relative z-10 max-w-sm w-full" style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))' }}>
      <img src="/phone-mockup.png" alt="Gully chat interface" className="w-full h-auto" fetchpriority="high" decoding="async" />
      <div style={{
        position: 'absolute', top: '18%', left: '6%', right: '6%', bottom: '15%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '12px', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleMessages.map((msg, idx) => (
            <div key={`${convoIndex}-${idx}`} style={{
              maxWidth: '80%', padding: '10px 14px', fontSize: '14px', lineHeight: 1.45,
              color: '#fff',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user'
                ? 'linear-gradient(135deg, #B06AB3 0%, #9B59B6 50%, #8E44AD 100%)'
                : 'linear-gradient(135deg, #4A4A5A 0%, #3D3D4A 50%, #333340 100%)',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(155,89,182,0.4)' : '0 4px 15px rgba(0,0,0,0.3)',
              animation: 'message-pop 0.3s ease-out',
            }}>{msg.text}</div>
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
  const [authMode, setAuthMode] = useState("signup");
  const [flowType, setFlowType] = useState('hiring');

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#0c0b09';
    document.body.style.backgroundColor = '#0c0b09';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % WORDS.length);
    }, ANIMATION_TIMING.WORD_ROTATION_INTERVAL);
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

  const handleTryUsNow = useCallback(() => {
    requestAnimationFrame(() => {
      startTransition(() => {
        setHasModalBeenOpened(true);
        setAuthMode("signup");
        setShowAuthModal(true);
      });
    });
  }, []);

  const handleSignIn = useCallback(() => {
    requestAnimationFrame(() => {
      startTransition(() => {
        setHasModalBeenOpened(true);
        setAuthMode("signin");
        setShowAuthModal(true);
      });
    });
  }, []);

  return (
    <div className="overflow-x-hidden" style={{ background: '#0c0b09' }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(12,11,9,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/butterfly.png" alt="Gully" className="w-8 h-auto" style={{ filter: 'brightness(0) invert(1)' }} fetchpriority="high" decoding="async" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.01em' }}>gully</span>
          </a>
          <button onClick={handleSignIn} style={{ fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color='#D4A853'}
            onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}>
            SIGN IN
          </button>
        </div>
      </nav>


      {/* ── HERO: TEXT LEFT / PHONE RIGHT ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>

        {/* Road image — right side, fading into dark */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', zIndex: 1,
          background: 'linear-gradient(to right, #0c0b09 0%, transparent 30%)',
          pointerEvents: 'none'
        }} />
        <img src="/gully-road.jpg" alt="" style={{
          position: 'absolute', top: 0, right: 0, width: '55%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top', opacity: 0.25, zIndex: 0,
          maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
        }} loading="eager" />

        {/* Warm glow */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)',
          zIndex: 1, pointerEvents: 'none'
        }} />

        <div className="max-w-7xl mx-auto px-8 w-full relative" style={{ zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* LEFT — Text */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.25em', color: '#D4A853', marginBottom: '1.5rem', opacity: 0.9 }}>
                THE SUPERCONNECTOR
              </div>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 0.95, fontWeight: 900, color: '#F5F0E8', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                need a<br />
                <span style={{ color: '#D4A853', fontStyle: 'italic', transition: 'opacity 0.4s' }} key={currentWord}>
                  {WORDS[currentWord]}
                </span>
                <span style={{ color: '#F5F0E8' }}>?</span>
              </h1>

              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: 'rgba(245,240,232,0.5)', maxWidth: '420px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                text taj on whatsapp. get matched in minutes. no app, no forms — just your next connection.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button onClick={handleTryUsNow} style={{
                  padding: '0.9rem 2.2rem', background: '#D4A853', border: 'none', borderRadius: '4px',
                  fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#0c0b09',
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E8BB6B'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#D4A853'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  START CONNECTING <ArrowRight size={14} />
                </button>
                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.3)' }}>FREE TO START</span>
              </div>
            </div>

            {/* RIGHT — Phone */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>


      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '8rem 0', background: '#0c0b09', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle road texture divider */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.3), transparent)' }} />

        <div className="max-w-7xl mx-auto px-8">
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.25em', color: '#D4A853' }}>HOW IT WORKS</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,168,83,0.2)' }} />
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['HIRING', 'LOOKING FOR WORK'].map((tab, i) => (
                <button key={tab} onClick={() => setFlowType(i === 0 ? 'hiring' : 'freelancer')}
                  style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.15em', background: 'none', border: 'none', cursor: 'pointer',
                    color: (i === 0 ? flowType === 'hiring' : flowType === 'freelancer') ? '#D4A853' : 'rgba(245,240,232,0.3)',
                    transition: 'color 0.2s', padding: '0.25rem 0',
                    borderBottom: (i === 0 ? flowType === 'hiring' : flowType === 'freelancer') ? '1px solid #D4A853' : '1px solid transparent'
                  }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
            {/* Left — Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingTop: '1rem' }}>
              {((flowType === 'hiring' ? [
                { num: "01", title: "message Taj", desc: "Tell our AI concierge who you're looking for. No forms, no filters — just describe what you need in plain english." },
                { num: "02", title: "get matched", desc: "Within minutes, Taj finds the right people from our network of verified professionals across 17 categories." },
                { num: "03", title: "connect", desc: "We make the intro. Real conversations, real collaborations — your next hire is one message away." }
              ] : [
                { num: "01", title: "tell Taj about you", desc: "Share your skills, location, and what kind of work you want. Takes 2 minutes on WhatsApp." },
                { num: "02", title: "get opportunities", desc: "Taj matches you with gigs that fit your profile. No more scrolling job boards at 2am." },
                { num: "03", title: "connect", desc: "Say yes to the ones you want. We make the intro and handle the awkward part." }
              ])).map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#D4A853', letterSpacing: '0.1em', paddingTop: '0.6rem', minWidth: '2rem' }}>{step.num}</span>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#F5F0E8', marginBottom: '0.75rem', lineHeight: 1.1, fontStyle: 'italic' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'rgba(245,240,232,0.45)', lineHeight: 1.7, maxWidth: '380px' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Phone */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'sticky', top: '8rem' }}>
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>


      {/* ── STATS ── */}
      <section style={{ padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.2), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.2), transparent)' }} />

        <div className="max-w-7xl mx-auto px-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
            {[
              { value: "500+", label: "verified creatives" },
              { value: "17", label: "categories" },
              { value: "10+", label: "US cities" }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#D4A853', fontWeight: 900, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(245,240,232,0.35)', marginTop: '0.5rem' }}>
                  {stat.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROAD CTA ── */}
      <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Road image full bleed */}
        <img src="/gully-road.jpg" alt="" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center', opacity: 0.15, zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, #0c0b09 0%, transparent 30%, transparent 70%, #0c0b09 100%)'
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(12,11,9,0.5)' }} />

        <div className="max-w-7xl mx-auto px-8 relative" style={{ zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.3em', color: '#D4A853', marginBottom: '1.5rem', opacity: 0.8 }}>
            EVERY OPPORTUNITY IS DOWN THE STREET
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, color: '#F5F0E8', lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            your next connection<br />
            <span style={{ color: '#D4A853', fontStyle: 'italic' }}>is one message away</span>
          </h2>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'rgba(245,240,232,0.45)', marginBottom: '2.5rem' }}>
            free to start. no app. just WhatsApp.
          </p>
          <button onClick={handleTryUsNow} style={{
            padding: '1rem 2.5rem', background: 'transparent', border: '1px solid rgba(212,168,83,0.6)',
            borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.15em',
            color: '#D4A853', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.75rem'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#D4A853'; e.currentTarget.style.color = '#0c0b09'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D4A853'; }}>
            START CONNECTING <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0c0b09' }}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-8">
          {[['privacy', '/privacy'], ['terms', '/terms'], ['faq', '/faq'], ['contact', 'mailto:taj@trygully.com']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.25)', transition: 'color 0.2s', textTransform: 'lowercase' }}
              onMouseEnter={e => e.target.style.color = 'rgba(245,240,232,0.6)'}
              onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.25)'}>{label}</a>
          ))}
        </div>
      </footer>

      {hasModalBeenOpened && (
        <Suspense fallback={null}>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
        </Suspense>
      )}
    </div>
  );
};

export default LandingPage;
