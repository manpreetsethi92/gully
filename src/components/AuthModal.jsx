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
import { ArrowLeft, MessageCircle, Check, Instagram, Linkedin, ChevronDown, Search, Mail } from "lucide-react";

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

// Country dropdown rendered via portal to escape Dialog
const CountryDropdown = ({ isOpen, onClose, onSelect, buttonRef, searchValue, onSearchChange, filteredCountries, selectedCode }) => {
  console.log("CountryDropdown render, isOpen:", isOpen);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!isOpen || !buttonRef?.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 280)
      });
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

  return createPortal(
    <div
      className="fixed inset-0 z-[99999]"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="absolute bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          maxHeight: '320px'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
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
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Country list */}
        <div className="overflow-y-auto" style={{ maxHeight: '260px' }}>
          {filteredCountries.map((country, idx) => (
            <div
              key={`${country.code}-${country.country}-${idx}`}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onSelect(country.code);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="text-lg">{country.flag}</span>
              <span className="flex-1 text-sm text-gray-700">{country.country}</span>
              <span className="text-sm text-gray-500 font-medium">{country.code}</span>
              {country.code === selectedCode && (
                <Check size={14} className="text-red-500" />
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
 */
const AuthModal = ({ isOpen, onClose, mode = "signup" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const phoneInputRef = useRef(null);
  const countryButtonRef = useRef(null);

  // Internal mode (can override prop for switching)
  const [internalMode, setInternalMode] = useState(mode);

  // Common state
  const [step, setStep] = useState(mode === "signin" ? "phone" : "form");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Signup form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // OTP state (for signin)
  const [otp, setOtp] = useState("");

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Phone check state
  const [phoneExists, setPhoneExists] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);

  // Reset when mode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setInternalMode(mode);
      setStep(mode === "signin" ? "phone" : "form");
      setShowSuccess(false);
      setOtp("");
      setPhoneExists(false);
      setShowCountryDropdown(false);
    }
  }, [isOpen, mode]);

  // Check phone when user types 10 digits (signup mode only)
  useEffect(() => {
    const cleaned = phone.replace(/\D/g, '');
    if (internalMode === "signup" && cleaned.length >= 10) {
      const checkPhone = async () => {
        setPhoneChecking(true);
        try {
          const fullPhone = `${countryCode}${cleaned}`;
          const response = await axios.get(`${API}/auth/check-phone?phone=${encodeURIComponent(fullPhone)}`);
          setPhoneExists(response.data.exists);
        } catch (error) {
          console.error("Phone check error:", error);
          setPhoneExists(false);
        } finally {
          setPhoneChecking(false);
        }
      };
      checkPhone();
    } else {
      setPhoneExists(false);
    }
  }, [phone, countryCode, internalMode]);

  const resetAndClose = () => {
    setInternalMode(mode);
    setStep(mode === "signin" ? "phone" : "form");
    setPhone("");
    setCountryCode("+1");
    setOtp("");
    setName("");
    setEmail("");
    setLocation("");
    setInstagram("");
    setLinkedin("");
    setShowSuccess(false);
    setShowCountryDropdown(false);
    setCountrySearch("");
    setPhoneExists(false);
    onClose();
  };

  const switchToSignin = () => {
    setPhoneExists(false);
    setInternalMode("signin");
    setStep("phone");
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
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  const hasSocialLink = () => {
    return instagram.trim() !== "" || linkedin.trim() !== "";
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ========== SIGNUP FLOW ==========
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (phoneExists) {
      toast.error("This phone number is already registered. Please sign in instead.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!email.trim() || !isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address");
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
        email: email.trim(),
        location: location.trim(),
        instagram: instagram.trim() || null,
        linkedin: linkedin.trim() || null
      });

      if (response.data.success) {
        setShowSuccess(true);
        toast.success("Welcome to Titlii!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const detail = error.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  // ========== SIGNIN FLOW ==========
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

  // Country code button component
  const CountryCodeButton = ({ btnRef }) => (
    <button
      ref={btnRef}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowCountryDropdown(!showCountryDropdown);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowCountryDropdown(prev => !prev);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="flex items-center gap-1 px-3 h-11 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-[90px]"
    >
      <span className="text-lg">{getSelectedCountry().flag}</span>
      <span className="text-sm font-medium">{countryCode}</span>
      <ChevronDown size={14} className="text-gray-400" />
    </button>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()} modal={false}>
        {/* Custom backdrop with pointer-events handling */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-50"
            style={{ pointerEvents: showCountryDropdown ? 'none' : 'auto' }}
            onClick={() => !showCountryDropdown && resetAndClose()}
            onTouchStart={(e) => {
              if (showCountryDropdown) e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              if (showCountryDropdown) {
                e.stopPropagation();
                e.preventDefault();
              } else {
                resetAndClose();
              }
            }}
          />
        )}

        <DialogContent
          className="sm:max-w-md p-0 gap-0 overflow-hidden z-50"
          onPointerDownOutside={(e) => {
            if (showCountryDropdown) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (showCountryDropdown) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (showCountryDropdown) {
              e.preventDefault();
              setShowCountryDropdown(false);
            }
          }}
        >
          <div className="p-8">
            {/* Success Screen */}
            {showSuccess && internalMode === "signup" ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                <p className="text-gray-500 mb-6">
                  Now text Taj on WhatsApp to find who you need!
                </p>
                <a
                  href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20just%20signed%20up"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => resetAndClose()}
                  className="block w-full h-12 rounded-full text-white font-semibold flex items-center justify-center gap-2"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle size={20} />
                  Text Taj now
                </a>
              </div>
            ) : internalMode === "signup" ? (
              /* ========== SIGNUP MODE ========== */
              <div>
                <h2 className="text-xl font-bold mb-1">Join Titlii</h2>
                <p className="text-gray-500 text-sm mb-6">Tell us a bit about yourself</p>

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
                      <CountryCodeButton btnRef={countryButtonRef} />
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
                    {phoneExists && (
                      <p className="text-sm text-amber-600 mt-2">
                        This number is already registered.{" "}
                        <button
                          type="button"
                          onClick={switchToSignin}
                          className="text-[#E50914] font-medium hover:underline"
                        >
                          Sign in instead?
              </button>
                      </p>
                    )}
                    {phoneChecking && (
                      <p className="text-xs text-gray-400 mt-1">Checking...</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">EMAIL</Label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="h-11 pl-10"
                        autoComplete="email"
                      />
                    </div>
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
                    className="w-full h-11 rounded-full text-white font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#E50914' }}
                    disabled={loading || phoneExists}
                  >
                      {loading ? <div className="spinner mx-auto" /> : "Continue"}
                    </button>
                  </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            ) : step === "phone" ? (
              /* ========== SIGNIN - PHONE STEP ========== */
              <div>
                <h2 className="text-xl font-bold mb-1">Welcome back</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your phone number to sign in via WhatsApp</p>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">PHONE NUMBER</Label>
                    <div className="flex gap-2">
                      <CountryCodeButton btnRef={countryButtonRef} />
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
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-full text-white font-semibold transition-opacity"
                    style={{ background: '#E50914' }}
                    disabled={loading}
                  >
                    {loading ? <div className="spinner mx-auto" /> : "Send Code"}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <button
                      onClick={() => {
                        setInternalMode("signup");
                        setStep("form");
                      }}
                      className="text-[#E50914] font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* ========== SIGNIN - OTP STEP ========== */
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

      {/* Country dropdown portal - OUTSIDE Dialog */}
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
    </>
  );
};

export default AuthModal;
