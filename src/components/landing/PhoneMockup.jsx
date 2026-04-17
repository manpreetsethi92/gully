import React, { useState, useEffect } from "react";

const ANIMATION_TIMING = {
  MESSAGE_DELAY: 1200,
  CONVERSATION_GAP: 3500,
  INITIAL_DELAY: 600,
};

const CONVERSATIONS = [
  [
    { sender: "taj", text: "Gurbax mentioned he is looking for a singer to collab on his new EP. Interested?" },
    { sender: "user", text: "yes, tell me more about him, what kind of songs does he make?" },
    { sender: "taj", text: "Mostly electronic, house but he is open to other genres as well. You want to see his profile?" },
    { sender: "user", text: "Yes, send it over" },
    { sender: "taj", text: "Awesome, doing it asap" }
  ],
  [
    { sender: "user", text: "I need a travel RN for my clinic next month, 4 weeks in San Diego" },
    { sender: "taj", text: "Pulling from my network of RNs licensed in CA. 1 sec." },
    { sender: "taj", text: "Got 6. Sarah's done 3 travel contracts. Want her resume?" },
    { sender: "user", text: "Yes send it" }
  ],
  [
    { sender: "user", text: "Looking for bartending gigs in NYC next weekend" },
    { sender: "taj", text: "3 spots are short-staffed. I'll get you one." },
    { sender: "taj", text: "Locked. Sunday 6pm at The Rose." }
  ],
  [
    { sender: "user", text: "I do Webflow. Looking for $1-2k projects." },
    { sender: "taj", text: "Noted. 4 new briefs came in this week that fit." },
    { sender: "taj", text: "Showing you the best 2 now." }
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
        const id = setTimeout(showNextMessage, ANIMATION_TIMING.MESSAGE_DELAY);
        timeoutIds.push(id);
      } else {
        const id = setTimeout(() => {
          setConvoIndex((prev) => (prev + 1) % CONVERSATIONS.length);
        }, ANIMATION_TIMING.CONVERSATION_GAP);
        timeoutIds.push(id);
      }
    };

    const startId = setTimeout(showNextMessage, ANIMATION_TIMING.INITIAL_DELAY);
    timeoutIds.push(startId);

    return () => timeoutIds.forEach(id => clearTimeout(id));
  }, [convoIndex]);

  return (
    <div className="relative z-10 w-full lg:max-w-sm lg:drop-shadow-[0_40px_80px_rgba(0,0,0,0.18)]">
      <img
        src="/phone-mockup.png"
        alt="Gully chat interface"
        className="w-full h-auto"
        fetchpriority="high"
        decoding="async"
      />
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
                fontSize: '16px',
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

export default PhoneMockup;
