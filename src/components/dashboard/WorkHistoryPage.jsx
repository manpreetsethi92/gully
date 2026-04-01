/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { History, Star, TrendingUp, MessageCircle } from "lucide-react";

const WorkHistoryPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [jobsRes, userRes] = await Promise.allSettled([
          axios.get(`${API}/saved-jobs`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (jobsRes.status === "fulfilled") setSavedJobs(jobsRes.value.data || []);
        if (userRes.status === "fulfilled") setUser(userRes.value.data);
      } catch {
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  // Skills from user profile as proxy for affinity until gig_dna is populated
  const skills = user?.skills || [];
  const closedJobs = savedJobs.filter(j => j.status === "closed" || j.status === "completed");

  return (
    <div>
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Work History</h1>
        {closedJobs.length > 0 && (
          <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{closedJobs.length} verified gig{closedJobs.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Skills banner */}
      {skills.length > 0 && (
        <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-purple-500/10" : "bg-purple-50"}`}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className={darkMode ? "text-purple-400" : "text-purple-600"} />
              <div>
                <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Your verified track record</p>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-white/60" : "text-gray-600"}`}>Skills you've proven by actually doing the work</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 8).map((s, i) => (
                <span key={i} className={`px-3 py-1 text-sm rounded-full font-medium ${darkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"}`}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved / closed jobs as work history */}
      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <History size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>No gigs closed yet</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            Every gig you deliver through Gully gets added here — your personal verified portfolio. Hirers see this when they're deciding who to book.
          </p>
          <a href="https://wa.me/12134147369?text=Hi%20Taj!" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm" style={{ background: "#E50914" }}>
            <MessageCircle size={18} /> Find gigs via Taj
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {savedJobs.map((job, i) => (
            <div key={job.id || i} className={`px-4 py-5 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                  <History size={18} className={darkMode ? "text-white/60" : "text-gray-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>{job.title || job.description || "Gig"}</p>
                  {job.budget_display && <p className={`text-sm mt-0.5 ${darkMode ? "text-white/50" : "text-gray-500"}`}>{job.budget_display}</p>}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {job.rating > 0 && (
                      <span className={`flex items-center gap-1 text-sm font-medium ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                        <Star size={14} fill="currentColor" /> {job.rating?.toFixed(1)}
                      </span>
                    )}
                    {job.saved_at && <span className={`text-xs ${darkMode ? "text-white/40" : "text-gray-400"}`}>{formatDate(job.saved_at)}</span>}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      job.status === "closed" || job.status === "completed"
                        ? (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700")
                        : (darkMode ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-600")
                    }`}>
                      {job.status === "closed" || job.status === "completed" ? "Verified" : "Saved"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkHistoryPage;
