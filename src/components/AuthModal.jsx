import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useAuth, API } from "../App";
import { ArrowLeft, Phone, Shield, Check, Instagram, Linkedin, X, MessageCircle, ChevronDown, Search } from "lucide-react";
import { sendOTP, verifyOTP, clearRecaptcha } from "../firebase";

const SKILL_CATEGORIES = {
  creative: ["Photography", "Videography", "Graphic Design", "Music Production", "Writing", "Fashion Design", "Makeup Artistry"],
  tech: ["Software Development", "Data Science", "UI/UX Design", "AI/ML", "Mobile Development"],
  business: ["Marketing", "Sales", "Finance", "Consulting", "Project Management", "Business Development"],
  other: ["Fitness Training", "Life Coaching", "Event Planning", "Teaching", "Public Speaking"]
};

const COUNTRY_CODES = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" }
];

const TELEGRAM_BOT_URL = "https://t.me/titliworkBot?start=welcome";

// Country dropdown component rendered via portal
const CountryDropdown = ({ isOpen, onClose, onSelect, buttonRef, searchValue, onSearchChange, filteredCountries, selectedCode }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (!isOpen || !buttonRef?.current) return;
    
    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const mobile = viewportWidth < 640;
      setIsMobile(mobile);
      
      if (mobile) {
        setPosition({
          top: 0,
          left: 0,
          width: viewportWidth
        });
      } else {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 320;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        let top;
        if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
          top = rect.bottom + 4;
        } else {
          top = rect.top - dropdownHeight - 4;
        }
        
        let left = rect.left;
        const dropdownWidth = Math.min(Math.max(rect.width, 280), 400);
        if (left + dropdownWidth > viewportWidth - 16) {
          left = viewportWidth - dropdownWidth - 16;
        }
        
        setPosition({
          top: Math.max(8, top),
          left: Math.max(8, left),
          width: dropdownWidth
        });
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, buttonRef]);
  
  if (!isOpen) return null;
  
  const mobileStyles = isMobile ? {
    maxHeight: '50vh',
    borderRadius: '0 0 16px 16px',
    borderTop: 'none'
  } : {};
  
  return createPortal(
    <div
      className="fixed inset-0 z-[99999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="absolute bg-white border border-gray-200 shadow-2xl overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          maxHeight: isMobile ? '50vh' : '320px',
          borderRadius: isMobile ? '0 0 16px 16px' : '12px',
          ...mobileStyles
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300"
              style={{ height: isMobile ? '40px' : '36px', fontSize: isMobile ? '16px' : '14px' }}
              autoFocus={!isMobile}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        
        {/* Country list */}
        <div className="overflow-y-auto" style={{ maxHeight: isMobile ? 'calc(50vh - 60px)' : '260px' }}>
          {filteredCountries.map((country, idx) => (
            <div
              key={`${country.code}-${country.country}-${idx}`}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ padding: isMobile ? '14px 16px' : '10px 12px' }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onSelect(country.code);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                onSelect(country.code);
              }}
            >
              <span style={{ fontSize: isMobile ? '22px' : '20px' }}>{country.flag}</span>
              <span className="flex-1 text-gray-700" style={{ fontSize: isMobile ? '15px' : '14px' }}>{country.country}</span>
              <span className="text-gray-500 font-medium" style={{ fontSize: isMobile ? '15px' : '14px' }}>{country.code}</span>
              {country.code === selectedCode && (
                <Check size={16} className="text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const phoneInputRef = useRef(null);
  
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState("creative");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "", linkedin: "", twitter: "", imdb: ""
  });
  
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, []);

  const resetAndClose = () => {
    setStep("phone");
    setPhone("");
    setCountryCode("+1");
    setOtp("");
    setName("");
    setAge("");
    setBio("");
    setSelectedSkills([]);
    setSocialLinks({ instagram: "", linkedin: "", twitter: "", imdb: "" });
    setShowSuccess(false);
    setConfirmationResult(null);
    setShowCountryDropdown(false);
    setCountrySearch("");
    clearRecaptcha();
    onClose();
  };

  const getFullPhoneNumber = () => {
    const cleaned = phone.replace(/\D/g, '');
    return `${countryCode}${cleaned}`;
  };

  const getSelectedCountry = () => {
    return COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];
  };

  const filteredCountries = COUNTRY_CODES.filter(c => 
    !countrySearch || 
    c.country.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.includes(countrySearch)
  );

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    try {
      const fullPhone = getFullPhoneNumber();
      const result = await sendOTP(fullPhone);
      setConfirmationResult(result);
      setStep("otp");
      toast.success("OTP sent to your phone!");
    } catch (error) {
      console.error("Firebase OTP error:", error);
      clearRecaptcha();
      
      if (error.code === 'auth/invalid-phone-number') {
        toast.error("Invalid phone number. Please check and try again.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many attempts. Try again later.");
      } else if (error.code === 'auth/invalid-app-credential') {
        toast.error("Authentication error. Please refresh the page and try again.");
      } else if (error.code === 'auth/captcha-check-failed') {
        toast.error("reCAPTCHA verification failed. Please try again.");
      } else {
        toast.error(error.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete OTP");
      return;
    }
    
    if (!confirmationResult) {
      toast.error("Please request a new OTP");
      setStep("phone");
      return;
    }
    
    setLoading(true);
    try {
      await verifyOTP(confirmationResult, otp);
      const fullPhone = getFullPhoneNumber();
      
      try {
        const response = await axios.post(`${API}/auth/verify-otp`, { 
          phone: fullPhone, 
          otp: otp
        });
        
        if (!response.data.is_new_user && response.data.user.profile_completed) {
          login(response.data.token, response.data.user);
          resetAndClose();
          navigate("/app");
          toast.success("Welcome back!");
        } else {
          setToken(response.data.token);
          login(response.data.token, response.data.user);
          setName(response.data.user.name || "");
          setAge(response.data.user.age?.toString() || "");
          setStep("profile");
        }
      } catch (backendError) {
        console.error("Backend verify-otp error:", backendError);
        const errorDetail = backendError.response?.data?.detail || "";
        if (errorDetail.includes("Instagram or LinkedIn") || backendError.response?.status === 400) {
          setStep("profile");
        } else {
          toast.error(errorDetail || "Failed to verify. Please try again.");
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.code === 'auth/invalid-verification-code') {
        toast.error("Invalid OTP. Please try again.");
      } else if (error.code === 'auth/code-expired') {
        toast.error("OTP expired. Request a new one.");
        setStep("phone");
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      toast.error("Maximum 5 skills");
    }
  };

  const hasSocialLink = () => {
    return socialLinks.instagram.trim() !== "" || socialLinks.linkedin.trim() !== "";
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!age || parseInt(age) < 13) { toast.error("Please enter a valid age"); return; }
    
    if (!hasSocialLink()) { 
      toast.error("Please add your Instagram or LinkedIn to verify your profile"); 
      return; 
    }
    
    if (!bio.trim()) { toast.error("Please add a short bio"); return; }
    if (selectedSkills.length === 0) { toast.error("Select at least one skill"); return; }

    setLoading(true);
    try {
      let authToken = token;
      const fullPhone = getFullPhoneNumber();
      
      if (!authToken) {
        const authResponse = await axios.post(`${API}/auth/verify-otp`, { 
          phone: fullPhone, 
          otp: otp,
          name: name.trim(), 
          age: parseInt(age),
          instagram: socialLinks.instagram.trim() || null,
          linkedin: socialLinks.linkedin.trim() || null
        });
        authToken = authResponse.data.token;
        login(authResponse.data.token, authResponse.data.user);
      }

      const response = await axios.put(
        `${API}/users/me`,
        { bio: bio.trim(), skills: selectedSkills, social_links: socialLinks },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      login(authToken, response.data);
      setShowSuccess(true);
    } catch (error) {
      console.error("Profile completion error:", error);
      toast.error(error.response?.data?.detail || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (code) => {
    setCountryCode(code);
    setShowCountryDropdown(false);
    setCountrySearch('');
  };

  const handleStartTexting = () => {
    window.open(TELEGRAM_BOT_URL, "_blank");
    resetAndClose();
    navigate("/app");
    toast.success("Welcome to titlii!");
  };

  return (
    <Dialog 
      open={isOpen} 
      modal={false}
      onOpenChange={(open) => {
        if (showSuccess) return;
        if (!open && showCountryDropdown) return;
        if (!open) resetAndClose();
      }}
    >
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 z-[49]"
          style={{ pointerEvents: showCountryDropdown ? 'none' : 'auto' }}
          onClick={() => {
            if (!showCountryDropdown && !showSuccess) resetAndClose();
          }}
        />,
        document.body
      )}
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden bg-white rounded-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => {
          if (showSuccess || showCountryDropdown) {
            e.preventDefault();
            return;
          }
          resetAndClose();
        }}
        onInteractOutside={(e) => {
          if (showSuccess || showCountryDropdown) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (showCountryDropdown) {
            e.preventDefault();
            setShowCountryDropdown(false);
          }
        }}
      >
        <div id="recaptcha-container"></div>
        <div className="relative">
          {!showSuccess && (
            <button onClick={resetAndClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 z-10">
              <X size={20} className="text-gray-500" />
            </button>
          )}
          
          {showSuccess ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}>
                <MessageCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're all set! 🎉</h2>
              <p className="text-gray-600 mb-4">Now let's get you connected!</p>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#E50914' }}>Here's what happens next:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><span className="font-bold text-gray-900">1.</span><span>Taj will ask a few quick questions</span></li>
                  <li className="flex items-start gap-2"><span className="font-bold text-gray-900">2.</span><span>She'll match you with the right people</span></li>
                  <li className="flex items-start gap-2"><span className="font-bold text-gray-900">3.</span><span>You'll get introduced immediately</span></li>
                </ul>
              </div>
              
              <button onClick={handleStartTexting} className="w-full h-14 rounded-full text-white font-semibold text-lg flex items-center justify-center gap-3" style={{ background: '#E50914' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Start Texting Taj
              </button>
            </div>
          ) : (
            <div className="p-8">
              {step === "phone" && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <img src="/butterfly.png" alt="Titlii" className="w-8 h-auto" />
                    <span className="font-syne font-bold text-3xl" style={{ color: '#E50914' }}>titlii</span>
                  </div>
                  <h2 className="text-xl font-bold mb-1 mt-6">Get started</h2>
                  <p className="text-gray-500 text-sm mb-6">Enter your phone number to continue</p>
                  
                  <form onSubmit={handleSendOTP}>
                    <div className="mb-4">
                      <Label className="text-xs font-medium text-gray-500 mb-1 block">PHONE NUMBER</Label>
                      
                      <div 
                        ref={phoneInputRef}
                        className="flex h-11 border border-gray-300 rounded-lg overflow-hidden bg-white"
                      >
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowCountryDropdown(!showCountryDropdown); }}
                          className="flex items-center gap-1 px-3 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 shrink-0"
                        >
                          <span className="text-base">{getSelectedCountry().flag}</span>
                          <span className="text-sm font-medium text-gray-700">{countryCode}</span>
                          <ChevronDown size={14} className="text-gray-400 ml-0.5" />
                        </button>
                        
                        <input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 px-3 text-sm outline-none"
                        />
                      </div>

                      <CountryDropdown
                        isOpen={showCountryDropdown}
                        onClose={() => setShowCountryDropdown(false)}
                        onSelect={handleCountrySelect}
                        buttonRef={phoneInputRef}
                        searchValue={countrySearch}
                        onSearchChange={setCountrySearch}
                        filteredCountries={filteredCountries}
                        selectedCode={countryCode}
                      />
                    </div>
                    
                    <button type="submit" className="w-full h-11 rounded-full text-white font-semibold" style={{ background: '#E50914' }} disabled={loading}>
                      {loading ? <div className="spinner mx-auto" /> : "Continue"}
                    </button>
                  </form>
                </div>
              )}

              {step === "otp" && (
                <div>
                  <button onClick={() => { setStep("phone"); setOtp(""); setConfirmationResult(null); }} className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <h2 className="text-xl font-bold mb-1">Verify your number</h2>
                  <p className="text-gray-500 text-sm mb-4">Enter the code sent to {getFullPhoneNumber()}</p>
                  
                  <div className="p-2 rounded-lg mb-4 text-xs" style={{ background: '#e0f2fe' }}>
                    <Shield size={12} className="inline mr-1" style={{ color: '#0369a1' }} />
                    <span style={{ color: '#0369a1' }}>Check your SMS for the verification code</span>
                  </div>
                  
                  <div className="flex justify-center mb-6">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        {[0,1,2,3,4,5].map(i => (
                          <InputOTPSlot key={i} index={i} className="w-10 h-12 text-lg" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                  <button onClick={handleVerifyOTP} className="w-full h-11 rounded-full text-white font-semibold" style={{ background: '#E50914' }} disabled={loading || otp.length !== 6}>
                    {loading ? <div className="spinner mx-auto" /> : "Verify"}
                  </button>
                  
                  <button onClick={() => { setStep("phone"); setOtp(""); setConfirmationResult(null); }} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">
                    Didn't receive code? Try again
                  </button>
                </div>
              )}

              {step === "profile" && (
                <div className="max-h-[70vh] overflow-y-auto -mx-8 px-8">
                  <button onClick={() => setStep("otp")} className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <h2 className="text-xl font-bold mb-1">Create your profile</h2>
                  <p className="text-gray-500 text-sm mb-4">Tell us about yourself</p>
                  
                  <form onSubmit={handleCompleteProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-500 mb-1 block">NAME</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-10" />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 mb-1 block">AGE</Label>
                        <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" min="13" className="h-10" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.05) 0%, rgba(255, 71, 87, 0.05) 100%)', border: '1px solid rgba(229, 9, 20, 0.2)' }}>
                      <Label className="text-xs font-medium mb-2 block" style={{ color: '#E50914' }}>
                        VERIFY YOUR PROFILE *
                      </Label>
                      <p className="text-xs text-gray-500 mb-3">Add at least one so others can see your work</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Instagram size={16} className="text-pink-500 flex-shrink-0" />
                          <Input 
                            value={socialLinks.instagram} 
                            onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})} 
                            placeholder="Username or link (e.g., tajsethi_)" 
                            className={`h-10 text-sm ${hasSocialLink() ? 'border-green-300' : ''}`}
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-xs text-gray-400 px-2">or</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Linkedin size={16} className="text-blue-600 flex-shrink-0" />
                          <Input 
                            value={socialLinks.linkedin} 
                            onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})} 
                            placeholder="Username or link (e.g., taj-sethi)" 
                            className={`h-10 text-sm ${hasSocialLink() ? 'border-green-300' : ''}`}
                          />
                        </div>
                      </div>
                      {hasSocialLink() && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <Check size={12} /> Profile verification ready
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500 mb-1 block">BIO</Label>
                      <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What do you do?" className="resize-none h-16 text-sm" maxLength={200} />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500 mb-1 block">SKILLS ({selectedSkills.length}/5)</Label>
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {Object.keys(SKILL_CATEGORIES).map(cat => (
                          <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={activeCategory === cat ? { background: '#E50914' } : {}}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5 p-2 border rounded-lg min-h-[80px] max-h-[120px] overflow-y-auto">
                        {SKILL_CATEGORIES[activeCategory].map(skill => (
                          <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${selectedSkills.includes(skill) ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={selectedSkills.includes(skill) ? { background: '#E50914' } : {}}>
                            {selectedSkills.includes(skill) && <Check size={10} className="inline mr-1" />}
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full h-11 rounded-full text-white font-semibold" style={{ background: '#E50914' }} disabled={loading}>
                      {loading ? <div className="spinner mx-auto" /> : "Complete Profile"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
