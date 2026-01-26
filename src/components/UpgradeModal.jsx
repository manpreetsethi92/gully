import { Crown, Zap, CheckCircle, X } from "lucide-react";
import { useAuth, API } from "../App";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * UpgradeModal - Shows when user hits their daily limit
 */
const UpgradeModal = ({ isOpen, onClose, limitType = "requests" }) => {
  const { token } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Read dark mode from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('titli-dark-mode');
      if (stored) {
        setDarkMode(JSON.parse(stored));
      }
    } catch {
      setDarkMode(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = async (plan) => {
    setUpgrading(true);
    try {
      const response = await axios.post(
        `${API}/subscription/checkout`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { plan }
        }
      );
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error("Failed to start checkout:", error);
      toast.error("Failed to start checkout");
      setUpgrading(false);
    }
  };

  const getMessage = () => {
    if (limitType === "scraped_jobs") {
      return {
        title: "Job Alert Limit Reached",
        description: "You've received your maximum job alerts for today. Upgrade to Pro to get more daily alerts and never miss an opportunity."
      };
    }
    return {
      title: "Daily Limit Reached",
      description: "You've reached your daily request limit. Upgrade to Pro for more requests and unlock premium features."
    };
  };

  const { title, description } = getMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-[#111]' : 'bg-white'}`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full transition-colors z-10 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
        >
          <X size={20} className={darkMode ? 'text-white/60' : 'text-gray-400'} />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-500 px-6 py-8 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <Zap size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-white/80 text-sm">{description}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pro Features */}
          <div className="mb-6">
            <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>PRO BENEFITS</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-purple-500 flex-shrink-0" />
                <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>40 requests per day</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-purple-500 flex-shrink-0" />
                <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>25 job alerts daily</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-purple-500 flex-shrink-0" />
                <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Verified badge on your profile</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-purple-500 flex-shrink-0" />
                <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Priority matching</span>
              </li>
            </ul>
          </div>

          {/* Upgrade Button */}
          <button
            onClick={() => handleUpgrade("pro_monthly")}
            disabled={upgrading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all disabled:opacity-50"
          >
            {upgrading ? (
              <div className="spinner" />
            ) : (
              <>
                <Crown size={20} />
                Upgrade to Pro - $12.99/mo
              </>
            )}
          </button>

          {/* Alternative option */}
          <button
            onClick={onClose}
            className={`w-full mt-3 py-3 text-sm transition-colors ${darkMode ? 'text-white/50 hover:text-white/70' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Maybe later
          </button>

          {/* Reset notice */}
          <p className={`text-center text-xs mt-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
            Your limit resets at midnight UTC
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
