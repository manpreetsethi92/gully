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
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+387", country: "Bosnia", flag: "🇧🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+242", country: "Congo", flag: "🇨🇬" },
  { code: "+243", country: "Congo DR", flag: "🇨🇩" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+1876", country: "Jamaica", flag: "🇯🇲" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+853", country: "Macau", flag: "🇲🇴" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+850", country: "North Korea", flag: "🇰🇵" },
  { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+1787", country: "Puerto Rico", flag: "🇵🇷" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+670", country: "Timor-Leste", flag: "🇹🇱" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+1868", country: "Trinidad", flag: "🇹🇹" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+379", country: "Vatican City", flag: "🇻🇦" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
];

const TELEGRAM_BOT_URL = "https://t.me/titliworkBot?start=welcome";

// Portal dropdown component
const CountryDropdown = ({ isOpen, onClose, onSelect, buttonRef, searchValue, onSearchChange, filteredCountries, selectedCode }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  
  // Calculate position
  useEffect(() => {
    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const mobile = viewportWidth < 640;
      setIsMobile(mobile);
      
      if (mobile) {
        // Mobile: full width at top of screen
        setPosition({
          top: 0,
          left: 0,
          width: viewportWidth
        });
      } else if (isOpen && buttonRef.current) {
        // Desktop: below the input
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        let dropdownWidth = rect.width;
        const minWidth = 280;
        const maxWidth = Math.min(400, viewportWidth - 32);
        dropdownWidth = Math.max(minWidth, Math.min(dropdownWidth, maxWidth));
        
        let leftPos = rect.left;
        if (leftPos + dropdownWidth > viewportWidth - 16) {
          leftPos = viewportWidth - dropdownWidth - 16;
        }
        if (leftPos < 16) {
          leftPos = 16;
        }
        
        let topPos = rect.bottom + 4;
        const dropdownHeight = 280;
        if (topPos + dropdownHeight > viewportHeight && rect.top > dropdownHeight) {
          topPos = rect.top - dropdownHeight - 4;
        }
        
        setPosition({
          top: topPos,
          left: leftPos,
          width: dropdownWidth
        });
      }
    };
    
    updatePosition();
    
    if (isOpen) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, buttonRef]);

  // Handle click outside - but NOT for clicks inside dropdown
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e) => {
      // Don't close if clicking inside dropdown
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
        return;
      }
      // Don't close if clicking the toggle button (it handles its own toggle)
      if (buttonRef.current && buttonRef.current.contains(e.target)) {
        return;
      }
      onClose();
    };
    
    // Small delay to prevent immediate close
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('touchend', handleClickOutside, true);
    }, 10);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchend', handleClickOutside, true);
    };
  }, [isOpen, onClose, buttonRef]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      ref={dropdownRef}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: isMobile ? '50vh' : 'calc(100vh - 100px)',
        backgroundColor: '#fff',
        border: isMobile ? 'none' : '1px solid #e5e7eb',
        borderRadius: isMobile ? '0 0 16px 16px' : '8px',
        boxShadow: isMobile ? '0 4px 30px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Search input */}
      <div style={{ padding: isMobile ? '12px 16px' : '8px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search size={isMobile ? 18 : 16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search country..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              height: isMobile ? '40px' : '36px',
              paddingLeft: '36px',
              paddingRight: '12px',
              fontSize: isMobile ? '16px' : '14px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      
      {/* Country list */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
        {filteredCountries.map((c, idx) => {
          const isSelected = c.code === selectedCode;
          return (
            <div
              key={`${c.code}-${c.country}-${idx}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(c.code);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(c.code);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isMobile ? '14px 16px' : '12px',
                fontSize: isMobile ? '15px' : '14px',
                textAlign: 'left',
                backgroundColor: isSelected ? '#fef2f2' : 'white',
                cursor: 'pointer',
                boxSizing: 'border-box',
                borderLeft: isSelected ? '3px solid #E50914' : '3px solid transparent'
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSelected ? '#fef2f2' : 'white'; }}
            >
              <span style={{ fontSize: isMobile ? '22px' : '20px' }}>{c.flag}</span>
              <span style={{ color: '#111827', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.country}</span>
              <span style={{ color: '#9ca3af', flexShrink: 0 }}>{c.code}</span>
            </div>
          );
        })}
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
        // Check if it's a "new user needs instagram/linkedin" error
        const errorDetail = backendError.response?.data?.detail || "";
        if (errorDetail.includes("Instagram or LinkedIn") || backendError.response?.status === 400) {
          // New user - go to profile step to collect info
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
    }
  };

  const hasSocialLink = () => {
    return socialLinks.instagram?.trim() || socialLinks.linkedin?.trim();
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!hasSocialLink()) {
      toast.error("Please add your Instagram or LinkedIn to verify your profile");
      return;
    }
    
    setLoading(true);
    try {
      const fullPhone = getFullPhoneNumber();
      // First, create/get the user with verify-otp (only sends fields backend expects)
      const response = await axios.post(`${API}/auth/verify-otp`, {
        phone: fullPhone,
        otp: otp,
        name: name.trim(),
        age: parseInt(age) || null,
        instagram: socialLinks.instagram?.trim() || null,
        linkedin: socialLinks.linkedin?.trim() || null
      });
      
      // Then update profile with additional fields
      const profileToken = response.data.token;
      await axios.put(`${API}/users/me`, {
        bio: bio.trim(),
        skills: selectedSkills,
        social_links: {
          instagram: socialLinks.instagram?.trim() || null,
          linkedin: socialLinks.linkedin?.trim() || null,
          twitter: socialLinks.twitter?.trim() || null,
          imdb: socialLinks.imdb?.trim() || null
        }
      }, {
        headers: { Authorization: `Bearer ${profileToken}` }
      });
      
      // Fetch updated user
      const userResponse = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${profileToken}` }
      });
      
      login(profileToken, userResponse.data);
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

  return (
    <Dialog 
      open={isOpen} 
      modal={false}
      onOpenChange={(open) => {
        // Don't close modal if dropdown is open (user is interacting with portal)
        if (!open && showCountryDropdown) return;
        if (!open) resetAndClose();
      }}
    >
      {/* Custom overlay since modal={false} removes the default one */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 z-[49]"
          style={{ pointerEvents: showCountryDropdown ? 'none' : 'auto' }}
          onClick={() => {
            if (!showCountryDropdown) resetAndClose();
          }}
        />,
        document.body
      )}
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden bg-white rounded-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => {
          // Prevent modal close when clicking dropdown (which is outside modal DOM)
          if (showCountryDropdown) {
            e.preventDefault();
            return;
          }
          // Otherwise allow close
          resetAndClose();
        }}
        onInteractOutside={(e) => {
          // Prevent any outside interaction from closing modal while dropdown open
          if (showCountryDropdown) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Close dropdown first, then modal
          if (showCountryDropdown) {
            e.preventDefault();
            setShowCountryDropdown(false);
          }
        }}
      >
        <div id="recaptcha-container"></div>
        <div className="relative">
          <button onClick={resetAndClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 z-10">
            <X size={20} className="text-gray-500" />
          </button>
          
          {showSuccess ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(229, 9, 20, 0.1)' }}>
                <Check size={32} style={{ color: '#E50914' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
              <p className="text-gray-500 mb-6">Message Taj to start connecting</p>
              <button onClick={() => window.open(TELEGRAM_BOT_URL, '_blank')} className="w-full h-12 rounded-full text-white font-semibold flex items-center justify-center gap-2" style={{ background: '#E50914' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.6 4.6-1.87 5.12-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .38z"/>
                </svg>
                Start Texting Taj
              </button>
              <button 
                onClick={() => { resetAndClose(); navigate("/app"); }} 
                className="w-full h-12 rounded-full font-semibold flex items-center justify-center gap-2 mt-3 border border-gray-300 hover:bg-gray-50"
              >
                Go to Dashboard
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
                      
                      {/* Phone input row */}
                      <div 
                        ref={phoneInputRef}
                        className="flex h-11 border border-gray-300 rounded-lg overflow-hidden bg-white"
                      >
                        {/* Country selector button */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowCountryDropdown(!showCountryDropdown); }}
                          className="flex items-center gap-1 px-3 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 shrink-0"
                        >
                          <span className="text-base">{getSelectedCountry().flag}</span>
                          <span className="text-sm font-medium text-gray-700">{countryCode}</span>
                          <ChevronDown size={14} className="text-gray-400 ml-0.5" />
                        </button>
                        
                        {/* Phone number input */}
                        <input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 px-3 text-sm outline-none"
                        />
                      </div>

                      {/* Portal-based dropdown */}
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
                  
                  <div className="flex justify-center mb-4">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} className="w-10 h-12 text-lg" />)}
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
                          <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {SKILL_CATEGORIES[activeCategory].map(skill => (
                          <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-2 py-1 rounded-full text-xs font-medium ${selectedSkills.includes(skill) ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
                            {selectedSkills.includes(skill) && <Check size={10} className="inline mr-0.5" />}{skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full h-11 rounded-full text-white font-semibold transition-opacity" 
                      style={{ background: '#E50914', opacity: hasSocialLink() ? 1 : 0.5 }} 
                      disabled={loading || !hasSocialLink()}
                    >
                      {loading ? <div className="spinner mx-auto" /> : "Complete Profile"}
                    </button>
                    
                    {!hasSocialLink() && (
                      <p className="text-xs text-center text-gray-400">
                        Add Instagram or LinkedIn above to continue
                      </p>
                    )}
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
