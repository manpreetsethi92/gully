/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import {
  Network, Users, Search, Link2, Mail, Instagram, Linkedin,
  Flame, Clock, Building2, ChevronRight, ChevronDown, RefreshCw, X,
  Gift, Copy, Share2, MessageCircle, Calendar, BadgeCheck
} from "lucide-react";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1: INVITE & EARN (Referrals)
// ══════════════════════════════════════════════════════════════════════════════

const InviteEarnSection = ({ darkMode, token }) => {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await axios.get(`${API}/referrals/my-link`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReferral(res.data);
      } catch {
        setReferral(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReferral();
  }, [token]);

  const handleCopy = () => {
    if (!referral?.referral_url) return;
    navigator.clipboard.writeText(referral.referral_url);
    toast.success("Referral link copied!");
  };

  const handleWhatsAppShare = () => {
    if (!referral?.referral_url) return;
    const text = encodeURIComponent(
      `Join me on Titlii — find creative gigs and collaborators. ${referral.referral_url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (!referral?.referral_url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Titlii",
          text: "Find creative gigs and collaborators.",
          url: referral.referral_url,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (loading) return null;

  const referralUrl = referral?.referral_url || "";
  const clicks = referral?.clicks || 0;
  const signups = referral?.signups || 0;
  const proMonths = referral?.pro_months_earned || 0;

  return (
    <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
      <div className={`p-4 rounded-2xl ${darkMode ? "bg-red-500/10" : "bg-red-50"}`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>
              Invite friends, earn Pro free
            </p>
            <p className={`text-xs mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
              {clicks} clicks • {signups} signups • {proMonths > 0 ? `+${proMonths} Pro months` : "No Pro months yet"}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1 ${darkMode ? "text-white/50" : "text-gray-400"}`}
          >
            <ChevronDown size={18} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        {expanded && referralUrl && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className={`flex items-center gap-2 p-2 rounded-lg border mb-2 ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
              <p className={`flex-1 text-xs truncate font-mono ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                {referralUrl}
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-semibold"
                style={{ background: "#E50914" }}
              >
                <Copy size={12} /> Copy
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-semibold"
                style={{ background: "#25D366" }}
              >
                <MessageCircle size={13} /> WhatsApp
              </button>
              <button
                onClick={handleNativeShare}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border ${darkMode ? "border-white/10 text-white hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                <Share2 size={12} /> Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2: CONNECTIONS (Titlii work relationships)
// ══════════════════════════════════════════════════════════════════════════════

const ConnectionCard = ({ conn, darkMode, expanded, onToggle }) => {
  const connection = conn.other_user || conn;

  return (
    <div className={`border-b transition-all ${darkMode ? "border-white/10" : "border-gray-100"} ${expanded ? (darkMode ? "bg-white/5" : "bg-gray-50") : ""}`}>
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={onToggle}>
        {/* Avatar */}
        {connection.photo_url ? (
          <img src={connection.photo_url} alt={connection.name || "User"} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            {connection.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-[15px] flex items-center gap-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
              {connection.name}
              {connection.is_verified && <BadgeCheck size={14} className="text-blue-500" fill="currentColor" strokeWidth={0} />}
            </h3>
            {(connection.instagram || connection.social_links?.instagram) && (
              <a href={`https://instagram.com/${(connection.instagram || connection.social_links?.instagram).replace("@", "")}`} target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-white/40 hover:text-pink-400" : "text-gray-400 hover:text-pink-500"}`} onClick={(e) => e.stopPropagation()}>
                <Instagram size={13} />
              </a>
            )}
            {(connection.linkedin || connection.social_links?.linkedin) && (
              <a href={(() => { const linkedinValue = connection.linkedin || connection.social_links?.linkedin; return linkedinValue.startsWith("http") ? linkedinValue : `https://linkedin.com/in/${linkedinValue}`; })()} target="_blank" rel="noopener noreferrer" className={`${darkMode ? "text-white/40 hover:text-blue-400" : "text-gray-400 hover:text-blue-500"}`} onClick={(e) => e.stopPropagation()}>
                <Linkedin size={13} />
              </a>
            )}
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">Connected</span>
          </div>
          {connection.bio && <p className={`text-sm mt-1 line-clamp-1 ${darkMode ? "text-white/70" : "text-gray-600"}`}>{connection.bio}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(connection.skills || []).slice(0, 3).map((skill, idx) => (
              <span key={idx} className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-600"}`}>{skill}</span>
            ))}
            {(connection.skills || []).length > 3 && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-600"}`}>+{connection.skills.length - 3}</span>
            )}
          </div>
        </div>
        <ChevronDown size={16} className={`${darkMode ? "text-white/30" : "text-gray-400"} transition-transform flex-shrink-0 mt-1 ${expanded ? "rotate-180" : ""}`} />
      </div>

      {expanded && (
        <div className={`px-4 pb-4 border-t ${darkMode ? "border-white/5" : "border-gray-100"}`}>
          <div className="pl-14">
            <div className={`flex items-center gap-2 text-xs mb-2 mt-3 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              <Calendar size={11} />
              <span>Connected {new Date(conn.created_at || conn.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            {conn.request_title && (
              <div className={`text-sm mb-2 p-2 rounded-lg ${darkMode ? "bg-white/5 text-white/70" : "bg-gray-50 text-gray-700"}`}>
                <span className={`text-xs font-medium block mb-1 ${darkMode ? "text-white/50" : "text-gray-500"}`}>Connected for:</span>
                {conn.request_title}
              </div>
            )}
            {(connection.skills || []).length > 3 && (
              <div>
                <span className={`text-xs font-medium block mb-1.5 ${darkMode ? "text-white/50" : "text-gray-500"}`}>All skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(connection.skills || []).map((skill, idx) => (
                    <span key={idx} className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-600"}`}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3: MY CONTACTS (Imported network)
// ══════════════════════════════════════════════════════════════════════════════

const ImportControls = ({ darkMode, onConnect, connecting }) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <button
        onClick={() => onConnect("linkedin")}
        disabled={connecting === "linkedin"}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${darkMode ? "bg-[#0077b5]/20 text-[#4db8ff] hover:bg-[#0077b5]/30" : "bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20"}`}
      >
        <Linkedin size={13} /> {connecting === "linkedin" ? "Connecting..." : "Connect LinkedIn"}
      </button>

      <button
        onClick={() => onConnect("google")}
        disabled={connecting === "google"}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${darkMode ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
      >
        <Mail size={13} /> {connecting === "google" ? "Connecting..." : "Connect Google"}
      </button>

      <button
        onClick={() => onConnect("instagram")}
        disabled={connecting === "instagram"}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${darkMode ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30" : "bg-purple-50 text-purple-700 hover:bg-purple-100"}`}
      >
        <Instagram size={13} /> {connecting === "instagram" ? "Connecting..." : "Connect Instagram"}
      </button>
    </div>
  );
};

