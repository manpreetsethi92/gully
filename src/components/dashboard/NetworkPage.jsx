/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import {
  Network, Users, Search, Link2, Mail, Instagram,
  Flame, Clock, Building2, ChevronRight, RefreshCw, X
} from "lucide-react";

// ── Import Banner ─────────────────────────────────────────────────────────────
const ImportBanner = ({ darkMode, onImport, importing }) => {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [igHandle, setIgHandle] = useState("");
  const [showLinkedin, setShowLinkedin] = useState(false);
  const [showIg, setShowIg] = useState(false);

  return (
    <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
      <div className={`p-4 rounded-2xl ${darkMode ? "bg-blue-500/10" : "bg-blue-50"}`}>
        <p className={`font-bold text-[15px] mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Import your network
        </p>
        <p className={`text-sm mb-3 ${darkMode ? "text-white/60" : "text-gray-500"}`}>
          Giggy finds warm leads — people you already know who have gigs or need talent.
        </p>

        <div className="flex flex-col gap-2">
          {/* LinkedIn */}
          {!showLinkedin ? (
            <button
              onClick={() => setShowLinkedin(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "bg-[#0077b5]/20 text-[#4db8ff] hover:bg-[#0077b5]/30" : "bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20"}`}
            >
              <Link2 size={15} /> Import LinkedIn connections
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-xl text-sm border outline-none ${darkMode ? "bg-white/10 border-white/20 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-900"}`}
              />
              <button
                onClick={() => { onImport("linkedin", linkedinUrl); setLinkedinUrl(""); setShowLinkedin(false); }}
                disabled={!linkedinUrl.trim() || importing === "linkedin"}
                className="px-4 py-2 rounded-xl bg-[#0077b5] text-white text-sm font-semibold disabled:opacity-50"
              >
                {importing === "linkedin" ? "..." : "Import"}
              </button>
              <button onClick={() => setShowLinkedin(false)} className={`p-2 rounded-xl ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                <X size={16} className={darkMode ? "text-white/50" : "text-gray-400"} />
              </button>
            </div>
          )}

          {/* Gmail — OAuth redirect */}
          <button
            onClick={() => onImport("gmail", null)}
            disabled={importing === "gmail"}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
          >
            <Mail size={15} /> {importing === "gmail" ? "Connecting..." : "Import Gmail contacts"}
          </button>

          {/* Instagram */}
          {!showIg ? (
            <button
              onClick={() => setShowIg(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30" : "bg-purple-50 text-purple-700 hover:bg-purple-100"}`}
            >
              <Instagram size={15} /> Import Instagram network
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="@yourhandle"
                value={igHandle}
                onChange={e => setIgHandle(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-xl text-sm border outline-none ${darkMode ? "bg-white/10 border-white/20 text-white placeholder-white/30" : "bg-white border-gray-200 text-gray-900"}`}
              />
              <button
                onClick={() => { onImport("instagram", igHandle); setIgHandle(""); setShowIg(false); }}
                disabled={!igHandle.trim() || importing === "instagram"}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold disabled:opacity-50"
              >
                {importing === "instagram" ? "..." : "Import"}
              </button>
              <button onClick={() => setShowIg(false)} className={`p-2 rounded-xl ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                <X size={16} className={darkMode ? "text-white/50" : "text-gray-400"} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Contact Card ──────────────────────────────────────────────────────────────
const ContactCard = ({ contact, darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const sourceColors = {
    linkedin: darkMode ? "text-[#4db8ff]" : "text-[#0077b5]",
    gmail: darkMode ? "text-red-300" : "text-red-600",
    instagram: darkMode ? "text-purple-300" : "text-purple-700",
  };
  const sourceLabel = { linkedin: "LinkedIn", gmail: "Gmail", instagram: "Instagram" };

  return (
    <div
      className={`px-4 py-3 border-b cursor-pointer transition-colors ${darkMode ? "border-white/10 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E50914] to-[#ff4757] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {(contact.contact_name || "?").charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={`font-semibold text-[15px] truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
              {contact.contact_name}
            </p>
            {contact.warm_lead_label && (
              <span className="flex items-center gap-0.5 text-orange-500 text-xs font-bold flex-shrink-0">
                <Flame size={11} fill="currentColor" /> Warm
              </span>
            )}
          </div>
          <p className={`text-sm truncate ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            {contact.contact_role || contact.contact_company || "—"}
          </p>
        </div>

        {/* Source badge */}
        <span className={`text-xs font-medium flex-shrink-0 ${sourceColors[contact.source] || ""}`}>
          {sourceLabel[contact.source] || contact.source}
        </span>
        <ChevronRight size={14} className={`flex-shrink-0 transition-transform ${expanded ? "rotate-90" : ""} ${darkMode ? "text-white/30" : "text-gray-300"}`} />
      </div>

      {/* 4.3 — Interaction timeline (expanded) */}
      {expanded && (
        <div className={`mt-3 ml-14 space-y-1.5`}>
          {contact.contact_company && (
            <div className={`flex items-center gap-2 text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              <Building2 size={13} /> {contact.contact_company}
            </div>
          )}
          {contact.contact_linkedin && (
            <a
              href={contact.contact_linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 text-sm text-[#0077b5] hover:underline"
            >
              <Link2 size={13} /> View LinkedIn
            </a>
          )}
          {(contact.interaction_log || []).length > 0 ? (
            <div className={`mt-2 pt-2 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
              <p className={`text-xs font-semibold mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>History</p>
              {contact.interaction_log.slice(-3).map((ev, i) => (
                <div key={i} className={`flex items-start gap-2 text-xs ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                  <Clock size={11} className="mt-0.5 flex-shrink-0" />
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

// ── Main Page ─────────────────────────────────────────────────────────────────
const NetworkPage = ({ darkMode }) => {
  const { token, user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | linkedin | gmail | instagram | warm

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/network`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data || []);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleImport = async (source, value) => {
    setImporting(source);
    try {
      if (source === "gmail") {
        // Gmail: OAuth redirect
        const res = await axios.post(
          `${API}/oauth/gmail/authorize`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.auth_url) {
          window.open(res.data.auth_url, "_blank");
          toast.success("Opening Gmail — come back after authorizing");
        } else {
          toast.info("Gmail OAuth not configured yet");
        }
      } else if (source === "linkedin") {
        await axios.post(
          `${API}/network/import/linkedin`,
          { linkedin_url: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("LinkedIn import started — check back in a minute 🦋");
        setTimeout(fetchContacts, 5000);
      } else if (source === "instagram") {
        await axios.post(
          `${API}/network/import/instagram`,
          { instagram_handle: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Instagram import done 🦋");
        fetchContacts();
      }
    } catch (e) {
      toast.error(`Import failed — ${e?.response?.data?.detail || "try again"}`);
    } finally {
      setImporting(null);
    }
  };

  const filtered = contacts.filter(c => {
    const matchesSearch =
      !search ||
      (c.contact_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.contact_role || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.contact_company || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "warm" && c.warm_lead_label) ||
      c.source === filter;
    return matchesSearch && matchesFilter;
  });

  const warmCount = contacts.filter(c => c.warm_lead_label).length;
  const linkedinCount = contacts.filter(c => c.source === "linkedin").length;
  const gmailCount = contacts.filter(c => c.source === "gmail").length;
  const igCount = contacts.filter(c => c.source === "instagram").length;

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>My Network</h1>
            <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              {contacts.length} contacts · {warmCount} warm leads
            </p>
          </div>
          <button
            onClick={fetchContacts}
            disabled={loading}
            className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            <RefreshCw size={18} className={`${loading ? "animate-spin" : ""} ${darkMode ? "text-white/50" : "text-gray-400"}`} />
          </button>
        </div>

        {/* Search */}
        <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
          <Search size={15} className={darkMode ? "text-white/40" : "text-gray-400"} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? "text-white placeholder-white/30" : "text-gray-900"}`}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5 scrollbar-hide">
          {[
            { key: "all", label: `All (${contacts.length})` },
            { key: "warm", label: `🔥 Warm (${warmCount})` },
            { key: "linkedin", label: `LinkedIn (${linkedinCount})` },
            { key: "gmail", label: `Gmail (${gmailCount})` },
            { key: "instagram", label: `Instagram (${igCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === tab.key
                  ? "bg-[#E50914] text-white"
                  : darkMode ? "bg-white/10 text-white/60 hover:bg-white/15" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Import Banner — show if no contacts yet */}
      {contacts.length === 0 && !loading && (
        <ImportBanner darkMode={darkMode} onImport={handleImport} importing={importing} />
      )}

      {/* Import button when contacts exist */}
      {contacts.length > 0 && (
        <div className={`px-4 py-3 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <details className="group">
            <summary className={`cursor-pointer text-sm font-semibold flex items-center gap-2 ${darkMode ? "text-white/60" : "text-gray-500"}`}>
              <Network size={14} /> Import more contacts
            </summary>
            <div className="mt-2">
              <ImportBanner darkMode={darkMode} onImport={handleImport} importing={importing} />
            </div>
          </details>
        </div>
      )}

      {/* Contact List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <Users size={40} className={`mb-3 ${darkMode ? "text-white/20" : "text-gray-200"}`} />
          <p className={`font-semibold ${darkMode ? "text-white/60" : "text-gray-500"}`}>
            {search || filter !== "all" ? "No contacts match" : "No network imported yet"}
          </p>
          <p className={`text-sm mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
            {search || filter !== "all" ? "Try a different filter" : "Import LinkedIn, Gmail, or Instagram above"}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((c, i) => (
            <ContactCard key={c.id || i} contact={c} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkPage;
