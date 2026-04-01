import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Check, ExternalLink, ShieldCheck, Save, X } from "lucide-react";

const PlatformIcon = ({ platformKey, size = 44 }) => {
  const icons = {
    linkedin: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    google: (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  };
  return icons[platformKey] || null;
};

const PLATFORM_BG = {
  linkedin:  "#0A66C2",
  google:    "#ffffff",
  github:    "#24292e",
  youtube:   "#FF0000",
  instagram: "linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)",
  tiktok:    "#010101",
  facebook:  "#1877F2",
};

const PLATFORMS = [
  { key: "google",    label: "Google",    supportsOAuth: true },
  { key: "linkedin",  label: "LinkedIn",  supportsOAuth: true },
  { key: "github",    label: "GitHub",    supportsOAuth: true },
  { key: "youtube",   label: "YouTube",   supportsOAuth: true },
];

const SOCIAL_MANUAL_LINKS = [
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/yourusername" },
  { key: "twitter",   label: "X / Twitter", placeholder: "https://x.com/yourusername" },
  { key: "tiktok",    label: "TikTok",    placeholder: "https://www.tiktok.com/@yourusername" },
  { key: "behance",   label: "Behance",   placeholder: "https://www.behance.net/yourusername" },
  { key: "dribbble",  label: "Dribbble",  placeholder: "https://dribbble.com/yourusername" },
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
  const pollTimerRef = useRef(null);

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
      // fabric_connected_platforms is set by the backend when Fabric sync completes
      const fabricPlatforms = userData.fabric_connected_platforms || [];

      PLATFORMS.forEach(p => {
        if (links[p.key]) connectedResult[p.key] = links[p.key];
        // linked_at is stamped by Fabric webhook; social_oauth by direct OAuth
        // fabric_connected_platforms is a fallback for when linked_at isn't set yet
        if (oauth[p.key] || linkedAt[p.key] || fabricPlatforms.includes(p.key)) {
          verifiedResult[p.key] = true;
        }
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
    // Cleanup polling interval on unmount
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
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
        // Instagram (Fabric) must open in new tab — Chrome blocks accountscenter.instagram.com in popups
        const isFabricPlatform = platform === "instagram";
        if (isFabricPlatform) {
          window.open(authUrl, "_blank");
          // Poll for completion by checking connected accounts every 3 seconds
          pollTimerRef.current = setInterval(() => {
            fetchConnectedAccounts();
          }, 3000);
          setTimeout(() => {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
            setConnecting(null);
            fetchConnectedAccounts();
          }, 120000); // stop polling after 2 mins
        } else {
          // Standard OAuth popup for Google, LinkedIn, GitHub, YouTube
          const width = 600, height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          const popup = window.open(
            authUrl,
            `oauth_${platform}`,
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
          );
          // Fallback: if popup closed without postMessage
          pollTimerRef.current = setInterval(() => {
            if (popup?.closed) {
              clearInterval(pollTimerRef.current);
              pollTimerRef.current = null;
              setConnecting(null);
              fetchConnectedAccounts();
            }
          }, 1000);
        }
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
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: PLATFORM_BG[platform.key] || "#333" }}
                >
                  <PlatformIcon platformKey={platform.key} />
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
                {isVerified ? (
                  <span className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                    darkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                  }`}>
                    <ShieldCheck size={12} />
                    Verified
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
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setShowAddLinkModal(false);
            setSelectedLinkType("");
            setCustomLinkLabel("");
            setCustomLinkUrl("");
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? "bg-[#0a0a0a]" : "bg-white"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowAddLinkModal(false);
                setSelectedLinkType("");
                setCustomLinkLabel("");
                setCustomLinkUrl("");
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              aria-label="Close modal"
            >
              <X size={20} className={darkMode ? "text-white" : "text-gray-900"} />
            </button>

            <div className="p-6">
              <h2 id="modal-title" className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
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
                className="w-full h-10 rounded-full text-white font-medium transition-colors bg-[#E50914] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E50914]"
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
