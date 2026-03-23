/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Briefcase, MessageCircle, Plus, X, Check, Users, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!%20I%20need%20to%20hire%20someone";

const CATEGORIES = [
  "Film & Video", "Photography", "Graphic Design", "Web Development",
  "Marketing", "Music", "Writing", "Events", "Trades", "Other"
];

const HirerDashboard = ({ darkMode }) => {
  const { token } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", budget: "", location: "", category: ""
  });

  const fetchGigs = async () => {
    try {
      const res = await axios.get(`${API}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Show only hiring-type requests (where user is looking for someone)
      const hirerGigs = (res.data || []).filter(g =>
        g.request_type === "hiring" ||
        g.type === "hiring" ||
        !g.is_talent_seeking // default to showing all if field missing
      );
      setGigs(res.data || []);
    } catch {
      toast.error("Failed to load gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGigs(); }, [token]);

  const handlePost = async () => {
    if (!form.title.trim()) {
      toast.error("Add a title for your gig");
      return;
    }
    setPosting(true);
    try {
      await axios.post(`${API}/requests`, {
        title: form.title,
        description: form.description,
        budget_display: form.budget,
        location: form.location,
        category: form.category,
        request_type: "hiring",
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Gig posted! Taj will start finding matches.");
      setShowPostForm(false);
      setForm({ title: "", description: "", budget: "", location: "", category: "" });
      fetchGigs();
    } catch {
      toast.error("Failed to post — try messaging Taj on WhatsApp instead");
    } finally {
      setPosting(false);
    }
  };

  const fetchCandidates = async (gigId) => {
    setCandidatesLoading(true);
    try {
      const res = await axios.get(`${API}/requests/${gigId}/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(res.data || []);
    } catch {
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleAction = async (matchId, action) => {
    setActionLoading(matchId);
    try {
      await axios.post(`${API}/matches/${matchId}/action`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(c => c.map(m =>
        m.id === matchId ? { ...m, status: action === "approve" ? "outreach_pending" : "rejected" } : m
      ));
      toast.success(action === "approve" ? "Taj will reach out to them!" : "Skipped");
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d), now = new Date();
    const h = Math.floor((now - date) / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return days < 7 ? `${days}d ago` : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b flex items-center justify-between ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <div>
          <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Post a Gig</h1>
          {gigs.length > 0 && <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{gigs.length} posted</p>}
        </div>
        <button
          onClick={() => setShowPostForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
          style={{ background: "#E50914" }}
        >
          <Plus size={16} /> Post Gig
        </button>
      </div>

      {/* Post Gig Modal */}
      <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
        <DialogContent className={`sm:max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? "bg-[#111] border-white/10" : ""}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? "text-white" : "text-gray-900"}>Post a gig</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>What do you need? *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Videographer for product launch in Austin"
                className={`w-full px-4 py-3 rounded-xl border text-[15px] outline-none focus:ring-2 focus:ring-red-500 ${darkMode ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
              />
            </div>
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Details</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the project, skills needed, timeline..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border text-[15px] resize-none outline-none focus:ring-2 focus:ring-red-500 ${darkMode ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Budget</label>
                <input
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                  placeholder="e.g. $500"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-red-500 ${darkMode ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Location</label>
                <input
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Austin, TX"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-red-500 ${darkMode ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`}
                />
              </div>
            </div>
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border text-[15px] outline-none focus:ring-2 focus:ring-red-500 ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPostForm(false)}
                className={`flex-1 py-3 rounded-full border font-semibold transition-colors ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting || !form.title.trim()}
                className="flex-1 py-3 rounded-full text-white font-semibold disabled:opacity-50"
                style={{ background: "#E50914" }}
              >
                {posting ? "Posting..." : "Post gig"}
              </button>
            </div>
            <div className={`pt-1 pb-2 text-center`}>
              <p className={`text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}>or</p>
              <a href={WHATSAPP_BOT_URL} target="_blank" rel="noopener noreferrer"
                className={`text-sm font-medium mt-1 inline-block ${darkMode ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                Tell Taj on WhatsApp instead
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty state */}
      {gigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Briefcase size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>No gigs posted yet</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            Post a gig and Taj will find matched talent within minutes.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => setShowPostForm(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm"
              style={{ background: "#E50914" }}
            >
              <Plus size={18} /> Post a gig now
            </button>
            <a href={WHATSAPP_BOT_URL} target="_blank" rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-sm border ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
              <MessageCircle size={18} /> Message Taj on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Gig list */}
          <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className={`px-4 py-5 cursor-pointer transition-colors ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                onClick={() => { setSelectedGig(gig); fetchCandidates(gig.id); }}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                    gig.status === "closed" || gig.status === "expired" ? "bg-gray-400" :
                    gig.status === "review" || gig.status === "awaiting_approval" ? "bg-green-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{formatDate(gig.created_at)}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        gig.status === "closed" || gig.status === "expired"
                          ? (darkMode ? "bg-gray-500/20 text-gray-400" : "bg-gray-100 text-gray-500")
                          : gig.status === "review" || gig.status === "awaiting_approval"
                            ? (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700")
                            : (darkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700")
                      }`}>
                        {gig.status === "awaiting_approval" ? "Review" : gig.status?.charAt(0).toUpperCase() + gig.status?.slice(1)}
                      </span>
                      {gig.matches_count > 0 && (
                        <span className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>
                          {gig.matches_count} match{gig.matches_count > 1 ? "es" : ""}
                        </span>
                      )}
                    </div>
                    <p className={`text-[15px] font-medium ${darkMode ? "text-white/90" : "text-gray-800"}`}>{gig.title}</p>
                    {(gig.budget_display || gig.location) && (
                      <div className={`flex gap-3 mt-1 text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                        {gig.budget_display && <span>{gig.budget_display}</span>}
                        {gig.location && <span>{gig.location}</span>}
                      </div>
                    )}
                    {gig.matches_count > 0 && (
                      <p className="text-sm font-medium text-[#E50914] mt-2">View candidates →</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Candidates Modal */}
      <Dialog open={!!selectedGig} onOpenChange={() => { setSelectedGig(null); setCandidates([]); }}>
        <DialogContent className={`sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col ${darkMode ? "bg-[#111] border-white/10" : ""}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? "text-white" : "text-gray-900"}>Candidates</DialogTitle>
            {selectedGig && <p className={`text-sm ${darkMode ? "text-white/60" : "text-gray-500"}`}>"{selectedGig.title}"</p>}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
            {candidatesLoading ? (
              <div className="flex items-center justify-center py-10"><div className="spinner"></div></div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-10">
                <Users size={40} className={`mx-auto mb-3 ${darkMode ? "text-white/20" : "text-gray-300"}`} />
                <p className={darkMode ? "text-white/50" : "text-gray-500"}>No candidates yet</p>
                <p className={`text-sm mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>Taj is searching for matches...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div key={c.id} className={`rounded-xl p-4 ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <div className="flex items-start gap-3">
                      {c.matched_user?.photo_url ? (
                        <img src={c.matched_user.photo_url} alt={c.matched_user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                          {c.matched_user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{c.matched_user?.name || "Unknown"}</p>
                        {c.matched_user?.location && <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{c.matched_user.location}</p>}
                        {c.matched_user?.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {c.matched_user.skills.slice(0, 3).map((s, i) => (
                              <span key={i} className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-white/10 text-white/70" : "bg-gray-200 text-gray-700"}`}>{s}</span>
                            ))}
                          </div>
                        )}
                        {c.match_reason && <p className={`text-xs mt-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>{c.match_reason}</p>}
                      </div>
                      {c.status === "suggested" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleAction(c.id, "approve")} disabled={actionLoading === c.id}
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-green-500 text-white hover:bg-green-600">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleAction(c.id, "reject")} disabled={actionLoading === c.id}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border ${darkMode ? "border-white/20 text-white/60 hover:bg-white/10" : "border-gray-300 text-gray-500 hover:bg-gray-100"}`}>
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HirerDashboard;
