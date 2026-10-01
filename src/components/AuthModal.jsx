// AuthModal v3 — ButtrBase OTP login (Saumya's launch spec, 2026-10-01).
//
// Flow:
//   Step 1 (contact):  email (default) or phone → POST /auth/bb/otp/send
//   Step 2 (otp):      6-digit code → POST /auth/bb/otp/verify
//                      → profile complete?  done, go to /app
//                      → new bare user?     Step 3
//   Step 3 (details):  name + location → POST /auth/bb/complete-profile
//                      → socials connect page with the "text taj" flag
//
// Legacy phone login (Twilio Verify) stays reachable behind one link for the
// pre-ButtrBase users until the migration/cutover decision lands - removing
// it is a cutover-step action, not part of this rework.
//
// Voice/tone: lowercase, editorial, matches the landing.

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useAuth, API } from "../App";
import { ArrowLeft, ArrowRight, ChevronDown, Search, Check } from "lucide-react";

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
  { code: "+46",  iso: "SE", country: "Sweden",          flag: "🇸🇪", len: 9,  placeholder: "000 000 000",      format: "ddd ddd ddd" },
  { code: "+41",  iso: "CH", country: "Switzerland",     flag: "🇨🇭", len: 9,  placeholder: "000 00 00 00",     format: "ddd dd dd dd" },
  { code: "+65",  iso: "SG", country: "Singapore",       flag: "🇸🇬", len: 8,  placeholder: "0000 0000",        format: "dddd dddd" },
  { code: "+971", iso: "AE", country: "UAE",             flag: "🇦🇪", len: 9,  placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+966", iso: "SA", country: "Saudi Arabia",    flag: "🇸🇦", len: 9,  placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+27",  iso: "ZA", country: "South Africa",    flag: "🇿🇦", len: 9,  placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+234", iso: "NG", country: "Nigeria",         flag: "🇳🇬", len: 10, placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+63",  iso: "PH", country: "Philippines",     flag: "🇵🇭", len: 10, placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+84",  iso: "VN", country: "Vietnam",         flag: "🇻🇳", len: 9,  placeholder: "000 000 000",      format: "ddd ddd ddd" },
  { code: "+66",  iso: "TH", country: "Thailand",        flag: "🇹🇭", len: 9,  placeholder: "0000 000 000",     format: "dddd ddd ddd" },
  { code: "+60",  iso: "MY", country: "Malaysia",        flag: "🇲🇾", len: 9,  placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+62",  iso: "ID", country: "Indonesia",       flag: "🇮🇩", len: 10, placeholder: "0000 0000 0000",   format: "dddd dddd dddd" },
  { code: "+48",  iso: "PL", country: "Poland",          flag: "🇵🇱", len: 9,  placeholder: "000 000 000",      format: "ddd ddd ddd" },
  { code: "+90",  iso: "TR", country: "Turkey",          flag: "🇹🇷", len: 10, placeholder: "000 000 00 00",    format: "ddd ddd dd dd" },
  { code: "+20",  iso: "EG", country: "Egypt",           flag: "🇪🇬", len: 10, placeholder: "000 0000 0000",    format: "ddd dddd dddd" },
  { code: "+92",  iso: "PK", country: "Pakistan",        flag: "🇵🇰", len: 10, placeholder: "0000 0000000",     format: "dddd ddddddd" },
  { code: "+880", iso: "BD", country: "Bangladesh",      flag: "🇧🇩", len: 10, placeholder: "0000 0000000",     format: "dddd ddddddd" },
  { code: "+64",  iso: "NZ", country: "New Zealand",     flag: "🇳🇿", len: 9,  placeholder: "000 000 0000",     format: "ddd ddd dddd" },
  { code: "+353", iso: "IE", country: "Ireland",         flag: "🇮🇪", len: 9,  placeholder: "000 000 0000",     format: "ddd ddd dddd" }
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

const looksLikeEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim());


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
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-gray-400 lowercase font-mono"
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

  // "contact" → "otp" → ("details" if the ButtrBase user is new to gully)
  // "legacyphone" / "legacyotp" = pre-ButtrBase Twilio flow, link at the bottom.
  const [step, setStep] = useState("contact");
  const [channel, setChannel] = useState("email");
  const [email, setEmail] = useState("");
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

  const contactInputRef = useRef(null);

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("contact");
      setChannel("email");
      setEmail("");
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
  const contact = channel === "email" ? email.trim().toLowerCase() : fullPhone;
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

  // ===== Step 1: contact → send the ButtrBase code =====
  const handleContactSubmit = async () => {
    setError("");
    if (channel === "email" && !looksLikeEmail(email)) {
      setError("enter a valid email address");
      return;
    }
    if (channel === "phone" && phone.replace(/\D/g, "").length !== selectedMaxDigits) {
      setError(`enter a valid ${selectedCountry.country.toLowerCase()} number (${selectedMaxDigits} digits)`);
      return;
    }
    if (!agreedToTerms) {
      setError("please accept the terms to continue");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/bb/otp/send`,
        channel === "email" ? { email: contact } : { phone: contact }
      );
      setOtp("");
      setStep("otp");
    } catch (e) {
      const msg = e?.response?.data?.detail || "something went wrong, try again";
      setError(typeof msg === "string" ? msg.toLowerCase() : "something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 2: verify → login, then details if new =====
  const handleOtpSubmit = async () => {
    setError("");
    if (otp.length !== 6) {
      setError("enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/bb/otp/verify`, {
        ...(channel === "email" ? { email: contact } : { phone: contact }),
        otp
      });
      login(data.token, data.user);
      if (data.user?.profile_completed) {
        toast.success("welcome back");
        onClose();
        navigate("/app");
      } else {
        setStep("details");
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || "invalid or expired code";
      setError(typeof msg === "string" ? msg.toLowerCase() : "invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 3: name + location for the bare ButtrBase user =====
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
      const token = localStorage.getItem("gully_token");
      const refCode = localStorage.getItem("gully_ref") || null;
      const { data } = await axios.post(
        `${API}/auth/bb/complete-profile`,
        { name: name.trim(), location: location.trim(), ref_code: refCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(token, data.user);
      if (refCode) localStorage.removeItem("gully_ref");

      // Same handoff as the old signup: socials connect page carries the
      // "text taj to get started" prompt (WhatsApp policy: user messages first).
      sessionStorage.setItem("gully_needs_first_text", "1");
      onClose();
      navigate("/app/you?tab=socials");
    } catch (e) {
      const msg = e?.response?.data?.detail || "something went wrong, try again";
      setError(typeof msg === "string" ? msg.toLowerCase() : "signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== Legacy (pre-ButtrBase) phone login, unchanged =====
  const handleLegacyPhoneSubmit = async () => {
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
        await axios.post(`${API}/auth/send-otp`, { phone: fullPhone });
        setStep("legacyotp");
      } else {
        setError("no old account on this number — sign in with email or phone above instead");
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || "something went wrong, try again";
      setError(typeof msg === "string" ? msg.toLowerCase() : "something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleLegacyOtpSubmit = async () => {
    setError("");
    if (otp.length !== 6) {
      setError("enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/verify-otp`, { phone: fullPhone, otp });
      login(data.token, data.user);
      toast.success("welcome back");
      onClose();
      navigate("/app");
    } catch (e) {
      setError("invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "otp" || step === "details") setStep("contact");
    if (step === "legacyotp") setStep("legacyphone");
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
          {/* Back arrow — only on step 2+ */}
          {(step === "otp" || step === "details" || step === "legacyotp") && (
            <button
              onClick={handleBack}
              className="absolute top-5 left-5 w-9 h-9 rounded-full border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors z-10"
              aria-label="back"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          {/* ========== STEP 1: CONTACT ========== */}
          {step === "contact" && (
            <div className="px-10 py-12">
              <h2 className="font-display text-[42px] leading-[0.95] tracking-tight text-gray-900 font-normal lowercase mb-2">
                just give me your<br />
                <em className="text-[#E50914]">{channel}.</em>
              </h2>
              <p className="font-syne text-sm text-gray-500 mb-6 lowercase">
                {channel === "email"
                  ? "we'll send a 6-digit code. taj does the rest."
                  : "taj will text you to take it from here."}
              </p>

              {/* channel toggle */}
              <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-full mb-5">
                {["email", "phone"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setChannel(c); setError(""); }}
                    className={`px-4 h-8 rounded-full font-mono text-xs lowercase transition-colors ${
                      channel === c ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="mb-5">
                {channel === "email" ? (
                  <Input
                    ref={contactInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.com"
                    className="h-12 rounded-xl font-mono text-[15px]"
                    autoComplete="email"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleContactSubmit()}
                  />
                ) : (
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
                      ref={contactInputRef}
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
                      onKeyDown={(e) => e.key === "Enter" && handleContactSubmit()}
                    />
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
                <div
                  className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
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
                onClick={handleContactSubmit}
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

              <p className="text-xs text-gray-400 text-center mt-4 font-mono lowercase">
                old gully account?{" "}
                <button
                  onClick={() => { setStep("legacyphone"); setError(""); }}
                  className="text-gray-900 underline"
                >
                  sign in with your phone
                </button>
              </p>
            </div>
          )}

          {/* ========== STEP 2: OTP ========== */}
          {step === "otp" && (
            <div className="px-10 py-12 pt-16">
              <h2 className="font-display text-[36px] leading-[0.95] tracking-tight text-gray-900 font-normal lowercase mb-2">
                welcome back.
              </h2>
              <p className="font-syne text-sm text-gray-500 mb-8 lowercase">
                we sent a 6-digit code to <span className="text-gray-900">{contact}</span>
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
                  onClick={handleContactSubmit}
                  className="text-gray-900 underline"
                  disabled={loading}
                >
                  resend
                </button>
              </p>
            </div>
          )}

          {/* ========== STEP 3: DETAILS (new ButtrBase user) ========== */}
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

          {/* ========== LEGACY: old phone login (pre-ButtrBase users) ========== */}
          {step === "legacyphone" && (
            <div className="px-10 py-12">
              <h2 className="font-display text-[42px] leading-[0.95] tracking-tight text-gray-900 font-normal lowercase mb-2">
                just give me your<br />
                <em className="text-[#E50914]">phone.</em>
              </h2>
              <p className="font-syne text-sm text-gray-500 mb-8 lowercase">
                for accounts made before the buttrbase switch.
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
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, selectedMaxDigits);
                      setPhone(formatPhoneByMask(raw, selectedMask));
                    }}
                    placeholder={selectedPlaceholder}
                    className="flex-1 h-12 rounded-xl font-mono text-[15px]"
                    autoComplete="tel"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleLegacyPhoneSubmit()}
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
                <div
                  className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
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
                onClick={handleLegacyPhoneSubmit}
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

          {/* ========== LEGACY: old OTP step ========== */}
          {step === "legacyotp" && (
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
                  onComplete={handleLegacyOtpSubmit}
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
                onClick={handleLegacyOtpSubmit}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-syne font-semibold rounded-full transition-colors lowercase text-[15px] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "..." : "verify"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4 font-mono lowercase">
                didn't get it?{" "}
                <button
                  onClick={handleLegacyPhoneSubmit}
                  className="text-gray-900 underline"
                  disabled={loading}
                >
                  resend
                </button>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModal;
