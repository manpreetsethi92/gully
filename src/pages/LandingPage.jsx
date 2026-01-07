import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { ArrowRight, Star, Sparkles, Zap, Search, Users, Briefcase, Home, Car, Camera, Music, Code, Wrench, Heart, DollarSign, MapPin } from "lucide-react";
import AuthModal from "../components/AuthModal";

const NEEDS = [
  "a photographer for Saturday",
  "someone to fix my sink",
  "a vocal coach",
  "a ride to the airport",
  "a web developer",
  "a DJ for my party",
  "a dog walker",
  "a guitar teacher",
  "a moving helper",
  "a personal trainer"
];

const CATEGORIES = [
  { icon: Briefcase, label: "Gigs", color: "#8B5CF6", count: "2.4k" },
  { icon: Home, label: "Services", color: "#EC4899", count: "1.8k" },
  { icon: Music, label: "Creative", color: "#F59E0B", count: "950" },
  { icon: Code, label: "Tech", color: "#3B82F6", count: "1.2k" },
  { icon: Wrench, label: "Trades", color: "#10B981", count: "800" },
  { icon: Camera, label: "Events", color: "#EF4444", count: "650" },
];

const EXAMPLES = [
  { need: "Need a photographer", match: "Sarah, 4.9★ photographer nearby", time: "2 min" },
  { need: "Looking for a plumber", match: "Mike's Plumbing, available today", time: "5 min" },
  { need: "Want guitar lessons", match: "Jazz guitarist, 10yrs experience", time: "3 min" },
];

