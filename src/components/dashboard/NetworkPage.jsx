// NetworkPage v2 — editorial redesign to match the Home inbox aesthetic.
//
// Rendered inside the 'network' tab on HomePage.
// No own header (Home already renders 'what's new, taj?' above).
// No Invite & Earn banner (that's in Settings → Referrals now).
// No sticky top bar. No refresh button (fetches once on mount).
//
// Tabs:
//   - connections: people you've matched with on gully
//   - contacts: imported from linkedin/gmail/instagram
//
// Tab style matches the inbox tabs (underline, , counts inline).
// Card style matches TajMessageCard (rounded-2xl, subtle border).

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import {
  Search, Link2, Mail, Instagram, Linkedin, Flame, Clock,
  ChevronDown, BadgeCheck
} from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

// ─────────────────────────────────────────────────────────────────────────
// Connection card — matches TajMessageCard styling
// ─────────────────────────────────────────────────────────────────────────

const ConnectionCard = ({ conn, darkMode, expanded, onToggle }) => {
  const connection = conn.other_user || conn;
  const instagramValue = connection.instagram || connection.social_links?.instagram;
  const linkedinValue = connection.linkedin || connection.social_links?.linkedin;

  return (
    <article
      onClick={onToggle}
      className={`rounded-2xl border p-5 mb-3 transition-colors cursor-pointer ${
 darkMode
 ?"bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
 :"bg-white border-gray-100 hover:border-gray-200"
 }`}
    >
      <div className="flex items-start gap-3">
        {connection.photo_url ? (
          <img src={connection.photo_url} alt={connection.name || "user"} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-[14px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            {(connection.name || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
            <span className={`text-[15px] font-semibold flex items-center gap-1 ${darkMode ?"text-white" :"text-gray-900"}`}>
              {connection.name || "someone"}
              {connection.is_verified && <BadgeCheck size={12} className="text-blue-500 flex-shrink-0" fill="currentColor" strokeWidth={0} />}
            </span>
            <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide ml-auto ${darkMode ?"bg-green-500/20 text-green-300" :"bg-green-50 text-green-700"}`}>
              connected
            </span>
          </div>
          {connection.location && (
            <div className={`font-mono text-[11px] tracking-wide mb-1 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
              {connection.location}
            </div>
          )}
          {connection.bio && (
            <p className={`text-[13.5px] leading-relaxed ${darkMode ?"text-white/80" :"text-gray-700"}`}>
              {connection.bio}
            </p>
          )}
          {expanded && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.isArray(connection.skills) && connection.skills.slice(0, 8).map((skill, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-full text-[11.5px] ${darkMode ?"bg-white/10 text-white/70" :"bg-gray-100 text-gray-700"}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {expanded && (
            <div className="flex flex-wrap gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
              {instagramValue && (
                <a
                  href={`https://instagram.com/${String(instagramValue).replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium ${darkMode ?"bg-white/5 text-white/80 hover:bg-white/10" :"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <Instagram size={11} /> Instagram
                </a>
              )}
              {linkedinValue && (
                <a
                  href={String(linkedinValue).startsWith("http") ? linkedinValue : `https://linkedin.com/in/${linkedinValue}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium ${darkMode ?"bg-white/5 text-white/80 hover:bg-white/10" :"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <Linkedin size={11} /> LinkedIn
                </a>
              )}
              <a
                href={WHATSAPP_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium ${darkMode ?"bg-transparent text-white border border-white/20 hover:border-white/40" :"bg-white text-gray-900 border border-gray-200 hover:border-gray-400"}`}
              >
                <WhatsAppIcon size={10} color="#25D366" /> Ask Taj
              </a>
            </div>
          )}
        </div>
        <ChevronDown size={16} className={`flex-shrink-0 transition-transform mt-1 ${expanded ?"rotate-180" :""} ${darkMode ?"text-white/40" :"text-gray-400"}`} />
      </div>
    </article>
  );
};


// ─────────────────────────────────────────────────────────────────────────
// Contact card (imported from LinkedIn / Gmail / Instagram)
// ─────────────────────────────────────────────────────────────────────────

const SOURCE_META = {
  linkedin:  { label: "linkedin",  fg: "#0077b5", bg: "#e0f0fa" },
  gmail:     { label: "gmail",     fg: "#d93025", bg: "#fce8e6" },
  instagram: { label: "instagram", fg: "#7c3aed", bg: "#f5f3ff" }
};

const ContactCard = ({ contact, darkMode, expanded, onToggle }) => {
  const src = SOURCE_META[contact.source] || { label: contact.source || "source", fg: "#6b7280", bg: "#f3f4f6" };

  return (
    <article
      onClick={onToggle}
      className={`rounded-2xl border p-5 mb-3 transition-colors cursor-pointer ${
 darkMode
 ?"bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
 :"bg-white border-gray-100 hover:border-gray-200"
 }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-[14px] flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
        >
          {(contact.contact_name || "?").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
            <span className={`text-[15px] font-semibold truncate ${darkMode ?"text-white" :"text-gray-900"}`}>
              {(contact.contact_name || "unknown").toLowerCase()}
            </span>
            {contact.warm_lead_label && (
              <span className={`inline-flex items-center gap-0.5 font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide ${darkMode ?"bg-orange-500/20 text-orange-300" :"bg-orange-50 text-orange-600"}`}>
                <Flame size={9} fill="currentColor" /> Warm
              </span>
            )}
            <span
              className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide"
              style={{ color: src.fg, background: darkMode ? `${src.fg}22` : src.bg }}
            >
              {src.label}
            </span>
          </div>
          {(contact.contact_role || contact.contact_company) && (
            <div className={`font-mono text-[11px] tracking-wide ${darkMode ?"text-white/40" :"text-gray-400"}`}>
              {[contact.contact_role, contact.contact_company].filter(Boolean).join(" · ").toLowerCase()}
            </div>
          )}

          {expanded && (
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              {contact.contact_linkedin && (
                <a
                  href={contact.contact_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium mr-2 mb-1 ${darkMode ?"bg-white/5 text-white/80 hover:bg-white/10" :"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <Link2 size={11} /> Open LinkedIn
                </a>
              )}
              {Array.isArray(contact.interaction_log) && contact.interaction_log.length > 0 ? (
                <div className={`mt-3 pt-3 border-t ${darkMode ?"border-white/10" :"border-gray-100"}`}>
                  <div className={`font-mono text-[10px] mb-2 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                    history
                  </div>
                  {contact.interaction_log.slice(-3).map((ev, i) => (
                    <div key={i} className={`flex items-start gap-2 text-[11.5px] mb-1 ${darkMode ?"text-white/50" :"text-gray-500"}`}>
                      <Clock size={11} className="mt-0.5 flex-shrink-0" />
                      <span>
                        {(ev.description || ev.type || "interaction").toLowerCase()}
                        {ev.ts && <span className="font-mono text-[10px] ml-1">· {new Date(ev.ts).toLocaleDateString()}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`mt-2 font-mono text-[10.5px] tracking-wide ${darkMode ?"text-white/30" :"text-gray-400"}`}>
                  no interactions yet
                </div>
              )}
            </div>
          )}
        </div>
        <ChevronDown size={16} className={`flex-shrink-0 transition-transform mt-1 ${expanded ?"rotate-180" :""} ${darkMode ?"text-white/40" :"text-gray-400"}`} />
      </div>
    </article>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Import controls — three buttons for linkedin / gmail / instagram OAuth
// ─────────────────────────────────────────────────────────────────────────

const ImportControls = ({ darkMode, onConnect, connecting }) => {
  const providers = [
    { id: "linkedin", icon: Linkedin, label: "linkedin", fg: "#0077b5" },
    { id: "google",   icon: Mail,     label: "gmail",    fg: "#d93025" },
    { id: "instagram", icon: Instagram, label: "instagram", fg: "#7c3aed" }
  ];
  return (
    <div className={`rounded-2xl border p-4 mb-5 ${darkMode ?"bg-white/[0.03] border-white/10" :"bg-white border-gray-100"}`}>
      <div className={`font-mono text-[10.5px] mb-3 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
        import contacts
      </div>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => {
          const Icon = p.icon;
          const isLoading = connecting === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onConnect(p.id)}
              disabled={isLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium transition-colors disabled:opacity-50 ${darkMode ?"bg-white/5 text-white/80 border border-white/10 hover:bg-white/10" :"bg-white text-gray-900 border border-gray-200 hover:border-gray-400"}`}
              style={{ color: isLoading ? undefined : p.fg }}
            >
              <Icon size={12} />
              {isLoading ? "connecting…" : `connect ${p.label}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────
// Main NetworkPage
// ─────────────────────────────────────────────────────────────────────────

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
  const [activeSubTab, setActiveSubTab] = useState("connections");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [connectionsRes, contactsRes] = await Promise.all([
        axios.get(`${API}/connections`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/network`,     { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setConnections(connectionsRes.data || []);
      setContacts(contactsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch network data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // OAuth popup message listener
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "oauth_success") {
        fetchData();
        toast.success("account connected");
        setConnecting(null);
      } else if (event.data?.type === "oauth_error") {
        toast.error("authorization cancelled");
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
        toast.error("user id missing — refresh and try again");
        setConnecting(null);
        return;
      }
      const res = await axios.get(
        `${API}/oauth/${platform}/authorize?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.auth_url) {
        const width = 600, height = 700;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        const popup = window.open(
          res.data.auth_url,
          `${platform}_oauth`,
          `width=${width},height=${height},top=${top},left=${left}`
        );
        if (!popup) {
          toast.error("allow popups to connect");
          setConnecting(null);
        }
      } else {
        toast.info(`${platform} oauth not set up yet`);
        setConnecting(null);
      }
    } catch (e) {
      toast.error(`couldn't connect — ${e?.response?.data?.detail || "try again"}`);
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

  const SUB_TABS = [
    { id: "connections", label: "connections", count: connections.length },
    { id: "contacts",    label: "contacts",    count: contacts.length }
  ];

  return (
    <div>
      {/* Sub-tabs — matches Home's tab style, just inside the Network tab */}
      <div className={`flex gap-1 mb-5 border-b ${darkMode ?"border-white/10" :"border-gray-100"}`}>
        {SUB_TABS.map((tab) => {
          const isActive = tab.id === activeSubTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`text-[13px] py-2.5 pr-5 transition-colors relative ${
 isActive
 ? (darkMode ?"text-white font-semibold" :"text-gray-900 font-semibold")
 : (darkMode ?"text-white/50 hover:text-white/80" :"text-gray-500 hover:text-gray-700")
 }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 font-mono text-[10.5px] ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className={`absolute bottom-[-0.5px] left-0 right-5 h-[2px] ${darkMode ?"bg-white" :"bg-gray-900"}`} />
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : activeSubTab === "connections" ? (
        connections.length === 0 ? (
          <EmptyState
            title="no connections yet."
            body="when taj matches you with someone, they'll show up here."
            darkMode={darkMode}
          />
        ) : (
          <div>
            {connections.map((conn) => (
              <ConnectionCard
                key={conn.id}
                conn={conn}
                darkMode={darkMode}
                expanded={expandedConnectionId === conn.id}
                onToggle={() => setExpandedConnectionId(expandedConnectionId === conn.id ? null : conn.id)}
              />
            ))}
          </div>
        )
      ) : (
        <div>
          {/* Import toggle + search/filter toolbar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`font-mono text-[10.5px] ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                imported from linkedin, gmail, instagram
              </div>
              <button
                onClick={() => setShowImport(!showImport)}
                className={`text-[12px] font-medium transition-colors ${darkMode ?"text-white/70 hover:text-white" :"text-gray-600 hover:text-gray-900"}`}
              >
                {showImport ? "hide" : "+ import"}
              </button>
            </div>
            {showImport && <ImportControls darkMode={darkMode} onConnect={handleConnect} connecting={connecting} />}
          </div>

          {contacts.length > 0 && (
            <>
              {/* Search */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 ${darkMode ?"bg-white/5 border border-white/10" :"bg-white border border-gray-100"}`}>
                <Search size={13} className={darkMode ? "text-white/40" : "text-gray-400"} />
                <input
                  type="text"
                  placeholder="search contacts…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`flex-1 bg-transparent text-[12.5px] outline-none ${darkMode ?"text-white placeholder-white/30" :"text-gray-900"}`}
                />
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[
                  { id: "all",       label: "all",       count: contacts.length },
                  { id: "warm",      label: "warm",      count: warmCount },
                  { id: "linkedin",  label: "LinkedIn",  count: contacts.filter(c => c.source === "linkedin").length },
                  { id: "gmail",     label: "gmail",     count: contacts.filter(c => c.source === "gmail").length },
                  { id: "instagram", label: "instagram", count: contacts.filter(c => c.source === "instagram").length }
                ].filter(f => f.count > 0 || f.id === "all").map((f) => {
                  const isActive = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] transition-colors ${
 isActive
 ? (darkMode ?"bg-white text-black" :"bg-gray-900 text-white")
 : (darkMode ?"bg-transparent text-white/60 border border-white/10 hover:border-white/30" :"bg-white text-gray-600 border border-gray-200 hover:border-gray-400")
 }`}
                    >
                      {f.label}
                      <span className={`font-mono text-[10px] ${isActive ? (darkMode ?"text-black/60" :"text-white/70") : (darkMode ?"text-white/30" :"text-gray-400")}`}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {filteredContacts.length === 0 ? (
            <EmptyState
              title={contacts.length === 0 ? "no contacts yet." : "nothing matches."}
              body={contacts.length === 0 ? "import your linkedin, gmail, or instagram to give taj your network." : "try a different filter or search."}
              darkMode={darkMode}
            />
          ) : (
            filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id || contact._id}
                contact={contact}
                darkMode={darkMode}
                expanded={expandedContactId === (contact.id || contact._id)}
                onToggle={() => setExpandedContactId(expandedContactId === (contact.id || contact._id) ? null : (contact.id || contact._id))}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ title, body, darkMode }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-[14px] mb-4"
      style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
    >
      T
    </div>
    <h3 className={`text-[16px] font-semibold mb-2 ${darkMode ?"text-white" :"text-gray-900"}`}>
      {title}
    </h3>
    <p className={`text-[14px] max-w-sm ${darkMode ?"text-white/50" :"text-gray-500"}`}>
      {body}
    </p>
  </div>
);

export default NetworkPage;
