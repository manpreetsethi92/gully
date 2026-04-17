// WorkHistoryPage v2 — editorial redesign matching Home / About / Network.
//
// Rendered inside the 'work' tab of YouPage (passes hideHeader).
// Legacy route /app/work-history still redirects here; in that case
// hideHeader=false and we show a full header.

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../../App";
import { Star, ChevronDown } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const WorkHistoryPage = ({ darkMode, hideHeader = false }) => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

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

  const skills = user?.skills || [];

  return (
    <div>
      {!hideHeader && (
        <div className="mb-1">
          <div className={`font-mono text-[11px] tracking-[0.25em] lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            your track record
          </div>
        </div>
      )}
      {!hideHeader && (
        <h1 className={`font-display text-[clamp(2rem,5vw,44px)] leading-none font-normal tracking-tight mb-7 lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
          work history.
        </h1>
      )}

      {/* Skills banner — editorial version */}
      {skills.length > 0 && (
        <section className={`rounded-2xl border mb-5 overflow-hidden ${darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-100 bg-white"}`}>
          <button
            onClick={() => setSkillsExpanded(prev => !prev)}
            className="w-full px-5 py-4 flex items-center gap-3 text-left"
          >
            <div className="flex-1 min-w-0">
              <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                verified skills
              </div>
              <p className={`font-syne text-[13.5px] lowercase ${darkMode ? "text-white/80" : "text-gray-700"}`}>
                what you've proven by actually doing the work
              </p>
            </div>
            <span className={`font-mono text-[11px] lowercase mr-2 ${darkMode ? "text-white/60" : "text-gray-500"}`}>
              {skills.length}
            </span>
            <ChevronDown size={16} className={`flex-shrink-0 transition-transform ${skillsExpanded ? "rotate-180" : ""} ${darkMode ? "text-white/40" : "text-gray-400"}`} />
          </button>
          {skillsExpanded && (
            <div className={`px-5 pb-4 pt-0 flex flex-wrap gap-1.5 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
              {skills.slice(0, 12).map((s, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-[12px] lowercase mt-3 ${darkMode ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700"}`}
                >
                  {s.toLowerCase()}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Gig list */}
      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-[14px] mb-4"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
          >
            T
          </div>
          <h3 className={`font-display text-[22px] leading-tight font-normal mb-2 lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
            nothing closed yet.
          </h3>
          <p className={`font-syne text-[14px] max-w-sm lowercase mb-5 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            every gig you finish through gully shows up here as your verified portfolio. hirers see this when they're deciding.
          </p>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-syne text-[12.5px] font-medium lowercase text-white"
            style={{ background: "#25D366" }}
          >
            <WhatsAppIcon size={12} /> ask taj for gigs
          </a>
        </div>
      ) : (
        <div>
          {savedJobs.map((job, i) => {
            const isVerified = job.status === "closed" || job.status === "completed";
            return (
              <article
                key={job.id || i}
                className={`rounded-2xl border p-5 mb-3 transition-colors ${
                  darkMode
                    ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                      <span className={`text-[15px] font-semibold lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {(job.title || job.description || "gig").toLowerCase()}
                      </span>
                      <span
                        className={`ml-auto font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide lowercase ${
                          isVerified
                            ? (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-50 text-green-700")
                            : (darkMode ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-600")
                        }`}
                      >
                        {isVerified ? "verified" : "saved"}
                      </span>
                    </div>
                    <div className={`font-mono text-[11px] tracking-wide lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                      {[
                        job.budget_display,
                        job.saved_at ? formatDate(job.saved_at).toLowerCase() : null
                      ].filter(Boolean).join(" · ")}
                    </div>
                    {job.rating > 0 && (
                      <div className={`inline-flex items-center gap-1 mt-2 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                        <Star size={12} fill="currentColor" />
                        <span className="font-mono text-[11px]">{job.rating?.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkHistoryPage;
