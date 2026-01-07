import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import AuthModal from "../components/AuthModal";

const WORDS = ["photographer", "plumber", "developer", "designer", "tutor", "DJ", "trainer"];

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
        alt="Titli chat interface"
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
                fontSize: '14px',
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
  const [scrollY, setScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = useCallback(() => {
    if (isAuthenticated && user?.profile_completed) {
      navigate("/app");
    } else {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="overflow-x-hidden bg-[#0a0a0a]">
      <style>{`
        html, body, #root {
          background-color: #0a0a0a !important;
          min-height: 100% !important;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
        
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        .font-syne { font-family: 'Syne', sans-serif; }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 30px rgba(229, 9, 20, 0.4)); }
          50% { filter: drop-shadow(0 0 50px rgba(229, 9, 20, 0.6)); }
        }
        
        @keyframes flap-left {
          0%, 5% { transform: rotateY(0deg) scaleX(1); }
          10% { transform: rotateY(45deg) scaleX(0.85); }
          15%, 20% { transform: rotateY(0deg) scaleX(1); }
          25% { transform: rotateY(45deg) scaleX(0.85); }
          30%, 100% { transform: rotateY(0deg) scaleX(1); }
        }
        
        @keyframes flap-right {
          0%, 5% { transform: rotateY(0deg) scaleX(1); }
          10% { transform: rotateY(-45deg) scaleX(0.85); }
          15%, 20% { transform: rotateY(0deg) scaleX(1); }
          25% { transform: rotateY(-45deg) scaleX(0.85); }
          30%, 100% { transform: rotateY(0deg) scaleX(1); }
        }
        
        .butterfly-wrapper {
          position: relative;
          perspective: 500px;
        }
        
        .wing-left {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transform-origin: right center;
          animation: flap-left 3s ease-in-out infinite;
        }
        
        .wing-left img {
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          object-fit: cover;
          object-position: left center;
        }
        
        .wing-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transform-origin: left center;
          animation: flap-right 3s ease-in-out infinite;
        }
        
        .wing-right img {
          position: absolute;
          top: 0;
          right: 0;
          width: 200%;
          height: 100%;
          object-fit: cover;
          object-position: right center;
        }
        
        .butterfly-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        
        @keyframes float-card {
          0%, 100% { 
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% { 
            transform: translateY(-15px) rotate(var(--rotation, 0deg));
          }
        }
        
        @keyframes message-pop {
          0% { 
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          100% { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fade-up 1s ease-out forwards;
        }
        
        .animate-fade-up-delay-1 {
          animation: fade-up 1s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-up-delay-2 {
          animation: fade-up 1s ease-out 0.4s forwards;
          opacity: 0;
        }
        
        .animate-fade-up-delay-3 {
          animation: fade-up 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-[1800px] mx-auto px-8 py-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4">
            <img 
              src="/butterfly.png" 
              alt="Titli" 
              className="w-10 h-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="font-syne font-bold text-xl tracking-tight text-white">titli</span>
          </a>
          
          {/* Desktop */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="hidden md:block font-mono text-sm tracking-wider text-white hover:text-[#E50914] transition-colors"
          >
            [ENTER]
          </button>
          
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-white p-2 -mr-2"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-[280px] bg-[#0a0a0a] border-l border-white/10 p-8 flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="self-end text-white/70 hover:text-white p-2 -mr-2 -mt-2"
            >
              <X size={24} />
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-3 mt-8 mb-12">
              <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
              <span className="font-syne font-bold text-xl text-[#E50914]">titli</span>
            </div>
            
            {/* Menu Items */}
            <div className="flex flex-col gap-6">
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-syne text-lg text-white/70 hover:text-white transition-colors lowercase"
              >
                how it works
              </a>
              <a 
                href="#testimonials" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-syne text-lg text-white/70 hover:text-white transition-colors lowercase"
              >
                testimonials
              </a>
            </div>
            
            {/* CTA Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowAuthModal(true);
              }}
              className="mt-auto mb-8 w-full py-4 rounded-full bg-[#E50914] text-white font-syne font-semibold text-base transition-all hover:shadow-lg hover:shadow-red-500/25"
            >
              get started
            </button>
            
            {/* Footer links */}
            <div className="flex gap-4 font-mono text-xs text-white/40">
              <a href="/privacy" className="hover:text-white/60">privacy</a>
              <a href="/terms" className="hover:text-white/60">terms</a>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HERO SECTION (WHITE) ==================== */}
      <section className="min-h-screen relative flex items-center bg-white pt-20">
        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-8 relative z-20 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow - BLACK */}
            <div className="animate-fade-up mb-8">
              <span className="font-mono text-xs tracking-[0.3em] text-gray-900 lowercase">
                find anyone you need
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
              tell us what you need. we'll connect you with trusted local pros — in minutes, not days.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-6 animate-fade-up-delay-3">
              <button 
                onClick={handleGetStarted}
                className="group relative px-10 py-5 bg-[#E50914] font-syne font-semibold text-lg tracking-wide text-white overflow-hidden transition-all duration-300 hover:pr-16 lowercase rounded-full"
              >
                <span className="relative z-10">try us now</span>
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
              
              {[
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
              ].map((step, idx) => (
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { value: "4,500+", label: "verified providers" },
              { value: "17", label: "categories" },
              { value: "5min", label: "average match time" },
              { value: "94%", label: "success rate" }
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

      {/* ==================== TESTIMONIALS (DARK) ==================== */}
      <section id="testimonials" className="py-32 relative overflow-hidden bg-[#0a0a0a]">
        {/* Background butterfly watermark */}
        <img 
          src="/butterfly.png" 
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-[0.03] pointer-events-none"
        />
        
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="font-mono text-xs tracking-[0.3em] text-[#E50914] mb-16 lowercase">
            real stories
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Found a photographer for my daughter's birthday in 10 minutes. She was amazing and half the price of others.",
                name: "Maria G.",
                role: "Los Angeles"
              },
              {
                quote: "My sink was flooding at 9pm. Had a plumber at my door by 10. Titli literally saved my apartment.",
                name: "James K.",
                role: "Chicago"
              },
              {
                quote: "Been looking for a good guitar teacher for months. Found one in my neighborhood through Titli.",
                name: "Aisha T.",
                role: "Austin"
              }
            ].map((t, idx) => (
              <div 
                key={idx} 
                className="group p-8 border border-white/10 hover:border-[#E50914]/30 transition-all duration-500 hover-lift"
              >
                <p className="font-display text-xl leading-relaxed mb-8 text-white/70 group-hover:text-white transition-colors">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E50914] to-[#ff6b6b]" />
                  <div>
                    <div className="font-syne font-semibold text-white">{t.name}</div>
                    <div className="font-mono text-xs text-white/40">{t.role}</div>
                  </div>
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
                className="butterfly-wrapper butterfly-glow w-[280px] h-[200px] md:w-[560px] md:h-[400px]" 
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
              let titli take
              <br />
              <span className="text-[#E50914]">you places</span>
            </h2>
            
            <p className="font-syne text-base md:text-xl text-white/50 mb-8 md:mb-12 max-w-lg mx-auto lowercase">
              your next connection is one message away.
            </p>
            
            <button 
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-4 px-10 py-5 md:px-12 md:py-6 bg-[#E50914] font-syne font-semibold text-lg md:text-xl tracking-wide text-white hover:gap-6 transition-all duration-300 lowercase rounded-full"
            >
              get started
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER (DARK) ==================== */}
      <footer className="py-6 md:py-4 bg-[#0a0a0a]">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {["privacy", "terms", "cookies"].map((link, idx) => (
              <a 
                key={idx}
                href="#" 
                className="font-mono text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default LandingPage;
