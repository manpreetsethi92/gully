import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Send, Users, MessageCircle, Check, X, Clock, XCircle, UserCheck } from "lucide-react";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const RequestsPage = ({ onRefresh, darkMode }) => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [closeLoading, setCloseLoading] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const fetchMatches = async (requestId) => {
    setMatchesLoading(true);
    try {
      const response = await axios.get(`${API}/requests/${requestId}/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(response.data);
    } catch (error) {
      toast.error("Failed to fetch matches");
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleViewMatches = (request) => {
    setSelectedRequest(request);
    setShowApplicants(false);
    fetchMatches(request.id);
  };

  const handleMatchAction = async (matchId, action) => {
    setActionLoading(matchId);
    try {
      await axios.post(
        `${API}/matches/${matchId}/action`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMatches(matches.map(m =>
        m.id === matchId
          ? { ...m, status: action === 'approve' ? 'outreach_sent' : 'rejected' }
          : m
      ));

      if (action === 'approve') {
        toast.success("Taj will reach out to them!");
      } else {
        toast.success("Skipped");
      }

      fetchRequests();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const fetchApplicants = async (requestId) => {
    setApplicantsLoading(true);
    try {
      const response = await axios.get(`${API}/requests/${requestId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(response.data);
    } catch (error) {
      toast.error("Failed to fetch applicants");
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleViewApplicants = (request) => {
    setSelectedRequest(request);
    setShowApplicants(true);
    fetchApplicants(request.id);
  };

  const handleApplicantAction = async (requestId, userId, action) => {
    setActionLoading(userId);
    try {
      await axios.post(
        `${API}/requests/${requestId}/applicants/${userId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplicants(applicants.filter(a => a.user.id !== userId));

      if (action === 'approve') {
        toast.success("Connected! Check your Connections page.");
      } else {
        toast.success("Declined");
      }

      fetchRequests();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleClosePost = async (requestId) => {
    setCloseLoading(requestId);
    try {
      await axios.post(
        `${API}/requests/${requestId}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post closed");
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Failed to close post");
    } finally {
      setCloseLoading(null);
    }
  };

  // Calculate expiration display
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMatchStatus = (status) => {
    switch (status) {
      case "suggested": return { label: "New", color: "text-blue-600 bg-blue-50" };
      case "outreach_sent": return { label: "Sent", color: "text-amber-600 bg-amber-50" };
      case "accepted": return { label: "Connected", color: "text-green-600 bg-green-50" };
      case "rejected": return { label: "Skipped", color: "text-gray-500 bg-gray-100" };
      case "declined": return { label: "Declined", color: "text-red-600 bg-red-50" };
      default: return { label: status, color: "text-gray-600 bg-gray-50" };
    }
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
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Requests</h1>
      </div>

      {/* Message Taj Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <div className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-[#E50914]">
            <MessageCircle size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>Message Taj to create requests</p>
            <p className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>She'll find the right people for you</p>
          </div>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366] hover:opacity-90 transition-opacity"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Requests */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Send size={48} className={darkMode ? 'text-white/20' : 'text-gray-300'} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No requests yet</h2>
          <p className={darkMode ? 'text-white/50' : 'text-gray-500'}>Message Taj to create your first request</p>
        </div>
      ) : (
        <div>
          {requests.map((request) => {
            const hasMatches = request.matches_count > 0;
            const hasApplicants = request.applicants_count > 0;
            const expiry = getExpirationDisplay(request.expires_at);
            const isExpired = request.status === 'expired';
            const isClosed = request.status === 'closed';

            return (
              <div
                key={request.id}
                className={`p-4 border-b transition-colors ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} ${(hasMatches || hasApplicants) ? 'cursor-pointer' : ''}`}
                onClick={() => hasMatches ? handleViewMatches(request) : hasApplicants ? handleViewApplicants(request) : null}
              >
                {/* Row 1: Time + Category + Status + Match Count + Expiration */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isExpired || isClosed ? 'bg-gray-400' :
                    request.status === 'matching' ? 'bg-yellow-500' :
                    request.status === 'done' || request.status === 'completed' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}></span>
                  <span className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    {formatDate(request.created_at)}
                  </span>

                  {/* Category Badge */}
                  {request.category && request.category !== 'other' && request.category !== 'community' && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                      {request.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  )}

                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    isExpired ? (darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-500') :
                    isClosed ? (darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-500') :
                    request.status === 'review' || request.status === 'awaiting_approval'
                      ? (darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700')
                      : (darkMode ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600')
                  }`}>
                    {isExpired ? 'Expired' : isClosed ? 'Closed' : request.status === 'awaiting_approval' ? 'Review' : request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                  </span>

                  {/* Match Count */}
                  {hasMatches && (
                    <span className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      {request.matches_count} matches
                    </span>
                  )}

                  {/* Applicants Count */}
                  {hasApplicants && (
                    <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {request.applicants_count} applicant{request.applicants_count > 1 ? 's' : ''}
                    </span>
                  )}

                  {/* Expiration countdown */}
                  {!isExpired && !isClosed && expiry && (
                    <span className={`text-sm font-medium flex items-center gap-1 ${
                      expiry.color === 'green' ? (darkMode ? 'text-green-400' : 'text-green-600') :
                      expiry.color === 'yellow' ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') :
                      (darkMode ? 'text-red-400' : 'text-red-600')
                    }`}>
                      <Clock size={12} />
                      {expiry.text}
                    </span>
                  )}
                </div>

                {/* Row 2: Request Title */}
                <p className={`text-[15px] leading-relaxed ${isExpired || isClosed ? (darkMode ? 'text-white/50' : 'text-gray-500') : (darkMode ? 'text-white/90' : 'text-gray-800')}`}>
                  "{request.title}"
                </p>

                {/* Row 3: Budget / Timeline / Location (if any exist) */}
                {(request.budget_display || request.timeline_display || request.location) && (
                  <div className={`flex items-center gap-3 mt-2 text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    {request.budget_display && (
                      <span>{request.budget_display}</span>
                    )}
                    {request.budget_display && (request.timeline_display || request.location) && (
                      <span>·</span>
                    )}
                    {request.timeline_display && (
                      <span>{request.timeline_display}</span>
                    )}
                    {request.timeline_display && request.location && (
                      <span>·</span>
                    )}
                    {request.location && (
                      <span>{request.location}</span>
                    )}
                  </div>
                )}

                {/* Row 4: Action buttons */}
                <div className="flex items-center gap-3 mt-3">
                  {hasMatches && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMatches(request);
                      }}
                      className="text-sm font-medium text-red-500 hover:text-red-400"
                    >
                      View matches →
                    </button>
                  )}
                  {hasApplicants && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewApplicants(request);
                      }}
                      className={`text-sm font-medium ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
                    >
                      View applicants →
                    </button>
                  )}
                  {!isExpired && !isClosed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to close this post?')) {
                          handleClosePost(request.id);
                        }
                      }}
                      disabled={closeLoading === request.id}
                      className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <XCircle size={14} />
                      Close post
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Matches Modal */}
      <Dialog open={!!selectedRequest && !showApplicants} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className={`sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col ${darkMode ? 'bg-[#111] border-white/10' : ''}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : 'text-gray-900'}>Matches</DialogTitle>
            {selectedRequest && (
              <div className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                <p className="text-sm">"{selectedRequest.title}"</p>
                {(selectedRequest.budget_display || selectedRequest.timeline_display || selectedRequest.location) && (
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    {selectedRequest.budget_display && <span>{selectedRequest.budget_display}</span>}
                    {selectedRequest.budget_display && (selectedRequest.timeline_display || selectedRequest.location) && <span>·</span>}
                    {selectedRequest.timeline_display && <span>{selectedRequest.timeline_display}</span>}
                    {selectedRequest.timeline_display && selectedRequest.location && <span>·</span>}
                    {selectedRequest.location && <span>{selectedRequest.location}</span>}
                  </div>
                )}
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
            {matchesLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="spinner"></div>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-10">
                <Users size={40} className={`mx-auto mb-3 ${darkMode ? 'text-white/20' : 'text-gray-300'}`} />
                <p className={darkMode ? 'text-white/50' : 'text-gray-500'}>No matches yet</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>Taj is still searching...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match) => {
                  const status = getMatchStatus(match.status);
                  const canAct = match.status === 'suggested';

                  return (
                    <div
                      key={match.id}
                      className={`rounded-xl p-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar - with photo support */}
                        {match.matched_user?.photo_url || match.matched_user?.photo || match.matched_user?.avatar ? (
                          <img
                            src={match.matched_user.photo_url || match.matched_user.photo || match.matched_user.avatar}
                            alt={match.matched_user.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                          >
                            {match.matched_user?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {/* Name + Status */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {match.matched_user?.name || 'Unknown'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-white/10 text-white/60' : status.color}`}>
                              {status.label}
                            </span>
                          </div>

                          {/* Location */}
                          {match.matched_user?.location && (
                            <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                              {match.matched_user.location}
                            </p>
                          )}

                          {/* Skills as tags - max 3 */}
                          {match.matched_user?.skills && match.matched_user.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {match.matched_user.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-white/10 text-white/70' : 'bg-gray-200 text-gray-700'}`}
                                >
                                  {skill}
                                </span>
                              ))}
                              {match.matched_user.skills.length > 3 && (
                                <span className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                                  +{match.matched_user.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Match Reason */}
                          {match.match_reason && (
                            <p className={`text-xs mt-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                              Matched: {match.match_reason}
                            </p>
                          )}
                        </div>

                        {/* Actions - only if status is suggested */}
                        {canAct && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleMatchAction(match.id, 'approve')}
                              disabled={actionLoading === match.id}
                              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#22c55e] text-white hover:opacity-90 transition-opacity"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => handleMatchAction(match.id, 'reject')}
                              disabled={actionLoading === match.id}
                              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${darkMode ? 'border-white/20 text-white/60 hover:bg-white/10' : 'border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Applicants Modal */}
      <Dialog open={!!selectedRequest && showApplicants} onOpenChange={() => { setSelectedRequest(null); setShowApplicants(false); }}>
        <DialogContent className={`sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col ${darkMode ? 'bg-[#111] border-white/10' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <UserCheck size={20} className="text-purple-500" />
              Interested Professionals
            </DialogTitle>
            {selectedRequest && (
              <div className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                <p className="text-sm">"{selectedRequest.title}"</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  These professionals want to connect with you!
                </p>
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
            {applicantsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="spinner"></div>
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-10">
                <UserCheck size={40} className={`mx-auto mb-3 ${darkMode ? 'text-white/20' : 'text-gray-300'}`} />
                <p className={darkMode ? 'text-white/50' : 'text-gray-500'}>No applicants yet</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>Wait for professionals to express interest</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applicants.map((applicant) => {
                  const user = applicant.user;

                  return (
                    <div
                      key={applicant.opportunity_id}
                      className={`rounded-xl p-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        {user?.photo_url || user?.photo || user?.avatar ? (
                          <img
                            src={user.photo_url || user.photo || user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}
                          >
                            {user?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {/* Name */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user?.name || 'Unknown'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                              Interested
                            </span>
                          </div>

                          {/* Location */}
                          {user?.location && (
                            <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                              {user.location}
                            </p>
                          )}

                          {/* Skills as tags - max 3 */}
                          {user?.skills && user.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {user.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}
                                >
                                  {skill}
                                </span>
                              ))}
                              {user.skills.length > 3 && (
                                <span className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                                  +{user.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Bio preview */}
                          {user?.bio && (
                            <p className={`text-xs mt-2 line-clamp-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                              {user.bio}
                            </p>
                          )}

                          {/* Applied at */}
                          {applicant.applied_at && (
                            <p className={`text-xs mt-2 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                              Applied {formatDate(applicant.applied_at)}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleApplicantAction(selectedRequest.id, user.id, 'approve')}
                            disabled={actionLoading === user.id}
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleApplicantAction(selectedRequest.id, user.id, 'decline')}
                            disabled={actionLoading === user.id}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${darkMode ? 'border-white/20 text-white/60 hover:bg-white/10' : 'border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsPage;
