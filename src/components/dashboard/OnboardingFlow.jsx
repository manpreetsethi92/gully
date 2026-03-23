import React, { useState } from "react";
import { useAuth, API } from "../../App";
import axios from "axios";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { ChevronRight, Check, Briefcase, Search, Video, Calendar, Zap } from "lucide-react";

const OnboardingFlow = ({ darkMode }) => {
  const { user, token } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    intent: null, // 'hiring' or 'working'
    name: user?.name || "",
    skills: [],
    location: "",
    completedChallenge: false,
    recordedIntro: false,
    calendarConnected: false
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "What brings you here?",
      description: "Tell us your primary goal on Giggy",
      component: StepIntent
    },
    {
      title: "Tell us about yourself",
      description: "Help us understand your profile better",
      component: StepBasicInfo
    },
    {
      title: "Connect your social accounts",
      description: "Link platforms to showcase your work",
      component: StepSocialConnect
    },
    {
      title: "Get a Verified badge",
      description: "Complete a quick skill challenge",
      component: StepSkillChallenge
    },
    {
      title: "Record your intro",
      description: "60-second video introduction",
      component: StepVideoIntro
    },
    {
      title: "Set your availability",
      description: "Connect your calendar for easy booking",
      component: StepCalendar
    }
  ];

  const calculateProgress = () => {
    let completed = 0;
    if (formData.intent) completed++;
    if (formData.name && formData.location) completed++;
    if (formData.completedChallenge) completed++;
    if (formData.recordedIntro) completed++;
    if (formData.calendarConnected) completed++;
    return Math.round((completed / 5) * 100);
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setLoading(true);
      try {
        await axios.post(`${API}/onboarding/complete`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Redirect to dashboard
        window.location.href = '/app';
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className={`min-h-screen p-4 lg:p-6 flex flex-col ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className={`font-syne font-bold text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {steps[currentStep].title}
            </h1>
            <span className="font-syne font-bold text-[#E50914]">{calculateProgress()}%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-[#E50914] transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            Step {currentStep + 1} of {steps.length} • {steps[currentStep].description}
          </p>
        </div>

        {/* Step Content */}
        <div className="flex-1">
          <CurrentStepComponent
            formData={formData}
            setFormData={setFormData}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            darkMode={darkMode}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 bg-[#E50914] hover:bg-[#d00810] text-white"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            {!loading && <ChevronRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 1: Intent
const StepIntent = ({ formData, setFormData, darkMode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card
      onClick={() => setFormData({ ...formData, intent: 'hiring' })}
      className={`p-6 cursor-pointer transition-all ${
        formData.intent === 'hiring'
          ? darkMode ? 'bg-[#E50914]/20 border-[#E50914]/50' : 'bg-red-50 border-[#E50914]'
          : darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }`}
    >
      <Briefcase size={32} className={formData.intent === 'hiring' ? 'text-[#E50914]' : 'text-gray-400'} />
      <h3 className={`font-syne font-bold text-lg mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        I'm Hiring
      </h3>
      <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
        Post gigs and find talented people to help with projects
      </p>
      {formData.intent === 'hiring' && <Check size={20} className="text-[#E50914] mt-4" />}
    </Card>

    <Card
      onClick={() => setFormData({ ...formData, intent: 'working' })}
      className={`p-6 cursor-pointer transition-all ${
        formData.intent === 'working'
          ? darkMode ? 'bg-[#E50914]/20 border-[#E50914]/50' : 'bg-red-50 border-[#E50914]'
          : darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }`}
    >
      <Search size={32} className={formData.intent === 'working' ? 'text-[#E50914]' : 'text-gray-400'} />
      <h3 className={`font-syne font-bold text-lg mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        I'm Looking for Work
      </h3>
      <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
        Find and apply for gigs that match your skills
      </p>
      {formData.intent === 'working' && <Check size={20} className="text-[#E50914] mt-4" />}
    </Card>
  </div>
);

// Step 2: Basic Info
const StepBasicInfo = ({ formData, setFormData, darkMode }) => (
  <div className="space-y-4">
    <div>
      <label className={`block text-sm font-syne font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Full Name
      </label>
      <Input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Your name"
        className={darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-50'}
      />
    </div>

    <div>
      <label className={`block text-sm font-syne font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Skills (add up to 5)
      </label>
      <div className="flex gap-2 mb-3">
        <Input
          value={formData.skills.join(", ")}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
          placeholder="e.g., Electrical, Plumbing, React"
          className={darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-50'}
        />
      </div>
      {formData.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>

    <div>
      <label className={`block text-sm font-syne font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Location
      </label>
      <Input
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="City, State"
        className={darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-50'}
      />
    </div>
  </div>
);

// Step 3: Social Connect
const StepSocialConnect = ({ darkMode }) => (
  <Card className={`p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
    <h3 className={`font-syne font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      Connect your platforms
    </h3>
    <p className={`text-sm mb-6 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
      Link LinkedIn, GitHub, portfolio, or other platforms to showcase your work. You can do this now or skip for later.
    </p>
    <Button
      onClick={() => window.location.href = '/app/connect-social'}
      className="w-full bg-[#E50914] hover:bg-[#d00810] text-white"
    >
      Connect Accounts
    </Button>
  </Card>
);

// Step 4: Skill Challenge
const StepSkillChallenge = ({ formData, setFormData, darkMode }) => (
  <Card className={`p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-start gap-4 mb-4">
      <Zap size={24} className="text-[#E50914]" />
      <div>
        <h3 className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Earn a Verified Badge
        </h3>
        <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Complete a quick task to prove your skills and get the blue verified badge
        </p>
      </div>
    </div>
    
    <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
      <p className={`text-sm font-mono ${darkMode ? 'text-white/80' : 'text-gray-800'}`}>
        We'll send you a small task related to your skills. Complete it quickly to get verified in 2-3 hours.
      </p>
    </div>

    <Button
      onClick={() => setFormData({ ...formData, completedChallenge: !formData.completedChallenge })}
      className={`w-full ${
        formData.completedChallenge
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-[#E50914] hover:bg-[#d00810] text-white'
      }`}
    >
      {formData.completedChallenge ? '✓ Challenge Complete' : 'Start Challenge'}
    </Button>
  </Card>
);

// Step 5: Video Intro
const StepVideoIntro = ({ formData, setFormData, darkMode }) => (
  <Card className={`p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-start gap-4 mb-4">
      <Video size={24} className="text-[#E50914]" />
      <div>
        <h3 className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Record a 60-Second Intro
        </h3>
        <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Send a WhatsApp voice/video message introducing yourself
        </p>
      </div>
    </div>

    <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
      <p className={`text-sm font-mono ${darkMode ? 'text-white/80' : 'text-gray-800'}`}>
        "Hi, I'm [name]. I specialize in [skills]. I'm excited to help with projects in [location]."
      </p>
    </div>

    <Button
      onClick={() => {
        setFormData({ ...formData, recordedIntro: true });
        window.open('https://wa.me/12134147369?text=Here%20is%20my%20intro', '_blank');
      }}
      className={`w-full ${
        formData.recordedIntro
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-[#E50914] hover:bg-[#d00810] text-white'
      }`}
    >
      {formData.recordedIntro ? '✓ Intro Sent' : 'Send on WhatsApp'}
    </Button>
  </Card>
);

// Step 6: Calendar
const StepCalendar = ({ formData, setFormData, darkMode }) => (
  <Card className={`p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-start gap-4 mb-4">
      <Calendar size={24} className="text-[#E50914]" />
      <div>
        <h3 className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Connect Your Calendar
        </h3>
        <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Let hirers see when you're available for gigs
        </p>
      </div>
    </div>

    <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
      <p className={`text-sm font-mono ${darkMode ? 'text-white/80' : 'text-gray-800'}`}>
        We'll sync your Google Calendar so hirers know your availability instantly.
      </p>
    </div>

    <Button
      onClick={() => {
        setFormData({ ...formData, calendarConnected: true });
        window.location.href = `${API}/oauth/google-calendar/authorize`;
      }}
      className={`w-full ${
        formData.calendarConnected
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-[#E50914] hover:bg-[#d00810] text-white'
      }`}
    >
      {formData.calendarConnected ? '✓ Calendar Connected' : 'Connect Google Calendar'}
    </Button>
  </Card>
);

export default OnboardingFlow;
