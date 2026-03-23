/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Briefcase, MessageCircle, Plus, Users, Clock, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!%20I%20need%20to%20hire%20someone";

const HirerDashboard = ({ darkMode }) => {
  const { token } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await axios.get(`${API}/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGigs(response.data);
      } catch (error) {
        toast.error("Failed to fetch gigs");
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [token]);

  const fetchCandidates = async (gigId) => {
    setCandidatesLoading(true);
    try {
      const response = await axios.get(`${API}/requests/${gigId}/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
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
      setCandidates(candidates.map(c =>
        c.id === matchId ? { ...c, status: action === "approve" ? "outreach_pending" : "rejected" } : c
      ));
      toast.success(action === "approve" ? "Taj will reach out to them!" : "Skipped");
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return days < 7 ? `${days}d ago` : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  const activeGigs = gigs.filter(g => !["expired", "closed"].includes(g.status));

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b flex items-center justify-between ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Post a Gig</h1>
        <a
          href={WHATSAPP_BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
          style={{ background: "#E50914" }}
        >
          <Plus size={16} />
          New Gig
        </a>
      </div>

      {/* Stats */}
      {gigs.length > 0 && (
        <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active", value: activeGigs.length, color: darkMode ? "bg-white/5" : "bg-gray-50" },
              { label: "Total Matches", value: gigs.reduce((s, g) => s + (g.matches_count || 0), 0), color: darkMode ? "bg-white/5" : "bg-gray-50" },
              { label: "Closed", value: gigs.filter(g => g.status === "closed").length, color: darkMode ? "bg-white/5" : "bg-gray-50" },
            ].map((stat) => (
              <div key={stat.label} className={`p-3 rounded-xl text-center ${stat.color}`}>
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stat.value}</div>
                <div className={`text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? "bg-red-500/10" : "bg-red-50"}`}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-[#E50914]">
            <MessageCircle size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Tell Taj what you need</p>
            <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>She'll find and vet talent for you</p>
          </div>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Gig List */}
      {gigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Briefcase size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>No gigs posted yet</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>Tell Taj who you're looking for and she'll find the right person.</p>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: "#E50914" }}
          >
            <MessageCircle size={18} />
            Message Taj to post a gig
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className={`px-4 py-5 cursor-pointer transition-colors ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
              onClick={() => { setSelectedGig(gig); fetchCandidates(gig.id); }}
            >
              <div className="flex items-start gap-3">
                <div className={`flex items-center gap-2 flex-wrap mb-2`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${gig.status === "closed" || gig.status === "expired" ? "bg-gray-400" : "bg-green-500"}`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{formatDate(gig.created_at)}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${gig.status === "closed" || gig.status === "expired" ? (darkMode ? "bg-gray-500/20 text-gray-400" : "bg-gray-100 text-gray-500") : (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700")}`}>
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
                    <p className="text-sm font-medium text-red-500 mt-2">View candidates →</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidates Modal */}
      <Dialog open={!!selectedGig} onOpenChange={() => setSelectedGig(null)}>
        <DialogContent className={`sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col ${darkMode ? "bg-[#111] border-white/10" : ""}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? "text-white" : "text-gray-900"}>Candidates</DialogTitle>
            {selectedGig && (
              <p className={`text-sm ${darkMode ? "text-white/60" : "text-gray-500"}`}>"{selectedGig.title}"</p>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
            {candidatesLoading ? (
              <div className="flex items-center justify-center py-10"><div className="spinner"></div></div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-10">
                <Users size={40} className={`mx-auto mb-3 ${darkMode ? "text-white/20" : "text-gray-300"}`} />
                <p className={darkMode ? "text-white/50" : "text-gray-500"}>No candidates yet — Taj is searching</p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div key={c.id} className={`rounded-xl p-4 ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <div className="flex items-start gap-3">
                      {c.matched_user?.photo_url ? (
                        <img src={c.matched_user.photo_url} alt={c.matched_user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                          {c.matched_user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{c.matched_user?.name}</p>
                        {c.matched_user?.location && <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{c.matched_user.location}</p>}
                        {c.matched_user?.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {c.matched_user.skills.slice(0, 3).map((s, i) => (
                              <span key={i} className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-white/10 text-white/70" : "bg-gray-200 text-gray-700"}`}>{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {c.status === "suggested" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleAction(c.id, "approve")} disabled={actionLoading === c.id} className="w-9 h-9 rounded-full flex items-center justify-center bg-green-500 text-white">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleAction(c.id, "reject")} disabled={actionLoading === c.id} className={`w-9 h-9 rounded-full flex items-center justify-center border ${darkMode ? "border-white/20 text-white/60" : "border-gray-300 text-gray-500"}`}>
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
