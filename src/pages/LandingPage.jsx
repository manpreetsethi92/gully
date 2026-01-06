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
      className="relative"
      style={{ 
        width: '320px',
        filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))',
      }}
    >
      {/* iPhone with Telegram screen - static image */}
      <img 
        src="/phone-mockup.png"
        alt="Taj on Telegram"
        className="w-full h-auto"
        style={{ display: 'block' }}
      />
      
      {/* Message bubbles overlay - positioned over the screen area */}
      <div 
        style={{
          position: 'absolute',
          top: '22%',
          left: '8%',
          right: '8%',
          bottom: '18%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '10px',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleMessages.map((msg, idx) => (
            <div
              key={`${convoIndex}-${idx}`}
              style={{ 
                maxWidth: '80%',
                padding: '8px 12px',
                fontSize: '12px',
                lineHeight: 1.4,
                color: '#fff',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#3B82F6' : '#374151',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
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
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:opacity-90"
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
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-lg"
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
          <p className="text-sm text-gray-500">© 2025 titly.social</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact</a>
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
