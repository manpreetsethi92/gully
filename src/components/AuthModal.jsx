// AuthModal v2 — radical simplification.
//
// Flow:
//   Step 1 (phone):   user types phone → we check if account exists
//                     → if exists:  go to Step 2a (OTP signin)
//                     → if new:     go to Step 2b (name + location signup)
//   Step 2a (otp):    user enters OTP → /auth/verify-otp → done
//   Step 2b (name):   user enters name + location → /auth/signup-and-call → done
//   Step 3 (handoff): "message taj" CTA + QR code. The real onboarding
//                     (email, IG, LinkedIn, skills) happens in WhatsApp.
//
// Voice/tone: lowercase, editorial, matches the landing.

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useAuth, API } from "../App";
import { ArrowLeft, ArrowRight, ChevronDown, Search, Check } from "lucide-react";

// Same WhatsApp number as landing + dashboard.
// Note: WhatsApp policy requires user to send the FIRST message before Taj can respond.
// We pre-fill a friendly opener so the user just has to hit send.
const WHATSAPP_NUMBER = "12134147369";
const WHATSAPP_DISPLAY = "+1 (213) 414-7369";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("hey taj! just signed up on gully")}`;

const COUNTRY_CODES = [
  { code: "+1",   iso: "US", country: "United States",   flag: "🇺🇸", len: 10, placeholder: "(000) 000-0000",   format: "(ddd) ddd-dddd" },
  { code: "+1",   iso: "CA", country: "Canada",          flag: "🇨🇦", len: 10, placeholder: "(000) 000-0000",   format: "(ddd) ddd-dddd" },
  { code: "+44",  iso: "GB", country: "United Kingdom",  flag: "🇬🇧", len: 10, placeholder: "0000 000000",      format: "dddd dddddd" },
  { code: "+91",  iso: "IN", country: "India",           flag: "🇮🇳", len: 10, placeholder: "00000 00000",      format: "ddddd ddddd" },
  { code: "+61",  iso: "AU", country: "Australia",       flag: "🇦🇺", len: 9,  placeholder: "000 000 000",      format: "ddd ddd ddd" },
  { code: "+49",  iso: "DE", country: "Germany",         flag: "🇩🇪", len: 11, placeholder: "000 00000000",     format: "ddd dddddddd" },
  { code: "+33",  iso: "FR", country: "France",          flag: "🇫🇷", len: 9,  placeholder: "0 00 00 00 00",    format: "d dd dd dd dd" },
  { code: "+81",  iso: "JP", country: "Japan",           flag: "🇯🇵", len: 10, placeholder: "00 0000 0000",     format: "dd dddd dddd" },
  { code: "+86",  iso: "CN", country: "China",           flag: "🇨🇳", len: 11, placeholder: "000 0000 0000",    format: "ddd dddd dddd" },
  { code: "+55",  iso: "BR", country: "Brazil",          flag: "🇧🇷", len: 11, placeholder: "(00) 00000-0000",  format: "(dd) ddddd-dddd" },
  { code: "+52",  iso: "MX", country: "Mexico",          flag: "🇲🇽", len: 10, placeholder: "00 0000 0000",     format: "dd dddd dddd" },
  { code: "+34",  iso: "ES", country: "Spain",           flag: "🇪🇸", len: 9,  placeholder: "000 000 000",      format: "ddd ddd ddd" },
  { code: "+39",  iso: "IT", country: "Italy",           flag: "🇮🇹", len: 10, placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+82",  iso: "KR", country: "South Korea",     flag: "🇰🇷", len: 10, placeholder: "00 0000 0000",     format: "dd dddd dddd" },
  { code: "+31",  iso: "NL", country: "Netherlands",     flag: "🇳🇱", len: 9,  placeholder: "0 00000000",       format: "d dddddddd" },
  { code: "+46",  iso: "SE", country: "Sweden",          flag: "🇸🇪", len: 9,  placeholder: "00 000 00 00",     format: "dd ddd dd dd" },
  { code: "+41",  iso: "CH", country: "Switzerland",     flag: "🇨🇭", len: 9,  placeholder: "00 000 00 00",     format: "dd ddd dd dd" },
  { code: "+65",  iso: "SG", country: "Singapore",       flag: "🇸🇬", len: 8,  placeholder: "0000 0000",        format: "dddd dddd" },
  { code: "+971", iso: "AE", country: "UAE",             flag: "🇦🇪", len: 9,  placeholder: "00 000 0000",      format: "dd ddd dddd" },
  { code: "+966", iso: "SA", country: "Saudi Arabia",    flag: "🇸🇦", len: 9,  placeholder: "00 000 0000",      format: "dd ddd dddd" },
  { code: "+27",  iso: "ZA", country: "South Africa",    flag: "🇿🇦", len: 9,  placeholder: "00 000 0000",      format: "dd ddd dddd" },
  { code: "+234", iso: "NG", country: "Nigeria",         flag: "🇳🇬", len: 10, placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+63",  iso: "PH", country: "Philippines",     flag: "🇵🇭", len: 10, placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+84",  iso: "VN", country: "Vietnam",         flag: "🇻🇳", len: 9,  placeholder: "000 000 000",      format: "ddd ddd ddd" },
  { code: "+66",  iso: "TH", country: "Thailand",        flag: "🇹🇭", len: 9,  placeholder: "00 000 0000",      format: "dd ddd dddd" },
  { code: "+60",  iso: "MY", country: "Malaysia",        flag: "🇲🇾", len: 9,  placeholder: "00 000 0000",      format: "dd ddd dddd" },
  { code: "+62",  iso: "ID", country: "Indonesia",       flag: "🇮🇩", len: 10, placeholder: "000 0000 0000",    format: "ddd dddd dddd" },
  { code: "+48",  iso: "PL", country: "Poland",          flag: "🇵🇱", len: 9,  placeholder: "000 000 000",      format: "ddd ddd ddd" },
  { code: "+90",  iso: "TR", country: "Turkey",          flag: "🇹🇷", len: 10, placeholder: "000 000 00 00",    format: "ddd ddd dd dd" },
  { code: "+20",  iso: "EG", country: "Egypt",           flag: "🇪🇬", len: 10, placeholder: "00 0000 0000",     format: "dd dddd dddd" },
  { code: "+92",  iso: "PK", country: "Pakistan",        flag: "🇵🇰", len: 10, placeholder: "000 0000000",      format: "ddd ddddddd" },
  { code: "+880", iso: "BD", country: "Bangladesh",      flag: "🇧🇩", len: 10, placeholder: "0000 000000",      format: "dddd dddddd" },
  { code: "+64",  iso: "NZ", country: "New Zealand",     flag: "🇳🇿", len: 9,  placeholder: "00 000 0000",      format: "dd ddd dddd" },
  { code: "+353", iso: "IE", country: "Ireland",         flag: "🇮🇪", len: 9,  placeholder: "00 000 0000",      format: "dd ddd dddd" }
];

// Format a digit string according to a mask. 'd' = digit slot. Other chars passed through.
// "1234567890" with "(ddd) ddd-dddd" → "(123) 456-7890"
const formatPhoneByMask = (digits, mask) => {
  if (!mask) return digits;
  let out = "";
  let i = 0;
  for (const ch of mask) {
    if (i >= digits.length) break;
    if (ch === "d") {
      out += digits[i];
      i++;
    } else {
      out += ch;
    }
  }
  return out;
};


// Country code picker — rendered INLINE (no portal).
// Portals + Radix Dialog's outside-click detector fight each other.
// Inline absolute positioning means the dropdown is part of the Dialog subtree,
// so Radix sees clicks as "inside" and doesn't interfere.
const CountryDropdown = ({ isOpen, onClose, onSelect, searchValue, onSearchChange, filteredCountries }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
      style={{ maxHeight: "320px" }}
    >
      <div className="p-2 border-b border-gray-100 bg-white sticky top-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="search country"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 lowercase font-mono"
            autoFocus
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1" style={{ maxHeight: "260px" }}>
        {filteredCountries.map((country, idx) => (
          <button
            type="button"
            key={`${country.code}-${country.country}-${idx}`}
            className="w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors text-left"
            onClick={() => {
              onSelect(country);
              onClose();
            }}
          >
            <span className="text-lg">{country.flag}</span>
            <span className="text-sm text-gray-900 flex-1 lowercase">{country.country}</span>
            <span className="font-mono text-xs text-gray-500">{country.code}</span>
          </button>
        ))}
        {filteredCountries.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-gray-400 lowercase font-mono">no match</div>
        )}
      </div>
    </div>
  );
};


const AuthModal = ({ isOpen, onClose, mode = "signup" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // "phone" → check existence → "otp" (existing) or "details" (new) → "handoff"
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [countryIso, setCountryIso] = useState("US");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [otp, setOtp] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const phoneInputRef = useRef(null);

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhone("");
      setName("");
      setLocation("");
      setOtp("");
      setAgreedToTerms(false);
      setError("");
    }
  }, [isOpen]);

  // IP-based geolocation → default country code on first modal open.
  // Runs only once per app session; cached in sessionStorage so it doesn't
  // re-fetch if the user opens/closes the modal multiple times.
  useEffect(() => {
    if (!isOpen) return;
    const cached = sessionStorage.getItem("gully:geo_country");
    if (cached) {
      try {
        const { iso, code } = JSON.parse(cached);
        if (iso && code) {
          setCountryIso(iso);
          setCountryCode(code);
          return;
        }
      } catch {}
    }
    // Free, no-auth, ~60 req/min per IP. Good enough for a signup screen.
    // If this fails we silently keep the +1 default.
    fetch("https://ipapi.co/json/", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.country_code) return;
        const iso = data.country_code.toUpperCase();
        const match = COUNTRY_CODES.find((c) => c.iso === iso);
        if (match) {
          setCountryIso(iso);
          setCountryCode(match.code);
          sessionStorage.setItem(
            "gully:geo_country",
            JSON.stringify({ iso, code: match.code })
          );
        }
      })
      .catch(() => { /* silent fallback to +1 */ });
  }, [isOpen]);

  const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;
  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  // Prefer exact iso match (so +1 US vs +1 CA both resolve correctly).
  // Falls back to first country with matching code.
  const selectedCountry =
    COUNTRY_CODES.find((c) => c.iso === countryIso && c.code === countryCode) ||
    COUNTRY_CODES.find((c) => c.code === countryCode) ||
    COUNTRY_CODES[0];
  const selectedFlag = selectedCountry.flag;
  const selectedMaxDigits = selectedCountry.len;
  const selectedPlaceholder = selectedCountry.placeholder;
  const selectedMask = selectedCountry.format;

  // ===== Step 1: phone → route to OTP or details =====
  const handlePhoneSubmit = async () => {
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== selectedMaxDigits) {
      setError(`enter a valid ${selectedCountry.country.toLowerCase()} number (${selectedMaxDigits} digits)`);
      return;
    }
    if (!agreedToTerms) {
      setError("please accept the terms to continue");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/auth/check-phone?phone=${encodeURIComponent(fullPhone)}`);
      if (data.exists) {
        // Existing user — send OTP for signin
        await axios.post(`${API}/auth/send-otp`, { phone: fullPhone });
        setStep("otp");
      } else {
        // New user — ask for name + location
        setStep("details");
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || "something went wrong, try again";
      setError(msg.toLowerCase());
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 2a: OTP verify (signin) =====
  const handleOtpSubmit = async () => {
    setError("");
    if (otp.length !== 6) {
      setError("enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/verify-otp`, {
        phone: fullPhone,
        otp
      });
      login(data.token, data.user);
      // Existing users skip handoff — they've used the product before
      toast.success("welcome back");
      onClose();
      navigate("/app");
    } catch (e) {
      setError("invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 2b: signup (new user) =====
  const handleDetailsSubmit = async () => {
    setError("");
    if (!name.trim()) {
      setError("what should taj call you?");
      return;
    }
    if (!location.trim()) {
      setError("where are you based?");
      return;
    }
    setLoading(true);
    try {
      // Read referral code if stored from ?ref= URL param
      const refCode = localStorage.getItem("gully_ref") || null;
      // NOTE: /auth/signup-and-call is named historically — voice calls are DISABLED.
      // It now just: creates user → logs activity → waits for user to text Taj first
      // (WhatsApp policy requires user-initiated first message).
      const { data } = await axios.post(`${API}/auth/signup-and-call`, {
        name: name.trim(),
        phone: fullPhone,
        email: null,
        location: location.trim(),
        instagram: null,
        linkedin: null,
        ref_code: refCode,
        whatsapp_alerts_opt_in: true
      });
      login(data.token, data.user);
      // Fire-and-forget cleanup of referral code
      if (refCode) localStorage.removeItem("gully_ref");
      setStep("handoff");
    } catch (e) {
      const msg = e?.response?.data?.detail || "something went wrong, try again";
      setError(typeof msg === "string" ? msg.toLowerCase() : "signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "otp" || step === "details") setStep("phone");
  };


  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && showCountryDropdown) return;
          if (!open) onClose();
        }}
      >
        <DialogContent
          className="sm:max-w-md p-0 bg-white border border-gray-100 rounded-3xl"
        >
          {/* Back arrow — only on step 2 */}
          {(step === "otp" || step === "details") && (
            <button
              onClick={handleBack}
              className="absolute top-5 left-5 w-9 h-9 rounded-full border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors z-10"
              aria-label="back"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          {/* ========== STEP 1: PHONE ========== */}
          {step === "phone" && (
            <div className="px-10 py-12">
              <h2 className="font-display text-[42px] leading-[0.95] tracking-tight text-gray-900 font-normal lowercase mb-2">
                just give me your<br />
                <em className="text-[#E50914]">phone.</em>
              </h2>
              <p className="font-syne text-sm text-gray-500 mb-8 lowercase">
                taj will text you to take it from here.
              </p>

              <div className="mb-5">
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-1.5 px-3 h-12 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
                    >
                      <span className="text-lg">{selectedFlag}</span>
                      <span className="font-mono text-sm text-gray-900">{countryCode}</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    <CountryDropdown
                      isOpen={showCountryDropdown}
                      onClose={() => {
                        setShowCountryDropdown(false);
                        setCountrySearch("");
                      }}
                      onSelect={(c) => {
                        setCountryCode(c.code);
                        setCountryIso(c.iso);
                        // Re-format any typed digits to the new country's mask,
                        // and truncate if they typed more digits than the new country allows.
                        const digits = phone.replace(/\D/g, "").slice(0, c.len);
                        setPhone(formatPhoneByMask(digits, c.format));
                        setError("");
                      }}
                      searchValue={countrySearch}
                      onSearchChange={setCountrySearch}
                      filteredCountries={filteredCountries}
                    />
                  </div>
                  <Input
                    ref={phoneInputRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      // Strip non-digits, cap at country's max, then format with country mask.
                      const raw = e.target.value.replace(/\D/g, "").slice(0, selectedMaxDigits);
                      setPhone(formatPhoneByMask(raw, selectedMask));
                    }}
                    placeholder={selectedPlaceholder}
                    className="flex-1 h-12 rounded-xl font-mono text-[15px]"
                    autoComplete="tel"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    agreedToTerms ? "bg-[#E50914] border-[#E50914]" : "bg-white border-gray-300"
                  }`}
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                >
                  {agreedToTerms && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-xs text-gray-500 leading-relaxed lowercase" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                  i agree to gully's{" "}
                  <a href="/terms" target="_blank" className="text-gray-900 underline">terms</a>{" "}and{" "}
                  <a href="/privacy" target="_blank" className="text-gray-900 underline">privacy policy</a>. taj will send me whatsapp messages.
                </span>
              </label>

              {error && (
                <p className="text-sm text-[#E50914] mb-4 lowercase font-syne">{error}</p>
              )}

              <button
                onClick={handlePhoneSubmit}
                disabled={loading}
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-syne font-semibold rounded-full transition-colors lowercase text-[15px] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "..." : (
                  <>
                    continue
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ========== STEP 2a: OTP (existing user) ========== */}
          {step === "otp" && (
            <div className="px-10 py-12 pt-16">
              <h2 className="font-display text-[36px] leading-[0.95] tracking-tight text-gray-900 font-normal lowercase mb-2">
                welcome back.
              </h2>
              <p className="font-syne text-sm text-gray-500 mb-8 lowercase">
                we texted a 6-digit code to <span className="text-gray-900">{fullPhone}</span>
              </p>

              <div className="mb-6 flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleOtpSubmit}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p className="text-sm text-[#E50914] mb-4 lowercase font-syne text-center">{error}</p>
              )}

              <button
                onClick={handleOtpSubmit}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-syne font-semibold rounded-full transition-colors lowercase text-[15px] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "..." : "verify"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4 font-mono lowercase">
                didn't get it?{" "}
                <button
                  onClick={handlePhoneSubmit}
                  className="text-gray-900 underline"
                  disabled={loading}
                >
                  resend
                </button>
              </p>
            </div>
          )}


          {/* ========== STEP 2b: DETAILS (new user) ========== */}
          {step === "details" && (
            <div className="px-10 py-12 pt-16">
              <h2 className="font-display text-[36px] leading-[0.95] tracking-tight text-gray-900 font-normal lowercase mb-2">
                nice. two more things.
              </h2>
              <p className="font-syne text-sm text-gray-500 mb-8 lowercase">
                taj will ask the rest over text. promise.
              </p>

              <div className="mb-5">
                <label className="font-mono text-[10px] tracking-[0.2em] text-gray-400 mb-2 block lowercase">
                  your name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="what should taj call you?"
                  className="h-12 rounded-xl text-[15px]"
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="font-mono text-[10px] tracking-[0.2em] text-gray-400 mb-2 block lowercase">
                  where you're based
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="city, state — e.g. austin, TX"
                  className="h-12 rounded-xl text-[15px]"
                  onKeyDown={(e) => e.key === "Enter" && handleDetailsSubmit()}
                />
              </div>

              {error && (
                <p className="text-sm text-[#E50914] mb-4 lowercase font-syne">{error}</p>
              )}

              <button
                onClick={handleDetailsSubmit}
                disabled={loading}
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-syne font-semibold rounded-full transition-colors lowercase text-[15px] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "..." : (
                  <>
                    meet taj
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ========== STEP 3: HANDOFF ========== */}
          {step === "handoff" && (
            <div className="px-10 py-12 text-center">
              <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 bg-gray-50 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot" />
                <span className="font-mono text-[10px] tracking-wider text-gray-600 lowercase">you're in</span>
              </div>
              <h2 className="font-display text-[42px] leading-[0.95] tracking-tight text-gray-900 font-normal lowercase mb-3">
                say hi to <em className="text-[#E50914]">taj.</em>
              </h2>
              <p className="font-syne text-[15px] text-gray-500 leading-relaxed mb-8 lowercase">
                text her first and she'll take it from there.<br />
                (whatsapp rules — she can't message you until you say hi.)
              </p>

              <div className="inline-flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-2xl mb-2">
                <div className="p-2 bg-white rounded-lg">
                  <QRCodeSVG
                    value={WHATSAPP_URL}
                    size={140}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#0a0a0a"
                    marginSize={0}
                  />
                </div>
                <div className="font-mono text-[10px] text-gray-500 tracking-wider lowercase">
                  scan · {WHATSAPP_DISPLAY}
                </div>
              </div>

              <div className="mt-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Close modal and head to dashboard so when they come back later they land on /app
                    setTimeout(() => { onClose(); navigate("/app"); }, 250);
                  }}
                  className="inline-flex items-center gap-2 px-6 h-12 bg-[#25D366] hover:bg-[#1fb855] text-white font-syne font-semibold rounded-full transition-colors lowercase text-[15px]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  open whatsapp
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModal;
