// SocialOAuthPage — editorial redesign.
// Keeps Fabric/OAuth flow, polling, enriched data fetching — only visual rewrite.

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Check, ExternalLink, ShieldCheck, Save, X } from "lucide-react";

const PlatformIcon = ({ platformKey }) => {
  const icons = {
    linkedin: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    google: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  };
  return icons[platformKey] || null;
};

const PLATFORM_BG = {
  linkedin:  "#0A66C2",
  google:    "#ffffff",
  github:    "#24292e",
  instagram: "linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)",
};

const PLATFORMS = [
  { key: "instagram", label: "Instagram", supportsOAuth: false, usesFabric: true },
  { key: "google",    label: "Google",    supportsOAuth: true },
  { key: "linkedin",  label: "LinkedIn",  supportsOAuth: true },
  { key: "github",    label: "GitHub",    supportsOAuth: true },
];

const WORK_LINKS = [
  { key: "twitter",   label: "X / Twitter", placeholder: "https://x.com/yourusername" },
  { key: "tiktok",    label: "TikTok",      placeholder: "https://www.tiktok.com/@yourusername" },
  { key: "behance",   label: "Behance",     placeholder: "https://www.behance.net/yourusername" },
  { key: "dribbble",  label: "Dribbble",    placeholder: "https://dribbble.com/yourusername" },
  { key: "spotify",   label: "Spotify",     placeholder: "https://open.spotify.com/artist/..." },
  { key: "imdb",      label: "IMDb",        placeholder: "https://www.imdb.com/name/nm..." },
  { key: "vimeo",     label: "Vimeo",       placeholder: "https://vimeo.com/yourusername" },
  { key: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/yourusername" },
  { key: "website",   label: "Personal website", placeholder: "https://yourwebsite.com" },
  { key: "portfolio", label: "Portfolio",   placeholder: "https://yourportfolio.com" },
];

const PORTFOLIO_LINKS = [
  { key: "twitter" }, { key: "tiktok" }, { key: "behance" }, { key: "dribbble" },
  { key: "spotify" }, { key: "imdb" }, { key: "vimeo" }, { key: "soundcloud" },
  { key: "website" }, { key: "portfolio" },
];

const SocialOAuthPage = ({ darkMode, hideHeader = false }) => {
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
      const fabricPlatforms = userData.fabric_connected_platforms || [];

      const connectedResult = {};
      const verifiedResult = {};
      PLATFORMS.forEach(p => {
        if (links[p.key]) connectedResult[p.key] = links[p.key];
        if (oauth[p.key] || linkedAt[p.key] || fabricPlatforms.includes(p.key)) {
          verifiedResult[p.key] = true;
        }
      });

      setConnected(connectedResult);
      setVerified(verifiedResult);

      const portfolio = {};
      PORTFOLIO_LINKS.forEach(link => {
        if (links[link.key]) portfolio[link.key] = links[link.key];
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
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [fetchConnectedAccounts]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "oauth_success") {
        toast.success(`${event.data.platform} connected`);
        fetchConnectedAccounts();
        setConnecting(null);
      } else if (event.data?.type === "oauth_error") {
        toast.error("connection cancelled");
        setConnecting(null);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchConnectedAccounts]);

  const handleConnect = async (platform) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error("please log in again");
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
        window.open(authUrl, "_blank");
        pollTimerRef.current = setInterval(fetchConnectedAccounts, 3000);
        setTimeout(() => {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
          setConnecting(null);
          fetchConnectedAccounts();
        }, 120000);
      } else {
        toast.info(`${platform} oauth not configured yet`);
        setConnecting(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || `couldn't connect ${platform}`);
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
      toast.success("links saved");
      fetchConnectedAccounts();
    } catch {
      toast.error("couldn't save");
    } finally {
      setSavingPortfolio(false);
    }
  };

  const handleAddLink = () => {
    if (selectedLinkType === "custom") {
      if (!customLinkLabel || !customLinkUrl) {
        toast.error("need both label and url");
        return;
      }
      const customKey = `custom_${Date.now()}`;
      setPortfolioLinks(prev => ({
        ...prev,
        [customKey]: customLinkUrl,
        [`${customKey}_label`]: customLinkLabel
      }));
    } else if (selectedLinkType) {
      setPortfolioLinks(prev => ({
        ...prev,
        [selectedLinkType]: prev[selectedLinkType] || ""
      }));
    }
    setShowAddLinkModal(false);
    setSelectedLinkType("");
    setCustomLinkLabel("");
    setCustomLinkUrl("");
  };

  const handleRemoveLink = (key) => {
    setPortfolioLinks(prev => {
      const updated = { ...prev };
      delete updated[key];
      if (key.startsWith("custom_")) delete updated[`${key}_label`];
      return updated;
    });
  };

  const addedLinks = Object.keys(portfolioLinks).filter(k => !k.endsWith("_label"));

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  const connectedCount = Object.keys(verified).length;

  return (
    <div>
      {!hideHeader && (
        <div className="mb-1">
          <div className={`font-mono text-[11px] ${darkMode ?"text-white/40" :"text-gray-400"}`}>
            how people find you
          </div>
          <h1 className={`text-[18px] font-semibold mb-7 ${darkMode ?"text-white" :"text-gray-900"}`}>
            connect socials.
          </h1>
        </div>
      )}

      {/* Top meta row: count + add link */}
      <div className="flex items-center justify-between mb-4">
        <p className={`font-mono text-[10.5px] ${darkMode ?"text-white/40" :"text-gray-400"}`}>
          {connectedCount} of {PLATFORMS.length} connected
        </p>
        <button
          onClick={() => setShowAddLinkModal(true)}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
 darkMode ?"bg-white/5 text-white border border-white/10 hover:bg-white/10"
 :"bg-white text-gray-900 border border-gray-200 hover:border-gray-400"
 }`}
        >
          <span className="text-lg leading-none">+</span>
          add link
        </button>
      </div>

      {/* Taj-voice intro */}
      <section className={`rounded-2xl border p-5 mb-5 ${darkMode ?"border-white/10 bg-white/[0.03]" :"border-gray-100 bg-white"}`}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}>
            T
          </div>
          <div className="flex-1">
            <p className={`text-[14.5px] leading-[1.55] ${darkMode ?"text-white/90" :"text-gray-900"}`}>
              verify yourself and i can match you better. oauth-verified profiles rank higher and get a verified badge. 10 seconds per platform.
            </p>
          </div>
        </div>
      </section>

      {/* Platforms section label */}
      <div className={`font-mono text-[10px] mb-2 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
        verified accounts
      </div>

      {/* Platform rows */}
      <div className="mb-6">
        {PLATFORMS.map((platform) => {
          const isVerified = !!verified[platform.key];
          const isConnected = isVerified || !!connected[platform.key];
          const isConnecting = connecting === platform.key;

          return (
            <article
              key={platform.key}
              className={`rounded-2xl border p-4 mb-2 flex items-center gap-3 transition-colors ${
 darkMode ?"border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
 :"border-gray-100 bg-white hover:border-gray-200"
 }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: PLATFORM_BG[platform.key] || "#333" }}
              >
                <PlatformIcon platformKey={platform.key} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[14px] font-medium ${darkMode ?"text-white" :"text-gray-900"}`}>
                    {platform.label}
                  </span>
                  {isVerified && <ShieldCheck size={12} className="text-blue-400 flex-shrink-0" />}
                </div>
                {isConnected ? (
                  connected[platform.key] ? (
                    <a
                      href={connected[platform.key]}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-green-600"
                    >
                      <Check size={10} /> {isVerified ? "verified" : "connected"} <ExternalLink size={9} />
                    </a>
                  ) : (
                    <p className="inline-flex items-center gap-1 font-mono text-[11px] text-green-600">
                      <Check size={10} /> {isVerified ? "verified" : "connected"}
                    </p>
                  )
                ) : (
                  <p className={`font-mono text-[11px] tracking-wide ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                    {platform.supportsOAuth || platform.usesFabric ? "verify with oauth" : "add your profile link"}
                  </p>
                )}
              </div>
              {isVerified ? (
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide"
                  style={{ color: "#2563eb", background: darkMode ? "rgba(37,99,235,0.2)" : "#eff6ff" }}
                >
                  verified
                </span>
              ) : (platform.supportsOAuth || platform.usesFabric) ? (
                <button
                  onClick={() => handleConnect(platform.key)}
                  disabled={isConnecting}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium text-white disabled:opacity-50"
                  style={{ background: "#0a0a0a" }}
                >
                  {isConnecting ? "…" : "verify"}
                </button>
              ) : (
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide ${darkMode ?"bg-white/5 text-white/30" :"bg-gray-100 text-gray-400"}`}>
                  soon
                </span>
              )}
            </article>
          );
        })}
      </div>

      {/* Portfolio links */}
      {addedLinks.length > 0 && (
        <>
          <div className={`font-mono text-[10px] mb-2 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
            portfolio & work
          </div>
          <div className="mb-4">
            {addedLinks.map((key) => {
              const linkInfo = WORK_LINKS.find(l => l.key === key);
              const label = linkInfo?.label || portfolioLinks[`${key}_label`] || key;
              const url = portfolioLinks[key] || "";
              const iconText = label.substring(0, 2).toUpperCase();

              return (
                <article
                  key={key}
                  className={`rounded-2xl border p-4 mb-2 ${darkMode ?"border-white/10 bg-white/[0.03]" :"border-gray-100 bg-white"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-semibold text-[11px] flex-shrink-0 ${darkMode ?"bg-white/10 text-white" :"bg-gray-900 text-white"}`}>
                      {iconText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[14px] font-medium ${darkMode ?"text-white" :"text-gray-900"}`}>
                        {label}
                      </div>
                      <div className={`font-mono text-[11px] tracking-wide ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                        add your link
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveLink(key)}
                      className={`p-1.5 rounded-full transition-colors ${darkMode ?"hover:bg-white/10 text-white/40 hover:text-white/70" :"hover:bg-gray-100 text-gray-400 hover:text-gray-700"}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setPortfolioLinks(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={linkInfo?.placeholder || "https://..."}
                    className={`w-full px-3 py-2 rounded-xl border font-mono text-[12px] placeholder:focus:outline-none ${
 darkMode ?"bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/30"
 :"bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
 }`}
                  />
                </article>
              );
            })}
          </div>

          <button
            onClick={handleSavePortfolio}
            disabled={savingPortfolio}
            className="w-full py-2.5 rounded-full text-[13px] font-medium text-white transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            style={{ background: "#0a0a0a" }}
          >
            {savingPortfolio ? (
              <><div className="spinner w-4 h-4" /> saving…</>
            ) : (
              <><Save size={13} /> save all links</>
            )}
          </button>
        </>
      )}

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
        >
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ?"bg-[#0a0a0a] border border-white/10" :"bg-white border border-gray-100"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowAddLinkModal(false);
                setSelectedLinkType("");
                setCustomLinkLabel("");
                setCustomLinkUrl("");
              }}
              className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ?"hover:bg-white/10 text-white/60" :"hover:bg-gray-100 text-gray-500"}`}
              aria-label="close"
            >
              <X size={16} />
            </button>

            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <div className={`font-mono text-[10px] mb-1 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                add portfolio link
              </div>
              <h2 className={`text-[18px] font-semibold mb-1 ${darkMode ?"text-white" :"text-gray-900"}`}>
                where else do you live?
              </h2>
              <p className={`text-[13px] mb-5 ${darkMode ?"text-white/50" :"text-gray-500"}`}>
                pick a preset or add a custom link.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {WORK_LINKS.map((link) => {
                  const selected = selectedLinkType === link.key;
                  return (
                    <button
                      key={link.key}
                      onClick={() => setSelectedLinkType(link.key)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
 selected
 ?"text-white border-transparent"
 : darkMode
 ?"bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
 :"bg-white border-gray-200 text-gray-800 hover:border-gray-400"
 }`}
                      style={selected ? { background: "#E50914" } : {}}
                    >
                      {link.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => setSelectedLinkType("custom")}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
 selectedLinkType ==="custom"
 ?"text-white border-transparent"
 : darkMode
 ?"bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
 :"bg-white border-gray-200 text-gray-800 hover:border-gray-400"
 }`}
                  style={selectedLinkType === "custom" ? { background: "#E50914" } : {}}
                >
                  other (custom)
                </button>
              </div>

              {selectedLinkType === "custom" && (
                <div className="space-y-3 mb-4">
                  <div>
                    <div className={`font-mono text-[10px] mb-1.5 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                      label
                    </div>
                    <input
                      type="text"
                      value={customLinkLabel}
                      onChange={(e) => setCustomLinkLabel(e.target.value)}
                      placeholder="e.g. my portfolio"
                      className={`w-full px-3 py-2.5 rounded-xl border text-[13px] placeholder:focus:outline-none ${
 darkMode ?"bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/30"
 :"bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
 }`}
                    />
                  </div>
                  <div>
                    <div className={`font-mono text-[10px] mb-1.5 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                      url
                    </div>
                    <input
                      type="url"
                      value={customLinkUrl}
                      onChange={(e) => setCustomLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className={`w-full px-3 py-2.5 rounded-xl border font-mono text-[12px] placeholder:focus:outline-none ${
 darkMode ?"bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/30"
 :"bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
 }`}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleAddLink}
                disabled={!selectedLinkType}
                className="w-full py-2.5 rounded-full text-[13px] font-medium text-white disabled:opacity-50"
                style={{ background: "#0a0a0a" }}
              >
                add link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialOAuthPage;
