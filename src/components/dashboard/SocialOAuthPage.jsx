import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Link2, Check, ExternalLink, ShieldCheck } from "lucide-react";

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", color: "#0077b5", icon: "in", supportsOAuth: true },
  { key: "instagram", label: "Instagram", color: "linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)", icon: "IG", supportsOAuth: false },
  { key: "github", label: "GitHub", color: "#24292e", icon: "GH", supportsOAuth: true },
  { key: "youtube", label: "YouTube", color: "#ff0000", icon: "YT", supportsOAuth: true },
  { key: "tiktok", label: "TikTok", color: "#010101", icon: "TK", supportsOAuth: false },
  { key: "behance", label: "Behance", color: "#1769ff", icon: "Be", supportsOAuth: false },
  { key: "twitter", label: "X / Twitter", color: "#000", icon: "X", supportsOAuth: false },
  { key: "dribbble", label: "Dribbble", color: "#ea4c89", icon: "Dr", supportsOAuth: false },
];

const SocialOAuthPage = ({ darkMode }) => {
  const { token, user } = useAuth();
  const [connected, setConnected] = useState({});
  const [verified, setVerified] = useState({});
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);

  const fetchConnectedAccounts = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data;
      const links = userData.social_links || {};
      const oauth = userData.social_oauth || {};
      const linkedAt = userData.linked_at || {};

      const connectedResult = {};
      const verifiedResult = {};

      PLATFORMS.forEach(p => {
        if (links[p.key]) connectedResult[p.key] = links[p.key];
        if (oauth[p.key] || linkedAt[p.key]) verifiedResult[p.key] = true;
      });

      setConnected(connectedResult);
      setVerified(verifiedResult);
    } catch {
      setConnected({});
      setVerified({});
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchConnectedAccounts();
  }, [fetchConnectedAccounts]);

  // Listen for OAuth popup success/error messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "oauth_success") {
        toast.success(`${event.data.platform} connected successfully!`);
        fetchConnectedAccounts();
        setConnecting(null);
      } else if (event.data?.type === "oauth_error") {
        toast.error("Connection cancelled");
        setConnecting(null);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchConnectedAccounts]);

  const handleConnect = async (platform) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error("Please log in again");
      return;
    }

    setConnecting(platform);
    try {
      const response = await axios.post(
        `${API}/oauth/${platform}/authorize?user_id=${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const authUrl = response.data?.auth_url;
      if (authUrl) {
        // Open OAuth in popup
        const width = 600, height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          authUrl,
          `oauth_${platform}`,
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        // Fallback: if popup closed without postMessage
        const pollTimer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(pollTimer);
            setConnecting(null);
            fetchConnectedAccounts();
          }
        }, 1000);
      } else {
        toast.info(`${platform} OAuth not configured yet`);
        setConnecting(null);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || `Failed to connect ${platform}`;
      toast.error(msg);
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

  const connectedCount = Object.keys(connected).length + Object.keys(verified).length;

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Connect Socials</h1>
        <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
          {connectedCount} of {PLATFORMS.length} connected
        </p>
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-purple-500/10" : "bg-purple-50"}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Verify your identity, get better matches</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                OAuth-verified profiles get a verified badge and rank higher in Taj's matches. Takes 10 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform List */}
      <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
        {PLATFORMS.map((platform) => {
          const isVerified = !!verified[platform.key];
          const isConnected = isVerified || !!connected[platform.key];
          const isConnecting = connecting === platform.key;

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
                <div className="flex items-center gap-1.5">
                  <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{platform.label}</p>
                  {isVerified && (
                    <ShieldCheck size={14} className="text-blue-400 flex-shrink-0" />
                  )}
                </div>
                {isConnected ? (
                  connected[platform.key] ? (
                    <a
                      href={connected[platform.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-green-500"
                    >
                      <Check size={12} />
                      {isVerified ? "Verified" : "Connected"}
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <p className="flex items-center gap-1 text-sm text-green-500">
                      <Check size={12} />
                      {isVerified ? "Verified" : "Connected"}
                    </p>
                  )
                ) : (
                  <p className={`text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                    {platform.supportsOAuth ? "Verify with OAuth" : "Not connected"}
                  </p>
                )}
              </div>

              {/* Action */}
              {isConnected ? (
                <span className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                  isVerified
                    ? darkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                    : darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"
                }`}>
                  {isVerified ? <ShieldCheck size={12} /> : <Check size={12} />}
                  {isVerified ? "Verified" : "Connected"}
                </span>
              ) : platform.supportsOAuth ? (
                <button
                  onClick={() => handleConnect(platform.key)}
                  disabled={isConnecting}
                  className="px-3 py-1.5 text-sm rounded-full font-medium transition-colors bg-[#E50914] text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isConnecting ? "..." : "Verify"}
                </button>
              ) : (
                <span className={`px-3 py-1.5 text-sm rounded-full ${darkMode ? "bg-white/5 text-white/30" : "bg-gray-100 text-gray-400"}`}>
                  Soon
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialOAuthPage;
