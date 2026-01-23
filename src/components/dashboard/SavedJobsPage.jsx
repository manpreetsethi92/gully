import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Bookmark, ExternalLink, MapPin, DollarSign, Clock, Briefcase, Trash2, MessageCircle } from "lucide-react";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

// Source logo helper - same as OpportunitiesPage
const getSourceLogo = (source) => {
  const logos = {
    reddit: "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
    twitter: "https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc7275.png",
    facebook: "https://www.facebook.com/images/fb_icon_325x325.png",
    craigslist: "https://www.craigslist.org/images/peace.jpg",
    linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png"
  };
  const sourceLower = (source || "").toLowerCase();
  for (const [key, url] of Object.entries(logos)) {
    if (sourceLower.includes(key)) return url;
  }
  return null;
};

const SavedJobsPage = ({ onRefresh, darkMode }) => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`${API}/saved-jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
        toast.error("Failed to fetch saved jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [token]);

  const handleRemoveJob = async (jobId) => {
    setActionLoading(jobId);
    try {
      await axios.delete(`${API}/saved-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      toast.success("Job removed from saved");
      setSelectedJob(null);
      onRefresh?.();
    } catch (error) {
      toast.error("Failed to remove job");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryDisplay = (category) => {
    const names = {
      film_video: "Film & Video",
      photography: "Photography",
      music_audio: "Music & Audio",
      design: "Design",
      tech: "Tech",
      writing: "Writing",
      marketing: "Marketing",
      events: "Events",
      fashion: "Fashion",
      voice_acting: "Voice Acting",
      education: "Education",
      wellness: "Wellness",
      culinary: "Culinary",
      sports: "Sports",
      real_estate: "Real Estate",
      legal: "Legal",
      trades: "Trades",
      business_startup: "Business & Startup",
      other: "Other"
    };
    return names[category] || category || "Job";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Saved Jobs</h1>
        <span className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
          {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'}
        </span>
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-green-500/10' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Bookmark size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>Jobs you've saved</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                Tap on a job to see details and apply. We've sent the info to your WhatsApp too!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Bookmark size={48} className={darkMode ? 'text-white/20' : 'text-gray-300'} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No saved jobs yet</h2>
          <p className={`mb-4 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>When you accept a scraped opportunity, it'll appear here.</p>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ background: '#E50914' }}
          >
            <MessageCircle size={18} />
            Message Taj for more opportunities
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? 'divide-white/10' : 'divide-gray-100'}`}>
          {savedJobs.map((job) => (
            <article
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`px-4 py-5 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex gap-3">
                {/* Source Logo */}
                {getSourceLogo(job.source) ? (
                  <img
                    src={getSourceLogo(job.source)}
                    alt={job.source}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <Briefcase size={20} />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: Source + Time */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {job.source || 'External Job'}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                      · Saved {formatDate(job.saved_at || job.created_at)}
                    </span>
                  </div>

                  {/* Row 2: Title */}
                  <p className={`mt-1.5 text-[15px] font-medium line-clamp-2 ${darkMode ? 'text-white/90' : 'text-gray-800'}`}>
                    {job.title}
                  </p>

                  {/* Row 3: Location & Budget */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {job.location && job.location !== 'Not specified' && (
                      <span className={`flex items-center gap-1 text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        <MapPin size={14} />
                        {job.location}
                      </span>
                    )}
                    {job.budget_range && job.budget_range !== 'Not specified' && (
                      <span className={`flex items-center gap-1 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        <DollarSign size={14} />
                        {job.budget_range}
                      </span>
                    )}
                  </div>

                  {/* Row 4: Skills tags */}
                  {job.skills_needed && job.skills_needed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills_needed.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills_needed.length > 3 && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>
                          +{job.skills_needed.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Row 5: Category badge */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${darkMode ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'}`}>
                      {getCategoryDisplay(job.category)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Job Detail Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className={`sm:max-w-lg max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white'}`}>
          {selectedJob && (
            <>
              {/* Header with source info */}
              <div className={`flex flex-col items-center text-center pb-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                {/* Source Logo */}
                {getSourceLogo(selectedJob.source) ? (
                  <img
                    src={getSourceLogo(selectedJob.source)}
                    alt={selectedJob.source}
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-3"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <Briefcase size={28} />
                  </div>
                )}

                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedJob.source || 'External Job'}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                  Saved {formatDate(selectedJob.saved_at || selectedJob.created_at)}
                </p>
              </div>

              {/* Job Details Section */}
              <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  Job Details
                </h3>
                <p className={`text-[15px] font-medium leading-relaxed ${darkMode ? 'text-white/90' : 'text-gray-800'}`}>
                  {selectedJob.title}
                </p>
                {selectedJob.description && (
                  <p className={`mt-3 text-sm leading-relaxed ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    {selectedJob.description}
                  </p>
                )}

                {/* Metadata Grid */}
                <div className={`grid grid-cols-2 gap-3 mt-4 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                  {selectedJob.location && selectedJob.location !== 'Not specified' && (
                    <div>
                      <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Location</span>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin size={14} />
                        {selectedJob.location}
                      </p>
                    </div>
                  )}
                  {selectedJob.budget_range && selectedJob.budget_range !== 'Not specified' && (
                    <div>
                      <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Budget</span>
                      <p className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        <DollarSign size={14} />
                        {selectedJob.budget_range}
                      </p>
                    </div>
                  )}
                  {selectedJob.urgency && selectedJob.urgency !== 'Not specified' && (
                    <div>
                      <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Timeline</span>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock size={14} />
                        {selectedJob.urgency}
                      </p>
                    </div>
                  )}
                  {selectedJob.category && (
                    <div>
                      <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Category</span>
                      <p className="text-sm font-medium">{getCategoryDisplay(selectedJob.category)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              {selectedJob.skills_needed && selectedJob.skills_needed.length > 0 && (
                <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills_needed.map((skill, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 text-sm rounded-full ${darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                {selectedJob.source_url && (
                  <a
                    href={selectedJob.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-colors ${
                      darkMode
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <ExternalLink size={18} />
                    Apply Now
                  </a>
                )}
                <button
                  onClick={() => handleRemoveJob(selectedJob.id)}
                  disabled={actionLoading === selectedJob.id}
                  className={`flex items-center justify-center gap-2 py-3 rounded-full font-semibold border transition-colors ${
                    darkMode
                      ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                      : 'border-red-300 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={18} />
                  Remove from Saved
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedJobsPage;
