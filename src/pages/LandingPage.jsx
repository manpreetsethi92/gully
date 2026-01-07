import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import AuthModal from "../components/AuthModal";

const WORDS = ["photographer", "plumber", "developer", "designer", "tutor", "DJ", "trainer"];

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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
    <div className="min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
        
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        .font-syne { font-family: 'Syne', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-25px) rotate(2deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 30px rgba(229, 9, 20, 0.4)); }
          50% { filter: drop-shadow(0 0 50px rgba(229, 9, 20, 0.6)); }
        }
        
        @keyframes wing-flap {
          0%, 100% { 
            transform: perspective(400px) rotateY(0deg) translateY(0);
          }
          25% { 
            transform: perspective(400px) rotateY(15deg) translateY(-10px) scaleX(0.95);
          }
          50% { 
            transform: perspective(400px) rotateY(0deg) translateY(-20px);
          }
          75% { 
            transform: perspective(400px) rotateY(-15deg) translateY(-10px) scaleX(0.95);
          }
        }
        
        .butterfly-flap {
          animation: wing-flap 2s ease-in-out infinite, pulse-glow 4s ease-in-out infinite;
          transform-style: preserve-3d;
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

      {/* Navigation - minimal, appears on scroll or stays subtle */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-[1800px] mx-auto px-8 py-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4">
            <img 
              src="/butterfly.png" 
              alt="Titli" 
              className="w-10 h-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="font-syne font-bold text-xl tracking-tight text-white">TITLI</span>
          </a>
          <button
            onClick={() => setShowAuthModal(true)}
            className="font-mono text-sm tracking-wider text-white hover:text-[#E50914] transition-colors"
          >
            [ENTER]
          </button>
        </div>
      </nav>

      {/* ==================== HERO SECTION (WHITE) ==================== */}
      <section className="min-h-screen relative flex items-center bg-white pt-20">
        {/* Butterfly - positioned on right side with wing flapping */}
        <div 
          className="absolute z-10 pointer-events-none hidden lg:block"
          style={{
            top: '15%',
            right: '8%',
            width: 'clamp(200px, 28vw, 450px)',
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        >
          <img 
            src="/butterfly.png" 
            alt="Titli"
            className="w-full h-auto butterfly-flap"
          />
        </div>
        
        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-8 relative z-20 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow - BLACK */}
            <div className="animate-fade-up mb-8">
              <span className="font-mono text-xs tracking-[0.3em] text-gray-900 uppercase">
                Find anyone you need
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-tight mb-8 animate-fade-up-delay-1 text-gray-900">
              Need a
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
            <p className="font-syne text-xl md:text-2xl text-gray-500 max-w-xl leading-relaxed mb-12 animate-fade-up-delay-2">
              Tell us what you need. We'll connect you with trusted local pros — in minutes, not days.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-6 animate-fade-up-delay-3">
              <button 
                onClick={handleGetStarted}
                className="group relative px-10 py-5 bg-[#E50914] font-syne font-semibold text-lg tracking-wide text-white overflow-hidden transition-all duration-300 hover:pr-16"
              >
                <span className="relative z-10">Try us now</span>
                <ArrowRight 
                  className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white" 
                  size={20} 
                />
              </button>
              <div className="font-mono text-xs text-gray-400 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-300" />
                FREE TO START
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
          <span className="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </section>

      {/* ==================== HOW IT WORKS (DARK) ==================== */}
      <section className="py-32 relative bg-[#0a0a0a]">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Phone */}
            <div className="relative lg:sticky lg:top-32 flex justify-center lg:justify-center">
              <div 
                className="relative max-w-sm"
                style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))' }}
              >
                <img 
                  src="/phone-mockup.png" 
                  alt="Titli chat interface"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 left-0 w-32 h-32 border border-[#E50914]/20 rounded-full hidden lg:block" />
            </div>
            
            {/* Right - Steps */}
            <div className="space-y-20 pt-8 lg:pt-20">
              <div className="font-mono text-xs tracking-[0.3em] text-[#E50914] mb-12 uppercase">
                How it works
              </div>
              
              {[
                {
                  num: "01",
                  title: "Message Taj",
                  desc: "Tell our AI concierge exactly who you're looking for. No forms. No filters. Just describe what you need in your own words."
                },
                {
                  num: "02", 
                  title: "Get matched",
                  desc: "Within minutes, Taj finds the perfect people from our network of verified professionals."
                },
                {
                  num: "03",
                  title: "Connect",
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
              { value: "4,500+", label: "Verified providers" },
              { value: "17", label: "Categories" },
              { value: "5min", label: "Average match time" },
              { value: "94%", label: "Success rate" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center md:text-left">
                <div className="font-display text-4xl md:text-6xl text-[#E50914] mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs tracking-[0.15em] text-gray-400 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS (DARK) ==================== */}
      <section className="py-32 relative overflow-hidden bg-[#0a0a0a]">
        {/* Background butterfly watermark */}
        <img 
          src="/butterfly.png" 
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-[0.03] pointer-events-none"
        />
        
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="font-mono text-xs tracking-[0.3em] text-[#E50914] mb-16 uppercase">
            Real stories
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
      <section className="py-32 relative overflow-hidden bg-[#0a0a0a]">
        {/* Gradient glow behind butterfly */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #E50914 0%, transparent 70%)' }}
        />
        
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Butterfly */}
            <img 
              src="/butterfly.png" 
              alt="Titli"
              className="w-32 md:w-40 h-auto mx-auto mb-12"
              style={{ 
                animation: 'float 4s ease-in-out infinite',
                filter: 'drop-shadow(0 0 40px rgba(229, 9, 20, 0.5))'
              }}
            />
            
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-8 text-white">
              Let Titli take
              <br />
              <span className="text-[#E50914]">you places</span>
            </h2>
            
            <p className="font-syne text-xl text-white/50 mb-12 max-w-lg mx-auto">
              Your next connection is one message away.
            </p>
            
            <button 
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-4 px-12 py-6 bg-[#E50914] font-syne font-semibold text-xl tracking-wide text-white hover:gap-6 transition-all duration-300"
            >
              Get started
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER (DARK) ==================== */}
      <footer className="py-16 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
                <span className="font-syne font-bold text-lg text-white">TITLI</span>
              </div>
              <p className="font-mono text-xs text-white/40 leading-relaxed">
                The modern way to find<br />local help for anything.
              </p>
            </div>
            
            {[
              { title: "Categories", links: ["Home Services", "Events", "Lessons", "Tech"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Terms", "Privacy", "Cookies"] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-mono text-xs tracking-[0.15em] text-white/40 mb-6 uppercase">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="font-syne text-white/50 hover:text-[#E50914] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            <p className="font-mono text-xs text-white/30">
              © 2025 Titli. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Twitter", "Instagram", "LinkedIn"].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="font-mono text-xs text-white/30 hover:text-[#E50914] transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
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