const ContactCard = ({ contact, darkMode, expanded, onToggle }) => {
  const sourceColors = {
    linkedin: darkMode ? "text-[#4db8ff]" : "text-[#0077b5]",
    gmail: darkMode ? "text-red-300" : "text-red-600",
    instagram: darkMode ? "text-purple-300" : "text-purple-700",
  };
  const sourceLabel = { linkedin: "LinkedIn", gmail: "Gmail", instagram: "Instagram" };

  return (
    <div className={`px-4 py-3 border-b cursor-pointer transition-colors ${darkMode ? "border-white/10 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"}`} onClick={onToggle}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E50914] to-[#ff4757] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {(contact.contact_name || "?").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{contact.contact_name}</p>
            {contact.warm_lead_label && (
              <span className="flex items-center gap-0.5 text-orange-500 text-xs font-bold flex-shrink-0"><Flame size={10} fill="currentColor" /> Warm</span>
            )}
          </div>
          <p className={`text-xs truncate ${darkMode ? "text-white/50" : "text-gray-500"}`}>{contact.contact_role || contact.contact_company || "—"}</p>
        </div>
        <span className={`text-xs font-medium flex-shrink-0 ${sourceColors[contact.source] || ""}`}>{sourceLabel[contact.source] || contact.source}</span>
        <ChevronRight size={13} className={`flex-shrink-0 transition-transform ${expanded ? "rotate-90" : ""} ${darkMode ? "text-white/30" : "text-gray-300"}`} />
      </div>

      {expanded && (
        <div className="mt-2 ml-13 space-y-1">
          {contact.contact_company && (
            <div className={`flex items-center gap-2 text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}><Building2 size={11} /> {contact.contact_company}</div>
          )}
          {contact.contact_linkedin && (
            <a href={contact.contact_linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-xs text-[#0077b5] hover:underline"><Link2 size={11} /> View LinkedIn</a>
          )}
          {(contact.interaction_log || []).length > 0 ? (
            <div className={`mt-2 pt-2 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
              <p className={`text-xs font-semibold mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>History</p>
              {contact.interaction_log.slice(-3).map((ev, i) => (
                <div key={i} className={`flex items-start gap-1.5 text-xs ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                  <Clock size={10} className="mt-0.5 flex-shrink-0" />
                  <span>{ev.description || ev.type || "Interaction"} · {ev.ts ? new Date(ev.ts).toLocaleDateString() : ""}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}>No interactions yet</p>
          )}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN UNIFIED NETWORK PAGE
// ══════════════════════════════════════════════════════════════════════════════

const NetworkPage = ({ darkMode }) => {
  const { token, user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedConnectionId, setExpandedConnectionId] = useState(null);
  const [expandedContactId, setExpandedContactId] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [activeTab, setActiveTab] = useState("connections");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [connectionsRes, contactsRes] = await Promise.all([
        axios.get(`${API}/connections`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/network`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setConnections(connectionsRes.data || []);
      setContacts(contactsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch network data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for OAuth callback success
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      // SECURITY: Validate origin to prevent malicious messages
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "oauth_success") {
        fetchData();
        toast.success("Account connected successfully!");
        setConnecting(null);
      } else if (event.data?.type === "oauth_error") {
        toast.error("Authorization cancelled");
        setConnecting(null);
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, [fetchData]);

  const handleConnect = async (platform) => {
    setConnecting(platform);
    try {
      const userId = user?.id || user?.user_id;
      if (!userId) {
        toast.error("User ID not found. Please refresh and try again.");
        setConnecting(null);
        return;
      }

      const res = await axios.get(
        `${API}/oauth/${platform}/authorize?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.auth_url) {
        // Open OAuth page in popup
        const width = 600, height = 700;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const popup = window.open(
          res.data.auth_url,
          `${platform}_oauth`,
          `width=${width},height=${height},top=${top},left=${left}`
        );

        if (!popup) {
          toast.error("Please allow popups to connect your account");
          setConnecting(null);
        } else {
          toast.success(`Opening ${platform}...`);
        }
      } else {
        toast.info(`${platform} OAuth not configured yet`);
        setConnecting(null);
      }
    } catch (e) {
      toast.error(`Connection failed — ${e?.response?.data?.detail || "try again"}`);
      setConnecting(null);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      !search ||
      (c.contact_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.contact_role || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.contact_company || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "warm" && c.warm_lead_label) || c.source === filter;
    return matchesSearch && matchesFilter;
  });

  const warmCount = contacts.filter((c) => c.warm_lead_label).length;
  const linkedinCount = contacts.filter((c) => c.source === "linkedin").length;
  const gmailCount = contacts.filter((c) => c.source === "gmail").length;
  const igCount = contacts.filter((c) => c.source === "instagram").length;
  const totalPeople = connections.length + contacts.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Network</h1>
            <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              {totalPeople} {totalPeople === 1 ? "person" : "people"}
            </p>
          </div>
          <button onClick={fetchData} disabled={loading} className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
            <RefreshCw size={18} className={`${loading ? "animate-spin" : ""} ${darkMode ? "text-white/50" : "text-gray-400"}`} />
          </button>
        </div>
      </div>

      {/* SECTION 1: Invite & Earn */}
      <InviteEarnSection darkMode={darkMode} token={token} />

      {/* TAB BAR */}
      <div className={`px-4 py-3 border-b ${darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("connections")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "connections"
                ? "bg-[#E50914] text-white"
                : darkMode
                ? "bg-white/10 text-white/60 hover:bg-white/15"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "contacts"
                ? "bg-[#E50914] text-white"
                : darkMode
                ? "bg-white/10 text-white/60 hover:bg-white/15"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            My Contacts ({contacts.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "connections" ? (
        /* CONNECTIONS TAB */
        <div>
          {connections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Users size={36} className={`mb-3 ${darkMode ? "text-white/20" : "text-gray-200"}`} />
              <p className={`font-semibold text-sm ${darkMode ? "text-white/60" : "text-gray-500"}`}>No connections yet</p>
              <p className={`text-xs mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>When you match with someone on Titlii, they'll appear here</p>
            </div>
          ) : (
            connections.map((conn) => (
              <ConnectionCard key={conn.id} conn={conn} darkMode={darkMode} expanded={expandedConnectionId === conn.id} onToggle={() => setExpandedConnectionId(expandedConnectionId === conn.id ? null : conn.id)} />
            ))
          )}
        </div>
      ) : (
        /* MY CONTACTS TAB */
        <div>
          <div className={`px-4 py-3 ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>Imported from LinkedIn, Gmail, Instagram</p>
              <button onClick={() => setShowImport(!showImport)} className={`text-xs font-semibold ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                {showImport ? "Hide" : "Import"}
              </button>
            </div>

            {showImport && <ImportControls darkMode={darkMode} onConnect={handleConnect} connecting={connecting} />}

          {/* Search */}
          {contacts.length > 0 && (
            <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? "bg-white/10" : "bg-white"}`}>
              <Search size={13} className={darkMode ? "text-white/40" : "text-gray-400"} />
              <input type="text" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className={`flex-1 bg-transparent text-xs outline-none ${darkMode ? "text-white placeholder-white/30" : "text-gray-900"}`} />
            </div>
          )}

          {/* Filters */}
          {contacts.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {[
                { key: "all", label: `All (${contacts.length})` },
                { key: "warm", label: `🔥 Warm (${warmCount})` },
                { key: "linkedin", label: `LinkedIn (${linkedinCount})` },
                { key: "gmail", label: `Gmail (${gmailCount})` },
                { key: "instagram", label: `Instagram (${igCount})` },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setFilter(tab.key)} className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${filter === tab.key ? "bg-[#E50914] text-white" : darkMode ? "bg-white/10 text-white/60 hover:bg-white/15" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

          {/* Contacts List */}
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
              <Users size={36} className={`mb-3 ${darkMode ? "text-white/20" : "text-gray-200"}`} />
              <p className={`font-semibold text-sm ${darkMode ? "text-white/60" : "text-gray-500"}`}>
                {search || filter !== "all" ? "No contacts match" : "No network imported yet"}
              </p>
              <p className={`text-xs mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                {search || filter !== "all" ? "Try a different filter" : "Tap 'Import' above to get started"}
              </p>
            </div>
          ) : (
            filteredContacts.map((c, i) => <ContactCard key={c.id || i} contact={c} darkMode={darkMode} expanded={expandedContactId === c.id} onToggle={() => setExpandedContactId(expandedContactId === c.id ? null : c.id)} />)
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkPage;
