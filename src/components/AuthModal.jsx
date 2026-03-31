import { useState, useEffect, useRef, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useAuth, API } from "../App";
import { ArrowLeft, MessageCircle, Check, ChevronDown, Search, Mail } from "lucide-react";

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

// Debounce utility with cleanup support
const createDebounce = () => {
  let timeout;
  const debounced = (func, wait) => (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  const cancel = () => clearTimeout(timeout);
  return { debounced, cancel };
};

// Country dropdown rendered via portal to escape Dialog
const CountryDropdown = forwardRef(({ isOpen, onClose, onSelect, buttonRef, searchValue, onSearchChange, filteredCountries, selectedCode }, ref) => {
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
      ref={ref}
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
});

/**
 * AuthModal - WhatsApp-first authentication
 */
const AuthModal = ({ isOpen, onClose, mode = "signup" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const phoneInputRef = useRef(null);
  const countryButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [whatsappAlertsOptIn, setWhatsappAlertsOptIn] = useState(true);
  const [location, setLocation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  // OTP state (for signin)
  const [otp, setOtp] = useState("");

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingAuthData, setPendingAuthData] = useState(null);

  // Phone check state
  const [phoneExists, setPhoneExists] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);

  // Initialize debounce helper
  useEffect(() => {
    debounceRef.current = createDebounce();
    return () => {
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
    };
  }, []);

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

  // Phone check function
  const checkPhone = useCallback(async (fullPhone) => {
    try {
      const response = await axios.get(`${API}/auth/check-phone?phone=${encodeURIComponent(fullPhone)}`);
      setPhoneExists(response.data.exists);
    } catch (error) {
      setPhoneExists(false);
    } finally {
      setPhoneChecking(false);
    }
  }, []);

  // Check phone when user types 10 digits (signup mode only)
  useEffect(() => {
    const cleaned = phone.replace(/\D/g, '');
    if (internalMode === "signup" && cleaned.length >= 10) {
      setPhoneChecking(true);
      const fullPhone = `${countryCode}${cleaned}`;
      // Use debounced function with proper cleanup
      const debouncedCheck = debounceRef.current?.debounced(checkPhone, 500);
      if (debouncedCheck) {
        debouncedCheck(fullPhone);
      }
    } else {
      setPhoneExists(false);
    }
  }, [phone, countryCode, internalMode, checkPhone]);

  const resetAndClose = () => {
    setInternalMode(mode);
    setStep(mode === "signin" ? "phone" : "form");
    setPhone("");
    setCountryCode("+1");
    setOtp("");
    setName("");
    setEmail("");
    setLocation("");
    setLinkedinUrl("");
    setInstagramUrl("");
    setAgreedToTerms(false);
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

    // Require at least one social media URL (LinkedIn OR Instagram)
    if (!linkedinUrl.trim() && !instagramUrl.trim()) {
      toast.error("Please enter at least one social media URL (LinkedIn or Instagram)");
      return;
    }

    setLoading(true);
    try {
      const fullPhone = getFullPhoneNumber();

      // Build lightweight device fingerprint from stable browser signals
      let deviceFingerprint = null;
      try {
        const fpRaw = [
          navigator.userAgent,
          navigator.language,
          window.screen.width + "x" + window.screen.height,
          window.screen.colorDepth,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          navigator.hardwareConcurrency || "",
        ].join("|");
        // Hash it so we never store raw UA strings
        const fpArray = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fpRaw));
        deviceFingerprint = Array.from(new Uint8Array(fpArray)).map(b => b.toString(16).padStart(2,"0")).join("");
      } catch (cryptoError) {
        // Safari/older browsers might block crypto.subtle - use fallback
        console.warn("Crypto fingerprint failed, using fallback:", cryptoError);
        const fpRaw = [
          navigator.userAgent,
          navigator.language,
          window.screen.width + "x" + window.screen.height,
          window.screen.colorDepth,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          navigator.hardwareConcurrency || "",
        ].join("|");
        // Simple hash fallback for Safari
        let hash = 0;
        for (let i = 0; i < fpRaw.length; i++) {
          const char = fpRaw.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        deviceFingerprint = "safari_" + Math.abs(hash).toString(16);
      }

      // Pick up referral code if user landed via a referral link
      const refCode = localStorage.getItem("gully_ref") || undefined;

      const response = await axios.post(`${API}/auth/signup-and-call`, {
        name: name.trim(),
        phone: fullPhone,
        email: email.trim(),
        location: location.trim(),
        linkedin: linkedinUrl.trim(),
        instagram: instagramUrl.trim() || undefined,
        device_fingerprint: deviceFingerprint,
        whatsapp_alerts_opt_in: whatsappAlertsOptIn,
        ...(refCode && { ref_code: refCode })
      });

      if (response.data.success) {
        // Store token/user in state - don't call login() yet to prevent auto-navigation
        setPendingAuthData({
          token: response.data.token,
          user: response.data.user
        });

        // Clear referral code after successful signup so it isn't reused
        localStorage.removeItem("gully_ref");

        setShowSuccess(true);
        toast.success("Welcome to Gully!");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("An account already exists from this device. Please sign in instead.");
        setInternalMode("signin");
        setStep("phone");
      } else if (error.response?.status === 400 && error.response?.data?.detail?.includes("already registered")) {
        toast.error("This phone number is already registered. Please sign in instead.");
        setInternalMode("signin");
        setStep("phone");
      } else {
        const detail = error.response?.data?.detail || "Something went wrong. Please try again.";
        toast.error(detail);
      }
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
      toast.success("Code sent via SMS!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("No account found with this phone number. Please sign up first.");
        // Switch to signup mode
        setInternalMode("signup");
        setStep("form");
      } else if (error.response?.status === 429) {
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

      // Call login with token and user data
      login(response.data.token, response.data.user);

      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100));

      onClose();

      // Navigate to dashboard (route is /app/* in App.js)
      setTimeout(() => {
        navigate("/app", { replace: true });
      }, 200);
      
      if (response.data.profile_completed) {
          toast.success("Welcome back!");
        } else {
        toast.info("Welcome! Let's complete your profile.");
      }
    } catch (error) {
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
      <Dialog
        open={isOpen}
        modal={false}
        onOpenChange={(open) => {
          if (!open && showCountryDropdown) return;
          if (!open) resetAndClose();
        }}
      >
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
            if (
              showCountryDropdown ||
              dropdownRef.current?.contains(e.target) ||
              countryButtonRef.current?.contains(e.target)
            ) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (
              showCountryDropdown ||
              dropdownRef.current?.contains(e.target) ||
              countryButtonRef.current?.contains(e.target)
            ) {
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
          <div className="p-8">
            {/* Success Screen */}
            {showSuccess && internalMode === "signup" ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">You're in! 🦋</h2>
                <p className="text-gray-500 mb-6">
                  Now say hi to <strong>Taj</strong> on WhatsApp to start getting matched with the right people!
                </p>
                <a
                  href={`https://wa.me/12134147369?text=${encodeURIComponent("Hey Taj! Just signed up 🦋")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Login user with pending auth data
                    if (pendingAuthData) {
                      login(pendingAuthData.token, pendingAuthData.user);
                      setPendingAuthData(null);
                    }
                    // Navigate to dashboard with flag to show Connect Socials modal
                    onClose();
                    navigate('/app', { state: { showConnectSocials: true } });
                  }}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-full text-white font-semibold"
                  style={{ background: '#25D366' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Text Taj on WhatsApp
                </a>
              </div>
            ) : internalMode === "signup" ? (
              /* ========== SIGNUP MODE ========== */
              <div>
                <h2 className="text-xl font-bold mb-1">Join <span className="font-syne text-[#E50914]">gully</span></h2>
                <p className="text-gray-500 text-sm mb-6">Tell us a bit about yourself</p>

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">YOUR NAME</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
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
                        placeholder="(000) 000-0000"
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
                        placeholder="johndoe@company.com"
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

                  {/* LinkedIn URL */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">
                      LINKEDIN URL {!instagramUrl.trim() && <span className="text-[#E50914]">*</span>}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded" style={{ background: '#0077b5' }}>
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      <Input
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="linkedin.com/in/yourprofile"
                        className="h-11 pl-11"
                      />
                    </div>
                  </div>

                  {/* Instagram URL */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">
                      INSTAGRAM URL {!linkedinUrl.trim() && <span className="text-[#E50914]">*</span>}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded" style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <Input
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="instagram.com/yourhandle"
                        className="h-11 pl-11"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">At least one social URL required (LinkedIn or Instagram)</p>
                  </div>

                  <label className="flex items-start gap-3 mt-5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#E50914] focus:ring-[#E50914] accent-[#E50914]"
                    />
                    <span className="text-xs text-gray-500">
                      I agree to the{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#E50914] hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#E50914] hover:underline">Privacy Policy</a>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 mt-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={whatsappAlertsOptIn}
                      onChange={(e) => setWhatsappAlertsOptIn(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#E50914] focus:ring-[#E50914] accent-[#E50914]"
                    />
                    <span className="text-xs text-gray-500">
                      Send me gig alerts on WhatsApp 🔔
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-full text-white font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#E50914' }}
                    disabled={loading || phoneExists || !agreedToTerms}
                  >
                    {loading ? <div className="spinner mx-auto" /> : "Continue"}
                  </button>
                </form>
              </div>
            ) : step === "phone" ? (
              /* ========== SIGNIN - PHONE STEP ========== */
              <div>
                <h2 className="text-xl font-bold mb-1">Welcome back</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your phone number to sign in</p>

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
                        placeholder="(000) 000-0000"
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
                  We sent a code via SMS to {getFullPhoneNumber()}
                </p>

                <div className="p-3 rounded-lg mb-4 text-xs flex items-center gap-2" style={{ background: '#dcfce7' }}>
                  <MessageCircle size={14} className="text-green-600" />
                  <span className="text-green-700">Check your text messages for the code</span>
                  </div>
                  
                <div className="flex justify-center mb-6">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <InputOTPSlot key={i} index={i} className="w-10 h-12 text-lg" />
                      ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleVerifyOTP();
                  }}
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
        ref={dropdownRef}
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
