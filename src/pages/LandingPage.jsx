import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { ArrowRight } from "lucide-react";
import AuthModal from "../components/AuthModal";

const ROTATING_WORDS = ["artists", "producers", "mentors", "advisors", "investors", "focus groups", "musicians"];

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
      className="relative w-[280px] sm:w-[320px]"
      style={{ 
        filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.25))',
      }}
    >
      {/* iPhone Frame - Pure CSS */}
      <div 
        className="relative rounded-[45px] p-[12px] overflow-hidden"
        style={{ 
          background: '#1a1a1a',
          boxShadow: 'inset 0 0 0 2px #333, inset 0 0 0 4px #1a1a1a',
        }}
      >
        {/* Screen */}
        <div 
          className="relative rounded-[35px] overflow-hidden"
          style={{ 
            background: '#0e0e0e',
            aspectRatio: '9/19.5',
          }}
        >
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-[44px] flex items-center justify-between px-6 z-20">
            <span className="text-white text-[14px] font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
              </svg>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
              <svg className="w-6 h-3 text-white" fill="currentColor" viewBox="0 0 24 12">
                <rect x="0" y="0" width="22" height="12" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
                <rect x="2" y="2" width="16" height="8" rx="1" fill="currentColor"/>
                <rect x="22" y="4" width="2" height="4" rx="0.5" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Dynamic Island */}
          <div 
            className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] rounded-full z-30"
            style={{ background: '#000' }}
          />

          {/* Telegram Header */}
          <div 
            className="absolute top-[44px] left-0 right-0 h-[60px] flex items-center px-4 z-10"
            style={{ background: '#0e0e0e' }}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="text-[#007AFF] text-[16px]">‹</div>
              <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                T
              </div>
              <div className="flex-1">
                <div className="text-white text-[15px] font-semibold">Taj</div>
                <div className="text-gray-500 text-[12px]">bot</div>
              </div>
              <div className="w-[32px] h-[32px] rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Chat Background Pattern */}
          <div 
            className="absolute inset-0 top-[104px] bottom-[70px] overflow-hidden"
            style={{ 
              background: '#0e0e0e',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Messages Container */}
          <div className="absolute inset-0 top-[110px] bottom-[70px] flex flex-col justify-end px-3 pb-2 overflow-hidden">
            <div className="flex flex-col gap-[6px]">
              {visibleMessages.map((msg, idx) => (
                <div
                  key={`${convoIndex}-${idx}`}
                  className={`max-w-[80%] px-3 py-[8px] text-[13px] leading-[1.4] animate-fadeIn ${
                    msg.sender === 'user' 
                      ? 'self-end text-white rounded-[18px] rounded-br-[4px]' 
                      : 'self-start text-white rounded-[18px] rounded-bl-[4px]'
                  }`}
                  style={{ 
                    backgroundColor: msg.sender === 'user' ? '#007AFF' : '#303030',
                    animationDelay: `${idx * 0.1}s`
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[70px] flex items-center px-3 gap-2"
            style={{ background: '#1a1a1a' }}
          >
            <div className="w-[32px] h-[32px] rounded-full bg-[#303030] flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div 
              className="flex-1 h-[36px] rounded-full px-4 flex items-center text-gray-500 text-[14px]"
              style={{ background: '#303030' }}
            >
              Message
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#303030] flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
              </svg>
            </div>
          </div>

          {/* Home Indicator */}
          <div 
            className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full"
            style={{ background: '#666' }}
          />
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated && user?.profile_completed) {
      navigate("/app");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Add animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div 
            className="text-2xl font-bold cursor-pointer tracking-tight"
            style={{ color: '#E50914' }}
            onClick={() => navigate("/")}
          >
            titly
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-sm font-medium px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      <main className="pt-24 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="max-w-xl">
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
                style={{ color: '#0a0a0a' }}
              >
                <span className="whitespace-nowrap">Tell Taj who you need.</span>
                <br />
                <span style={{ color: '#E50914' }}>Get introduced.</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                One message away from meeting{" "}
                <span 
                  className={`inline-block font-semibold transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
                  style={{ color: '#E50914', minWidth: '120px' }}
                >
                  {ROTATING_WORDS[currentWordIndex]}
                </span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105 hover:shadow-lg"
                  style={{ background: '#E50914' }}
                >
                  Try us now
                  <ArrowRight size={18} />
                </button>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {['🎵', '🎨', '💼', '🎬'].map((emoji, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-lg shadow-sm"
                      style={{ 
                        background: ['#fee2e2', '#dbeafe', '#dcfce7', '#fef3c7'][i],
                        zIndex: 4 - i 
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">500+</span> creators connected this month
                </p>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2024 titly.social</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
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
