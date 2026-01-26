import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Sparkles, Check, X, Share2, Copy, MessageCircle, ExternalLink, Bookmark } from "lucide-react";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

// Source logo helper
const getSourceLogo = (source) => {
  const logos = {
    reddit: "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
    twitter: "https://abs.twimg.com/favicons/twitter.3.ico",
    facebook: "https://www.facebook.com/images/fb_icon_325x325.png",
    craigslist: "https://www.craigslist.org/favicon.ico",
    linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png"
  };
  const sourceLower = (source || "").toLowerCase();
  for (const [key, url] of Object.entries(logos)) {
    if (sourceLower.includes(key)) return url;
  }
  return null;
};

const OpportunitiesPage = ({ onRefresh, darkMode }) => {
  const { token } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [inviteLink] = useState("https://titlii.social");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(`${API}/opportunities`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOpportunities(response.data);
      } catch (error) {
        toast.error("Failed to fetch opportunities");
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, [token]);

  const handleAction = async (opportunityId, action, isExternal = false) => {
    setActionLoading(opportunityId);
    try {
      await axios.post(
        `${API}/opportunities/${opportunityId}/action`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpportunities(opportunities.filter(o => o.id !== opportunityId));

      if (action === "accept") {
        if (isExternal) {
          // External/scraped job - show special toast with link to saved jobs
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Job saved!</span>
              <span className="text-sm opacity-80">Check your WhatsApp for the apply link. Also in Saved Jobs.</span>
            </div>,
            { duration: 5000 }
          );
        } else {
          // Internal connection
          toast.success("You're connected! Check your Connections page.");
        }
      } else {
        toast.success("Declined");
      }

      onRefresh?.();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Link copied!");
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

  const getCleanRequest = (title, description) => {
    const text = description || title || "";
    const firstSentence = text.split(/[.!?]/)[0];
    if (firstSentence.length <= 120) {
      return firstSentence.trim();
    }
    return text.substring(0, 120).trim() + "...";
  };

  // Calculate expiration display for Track B opportunities
  const getExpirationDisplay = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;

    if (diff <= 0) return { text: 'Expired', color: 'red' };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 3) return { text: `${days}d left`, color: 'green' };
    if (days >= 2) return { text: `${days}d left`, color: 'yellow' };
    if (days === 1) return { text: '1d left', color: 'yellow' };
    if (hours > 0) return { text: `${hours}h left`, color: 'red' };
    return { text: 'Expiring soon', color: 'red' };
  };

  // Check if opportunity is external (scraped job)
  const isExternalOpportunity = (opp) => {
    return opp.from_user?.id === "" || !opp.from_user?.id;
  };

  // Verified badge component
  const VerifiedBadge = ({ className = "w-4 h-4" }) => (
    <svg className={`${className} text-blue-500`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  // Check if user has verified badge (paid subscription)
  const isUserVerified = (user) => {
    return user?.is_verified === true;
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
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Opportunities</h1>
        <button
          onClick={() => setShowInviteModal(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
        >
          <Share2 size={18} />
          Invite
        </button>
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-purple-500/10' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>People want to connect with you!</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                Tap on an opportunity to see details and decide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Sparkles size={48} className={darkMode ? 'text-white/20' : 'text-gray-300'} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No opportunities yet</h2>
          <p className={`mb-4 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>When someone's request matches your skills, it'll appear here.</p>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ background: '#E50914' }}
          >
            <MessageCircle size={18} />
            Message Taj to get more matches
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? 'divide-white/10' : 'divide-gray-100'}`}>
          {opportunities.map((opp) => {
            const isExternal = isExternalOpportunity(opp);
            return (
              <article
                key={opp.id}
                onClick={() => setSelectedOpportunity(opp)}
                className={`px-4 py-5 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
              >
                <div className="flex gap-3">
                  {/* Avatar - Handle external jobs differently */}
                  {isExternal ? (
                    getSourceLogo(opp.from_user?.name) ? (
                      <img
                        src={getSourceLogo(opp.from_user?.name)}
                        alt={opp.from_user?.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        <ExternalLink size={20} />
                      </div>
                    )
                  ) : opp.from_user?.photo_url ? (
                    <img
                      src={opp.from_user.photo_url}
                      alt={opp.from_user?.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      {opp.from_user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Row 1: Name + Verified badge + Time + Expiration + External indicator */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {opp.from_user?.name || 'Someone'}
                      </span>
                      {!isExternal && isUserVerified(opp.from_user) && <VerifiedBadge />}
                      <span className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        · {formatDate(opp.created_at)}
                      </span>
                      {/* Expiration countdown for Track B opportunities */}
                      {opp.expires_at && (() => {
                        const expiry = getExpirationDisplay(opp.expires_at);
                        if (!expiry) return null;
                        const colorClass = expiry.color === 'green'
                          ? (darkMode ? 'text-green-400' : 'text-green-600')
                          : expiry.color === 'yellow'
                            ? (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                            : (darkMode ? 'text-red-400' : 'text-red-600');
                        return (
                          <span className={`text-sm font-medium ${colorClass}`}>
                            · {expiry.text}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Row 2: Location */}
                    {opp.from_user?.location && (
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        {opp.from_user.location}
                      </p>
                    )}

                    {/* Row 3: Request preview */}
                    <p className={`mt-2 text-[15px] line-clamp-2 ${darkMode ? 'text-white/90' : 'text-gray-800'}`}>
                      "{getCleanRequest(opp.request_title, opp.request_description)}"
                    </p>

                    {/* Row 4: Matched skills tags */}
                    {opp.matched_skills && opp.matched_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {opp.matched_skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              isExternal 
                                ? (darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700')
                                : (darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700')
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                        {opp.matched_skills.length > 3 && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>
                            +{opp.matched_skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Row 5: Tap hint */}
                    <p className={`text-xs mt-3 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                      Tap to view details
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Opportunity Detail Modal */}
      <Dialog open={!!selectedOpportunity} onOpenChange={() => setSelectedOpportunity(null)}>
        <DialogContent className={`sm:max-w-lg max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white'}`}>
          {selectedOpportunity && (
            <>
              {/* Header with photo and basic info */}
              <div className={`flex flex-col items-center text-center pb-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                {/* Large photo */}
                {isExternalOpportunity(selectedOpportunity) ? (
                  getSourceLogo(selectedOpportunity.from_user?.name) ? (
                    <img
                      src={getSourceLogo(selectedOpportunity.from_user?.name)}
                      alt={selectedOpportunity.from_user?.name}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <ExternalLink size={32} />
                    </div>
                  )
                ) : selectedOpportunity.from_user?.photo_url || selectedOpportunity.from_user?.photo || selectedOpportunity.from_user?.avatar ? (
                  <img
                    src={selectedOpportunity.from_user.photo_url || selectedOpportunity.from_user.photo || selectedOpportunity.from_user.avatar}
                    alt={selectedOpportunity.from_user.name}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    {selectedOpportunity.from_user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name + verified + external badge */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedOpportunity.from_user?.name}
                  </h2>
                  {!isExternalOpportunity(selectedOpportunity) && isUserVerified(selectedOpportunity.from_user) && <VerifiedBadge className="w-5 h-5" />}
                </div>

                {/* Location */}
                {selectedOpportunity.from_user?.location && (
                  <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    {selectedOpportunity.from_user.location}
                  </p>
                )}

                {/* Expiration countdown */}
                {selectedOpportunity.expires_at && (() => {
                  const expiry = getExpirationDisplay(selectedOpportunity.expires_at);
                  if (!expiry) return null;
                  const bgClass = expiry.color === 'green'
                    ? (darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
                    : expiry.color === 'yellow'
                      ? (darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
                      : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700');
                  return (
                    <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold inline-block ${bgClass}`}>
                      {expiry.text}
                    </div>
                  );
                })()}

                {/* Social links - only for non-external */}
                {!isExternalOpportunity(selectedOpportunity) && (
                  <div className="flex gap-3 mt-3">
                    {selectedOpportunity.from_user?.social_links?.instagram && (
                      <a
                        href={`https://instagram.com/${selectedOpportunity.from_user.social_links.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {selectedOpportunity.from_user?.social_links?.linkedin && (
                      <a
                        href={selectedOpportunity.from_user.social_links.linkedin.startsWith('http') ? selectedOpportunity.from_user.social_links.linkedin : `https://linkedin.com/in/${selectedOpportunity.from_user.social_links.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-[#0077b5] text-white"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* The Opportunity Section */}
              <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  {isExternalOpportunity(selectedOpportunity) ? 'Job Details' : 'The Opportunity'}
                </h3>
                <p className={`text-[15px] leading-relaxed ${darkMode ? 'text-white/90' : 'text-gray-800'}`}>
                  "{selectedOpportunity.request_description || selectedOpportunity.request_title}"
                </p>

                {/* Budget / Timeline / Work Type / Location */}
                {(selectedOpportunity.budget_display || selectedOpportunity.timeline_display || selectedOpportunity.work_type || selectedOpportunity.location) && (
                  <div className={`grid grid-cols-2 gap-3 mt-4 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    {selectedOpportunity.budget_display && (
                      <div>
                        <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Budget</span>
                        <p className="text-sm font-medium">{selectedOpportunity.budget_display}</p>
                      </div>
                    )}
                    {selectedOpportunity.timeline_display && (
                      <div>
                        <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Timeline</span>
                        <p className="text-sm font-medium">{selectedOpportunity.timeline_display}</p>
                      </div>
                    )}
                    {selectedOpportunity.work_type && (
                      <div>
                        <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Type</span>
                        <p className="text-sm font-medium">{selectedOpportunity.work_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      </div>
                    )}
                    {selectedOpportunity.location && (
                      <div>
                        <span className={`text-xs uppercase ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Location</span>
                        <p className="text-sm font-medium">{selectedOpportunity.location}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Why You Matched Section */}
              {selectedOpportunity.matched_skills && selectedOpportunity.matched_skills.length > 0 && (
                <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    {isExternalOpportunity(selectedOpportunity) ? 'Skills Required' : 'Why You Matched'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.matched_skills.map((skill, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 text-sm rounded-full ${
                          isExternalOpportunity(selectedOpportunity)
                            ? (darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700')
                            : (darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700')
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About Section - only for non-external */}
              {!isExternalOpportunity(selectedOpportunity) && selectedOpportunity.from_user?.bio && (
                <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    About {selectedOpportunity.from_user.name?.split(' ')[0]}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    {selectedOpportunity.from_user.bio}
                  </p>
                </div>
              )}

              {/* External job notice */}
              {isExternalOpportunity(selectedOpportunity) && (
                <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                      <strong>📱 Tip:</strong> When you save this job, we'll send the full details and apply link to your WhatsApp!
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleAction(selectedOpportunity.id, "decline", isExternalOpportunity(selectedOpportunity));
                    setSelectedOpportunity(null);
                  }}
                  disabled={actionLoading === selectedOpportunity.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold border transition-colors ${
                    darkMode
                      ? 'border-white/30 text-white hover:bg-white/10'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X size={18} />
                  {isExternalOpportunity(selectedOpportunity) ? 'Pass' : 'Decline'}
                </button>
                <button
                  onClick={() => {
                    handleAction(selectedOpportunity.id, "accept", isExternalOpportunity(selectedOpportunity));
                    setSelectedOpportunity(null);
                  }}
                  disabled={actionLoading === selectedOpportunity.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-colors ${
                    isExternalOpportunity(selectedOpportunity)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : (darkMode
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-800')
                  }`}
                >
                  {isExternalOpportunity(selectedOpportunity) ? (
                    <>
                      <Bookmark size={18} />
                      Save Job
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Accept
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className={`sm:max-w-md ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : ''}>Invite a friend</DialogTitle>
            <DialogDescription className={darkMode ? 'text-white/60' : ''}>
              Share this link with friends to invite them to Titlii
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-2">
              <Input
                value={inviteLink}
                readOnly
                className={`flex-1 ${darkMode ? 'bg-white/5 border-white/10 text-white' : ''}`}
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-lg font-semibold text-white"
                style={{ background: '#E50914' }}
              >
                <Copy size={18} />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className={`flex-1 py-3 rounded-full border font-semibold transition-colors ${darkMode ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-full text-white font-semibold"
                style={{ background: '#E50914' }}
                onClick={() => {
                  handleCopyLink();
                  setShowInviteModal(false);
                }}
              >
                Copy & Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpportunitiesPage;