const LandingPage = () => {
  const [currentNeed, setCurrentNeed] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNeed((prev) => (prev + 1) % NEEDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = useCallback(() => {
    if (isAuthenticated && user?.profile_completed) {
      navigate("/app");
    } else {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, user, navigate]);

  const parallaxX = (mousePos.x - window.innerWidth / 2) / 60;
  const parallaxY = (mousePos.y - window.innerHeight / 2) / 60;

  return (
    <div className="min-h-screen bg-[#FFFDF9] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
        
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .delay-5 { animation-delay: 0.5s; opacity: 0; }
        
        .gradient-text {
          background: linear-gradient(135deg, #E50914 0%, #FF6B6B 50%, #FF8E53 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-btn {
          background: linear-gradient(135deg, #E50914 0%, #FF4D4D 100%);
          position: relative;
          overflow: hidden;
        }
        
        .gradient-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }
        
        .glow {
          filter: drop-shadow(0 0 30px rgba(229, 9, 20, 0.35));
        }
        
        .search-box {
          background: white;
          border: 2px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .search-box:focus-within {
          border-color: #E50914;
          box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1);
        }
        
        .blob {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: blob 10s ease-in-out infinite;
        }
        
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[500px] h-[500px] blob opacity-[0.06]"
          style={{ 
            background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
            top: '-5%',
            right: '-5%',
            transform: `translate(${parallaxX * -1}px, ${parallaxY * -1}px)`,
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] blob opacity-[0.04]"
          style={{ 
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            bottom: '20%',
            left: '-3%',
            animationDelay: '-5s',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9]/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img 
              src="/butterfly.png" 
              alt="Titli" 
              className="w-10 h-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(229, 9, 20, 0.25))' }}
            />
            <span className="text-xl font-bold text-gray-900">titli</span>
          </a>
          
          <div className="flex items-center gap-6">
            <a href="#how" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              How it works
            </a>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-semibold text-[#E50914] hover:text-red-700 transition-colors flex items-center gap-1"
            >
              Sign in <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 pb-16 px-6 relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="animate-slide-up delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-900">1,247</strong> people found help today
                </span>
              </div>
              
              {/* Main Headline */}
              <h1 className="animate-slide-up delay-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
                Need 
                <span className="relative mx-3">
                  <span 
                    key={currentNeed}
                    className="font-serif italic text-[#E50914] inline-block"
                    style={{ animation: 'bounce-in 0.5s ease-out' }}
                  >
                    {NEEDS[currentNeed]}
                  </span>
                </span>
                ?
                <br />
                <span className="text-gray-400 font-semibold text-3xl sm:text-4xl lg:text-5xl mt-4 block">
                  We'll find them.
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="animate-slide-up delay-3 text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                The modern way to find local help. Tell us what you need, and we'll connect you with trusted people nearby — in minutes, not days.
              </p>
              
              {/* Search Box */}
              <div className="animate-slide-up delay-4 mb-8">
                <div className="search-box rounded-2xl p-2 flex items-center gap-3 max-w-lg mx-auto lg:mx-0 shadow-lg">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search size={20} className="text-gray-400" />
                    <input 
                      type="text"
                      placeholder="What do you need help with?"
                      className="w-full py-3 text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                    />
                  </div>
                  <button 
                    onClick={handleGetStarted}
                    className="gradient-btn px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    Find help
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              
              {/* Quick categories */}
              <div className="animate-slide-up delay-5 flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                <span className="text-sm text-gray-400">Popular:</span>
                {["Photographers", "Handyman", "Tutors", "DJs", "Developers"].map((cat, i) => (
                  <button 
                    key={i}
                    className="text-sm text-gray-600 hover:text-[#E50914] hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Trust */}
              <div className="animate-slide-up delay-5 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2">
                  {['👨‍🔧', '📸', '🎸', '💻', '🏋️'].map((emoji, i) => (
                    <div 
                      key={i}
                      className="w-9 h-9 rounded-full bg-white border-2 border-[#FFFDF9] shadow-sm flex items-center justify-center text-base"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <strong className="text-gray-900">4,500+</strong> verified providers
                </div>
              </div>
            </div>
            
            {/* Right Content - Visual */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Butterfly */}
              <div 
                className="absolute z-20 glow"
                style={{
                  top: '-5%',
                  right: '10%',
                  width: 'clamp(100px, 18vw, 180px)',
                  animation: 'float 5s ease-in-out infinite',
                  transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                }}
              >
                <img src="/butterfly.png" alt="Titli" className="w-full h-auto" />
              </div>
              
              {/* Phone with chat */}
              <div 
                className="relative z-10 w-[280px] sm:w-[300px]"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
                  transform: `translate(${parallaxX * -0.3}px, ${parallaxY * -0.3}px)`,
                }}
              >
                <img src="/phone-mockup.png" alt="Titli app" className="w-full h-auto" />
                
                {/* Overlay chat messages */}
                <div className="absolute inset-0 top-[22%] left-[8%] right-[8%] bottom-[18%] flex flex-col justify-end p-3 overflow-hidden">
                  <div className="space-y-2">
                    <div className="self-end bg-[#E50914] text-white text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[85%]">
                      I need a photographer for a birthday party this Saturday
                    </div>
                    <div className="self-start bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%]">
                      Found 3 photographers available Saturday! 📸
                    </div>
                    <div className="self-start bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%]">
                      Sarah (4.9★) is nearby and free. Want me to connect you?
                    </div>
                    <div className="self-end bg-[#E50914] text-white text-xs px-3 py-2 rounded-2xl rounded-br-sm">
                      Yes please! 🙌
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating match card */}
              <div 
                className="absolute -left-4 lg:-left-12 top-1/3 bg-white rounded-2xl p-4 shadow-xl z-30 hidden sm:block max-w-[200px]"
                style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '1s' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-lg">
                    📸
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Sarah M.</p>
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#FBBF24" color="#FBBF24" />
                      <span className="text-xs text-gray-500">4.9 · Photographer</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={12} />
                  <span>2.3 miles away</span>
                  <span className="text-green-500 font-medium">Available</span>
                </div>
              </div>
              
              {/* Stats pill */}
              <div 
                className="absolute -right-2 bottom-1/4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg z-30 hidden sm:flex items-center gap-2"
                style={{ animation: 'float 3.5s ease-in-out infinite' }}
              >
                <Zap size={14} />
                <span>Matched in 2 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="py-6 bg-white border-y border-gray-100 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
          {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <div key={i} className="flex items-center gap-2 mx-6 px-4 py-2 rounded-full bg-gray-50">
              <cat.icon size={16} style={{ color: cat.color }} />
              <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              <span className="text-xs text-gray-400">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-red-50 text-[#E50914] text-sm font-semibold mb-4">
              Simple & Fast
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get help in 3 steps
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              No endless scrolling through listings. Just tell us what you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                emoji: "💬",
                title: "Tell us what you need",
                desc: "Describe what you're looking for in plain English. Need a plumber? A photographer? A guitar teacher? Just ask.",
                color: "from-blue-500 to-cyan-400"
              },
              {
                step: "02",
                emoji: "🎯",
                title: "We find the right people",
                desc: "Our AI matches you with verified providers nearby. No fake profiles, no spam — just real people ready to help.",
                color: "from-purple-500 to-pink-400"
              },
              {
                step: "03",
                emoji: "🤝",
                title: "Connect instantly",
                desc: "We introduce you directly. Chat, discuss details, and get it done. Most matches happen in under 5 minutes.",
                color: "from-orange-500 to-red-400"
              }
            ].map((item, idx) => (
              <div key={idx} className="card-hover relative bg-[#FFFDF9] rounded-3xl p-8 border border-gray-100">
                <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6 bg-[#FFFDF9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Whatever you need, we've got you
            </h2>
            <p className="text-gray-500">From everyday tasks to special occasions</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: "🔧", title: "Home Services", examples: "Plumbers, Electricians, Cleaners", bg: "bg-blue-50" },
              { emoji: "📸", title: "Events", examples: "Photographers, DJs, Caterers", bg: "bg-pink-50" },
              { emoji: "🎸", title: "Lessons", examples: "Music, Language, Fitness", bg: "bg-yellow-50" },
              { emoji: "💻", title: "Tech Help", examples: "Developers, Designers, IT Support", bg: "bg-purple-50" },
              { emoji: "🚗", title: "Transportation", examples: "Movers, Drivers, Delivery", bg: "bg-green-50" },
              { emoji: "✨", title: "Personal", examples: "Stylists, Trainers, Coaches", bg: "bg-orange-50" },
            ].map((cat, idx) => (
              <div key={idx} className={`${cat.bg} rounded-2xl p-6 card-hover cursor-pointer`}>
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{cat.title}</h3>
                <p className="text-sm text-gray-500">{cat.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real people, real results
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Found a photographer for my daughter's quinceañera in 10 minutes. She was amazing and half the price of others!",
                name: "Maria G.",
                location: "Los Angeles",
                emoji: "📸",
                bg: "bg-gradient-to-br from-pink-50 to-rose-50"
              },
              {
                quote: "My sink was flooding at 9pm. Had a plumber at my door by 10. Titli literally saved my apartment.",
                name: "James K.",
                location: "Chicago",
                emoji: "🔧",
                bg: "bg-gradient-to-br from-blue-50 to-cyan-50"
              },
              {
                quote: "Been looking for a good guitar teacher for months. Found one in my neighborhood through Titli. Now I can play!",
                name: "Aisha T.",
                location: "Austin",
                emoji: "🎸",
                bg: "bg-gradient-to-br from-yellow-50 to-orange-50"
              }
            ].map((t, idx) => (
              <div key={idx} className={`${t.bg} rounded-3xl p-8 card-hover relative overflow-hidden`}>
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">{t.emoji}</div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map((_, i) => (
                      <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">
                      {t.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-[#FFFDF9] to-orange-50" />
        
        {/* Floating butterflies */}
        <img 
          src="/butterfly.png" 
          alt=""
          className="absolute top-10 left-10 w-16 opacity-20"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <img 
          src="/butterfly.png" 
          alt=""
          className="absolute bottom-10 right-10 w-12 opacity-15"
          style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '2s' }}
        />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <img 
            src="/butterfly.png" 
            alt="Titli"
            className="w-24 h-auto mx-auto mb-8 glow"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          />
          
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Stop searching.
            <br />
            <span className="font-serif italic gradient-text">Start finding.</span>
          </h2>
          
          <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">
            Join thousands who found the help they needed — photographers, plumbers, tutors, and more.
          </p>
          
          <button 
            onClick={handleGetStarted}
            className="gradient-btn group px-10 py-5 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
          >
            Get started free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-6 text-sm text-gray-400">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
            <span className="font-bold text-lg text-gray-900">titli</span>
          </div>
          
          <div className="flex items-center gap-8">
            {["How it works", "Categories", "For Providers", "Privacy", "Terms"].map((link, i) => (
              <a key={i} href="#" className="text-sm text-gray-500 hover:text-[#E50914] transition-colors">
                {link}
              </a>
            ))}
          </div>
          
          <p className="text-sm text-gray-400">© 2025 Titli</p>
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
