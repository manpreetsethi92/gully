// FirstTextPrompt — the first thing a newly-signed-up user sees.
//
// Opens automatically when they land on /app/you?tab=socials right after
// signup (triggered by sessionStorage flag "gully_needs_first_text" set in
// AuthModal.jsx after successful signup).
//
// Purpose: bridge the gap between "website signup" and "WhatsApp onboarding".
// WhatsApp policy requires the USER to message the business first, so we can't
// auto-text them. This popup nudges them to send that first message with one
// tap, via wa.me deep link. Once dismissed (or the link is clicked), the flag
// is cleared so it doesn't show again.

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "12134147369";
const WHATSAPP_DISPLAY = "+1 (213) 414-7369";
const WHATSAPP_MESSAGE = "hey taj! just signed up on gully";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const FirstTextPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if the signup handoff flag is set
    if (sessionStorage.getItem("gully_needs_first_text") === "1") {
      setIsOpen(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.removeItem("gully_needs_first_text");
    setIsOpen(false);
  };

  const handleWhatsappClick = () => {
    // Clear the flag immediately — they've acknowledged the prompt
    sessionStorage.removeItem("gully_needs_first_text");
    // Keep the modal open briefly so they can see what happened, then close
    setTimeout(() => setIsOpen(false), 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(10, 10, 10, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={dismiss}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Pulsing status pill */}
        <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 bg-gray-50 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider text-gray-600 lowercase">you're in</span>
        </div>

        {/* Big headline */}
        <h2 className="text-[32px] leading-[1.05] tracking-tight text-gray-900 font-semibold mb-6">
          first — text taj.
        </h2>

        {/* Numbered steps */}
        <ol className="text-left mb-7 space-y-3 px-2">
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-[12px] font-semibold flex items-center justify-center mt-0.5">1</span>
            <div className="text-[14.5px] text-gray-700 leading-snug">
              text taj on <span className="font-mono text-gray-900">{WHATSAPP_DISPLAY}</span>
              <br />
              <span className="text-gray-400 text-[13px]">say "hey" — we'll pre-fill it for you</span>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-[12px] font-semibold flex items-center justify-center mt-0.5">2</span>
            <div className="text-[14.5px] text-gray-700 leading-snug">
              she'll ask 2 quick questions
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-[12px] font-semibold flex items-center justify-center mt-0.5">3</span>
            <div className="text-[14.5px] text-gray-700 leading-snug">
              she'll find your first match
            </div>
          </li>
        </ol>

        {/* Big green WhatsApp CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsappClick}
          className="inline-flex items-center justify-center gap-2.5 w-full h-14 bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold rounded-full transition-colors text-[16px] mb-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          text taj on whatsapp
        </a>

        {/* Secondary dismiss */}
        <button
          onClick={dismiss}
          className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          i'll do this later
        </button>
      </div>
    </div>
  );
};

export default FirstTextPrompt;
