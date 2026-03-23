/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState } from "react";
import { useAuth, API } from "../../App";
import { MessageCircle, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const STEPS = [
  { id: "skills", title: "What are your main skills?", placeholder: "e.g. Graphic design, video editing, carpentry..." },
  { id: "location", title: "Where are you based?", placeholder: "e.g. Austin, TX" },
  { id: "rate", title: "What's your typical rate?", placeholder: "e.g. $75/hr or $500/project" },
  { id: "availability", title: "How available are you?", placeholder: "e.g. Full-time, weekends only, 10hrs/week..." },
  { id: "dream_gig", title: "What's your dream gig?", placeholder: "e.g. Brand identity for a music startup" },
];

const OnboardingFlow = ({ darkMode }) => {
  const { token } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      setSaving(true);
      try {
        await axios.patch(`${API}/users/me`, { onboarding_answers: answers }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDone(true);
      } catch {
        toast.error("Failed to save — try again");
      } finally {
        setSaving(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>You're all set!</h2>
        <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
          Taj now knows exactly what you're looking for. Expect matches soon.
        </p>
        <a
          href="https://wa.me/12134147369?text=Hi%20Taj!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
          style={{ background: "#E50914" }}
        >
          <MessageCircle size={18} />
          Say hi to Taj on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Complete your profile</h1>
        <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>Step {step + 1} of {STEPS.length}</p>
      </div>

      {/* Progress Bar */}
      <div className={`h-1 ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
        <div
          className="h-1 transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "#E50914" }}
        />
      </div>

      {/* Step Content */}
      <div className="px-4 py-8">
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>{current.title}</h2>
        <textarea
          value={answers[current.id] || ""}
          onChange={(e) => setAnswers(prev => ({ ...prev, [current.id]: e.target.value }))}
          placeholder={current.placeholder}
          rows={4}
          className={`w-full p-4 rounded-2xl border text-[15px] resize-none outline-none focus:ring-2 focus:ring-red-500 transition-all ${darkMode ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
        />

        <button
          onClick={handleNext}
          disabled={saving || !answers[current.id]?.trim()}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold transition-opacity disabled:opacity-50"
          style={{ background: "#E50914" }}
        >
          {saving ? "Saving..." : isLast ? "Finish" : "Next"}
          {!saving && <ChevronRight size={18} />}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className={`mt-3 w-full py-3 rounded-full font-semibold border transition-colors ${darkMode ? "border-white/20 text-white/60 hover:bg-white/10" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            Back
          </button>
        )}
      </div>

      {/* Skip */}
      <div className="px-4 pb-4 text-center">
        <button
          onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))}
          className={`text-sm ${darkMode ? "text-white/30 hover:text-white/50" : "text-gray-400 hover:text-gray-600"}`}
        >
          Skip this question
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
