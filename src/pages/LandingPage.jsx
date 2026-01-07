import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { ArrowRight, Star, Play } from "lucide-react";
import AuthModal from "../components/AuthModal";

const WORDS = ["producer", "vocalist", "mentor", "investor", "designer", "filmmaker"];

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % WORDS.length);
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        
        .font-body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes word-slide {
          0% { opacity: 0; transform: translateY(20px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .gradient-btn {
          background: linear-gradient(135deg, #E50914 0%, #ff6b6b 50%, #ffa07a 100%);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .card-shadow {
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.06);
        }
        
        .card-shadow-hover {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .card-shadow-hover:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img 
              src="/butterfly.png" 
              alt="Titli" 
              className="w-9 h-auto"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(229, 9, 20, 0.3))' }}
            />
            <span className="font-body font-bold text-xl text-gray-900">titli</span>
          </a>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAuthModal(true)}
              className="font-body text-sm text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Already have an account? Sign in →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Social Proof Bar */}
          <div className="flex items-center justify-center gap-8 mb-12 opacity-40">
            {["TechCrunch", "Forbes", "Product Hunt", "YC"].map((logo, i) => (
              <span key={i} className="font-body font-semibold text-sm text-gray-400 tracking-wide">
                {logo}
              </span>
            ))}
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            {/* Butterfly Hero */}
            <div className="relative mb-8">
              <img 
                src="/butterfly.png" 
                alt="Titli"
                className="w-48 md:w-64 h-auto mx-auto"
                style={{ 
                  animation: 'float 5s ease-in-out infinite',
                  filter: 'drop-shadow(0 20px 40px rgba(229, 9, 20, 0.25))'
                }}
              />
            </div>

            {/* Headline */}
            <h1 className="font-body text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              The AI that finds your
              <br />
              <span className="relative inline-block">
                <span 
                  key={currentWord}
                  className="font-serif italic text-[#E50914]"
                  style={{ animation: 'word-slide 2.5s ease-in-out' }}
                >
                  {WORDS[currentWord]}
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-body text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Tell Taj who you need. Get introduced to verified creative professionals in minutes, not weeks.
            </p>

            {/* CTA Button */}
            <button 
              onClick={handleGetStarted}
              className="gradient-btn inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-body font-semibold text-lg shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
            >
              Try it out
              <ArrowRight size={20} />
            </button>

            {/* Trust Badge */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ 
                      background: ['#FFE4E1', '#E6E6FA', '#E0FFE0', '#FFF8DC'][i],
                      zIndex: 4 - i
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 card-shadow">
                <span className="font-body text-sm font-semibold text-gray-900">4.9/5</span>
                <span className="font-body text-sm text-gray-500">from</span>
                <span className="font-body text-sm font-semibold text-gray-900">500+</span>
                <span className="font-body text-sm text-gray-500">creators</span>
                <Star size={14} fill="#FBBF24" color="#FBBF24" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Demo Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative max-w-sm mx-auto">
            {/* Phone mockup */}
            <div 
              className="relative card-shadow rounded-[3rem] overflow-hidden"
              style={{ animation: 'float-slow 4s ease-in-out infinite' }}
            >
              <img 
                src="/phone-mockup.png" 
                alt="Titli chat interface"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating message bubble */}
            <div 
              className="absolute -right-4 md:-right-20 top-1/3 bg-white rounded-2xl rounded-br-sm px-4 py-3 card-shadow max-w-[200px]"
              style={{ animation: 'float-slow 3s ease-in-out infinite', animationDelay: '0.5s' }}
            >
              <p className="font-body text-sm text-gray-700">
                "found my co-founder in 3 days 🎉"
              </p>
            </div>
            
            {/* Another floating element */}
            <div 
              className="absolute -left-4 md:-left-16 bottom-1/3 bg-[#E50914] text-white rounded-2xl rounded-bl-sm px-4 py-3 card-shadow"
              style={{ animation: 'float-slow 3.5s ease-in-out infinite', animationDelay: '1s' }}
            >
              <p className="font-body text-sm font-medium">
                looking for a singer? ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Conversational Style */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <p className="font-body text-2xl md:text-3xl text-gray-800 leading-relaxed">
              At Titli we're changing how 
              <img src="/butterfly.png" alt="" className="inline w-8 h-8 mx-2 align-middle" style={{ filter: 'drop-shadow(0 2px 8px rgba(229,9,20,0.3))' }} />
              creatives find each other.
            </p>
            
            <p className="font-body text-2xl md:text-3xl text-gray-500 leading-relaxed">
              Using AI, we understand exactly 
              <span className="inline-flex items-center mx-2 px-3 py-1 bg-purple-100 rounded-full">
                <span className="text-purple-600">🧠</span>
              </span>
              what you need and connect you with the right people.
            </p>
            
            <p className="font-body text-2xl md:text-3xl text-gray-500 leading-relaxed">
              No more cold DMs
              <span className="inline-flex items-center mx-2 px-3 py-1 bg-red-50 rounded-full">
                <span>❌</span>
              </span>
              that go nowhere.
            </p>
            
            <p className="font-body text-2xl md:text-3xl text-gray-800 leading-relaxed">
              Just real introductions
              <span className="inline-flex items-center mx-2 px-3 py-1 bg-green-100 rounded-full">
                <span className="text-green-600">🤝</span>
              </span>
              to verified professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="py-20 px-6 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-body text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                emoji: "💬",
                title: "Message Taj",
                desc: "Describe who you're looking for in plain English. Like texting a friend who knows everyone."
              },
              {
                num: "02",
                emoji: "⚡",
                title: "Get Matched",
                desc: "Our AI finds the perfect people from our network of 500+ verified creatives."
              },
              {
                num: "03",
                emoji: "🎉",
                title: "Connect",
                desc: "We make warm intros. You start collaborating. It's that simple."
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-8 card-shadow card-shadow-hover"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{step.emoji}</span>
                  <span className="font-body text-sm font-medium text-[#E50914]">{step.num}</span>
                </div>
                <h3 className="font-body text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <p className="font-body text-lg text-gray-500">
              You've probably met someone through us.
            </p>
            <p className="font-body text-lg text-gray-900 font-semibold">
              You just didn't know it was Titli.
            </p>
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Found my vocalist in 2 hours. Taj understood exactly what I needed.",
                name: "Sarah K.",
                role: "Music Producer, LA",
                bg: "#FFF5F5"
              },
              {
                quote: "The best networking tool for creatives. No more cold DMs that go nowhere.",
                name: "Mike R.",
                role: "Filmmaker, NYC",
                bg: "#F5F5FF"
              },
              {
                quote: "Connected with 3 advisors who actually responded. Total game changer.",
                name: "Priya S.",
                role: "Startup Founder",
                bg: "#F5FFF5"
              }
            ].map((t, idx) => (
              <div 
                key={idx} 
                className="rounded-3xl p-8 card-shadow-hover"
                style={{ backgroundColor: t.bg }}
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((_, i) => (
                    <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
                <p className="font-body text-gray-800 leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
                    {["🎵", "🎬", "💼"][idx]}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="font-body text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-2xl mx-auto text-center">
          {/* Butterfly */}
          <img 
            src="/butterfly.png" 
            alt="Titli"
            className="w-24 h-auto mx-auto mb-8"
            style={{ 
              animation: 'float 4s ease-in-out infinite',
              filter: 'drop-shadow(0 12px 24px rgba(229, 9, 20, 0.3))'
            }}
          />
          
          <h2 className="font-body text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to meet your next
            <br />
            <span className="font-serif italic text-[#E50914]">collaborator</span>?
          </h2>
          
          <p className="font-body text-lg text-gray-500 mb-10">
            Join 500+ creatives already using Titli. It's free to start.
          </p>
          
          <button 
            onClick={handleGetStarted}
            className="gradient-btn inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-body font-semibold text-lg shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
          >
            Get started free
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
              <span className="font-body font-bold text-lg text-gray-900">titli</span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="font-body text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="font-body text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="font-body text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            
            <p className="font-body text-sm text-gray-400">
              © 2025 Titli
            </p>
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
