/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Link2, Check, ExternalLink } from "lucide-react";

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", color: "#0077b5", icon: "in" },
  { key: "instagram", label: "Instagram", color: "linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)", icon: "IG" },
  { key: "github", label: "GitHub", color: "#24292e", icon: "GH" },
  { key: "tiktok", label: "TikTok", color: "#010101", icon: "TK" },
  { key: "behance", label: "Behance", color: "#1769ff", icon: "Be" },
  { key: "youtube", label: "YouTube", color: "#ff0000", icon: "YT" },
  { key: "twitter", label: "X / Twitter", color: "#000", icon: "X" },
  { key: "dribbble", label: "Dribbble", color: "#ea4c89", icon: "Dr" },
];

const SocialOAuthPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [connected, setConnected] = useState({});
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);

  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        const response = await axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data;
        const links = user.social_links || {};
        const result = {};
        PLATFORMS.forEach(p => {
          if (links[p.key]) result[p.key] = links[p.key];
        });
        setConnected(result);
      } catch {
        setConnected({});
      } finally {
        setLoading(false);
      }
    };
    fetchConnectedAccounts();
  }, [token]);

  const handleConnect = async (platform) => {
    setConnecting(platform);
    try {
      const response = await axios.post(
        `${API}/oauth/${platform}/authorize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.auth_url) {
        window.open(response.data.auth_url, "_blank");
      } else {
        toast.info(`Connect your ${platform} URL in Settings → Edit Profile`);
      }
    } catch {
      toast.info(`To connect ${platform}, add your profile URL in Settings → Edit Profile`);
    } finally {
      setConnecting(null);
    }
  };

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
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Connect Socials</h1>
        <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
          {Object.keys(connected).length} of {PLATFORMS.length} connected
        </p>
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-purple-500/10" : "bg-purple-50"}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <Link2 size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>More connections, better matches</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                Connected profiles let Taj verify your work, build your reputation, and show hirers your portfolio automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform List */}
      <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
        {PLATFORMS.map((platform) => {
          const isConnected = !!connected[platform.key];
          return (
            <div key={platform.key} className={`px-4 py-4 flex items-center gap-3 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              {/* Platform Icon */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: platform.color }}
              >
                {platform.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{platform.label}</p>
                {isConnected ? (
                  <a
                    href={connected[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-green-500"
                  >
                    <Check size={12} />
                    Connected
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  <p className={`text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>Not connected</p>
                )}
              </div>

              {/* Action */}
              {isConnected ? (
                <span className={`px-3 py-1.5 text-sm rounded-full ${darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"}`}>
                  Connected
                </span>
              ) : (
                <button
                  onClick={() => handleConnect(platform.key)}
                  disabled={connecting === platform.key}
                  className={`px-3 py-1.5 text-sm rounded-full border font-medium transition-colors ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  {connecting === platform.key ? "..." : "Connect"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialOAuthPage;
