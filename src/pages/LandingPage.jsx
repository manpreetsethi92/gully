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
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
        
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        .font-syne { font-family: 'Syne', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 40px rgba(229, 9, 20, 0.3)); }
          50% { filter: drop-shadow(0 0 60px rgba(229, 9, 20, 0.5)); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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
        
        .text-stroke {
          -webkit-text-stroke: 1.5px rgba(0,0,0,0.15);
          color: transparent;
        }
        
        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #E50914 0%, #ff6b6b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1800px] mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-4">
            <img 
              src="/butterfly.png" 
              alt="Titli" 
              className="w-10 h-auto"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(229, 9, 20, 0.3))' }}
            />
            <span className="font-syne font-bold text-xl tracking-tight">TITLI</span>
          </a>
          <button
            onClick={() => setShowAuthModal(true)}
            className="font-mono text-sm tracking-wider text-gray-500 hover:text-[#E50914] transition-colors"
          >
            [ENTER]
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center pt-20">
        {/* Butterfly - Hero Element */}
        <div 
          className="absolute z-10 pointer-events-none"
          style={{
            top: '8%',
            right: '8%',
            width: 'clamp(180px, 25vw, 400px)',
            animation: 'float 6s ease-in-out infinite, pulse-glow 4s ease-in-out infinite',
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <img 
            src="/butterfly.png" 
            alt="Titli - Your guide to finding help"
            className="w-full h-auto"
          />
        </div>
        
        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-8 relative z-20">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <div className="animate-fade-up mb-8">
              <span className="font-mono text-xs tracking-[0.3em] text-[#E50914] uppercase">
                Find anyone you need
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="font-display text-[clamp(2.5rem,10vw,8rem)] leading-[0.95] tracking-tight mb-8 animate-fade-up-delay-1">
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
                <span className="relative z-10">Find help now</span>
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
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-mono text-[10px] tracking-[0.2em] text-gray-400">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-6 border-y border-gray-200 overflow-hidden bg-gray-50">
        <div 
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6">
              <span className="font-display text-3xl md:text-5xl text-stroke">Photographers</span>
              <span className="text-[#E50914] text-2xl">✦</span>
              <span className="font-display text-3xl md:text-5xl text-stroke">Plumbers</span>
              <span className="text-[#E50914] text-2xl">✦</span>
              <span className="font-display text-3xl md:text-5xl text-stroke">Developers</span>
              <span className="text-[#E50914] text-2xl">✦</span>
              <span className="font-display text-3xl md:text-5xl text-stroke">Tutors</span>
              <span className="text-[#E50914] text-2xl">✦</span>
              <span className="font-display text-3xl md:text-5xl text-stroke">Musicians</span>
              <span className="text-[#E50914] text-2xl">✦</span>
              <span className="font-display text-3xl md:text-5xl text-stroke">Trainers</span>
              <span className="text-[#E50914] text-2xl">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 relative bg-white">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left - Phone */}
            <div className="relative lg:sticky lg:top-32">
              <div 
                className="relative max-w-sm mx-auto"
                style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.12))' }}
              >
                <img 
                  src="/phone-mockup.png" 
                  alt="Titli chat interface"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-[#E50914]/20 rounded-full" />
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#E50914]/5 rounded-full blur-2xl" />
            </div>
            
            {/* Right - Steps */}
            <div className="space-y-20 pt-12">
              <div className="font-mono text-xs tracking-[0.3em] text-[#E50914] mb-12 uppercase">
                How it works
              </div>
              
              {[
                {
                  num: "01",
                  title: "Tell us what you need",
                  desc: "Describe what you're looking for in plain English. Need a photographer for Saturday? A plumber right now? A guitar teacher for your kid? Just ask."
                },
                {
                  num: "02", 
                  title: "We find the right people",
                  desc: "Our AI matches you with verified local pros. No fake profiles, no spam — just real people who can actually help."
                },
                {
                  num: "03",
                  title: "Connect instantly",
                  desc: "We make the intro. You chat directly, agree on details, and get it done. Most matches happen in under 5 minutes."
                }
              ].map((step, idx) => (
                <div key={idx} className="group hover-lift">
                  <div className="flex items-start gap-8">
                    <span className="font-mono text-sm text-[#E50914]">{step.num}</span>
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl mb-4 text-gray-900 group-hover:text-[#E50914] transition-colors">
                        {step.title}
                      </h3>
                      <p className="font-syne text-lg text-gray-500 max-w-md leading-relaxed">
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

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-200 bg-gray-50">
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

      {/* Testimonials */}
      <section className="py-32 relative overflow-hidden bg-white">
        {/* Background butterfly */}
        <img 
          src="/butterfly.png" 
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] opacity-[0.03] pointer-events-none"
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
                quote: "Been looking for a good guitar teacher for months. Found one in my neighborhood through Titli. Now I can play!",
                name: "Aisha T.",
                role: "Austin"
              }
            ].map((t, idx) => (
              <div 
                key={idx} 
                className="group p-8 border border-gray-200 hover:border-[#E50914]/30 transition-all duration-500 hover-lift bg-white"
              >
                <p className="font-display text-xl leading-relaxed mb-8 text-gray-700 group-hover:text-gray-900 transition-colors">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E50914] to-[#ff6b6b]" />
                  <div>
                    <div className="font-syne font-semibold text-gray-900">{t.name}</div>
                    <div className="font-mono text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden bg-gray-50">
        {/* Gradient orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #E50914 0%, transparent 70%)' }}
        />
        
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Butterfly */}
            <img 
              src="/butterfly.png" 
              alt="Titli"
              className="w-28 h-auto mx-auto mb-12"
              style={{ 
                animation: 'float 4s ease-in-out infinite',
                filter: 'drop-shadow(0 0 30px rgba(229, 9, 20, 0.3))'
              }}
            />
            
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-8 text-gray-900">
              Stop searching.
              <br />
              <span className="text-[#E50914]">Start finding.</span>
            </h2>
            
            <p className="font-syne text-xl text-gray-500 mb-12 max-w-lg mx-auto">
              Whatever you need — we'll help you find it.
            </p>
            
            <button 
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-4 px-12 py-6 bg-[#E50914] font-syne font-semibold text-xl tracking-wide text-white hover:gap-6 transition-all duration-300"
            >
              Get started free
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-200 bg-white">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
                <span className="font-syne font-bold text-lg">TITLI</span>
              </div>
              <p className="font-mono text-xs text-gray-400 leading-relaxed">
                The modern way to find<br />local help for anything.
              </p>
            </div>
            
            {[
              { title: "Categories", links: ["Home Services", "Events", "Lessons", "Tech"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Terms", "Privacy", "Cookies"] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-mono text-xs tracking-[0.15em] text-gray-400 mb-6 uppercase">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="font-syne text-gray-500 hover:text-[#E50914] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
            <p className="font-mono text-xs text-gray-400">
              © 2025 Titli. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Twitter", "Instagram", "LinkedIn"].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="font-mono text-xs text-gray-400 hover:text-[#E50914] transition-colors"
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
