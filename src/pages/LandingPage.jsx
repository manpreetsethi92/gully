import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { ArrowRight, Star, Sparkles, Heart, Zap, Music, Film, Palette, Mic, Camera, PenTool } from "lucide-react";
import AuthModal from "../components/AuthModal";

const WORDS = ["producer", "vocalist", "mentor", "investor", "designer", "filmmaker", "photographer"];
const CATEGORIES = [
  { icon: Music, label: "Musicians", color: "#8B5CF6" },
  { icon: Film, label: "Filmmakers", color: "#EC4899" },
  { icon: Palette, label: "Designers", color: "#F59E0B" },
  { icon: Mic, label: "Podcasters", color: "#10B981" },
  { icon: Camera, label: "Photographers", color: "#3B82F6" },
  { icon: PenTool, label: "Writers", color: "#EF4444" },
];

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Word rotation
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

  // Calculate parallax offset
  const parallaxX = (mousePos.x - window.innerWidth / 2) / 50;
  const parallaxY = (mousePos.y - window.innerHeight / 2) / 50;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        
        * { font-family: 'Outfit', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-25px) rotate(3deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .animate-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .animate-delay-3 { animation-delay: 0.3s; opacity: 0; }
        .animate-delay-4 { animation-delay: 0.4s; opacity: 0; }
        .animate-delay-5 { animation-delay: 0.5s; opacity: 0; }
        
        .gradient-text {
          background: linear-gradient(135deg, #E50914 0%, #FF6B6B 50%, #FF8E53 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-btn {
          background: linear-gradient(135deg, #E50914 0%, #FF4D4D 50%, #FF6B6B 100%);
          background-size: 200% 200%;
          animation: gradient-flow 3s ease infinite;
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
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        
        .glow-red {
          filter: drop-shadow(0 0 30px rgba(229, 9, 20, 0.4)) drop-shadow(0 0 60px rgba(229, 9, 20, 0.2));
        }
        
        .blob {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: blob 8s ease-in-out infinite;
        }
        
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        
        .marquee {
          animation: marquee 25s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .chat-bubble {
          animation: fade-in-up 0.5s ease-out forwards, bounce-soft 3s ease-in-out infinite;
        }
        
        .butterfly-trail {
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(229, 9, 20, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: fade-out 1s ease-out forwards;
        }
        
        @keyframes fade-out {
          to { opacity: 0; transform: scale(2); }
        }
      `}</style>

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] blob opacity-[0.07]"
          style={{ 
            background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
            top: '-10%',
            right: '-10%',
            transform: `translate(${parallaxX * -2}px, ${parallaxY * -2}px)`,
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] blob opacity-[0.05]"
          style={{ 
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            bottom: '10%',
            left: '-5%',
            animationDelay: '-4s',
            transform: `translate(${parallaxX * 2}px, ${parallaxY * 2}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/butterfly.png" 
                alt="Titli" 
                className="w-10 h-auto transition-transform duration-300 group-hover:scale-110"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(229, 9, 20, 0.3))' }}
              />
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-gray-900">titli</span>
          </a>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-sm font-medium text-gray-600 hover:text-[#E50914] transition-colors flex items-center gap-2"
          >
            Sign in <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="animate-fade-in-up animate-delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 mb-8">
                <Sparkles size={14} className="text-[#E50914]" />
                <span className="text-sm font-medium text-gray-700">500+ creatives connected this month</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="animate-fade-in-up animate-delay-2 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
                Find your next
                <br />
                <span className="relative inline-block mt-2">
                  <span 
                    key={currentWord}
                    className="font-display italic gradient-text"
                    style={{ 
                      display: 'inline-block',
                      animation: 'scale-in 0.4s ease-out'
                    }}
                  >
                    {WORDS[currentWord]}
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C47 2 153 2 199 5.5" stroke="#E50914" strokeWidth="3" strokeLinecap="round" style={{ animation: 'wiggle 2s ease-in-out infinite' }}/>
                  </svg>
                </span>
                <br />
                <span className="text-gray-400 font-normal">in one message.</span>
              </h1>
              
              {/* Subtitle */}
              <p className="animate-fade-in-up animate-delay-3 text-lg text-gray-500 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
                Tell Taj who you need. Our AI matches you with verified creative professionals — no cold DMs, just warm intros.
              </p>
              
              {/* CTA */}
              <div className="animate-fade-in-up animate-delay-4 flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-8">
                <button 
                  onClick={handleGetStarted}
                  className="gradient-btn group px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-3"
                >
                  <span>Start free</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Zap size={14} className="text-yellow-500" />
                  Takes 30 seconds
                </span>
              </div>
              
              {/* Trust Row */}
              <div className="animate-fade-in-up animate-delay-5 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {['🎵', '🎬', '🎨', '📸', '✍️'].map((emoji, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center text-lg hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        animation: 'bounce-soft 2s ease-in-out infinite',
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((_, i) => (
                      <Star key={i} size={14} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium ml-1">4.9</span>
                  <span className="text-sm text-gray-400">(500+ reviews)</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Phone + Butterfly */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Butterfly */}
              <div 
                className="absolute z-20 glow-red"
                style={{
                  top: '-10%',
                  right: '5%',
                  width: 'clamp(120px, 20vw, 200px)',
                  animation: 'float 5s ease-in-out infinite',
                  transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                }}
              >
                <img 
                  src="/butterfly.png" 
                  alt="Titli butterfly"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Glowing ring behind phone */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-20"
                style={{
                  background: 'radial-gradient(circle, #E50914 0%, transparent 70%)',
                  animation: 'pulse-ring 3s ease-out infinite',
                }}
              />
              
              {/* Phone */}
              <div 
                className="relative z-10 w-[280px] sm:w-[320px]"
                style={{
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.2))',
                  transform: `translate(${parallaxX * -0.5}px, ${parallaxY * -0.5}px)`,
                }}
              >
                <img 
                  src="/phone-mockup.png" 
                  alt="Titli chat"
                  className="w-full h-auto"
                />
                
                {/* Chat bubbles overlaid */}
                <div className="absolute inset-0 top-[22%] left-[8%] right-[8%] bottom-[18%] flex flex-col justify-end p-3 overflow-hidden">
                  <div className="space-y-2">
                    <div 
                      className="chat-bubble self-start bg-gray-700 text-white text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]"
                      style={{ animationDelay: '0.5s' }}
                    >
                      Hey! Looking for a vocalist for your track? 🎤
                    </div>
                    <div 
                      className="chat-bubble self-end bg-blue-500 text-white text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]"
                      style={{ animationDelay: '1s' }}
                    >
                      Yes! Someone with a soulful voice
                    </div>
                    <div 
                      className="chat-bubble self-start bg-gray-700 text-white text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]"
                      style={{ animationDelay: '1.5s' }}
                    >
                      Found 3 perfect matches! Here's Sarah ✨
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating testimonial card */}
              <div 
                className="absolute -left-8 bottom-20 bg-white rounded-2xl p-4 shadow-xl max-w-[180px] z-30 hidden lg:block"
                style={{ animation: 'float-delayed 4s ease-in-out infinite' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Sarah K.</p>
                    <p className="text-[10px] text-gray-500">Music Producer</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">"Found my vocalist in 2 hours!"</p>
                <div className="flex mt-2">
                  {[1,2,3,4,5].map((_, i) => (
                    <Star key={i} size={10} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
              </div>
              
              {/* Floating category pill */}
              <div 
                className="absolute -right-4 top-1/3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg z-30 hidden lg:flex items-center gap-2"
                style={{ animation: 'bounce-soft 3s ease-in-out infinite' }}
              >
                <Music size={12} />
                <span>Musicians</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex justify-center pt-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full" style={{ animation: 'bounce-soft 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* Categories Marquee */}
      <section className="py-8 bg-gray-50 overflow-hidden border-y border-gray-100">
        <div className="marquee flex whitespace-nowrap">
          {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <div key={i} className="flex items-center gap-3 mx-8">
              <cat.icon size={20} style={{ color: cat.color }} />
              <span className="text-lg font-medium text-gray-400">{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-red-50 text-[#E50914] text-sm font-medium mb-4">
              Simple as 1-2-3
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How Titli works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                emoji: "💬",
                title: "Message Taj",
                desc: "Just describe who you need. Like texting a friend who knows everyone in the industry.",
                color: "from-blue-500 to-cyan-400"
              },
              {
                num: "02",
                emoji: "✨",
                title: "Get Matched",
                desc: "Our AI finds perfect matches from 500+ verified creatives. Usually within minutes.",
                color: "from-purple-500 to-pink-400"
              },
              {
                num: "03",
                emoji: "🤝",
                title: "Connect",
                desc: "We make warm intros. No awkward cold DMs. Just real conversations.",
                color: "from-orange-500 to-red-400"
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="card-hover relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm group"
              >
                {/* Number badge */}
                <div 
                  className={`absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                >
                  {step.num}
                </div>
                
                {/* Emoji */}
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.emoji}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by creatives
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Join the community of artists, producers, and creators finding their perfect collaborators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Found my vocalist in 2 hours. Taj understood exactly what I needed. This is magic.",
                name: "Sarah K.",
                role: "Music Producer",
                emoji: "🎵",
                gradient: "from-purple-100 to-pink-50"
              },
              {
                quote: "The best networking tool for creatives. No more cold DMs that go nowhere. Ever.",
                name: "Mike R.",
                role: "Filmmaker",
                emoji: "🎬",
                gradient: "from-blue-100 to-cyan-50"
              },
              {
                quote: "Connected with 3 advisors who actually responded. Total game changer for my startup.",
                name: "Priya S.",
                role: "Founder",
                emoji: "💼",
                gradient: "from-orange-100 to-yellow-50"
              }
            ].map((t, idx) => (
              <div 
                key={idx}
                className={`card-hover bg-gradient-to-br ${t.gradient} rounded-3xl p-8 relative overflow-hidden`}
              >
                {/* Background emoji */}
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">
                  {t.emoji}
                </div>
                
                <div className="relative z-10">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map((_, i) => (
                      <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                    "{t.quote}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">
                      {t.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50"
        />
        
        {/* Floating butterflies */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img 
            src="/butterfly.png" 
            alt=""
            className="absolute top-10 left-10 w-20 opacity-20"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          />
          <img 
            src="/butterfly.png" 
            alt=""
            className="absolute bottom-20 right-20 w-16 opacity-15"
            style={{ animation: 'float-delayed 5s ease-in-out infinite' }}
          />
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Main butterfly */}
          <div className="relative inline-block mb-8">
            <img 
              src="/butterfly.png" 
              alt="Titli"
              className="w-32 h-auto glow-red"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            />
            {/* Sparkles */}
            <Sparkles 
              className="absolute -top-2 -right-2 text-yellow-400" 
              size={20}
              style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}
            />
            <Heart 
              className="absolute -bottom-2 -left-2 text-pink-400" 
              size={16}
              fill="currentColor"
              style={{ animation: 'bounce-soft 2s ease-in-out infinite', animationDelay: '0.5s' }}
            />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Ready to find your
            <br />
            <span className="font-display italic gradient-text">perfect match</span>?
          </h2>
          
          <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">
            Join 500+ creatives who stopped cold DMing and started connecting.
          </p>
          
          <button 
            onClick={handleGetStarted}
            className="gradient-btn group px-10 py-5 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <span>Get started — it's free</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
              <span className="font-bold text-lg text-gray-900">titli</span>
            </div>
            
            <div className="flex items-center gap-8">
              {["Privacy", "Terms", "Contact"].map((link, i) => (
                <a key={i} href="#" className="text-sm text-gray-500 hover:text-[#E50914] transition-colors">
                  {link}
                </a>
              ))}
            </div>
            
            <p className="text-sm text-gray-400">© 2025 Titli</p>
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
