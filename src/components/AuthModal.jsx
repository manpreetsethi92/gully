import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useAuth, API } from "../App";
import { ArrowLeft, MessageCircle, Check, Instagram, Linkedin, ChevronDown, Search } from "lucide-react";

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

/**
 * AuthModal - WhatsApp-first authentication
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - mode: "signup" | "signin" (default: "signup")
 * 
 * Flow A (signup): Form → Success screen ("Taj will text you!")
 * Flow B (signin): Phone → OTP via WhatsApp → Dashboard
 */
const AuthModal = ({ isOpen, onClose, mode = "signup" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const phoneInputRef = useRef(null);
  const countryButtonRef = useRef(null);
  
  // Common state
  const [step, setStep] = useState(mode === "signin" ? "phone" : "form");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Signup form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  
  // OTP state (for signin)
  const [otp, setOtp] = useState("");
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset when mode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(mode === "signin" ? "phone" : "form");
      setShowSuccess(false);
      setOtp("");
    }
  }, [isOpen, mode]);

  const resetAndClose = () => {
    setStep(mode === "signin" ? "phone" : "form");
    setPhone("");
    setCountryCode("+1");
    setOtp("");
    setName("");
    setLocation("");
    setInstagram("");
    setLinkedin("");
    setShowSuccess(false);
    setShowCountryDropdown(false);
    setCountrySearch("");
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

  const handleCountrySelect = (code) => {
    setCountryCode(code);
    setShowCountryDropdown(false);
    setCountrySearch('');
    // Focus phone input after selection
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  const hasSocialLink = () => {
    return instagram.trim() !== "" || linkedin.trim() !== "";
  };

  // ========== SIGNUP FLOW (Try us now) ==========
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (!location.trim()) {
      toast.error("Please enter your location");
      return;
    }
    
    if (!hasSocialLink()) {
      toast.error("Please add your Instagram or LinkedIn");
      return;
    }
    
    setLoading(true);
    try {
      const fullPhone = getFullPhoneNumber();
      
      const response = await axios.post(`${API}/auth/signup`, {
        name: name.trim(),
        phone: fullPhone,
        location: location.trim(),
        instagram: instagram.trim() || null,
        linkedin: linkedin.trim() || null
      });
      
      if (response.data.success) {
        setShowSuccess(true);
        toast.success("Welcome to Titlii! 🦋");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const detail = error.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  // ========== SIGNIN FLOW (Sign In) ==========
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
      
      await axios.post(`${API}/auth/send-otp`, {
        phone: fullPhone
      });
      
      setStep("otp");
      toast.success("Code sent via WhatsApp!");
    } catch (error) {
      console.error("Send OTP error:", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests. Please wait a bit and try again.");
      } else {
        toast.error(error.response?.data?.detail || "Failed to send code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    
    setLoading(true);
    try {
      const fullPhone = getFullPhoneNumber();
      
      const response = await axios.post(`${API}/auth/verify-otp`, {
        phone: fullPhone,
        otp: otp
      });
      
      login(response.data.token, response.data.user);
      
      if (response.data.profile_completed) {
        toast.success("Welcome back!");
        onClose();
        setTimeout(() => {
          navigate("/app", { replace: true });
        }, 100);
      } else {
        // Profile not complete - they should have gone through signup flow
        toast.info("Welcome! Let's complete your profile.");
        onClose();
        setTimeout(() => {
          navigate("/app", { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(error.response?.data?.detail || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Phone input component (shared between flows)
  const PhoneInput = ({ onSubmit, buttonText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label className="text-xs font-medium text-gray-500 mb-1 block">PHONE NUMBER</Label>
        <div className="flex gap-2">
          {/* Country Code Selector */}
          <button
            ref={countryButtonRef}
            type="button"
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="flex items-center gap-1 px-3 h-11 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-[90px]"
          >
            <span className="text-lg">{getSelectedCountry().flag}</span>
            <span className="text-sm font-medium">{countryCode}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          
          {/* Phone Input */}
          <Input
            ref={phoneInputRef}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="flex-1 h-11"
            autoComplete="tel"
          />
        </div>
        
        <CountryDropdown
          isOpen={showCountryDropdown}
          onClose={() => { setShowCountryDropdown(false); setCountrySearch(''); }}
          onSelect={handleCountrySelect}
          buttonRef={countryButtonRef}
          searchValue={countrySearch}
          onSearchChange={setCountrySearch}
          filteredCountries={filteredCountries}
          selectedCode={countryCode}
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full h-11 rounded-full text-white font-semibold transition-opacity" 
        style={{ background: '#E50914' }} 
        disabled={loading}
      >
        {loading ? <div className="spinner mx-auto" /> : buttonText}
      </button>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="p-8">
          {/* Success Screen (after signup) */}
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're all set! 🦋</h2>
              <p className="text-gray-500 mb-6">
                Now text Taj on WhatsApp to find who you need!
              </p>
              <a
                href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20just%20signed%20up"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-12 rounded-full text-white font-semibold flex items-center justify-center gap-2 mb-4"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={20} />
                Text Taj now 🦋
              </a>
              <button
                onClick={resetAndClose}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </button>
            </div>
          ) : mode === "signup" ? (
            /* ========== SIGNUP MODE (Try us now) ========== */
            <div>
              <h2 className="text-xl font-bold mb-1">Join Titlii</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us a bit about yourself. Taj will call you to learn more!</p>
              
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <Label className="text-xs font-medium text-gray-500 mb-1 block">YOUR NAME</Label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="What should Taj call you?" 
                    className="h-11" 
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <Label className="text-xs font-medium text-gray-500 mb-1 block">WHATSAPP NUMBER</Label>
                  <div className="flex gap-2">
                    <button
                      ref={countryButtonRef}
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-1 px-3 h-11 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-[90px]"
                    >
                      <span className="text-lg">{getSelectedCountry().flag}</span>
                      <span className="text-sm font-medium">{countryCode}</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    <Input
                      ref={phoneInputRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="flex-1 h-11"
                      autoComplete="tel"
                    />
                  </div>
                  <CountryDropdown
                    isOpen={showCountryDropdown}
                    onClose={() => { setShowCountryDropdown(false); setCountrySearch(''); }}
                    onSelect={handleCountrySelect}
                    buttonRef={countryButtonRef}
                    searchValue={countrySearch}
                    onSearchChange={setCountrySearch}
                    filteredCountries={filteredCountries}
                    selectedCode={countryCode}
                  />
                </div>
                
                {/* Location */}
                <div>
                  <Label className="text-xs font-medium text-gray-500 mb-1 block">LOCATION</Label>
                  <Input 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="City, State (e.g., Dallas, TX)" 
                    className="h-11" 
                  />
                </div>
                
                {/* Social Links */}
                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.05) 0%, rgba(255, 71, 87, 0.05) 100%)', border: '1px solid rgba(229, 9, 20, 0.2)' }}>
                  <Label className="text-xs font-medium mb-2 block" style={{ color: '#E50914' }}>
                    VERIFY YOUR PROFILE
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">Add at least one social link so we can verify you're real</p>
                  
                  {/* Instagram */}
                  <div className="flex items-center gap-2 mb-3">
                    <Instagram size={16} className="text-pink-500 flex-shrink-0" />
                    <Input 
                      value={instagram} 
                      onChange={(e) => setInstagram(e.target.value)} 
                      placeholder="Instagram username" 
                      className={`h-10 text-sm ${instagram.trim() ? 'border-green-300' : ''}`}
                    />
                  </div>
                  
                  {/* LinkedIn */}
                  <div className="flex items-center gap-2">
                    <Linkedin size={16} className="text-blue-600 flex-shrink-0" />
                    <Input 
                      value={linkedin} 
                      onChange={(e) => setLinkedin(e.target.value)} 
                      placeholder="LinkedIn URL or username" 
                      className={`h-10 text-sm ${linkedin.trim() ? 'border-green-300' : ''}`}
                    />
                  </div>
                  
                  {hasSocialLink() && (
                    <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                      <Check size={12} /> Ready to verify
                    </p>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="w-full h-11 rounded-full text-white font-semibold transition-opacity" 
                  style={{ background: '#E50914' }} 
                  disabled={loading}
                >
                  {loading ? <div className="spinner mx-auto" /> : "Continue"}
                </button>
              </form>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          ) : step === "phone" ? (
            /* ========== SIGNIN MODE - PHONE STEP ========== */
            <div>
              <h2 className="text-xl font-bold mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm mb-6">Enter your phone number to sign in via WhatsApp</p>
              
              <PhoneInput onSubmit={handleSendOTP} buttonText="Send Code" />
              
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => resetAndClose()} 
                    className="text-[#E50914] font-medium hover:underline"
                  >
                    Try us now
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* ========== SIGNIN MODE - OTP STEP ========== */
            <div>
              <button 
                onClick={() => { setStep("phone"); setOtp(""); }} 
                className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700"
              >
                <ArrowLeft size={16} /> Back
              </button>
              
              <h2 className="text-xl font-bold mb-1">Enter verification code</h2>
              <p className="text-gray-500 text-sm mb-4">
                We sent a code to your WhatsApp at {getFullPhoneNumber()}
              </p>
              
              <div className="p-3 rounded-lg mb-4 text-xs flex items-center gap-2" style={{ background: '#dcfce7' }}>
                <MessageCircle size={14} className="text-green-600" />
                <span className="text-green-700">Check your WhatsApp for the code</span>
              </div>
              
              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <InputOTPSlot key={i} index={i} className="w-10 h-12 text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <button 
                onClick={handleVerifyOTP} 
                className="w-full h-11 rounded-full text-white font-semibold transition-opacity" 
                style={{ background: '#E50914' }} 
                disabled={loading || otp.length !== 6}
              >
                {loading ? <div className="spinner mx-auto" /> : "Verify"}
              </button>
              
              <button 
                onClick={() => { setStep("phone"); setOtp(""); }} 
                className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
              >
                Didn't receive code? Try again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
