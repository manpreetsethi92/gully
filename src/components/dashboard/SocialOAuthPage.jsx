import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Check, ExternalLink, ShieldCheck, Link2, Save } from "lucide-react";

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", color: "#0077b5", icon: "in", supportsOAuth: true },
  { key: "google", label: "Google", color: "#4285F4", icon: "G", supportsOAuth: true },
  { key: "instagram", label: "Instagram", color: "linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)", icon: "IG", supportsOAuth: false },
  { key: "github", label: "GitHub", color: "#24292e", icon: "GH", supportsOAuth: true },
  { key: "youtube", label: "YouTube", color: "#ff0000", icon: "YT", supportsOAuth: true },
  { key: "tiktok", label: "TikTok", color: "#010101", icon: "TK", supportsOAuth: false },
  { key: "behance", label: "Behance", color: "#1769ff", icon: "Be", supportsOAuth: false },
  { key: "twitter", label: "X / Twitter", color: "#000", icon: "X", supportsOAuth: false },
  { key: "dribbble", label: "Dribbble", color: "#ea4c89", icon: "Dr", supportsOAuth: false },
];

const SOCIAL_MANUAL_LINKS = [
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/yourusername" },
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@yourusername" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/yourusername" },
  { key: "behance", label: "Behance", placeholder: "https://www.behance.net/yourusername" },
  { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/yourusername" },
];

const WORK_LINKS = [
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
      await axios.patch(
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

      {/* LinkedIn Enriched Card — shown after OAuth connect */}
      {verified.linkedin && (
        <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"}`}>
            <div className="flex items-start gap-3">
              {/* Profile photo */}
              {(connected._linkedinPicture) ? (
                <img src={connected._linkedinPicture} alt="LinkedIn" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0077b5] flex items-center justify-center flex-shrink-0 text-white font-bold">in</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{connected._linkedinName || "LinkedIn"}</p>
                  <ShieldCheck size={14} className="text-blue-400 flex-shrink-0" />
                </div>
                {connected._linkedinHeadline && (
                  <p className={`text-sm ${darkMode ? "text-white/70" : "text-gray-600"}`}>{connected._linkedinHeadline}</p>
                )}
                {connected._linkedinCompany && (
                  <p className={`text-xs mt-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>{connected._linkedinRole ? `${connected._linkedinRole} · ` : ""}{connected._linkedinCompany}</p>
                )}
                {connected._linkedinLocation && (
                  <p className={`text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}>{connected._linkedinLocation}</p>
                )}
                {connected._linkedinSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {connected._linkedinSkills.slice(0, 5).map(s => (
                      <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-white/10 text-white/60" : "bg-gray-200 text-gray-600"}`}>{s}</span>
                    ))}
                    {connected._linkedinSkills.length > 5 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-white/10 text-white/40" : "bg-gray-200 text-gray-400"}`}>+{connected._linkedinSkills.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Enriched Card */}
      {verified.github && connected._githubUsername && (
        <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
            <div className="flex items-start gap-3">
              {connected._githubAvatar ? (
                <img src={connected._githubAvatar} alt="GitHub" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#24292e] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">GH</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{connected._githubName || connected._githubUsername}</p>
                  <ShieldCheck size={14} className="text-blue-400 flex-shrink-0" />
                </div>
                <p className={`text-xs ${darkMode ? "text-white/40" : "text-gray-400"}`}>@{connected._githubUsername} · {connected._githubRepos} repos · {connected._githubFollowers} followers</p>
                {connected._githubBio && <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>{connected._githubBio}</p>}
                {connected._githubLanguages?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {connected._githubLanguages.slice(0, 6).map(l => (
                      <span key={l} className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-white/10 text-white/60" : "bg-gray-200 text-gray-600"}`}>{l}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Enriched Card */}
      {verified.youtube && connected._youtubeName && (
        <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"}`}>
            <div className="flex items-start gap-3">
              {connected._youtubeAvatar ? (
                <img src={connected._youtubeAvatar} alt="YouTube" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#ff0000] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">YT</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{connected._youtubeName}</p>
                  <ShieldCheck size={14} className="text-blue-400 flex-shrink-0" />
                </div>
                <p className={`text-xs ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                  {connected._youtubeSubscribers?.toLocaleString()} subscribers · {connected._youtubeVideos?.toLocaleString()} videos
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Portfolio & Work Links Section */}
      <div className={`mt-6 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Link2 size={20} className={darkMode ? "text-white" : "text-gray-900"} />
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Portfolio & Work Links
            </h2>
          </div>
          <p className={`text-sm mb-4 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
            Manually add your profile links for platforms without OAuth, plus portfolio and work samples
          </p>

          {/* Social Platforms (Coming Soon for OAuth) */}
          <div className="mb-6">
            <h3 className={`text-sm font-semibold mb-3 ${darkMode ? "text-white/80" : "text-gray-700"}`}>
              Social Profiles (Coming Soon for OAuth)
            </h3>
            <div className="space-y-3">
              {SOCIAL_MANUAL_LINKS.map((link) => (
                <div key={link.key}>
                  <label className={`text-xs font-medium mb-1 block ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                    {link.label}
                  </label>
                  <input
                    type="url"
                    value={portfolioLinks[link.key] || ""}
                    onChange={(e) => {
                      setPortfolioLinks(prev => ({
                        ...prev,
                        [link.key]: e.target.value
                      }));
                    }}
                    placeholder={link.placeholder}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      darkMode
                        ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/20"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Work & Portfolio Links */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${darkMode ? "text-white/80" : "text-gray-700"}`}>
              Work & Portfolio
            </h3>
            <div className="space-y-3">
              {WORK_LINKS.map((link) => (
                <div key={link.key}>
                  <label className={`text-xs font-medium mb-1 block ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                    {link.label}
                  </label>
                  <input
                    type="url"
                    value={portfolioLinks[link.key] || ""}
                    onChange={(e) => {
                      setPortfolioLinks(prev => ({
                        ...prev,
                        [link.key]: e.target.value
                      }));
                    }}
                    placeholder={link.placeholder}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      darkMode
                        ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/20"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300"
                    } focus:outline-none`}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSavePortfolio}
            disabled={savingPortfolio}
            className="mt-4 w-full h-10 rounded-full text-white font-medium transition-colors bg-[#E50914] hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {savingPortfolio ? (
              <>
                <div className="spinner w-4 h-4" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Portfolio Links
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialOAuthPage;
