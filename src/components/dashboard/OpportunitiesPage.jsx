import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Sparkles, Check, X, Share2, Copy, MessageCircle } from "lucide-react";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

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

  const handleAction = async (opportunityId, action) => {
    setActionLoading(opportunityId);
    try {
      await axios.post(
        `${API}/opportunities/${opportunityId}/action`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpportunities(opportunities.filter(o => o.id !== opportunityId));

      if (action === "accept") {
        toast.success("You're connected! Check your Connections page.");
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

  // Verified badge component
  const VerifiedBadge = ({ className = "w-4 h-4" }) => (
    <svg className={`${className} text-blue-500`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  const hasVerifiedSocial = (user) => {
    return user?.social_links?.linkedin || user?.social_links?.instagram;
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
          {opportunities.map((opp) => (
            <article
              key={opp.id}
              onClick={() => setSelectedOpportunity(opp)}
              className={`px-4 py-5 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div className="flex gap-3">
                {/* Avatar - Use photo if available */}
                {opp.from_user?.profile_photo_url || opp.from_user?.photo || opp.from_user?.avatar ? (
                  <img
                    src={opp.from_user.profile_photo_url || opp.from_user.photo || opp.from_user.avatar}
                    alt={opp.from_user.name}
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
                  {/* Row 1: Name + Verified badge + Time */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {opp.from_user?.name || 'Someone'}
                    </span>
                    {hasVerifiedSocial(opp.from_user) && <VerifiedBadge />}
                    <span className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                      · {formatDate(opp.created_at)}
                    </span>
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
                          className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}
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
          ))}
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
                {selectedOpportunity.from_user?.profile_photo_url || selectedOpportunity.from_user?.photo || selectedOpportunity.from_user?.avatar ? (
                  <img
                    src={selectedOpportunity.from_user.profile_photo_url || selectedOpportunity.from_user.photo || selectedOpportunity.from_user.avatar}
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

                {/* Name + verified */}
                <div className="flex items-center gap-2">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedOpportunity.from_user?.name}
                  </h2>
                  {hasVerifiedSocial(selectedOpportunity.from_user) && <VerifiedBadge className="w-5 h-5" />}
                </div>

                {/* Location */}
                {selectedOpportunity.from_user?.location && (
                  <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    {selectedOpportunity.from_user.location}
                  </p>
                )}

                {/* Social links */}
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
              </div>

              {/* The Opportunity Section */}
              <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  The Opportunity
                </h3>
                <p className={`text-[15px] leading-relaxed ${darkMode ? 'text-white/90' : 'text-gray-800'}`}>
                  "{selectedOpportunity.request_description || selectedOpportunity.request_title}"
                </p>

                {/* Budget/Timeline placeholder */}
                {(selectedOpportunity.budget || selectedOpportunity.timeline) && (
                  <div className="flex gap-4 mt-4">
                    {selectedOpportunity.budget && (
                      <div className={`flex items-center gap-2 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        <span className="text-green-500 font-medium">$</span>
                        <span>{selectedOpportunity.budget}</span>
                      </div>
                    )}
                    {selectedOpportunity.timeline && (
                      <div className={`flex items-center gap-2 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        <span>Timeline:</span>
                        <span>{selectedOpportunity.timeline}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Why You Matched Section */}
              {selectedOpportunity.matched_skills && selectedOpportunity.matched_skills.length > 0 && (
                <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    Why You Matched
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.matched_skills.map((skill, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 text-sm rounded-full ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About Section */}
              {selectedOpportunity.from_user?.bio && (
                <div className={`py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    About {selectedOpportunity.from_user.name?.split(' ')[0]}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    {selectedOpportunity.from_user.bio}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleAction(selectedOpportunity.id, "decline");
                    setSelectedOpportunity(null);
                  }}
                  disabled={actionLoading === selectedOpportunity.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold border transition-colors ${darkMode ? 'border-white/20 text-white/70 hover:bg-white/10' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                >
                  <X size={18} />
                  Decline
                </button>
                <button
                  onClick={() => {
                    handleAction(selectedOpportunity.id, "accept");
                    setSelectedOpportunity(null);
                  }}
                  disabled={actionLoading === selectedOpportunity.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-colors bg-white text-black hover:bg-gray-100"
                >
                  <Check size={18} />
                  Accept
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
