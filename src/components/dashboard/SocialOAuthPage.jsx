import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Check, ExternalLink, ShieldCheck, Save, X } from "lucide-react";

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", color: "#0077b5", icon: "in", supportsOAuth: true },
  { key: "google", label: "Google", color: "#4285F4", icon: "G", supportsOAuth: true },
  { key: "github", label: "GitHub", color: "#24292e", icon: "GH", supportsOAuth: true },
  { key: "youtube", label: "YouTube", color: "#ff0000", icon: "YT", supportsOAuth: true },
  { key: "instagram", label: "Instagram", color: "linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)", icon: "IG", supportsOAuth: false },
  { key: "twitter", label: "X / Twitter", color: "#000", icon: "X", supportsOAuth: false },
];

const SOCIAL_MANUAL_LINKS = [
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/yourusername" },
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@yourusername" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/yourusername" },
  { key: "behance", label: "Behance", placeholder: "https://www.behance.net/yourusername" },
  { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/yourusername" },
];

const WORK_LINKS = [
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@yourusername" },
  { key: "behance", label: "Behance", placeholder: "https://www.behance.net/yourusername" },
  { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/yourusername" },
  { key: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/artist/..." },
  { key: "imdb", label: "IMDb", placeholder: "https://www.imdb.com/name/nm..." },
  { key: "vimeo", label: "Vimeo", placeholder: "https://vimeo.com/yourusername" },
  { key: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/yourusername" },
  { key: "website", label: "Personal Website", placeholder: "https://yourwebsite.com" },
  { key: "portfolio", label: "Portfolio", placeholder: "https://yourportfolio.com" },
];

const PORTFOLIO_LINKS = [...SOCIAL_MANUAL_LINKS, ...WORK_LINKS];

const SocialOAuthPage = ({ darkMode }) => {
  const { token, user } = useAuth();
  const [connected, setConnected] = useState({});
  const [verified, setVerified] = useState({});
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [portfolioLinks, setPortfolioLinks] = useState({});
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [selectedLinkType, setSelectedLinkType] = useState("");
  const [customLinkLabel, setCustomLinkLabel] = useState("");
  const [customLinkUrl, setCustomLinkUrl] = useState("");

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

      // Pull LinkedIn enriched data for the profile card
      const enriched = userData.linkedin_enriched || {};
      const oauthLinkedIn = oauth.linkedin || {};
      if (verifiedResult.linkedin) {
        connectedResult._linkedinName = oauthLinkedIn.name || userData.name || "";
        connectedResult._linkedinHeadline = enriched.headline || userData.headline || oauthLinkedIn.headline || "";
        connectedResult._linkedinCompany = enriched.current_company || userData.current_company || "";
        connectedResult._linkedinRole = enriched.current_role || userData.current_role || "";
        connectedResult._linkedinLocation = enriched.location || userData.location || "";
        connectedResult._linkedinPicture = oauthLinkedIn.picture || enriched.profile_picture || userData.photo_url || "";
        connectedResult._linkedinSkills = enriched.skills || userData.skills || [];
      }

      // GitHub enriched data
      const oauthGithub = oauth.github || {};
      if (verifiedResult.github) {
        connectedResult._githubUsername = oauthGithub.username || "";
        connectedResult._githubName = oauthGithub.name || "";
        connectedResult._githubBio = oauthGithub.bio || "";
        connectedResult._githubRepos = oauthGithub.public_repos || 0;
        connectedResult._githubFollowers = oauthGithub.followers || 0;
        connectedResult._githubLanguages = oauthGithub.languages || [];
        connectedResult._githubAvatar = oauthGithub.avatar_url || "";
        connectedResult._githubUrl = oauthGithub.profile_url || "";
      }

      // YouTube enriched data
      const oauthYoutube = oauth.youtube || {};
      if (verifiedResult.youtube) {
        connectedResult._youtubeName = oauthYoutube.channel_name || "";
        connectedResult._youtubeSubscribers = oauthYoutube.subscriber_count || 0;
        connectedResult._youtubeVideos = oauthYoutube.video_count || 0;
        connectedResult._youtubeUrl = oauthYoutube.channel_url || "";
        connectedResult._youtubeAvatar = oauthYoutube.profile_picture || "";
      }

      setConnected(connectedResult);
      setVerified(verifiedResult);

      // Load portfolio links
      const portfolio = {};
      PORTFOLIO_LINKS.forEach(link => {
        if (links[link.key]) {
          portfolio[link.key] = links[link.key];
        }
      });
      setPortfolioLinks(portfolio);
    } catch {
      setConnected({});
      setVerified({});
      setPortfolioLinks({});
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
      // SECURITY: Validate origin to prevent malicious messages
      if (event.origin !== window.location.origin) return;

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

  const handleSavePortfolio = async () => {
    setSavingPortfolio(true);
    try {
      await axios.put(
        `${API}/users/me`,
        { social_links: portfolioLinks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Portfolio links saved!");
      fetchConnectedAccounts(); // Refresh data
    } catch (error) {
      toast.error("Failed to save portfolio links");
      console.error("Save error:", error);
    } finally {
      setSavingPortfolio(false);
    }
  };

  const handleAddLink = () => {
    if (selectedLinkType === "custom") {
      if (!customLinkLabel || !customLinkUrl) {
        toast.error("Please provide both label and URL");
        return;
      }
      // Add custom link with a unique key
      const customKey = `custom_${Date.now()}`;
      setPortfolioLinks(prev => ({
        ...prev,
        [customKey]: customLinkUrl,
        [`${customKey}_label`]: customLinkLabel
      }));
    } else if (selectedLinkType) {
      // Just mark this predefined link type as ready to fill
      setPortfolioLinks(prev => ({
        ...prev,
        [selectedLinkType]: prev[selectedLinkType] || ""
      }));
    }
    // Reset modal
    setShowAddLinkModal(false);
    setSelectedLinkType("");
    setCustomLinkLabel("");
    setCustomLinkUrl("");
  };

  const handleRemoveLink = (key) => {
    setPortfolioLinks(prev => {
      const updated = { ...prev };
      delete updated[key];
      if (key.startsWith("custom_")) {
        delete updated[`${key}_label`];
      }
      return updated;
    });
  };

  // Get list of added links (excluding meta fields like _label)
  const addedLinks = Object.keys(portfolioLinks).filter(
    key => !key.endsWith("_label")
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Connect Socials</h1>
            <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              {connectedCount} of {PLATFORMS.length} connected
            </p>
          </div>
          <button
            onClick={() => setShowAddLinkModal(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              darkMode
                ? "bg-white/10 text-white hover:bg-white/15"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            <span className="text-lg leading-none">+</span>
            Add Link
          </button>
        </div>
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
          const showManualInput = !platform.supportsOAuth && !isConnected;

          return (
            <div key={platform.key}>
              <div className={`px-4 py-4 flex items-center gap-3 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
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
                      {platform.supportsOAuth ? "Verify with OAuth" : "Add your profile link"}
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

              {/* Inline Manual Input for Coming Soon Platforms */}
              {showManualInput && (
                <div className={`px-4 pb-4 ${darkMode ? "bg-white/[0.02]" : "bg-gray-50/50"}`}>
                  <input
                    type="url"
                    value={portfolioLinks[platform.key] || ""}
                    onChange={(e) => {
                      setPortfolioLinks(prev => ({
                        ...prev,
                        [platform.key]: e.target.value
                      }));
                    }}
                    placeholder={`https://${platform.label.toLowerCase().replace(' / ', '.').replace(' ', '')}.com/yourusername`}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      darkMode
                        ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/20"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Portfolio Links - Same format as platforms */}
      <>
        {addedLinks.map((key) => {
        const linkInfo = WORK_LINKS.find(l => l.key === key);
        const label = linkInfo?.label || portfolioLinks[`${key}_label`] || key;
        const url = portfolioLinks[key];

        // Get first 2 letters for icon
        const iconText = label.substring(0, 2).toUpperCase();

        return (
          <div key={key}>
            <div className={`px-4 py-4 flex items-center gap-3 border-t ${darkMode ? "border-white/10 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"} transition-colors`}>
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                  darkMode ? "bg-white/10" : "bg-gray-800"
                }`}
              >
                {iconText}
              </div>

              {/* Platform Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {label}
                </p>
                <p className={`text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                  Add your profile link
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={() => handleRemoveLink(key)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? "hover:bg-white/10 text-white/40 hover:text-white/70" : "hover:bg-gray-200 text-gray-400 hover:text-gray-700"
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Inline input field */}
            <div className={`px-4 pb-4 ${darkMode ? "bg-white/[0.02]" : "bg-gray-50/50"}`}>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setPortfolioLinks(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }));
                }}
                placeholder={linkInfo?.placeholder || "https://..."}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/20"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300"
                } focus:outline-none`}
              />
            </div>
          </div>
        );
      })}

        {/* Save All Links Button */}
        {addedLinks.length > 0 && (
          <div className={`px-4 py-4 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
            <button
              onClick={handleSavePortfolio}
              disabled={savingPortfolio}
              className="w-full h-10 rounded-full text-white font-medium transition-colors bg-[#E50914] hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {savingPortfolio ? (
                <>
                  <div className="spinner w-4 h-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save All Links
                </>
              )}
            </button>
          </div>
        )}
      </>

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? "bg-[#0a0a0a]" : "bg-white"}`}>
            <button
              onClick={() => {
                setShowAddLinkModal(false);
                setSelectedLinkType("");
                setCustomLinkLabel("");
                setCustomLinkUrl("");
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <X size={20} className={darkMode ? "text-white" : "text-gray-900"} />
            </button>

            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Add Portfolio Link
              </h2>

              <div className="space-y-3 mb-4">
                <p className={`text-sm ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                  Select a preset or add a custom link
                </p>

                {/* Preset Options */}
                <div className="space-y-2">
                  {WORK_LINKS.map((link) => (
                    <button
                      key={link.key}
                      onClick={() => setSelectedLinkType(link.key)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedLinkType === link.key
                          ? darkMode
                            ? "bg-[#E50914]/10 border-[#E50914]"
                            : "bg-red-50 border-[#E50914]"
                          : darkMode
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <p className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {link.label}
                      </p>
                    </button>
                  ))}

                  {/* Custom Option */}
                  <button
                    onClick={() => setSelectedLinkType("custom")}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedLinkType === "custom"
                        ? darkMode
                          ? "bg-[#E50914]/10 border-[#E50914]"
                          : "bg-red-50 border-[#E50914]"
                        : darkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <p className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Other (Custom Link)
                    </p>
                  </button>
                </div>

                {/* Custom Link Inputs */}
                {selectedLinkType === "custom" && (
                  <div className="space-y-3 mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                        Label
                      </label>
                      <input
                        type="text"
                        value={customLinkLabel}
                        onChange={(e) => setCustomLinkLabel(e.target.value)}
                        placeholder="e.g., My Portfolio"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-white/5 border-white/10 text-white placeholder-white/30"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                        } focus:outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                        URL
                      </label>
                      <input
                        type="url"
                        value={customLinkUrl}
                        onChange={(e) => setCustomLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-white/5 border-white/10 text-white placeholder-white/30"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                        } focus:outline-none`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddLink}
                disabled={!selectedLinkType}
                className="w-full h-10 rounded-full text-white font-medium transition-colors bg-[#E50914] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialOAuthPage;
