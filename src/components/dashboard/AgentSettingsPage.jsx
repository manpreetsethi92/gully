// AgentSettingsPage — 'taj's brain' section inside Settings.
// Editorial redesign. Same Switch component + same handlers.

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { WhatsAppIcon } from "./WhatsAppIcon";

const Switch = ({ checked, onChange, disabled, darkMode }) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange?.(!checked)}
    style={{
      display: "inline-flex", alignItems: "center", width: "40px", height: "22px",
      borderRadius: "9999px", border: "none", cursor: disabled ? "not-allowed" : "pointer",
      padding: "2px", transition: "background-color 0.2s",
      backgroundColor: checked ? "#E50914" : (darkMode ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
      opacity: disabled ? 0.5 : 1, flexShrink: 0,
    }}
  >
    <span style={{
      display: "block", width: "18px", height: "18px", borderRadius: "50%",
      backgroundColor: "white", transition: "transform 0.2s",
      transform: checked ? "translateX(18px)" : "translateX(0)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    }} />
  </button>
);

const SETTINGS_CONFIG = [
  { key: "agent_pitch", label: "auto-pitch to hirers", description: "taj reaches out to matching hirers for you, no ask needed", pro: true },
  { key: "agent_negotiate", label: "auto-negotiate rate", description: "taj handles rate talks within your stated range", pro: true },
  { key: "agent_calendar", label: "auto-confirm bookings", description: "taj accepts gig invites that match your availability", pro: true },
  { key: "agent_invoice", label: "chase unpaid invoices", description: "taj follows up on late payments from hirers", pro: false },
  { key: "agent_portfolio", label: "auto-update work history", description: "taj adds closed gigs to your history automatically", pro: false },
];

const AgentSettingsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    agent_pitch: false, agent_negotiate: false,
    agent_calendar: false, agent_invoice: false, agent_portfolio: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const prefs = res.data?.agent_settings || res.data?.preferences || {};
        setSettings(prev => ({ ...prev, ...prefs }));
      } catch {
        // defaults
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const handleToggle = async (key) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));
    setSaving(key);
    try {
      await axios.put(`${API}/users/me`, {
        agent_settings: { ...settings, [key]: newVal }
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("saved");
    } catch {
      setSettings(prev => ({ ...prev, [key]: !newVal }));
      toast.error("couldn't save");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <section className={`rounded-2xl border p-5 mb-5 ${darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-100 bg-white"}`}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}>
            T
          </div>
          <div className="flex-1">
            <p className={`text-[14.5px] leading-[1.55] lowercase ${darkMode ? "text-white/90" : "text-gray-900"}`}>
              i can work for you automatically — you pick how much. toggle what you want on; i'll handle the rest.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-1">
        {SETTINGS_CONFIG.map(({ key, label, description, pro }) => (
          <div
            key={key}
            className={`rounded-2xl border p-4 flex items-start gap-3 mb-2 transition-colors ${
              darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`font-syne text-[14px] font-medium lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {label}
                </span>
                {pro && (
                  <span className={`font-mono text-[9.5px] px-2 py-0.5 rounded-md tracking-wide lowercase ${
                    darkMode ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-50 text-yellow-700"
                  }`}>
                    pro
                  </span>
                )}
              </div>
              <p className={`font-syne text-[12.5px] lowercase leading-relaxed ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                {description}
              </p>
            </div>
            <Switch checked={settings[key]} onChange={() => handleToggle(key)} disabled={saving === key} darkMode={darkMode} />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <a
          href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20want%20to%20upgrade%20to%20Pro"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-white font-syne text-[13px] font-medium lowercase"
          style={{ background: "#25D366" }}
        >
          <WhatsAppIcon size={13} />
          upgrade to pro for full autonomy
        </a>
      </div>
    </div>
  );
};

export default AgentSettingsPage;
