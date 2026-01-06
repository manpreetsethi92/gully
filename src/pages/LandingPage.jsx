import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import AuthModal from "../components/AuthModal";

const WORDS = ["artists", "producers", "mentors", "investors", "musicians", "designers"];

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
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
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
          0%, 100% { filter: drop-shadow(0 0 40px rgba(229, 9, 20, 0.4)); }
          50% { filter: drop-shadow(0 0 80px rgba(229, 9, 20, 0.7)); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes word-swap {
          0%, 40% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0; transform: translateY(-20px); }
          60%, 100% { opacity: 1; transform: translateY(0); }
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
        
        .grain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.03;
          z-index: 1000;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        
        .text-stroke {
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          color: transparent;
        }
        
        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
        }
      `}</style>
      
      {/* Grain overlay */}
      <div className="grain" />
      
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
            <span className="font-syne font-bold text-xl tracking-tight">TITLI</span>
          </a>
          <button
            onClick={() => setShowAuthModal(true)}
            className="font-mono text-sm tracking-wider hover:text-[#E50914] transition-colors"
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
            top: '10%',
            right: '5%',
            width: 'clamp(200px, 30vw, 500px)',
            animation: 'float 6s ease-in-out infinite, pulse-glow 4s ease-in-out infinite',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <img 
            src="/butterfly.png" 
            alt="Titli - Your guide to creative connections"
            className="w-full h-auto"
          />
        </div>
        
        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-8 relative z-20">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <div className="animate-fade-up mb-8">
              <span className="font-mono text-xs tracking-[0.3em] text-[#E50914]">
                THE CREATIVE NETWORK
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] tracking-tight mb-8 animate-fade-up-delay-1">
              Find your
              <br />
              <span className="relative inline-block">
                <span 
                  className="text-[#E50914] transition-all duration-500"
                  key={currentWord}
                >
                  {WORDS[currentWord]}
                </span>
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="font-syne text-xl md:text-2xl text-white/60 max-w-xl leading-relaxed mb-12 animate-fade-up-delay-2">
              One message to Taj. That's all it takes. 
              <br />
              <span className="text-white/40">No cold DMs. No endless scrolling. Just introductions.</span>
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-6 animate-fade-up-delay-3">
              <button 
                onClick={handleGetStarted}
                className="group relative px-10 py-5 bg-[#E50914] font-syne font-semibold text-lg tracking-wide overflow-hidden transition-all duration-300 hover:pr-14"
              >
                <span className="relative z-10">Start now</span>
                <ArrowRight 
                  className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" 
                  size={20} 
                />
              </button>
              <div className="font-mono text-xs text-white/40 flex items-center gap-2">
                <span className="w-8 h-px bg-white/20" />
                FREE TO JOIN
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 border-y border-white/10 overflow-hidden">
        <div 
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 mx-8">
              <span className="font-display text-4xl md:text-6xl text-stroke">Musicians</span>
              <span className="text-[#E50914]">✦</span>
              <span className="font-display text-4xl md:text-6xl text-stroke">Filmmakers</span>
              <span className="text-[#E50914]">✦</span>
              <span className="font-display text-4xl md:text-6xl text-stroke">Designers</span>
              <span className="text-[#E50914]">✦</span>
              <span className="font-display text-4xl md:text-6xl text-stroke">Writers</span>
              <span className="text-[#E50914]">✦</span>
              <span className="font-display text-4xl md:text-6xl text-stroke">Producers</span>
              <span className="text-[#E50914]">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 relative">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left - Phone */}
            <div className="relative lg:sticky lg:top-32">
              <div 
                className="relative max-w-sm mx-auto"
                style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))' }}
              >
                <img 
                  src="/phone-mockup.png" 
                  alt="Taj chatbot interface"
                  className="w-full h-auto"
                />
                {/* Message overlay would go here */}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-[#E50914]/20 rounded-full" />
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#E50914]/10 rounded-full blur-2xl" />
            </div>
            
            {/* Right - Steps */}
            <div className="space-y-24 pt-20">
              <div className="font-mono text-xs tracking-[0.3em] text-[#E50914] mb-16">
                HOW IT WORKS
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
                  desc: "Within minutes, Taj finds the perfect people from our network of verified creative professionals."
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
                      <h3 className="font-display text-4xl md:text-5xl mb-4 group-hover:text-[#E50914] transition-colors">
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

      {/* Stats Section */}
      <section className="py-24 border-y border-white/10">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { value: "500+", label: "Creators connected" },
              { value: "17", label: "Creative categories" },
              { value: "2min", label: "Average match time" },
              { value: "94%", label: "Success rate" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center md:text-left">
                <div className="font-display text-5xl md:text-7xl text-[#E50914] mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative overflow-hidden">
        {/* Background butterfly */}
        <img 
          src="/butterfly.png" 
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.03] pointer-events-none"
        />
        
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="font-mono text-xs tracking-[0.3em] text-[#E50914] mb-16">
            TESTIMONIALS
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Found my vocalist in 2 hours. Taj understood exactly what I needed.",
                name: "Sarah K.",
                role: "Music Producer, LA"
              },
              {
                quote: "The best networking tool for creatives. No more cold DMs that go nowhere.",
                name: "Mike R.",
                role: "Filmmaker, NYC"
              },
              {
                quote: "Connected with 3 advisors who actually responded. Total game changer.",
                name: "Priya S.",
                role: "Startup Founder"
              }
            ].map((t, idx) => (
              <div 
                key={idx} 
                className="group p-8 border border-white/10 hover:border-[#E50914]/50 transition-all duration-500 hover-lift bg-white/[0.02]"
              >
                <p className="font-display text-2xl leading-relaxed mb-8 group-hover:text-[#E50914] transition-colors">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E50914] to-[#ff4d4d]" />
                  <div>
                    <div className="font-syne font-semibold">{t.name}</div>
                    <div className="font-mono text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        {/* Gradient orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #E50914 0%, transparent 70%)' }}
        />
        
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Butterfly */}
            <img 
              src="/butterfly.png" 
              alt="Titli"
              className="w-32 h-auto mx-auto mb-12"
              style={{ 
                animation: 'float 4s ease-in-out infinite',
                filter: 'drop-shadow(0 0 40px rgba(229, 9, 20, 0.5))'
              }}
            />
            
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8">
              Let Titli take
              <br />
              <span className="text-[#E50914]">you places</span>
            </h2>
            
            <p className="font-syne text-xl text-white/50 mb-12 max-w-xl mx-auto">
              Your next collaboration is one message away.
            </p>
            
            <button 
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-4 px-12 py-6 bg-[#E50914] font-syne font-semibold text-xl tracking-wide hover:gap-6 transition-all duration-300"
            >
              Get started
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
                <span className="font-syne font-bold text-lg">TITLI</span>
              </div>
              <p className="font-mono text-xs text-white/40 leading-relaxed">
                The professional network<br />for creative people.
              </p>
            </div>
            
            {[
              { title: "Product", links: ["How it works", "Pricing", "FAQ"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Terms", "Privacy", "Cookies"] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-mono text-xs tracking-[0.2em] text-white/60 mb-6 uppercase">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="font-syne text-white/40 hover:text-[#E50914] transition-colors">
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
