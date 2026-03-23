/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Bot, MessageCircle, Zap } from "lucide-react";

const Switch = ({ checked, onChange, disabled, darkMode }) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange?.(!checked)}
    style={{
      display: "inline-flex", alignItems: "center", width: "44px", height: "24px",
      borderRadius: "9999px", border: "none", cursor: disabled ? "not-allowed" : "pointer",
      padding: "2px", transition: "background-color 0.2s",
      backgroundColor: checked ? "#E50914" : (darkMode ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
      opacity: disabled ? 0.5 : 1, flexShrink: 0,
    }}
  >
    <span style={{
      display: "block", width: "20px", height: "20px", borderRadius: "50%",
      backgroundColor: "white", transition: "transform 0.2s",
      transform: checked ? "translateX(20px)" : "translateX(0)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    }} />
  </button>
);

const AgentSettingsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    pitch_autonomy: false,
    negotiate_autonomy: false,
    calendar_booking: false,
    invoice_chasing: false,
    portfolio_updates: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await axios.get(`${API}/agent/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSettings(response.data?.settings || settings);
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchAgentData();
  }, [token]);

  const handleToggle = async (key) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    setSaving(key);
    try {
      await axios.patch(`${API}/agent/settings`, { [key]: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Setting updated");
    } catch {
      setSettings(prev => ({ ...prev, [key]: !newValue }));
      toast.error("Failed to update");
    } finally {
      setSaving(null);
    }
  };

  const settingsConfig = [
    { key: "pitch_autonomy", label: "Auto-pitch to hirers", description: "Taj reaches out to matching hirers on your behalf without asking first", pro: true },
    { key: "negotiate_autonomy", label: "Auto-negotiate rate", description: "Taj handles rate negotiations within your stated range", pro: true },
    { key: "calendar_booking", label: "Auto-confirm bookings", description: "Taj accepts gig invites that match your availability", pro: true },
    { key: "invoice_chasing", label: "Chase unpaid invoices", description: "Taj follows up on late payments from hirers", pro: false },
    { key: "portfolio_updates", label: "Auto-update portfolio", description: "Taj adds closed gigs to your work history automatically", pro: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Taj Agent</h1>
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-red-500/10" : "bg-red-50"}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center flex-shrink-0">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Taj works for you, automatically</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                Choose how much Taj does on your behalf. Toggle on the ones you want — she'll handle the rest while you focus on the actual work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
        {settingsConfig.map(({ key, label, description, pro }) => (
          <div key={key} className={`px-4 py-5 flex items-start gap-3 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${settings[key] ? (darkMode ? "bg-red-500/20" : "bg-red-100") : (darkMode ? "bg-white/5" : "bg-gray-100")}`}>
              <Zap size={18} className={settings[key] ? (darkMode ? "text-red-400" : "text-red-500") : (darkMode ? "text-white/30" : "text-gray-400")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{label}</p>
                {pro && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${darkMode ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-700"}`}>Pro</span>
                )}
              </div>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/50" : "text-gray-500"}`}>{description}</p>
            </div>
            <Switch
              checked={settings[key]}
              onChange={() => handleToggle(key)}
              disabled={saving === key}
              darkMode={darkMode}
            />
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div className={`px-4 py-4 ${darkMode ? "border-t border-white/10" : "border-t border-gray-100"}`}>
        <a
          href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20want%20to%20upgrade%20to%20Pro"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-white font-semibold"
          style={{ background: "#E50914" }}
        >
          <MessageCircle size={18} />
          Upgrade to Pro for full autonomy
        </a>
      </div>
    </div>
  );
};

export default AgentSettingsPage;
