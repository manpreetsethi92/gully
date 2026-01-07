import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Send, Clock, Users, CheckCircle, MessageCircle, MoreHorizontal, Eye, ChevronRight, Sparkles, Check, X, User } from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/titliworkBot?start=welcome";

const RequestsPage = ({ onRefresh }) => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
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
  };

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
      
      // Update local state
      setMatches(matches.map(m => 
        m.id === matchId 
          ? { ...m, status: action === 'approve' ? 'outreach_sent' : 'rejected' }
          : m
      ));
      
      if (action === 'approve') {
        toast.success("Taj will reach out to them!");
      } else {
        toast.success("Match skipped");
      }
      
      // Refresh requests to update counts
      fetchRequests();
    } catch (error) {
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
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "matching": return <Sparkles size={14} />;
      case "awaiting_approval": return <Eye size={14} />;
      case "in_progress": return <Clock size={14} />;
      case "completed": return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "matching": return { bg: '#fef3c7', text: '#92400e' };
      case "awaiting_approval": return { bg: '#dbeafe', text: '#1e40af' };
      case "in_progress": return { bg: '#fef3c7', text: '#92400e' };
      case "completed": return { bg: '#dcfce7', text: '#166534' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "matching": return "Finding matches";
      case "awaiting_approval": return "Review matches";
      case "in_progress": return "In progress";
      case "completed": return "Connected";
      default: return status.replace('_', ' ');
    }
  };

  const getMatchStatusBadge = (status) => {
    switch (status) {
      case "suggested": return { bg: '#dbeafe', text: '#1e40af', label: 'Awaiting your approval' };
      case "outreach_sent": return { bg: '#fef3c7', text: '#92400e', label: 'Waiting for response' };
      case "accepted": return { bg: '#dcfce7', text: '#166534', label: 'Connected!' };
      case "rejected": return { bg: '#f3f4f6', text: '#6b7280', label: 'Skipped' };
      case "declined": return { bg: '#fee2e2', text: '#991b1b', label: 'Declined' };
      default: return { bg: '#f3f4f6', text: '#374151', label: status };
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
      <div className="sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 dark:border-[#222]">
        <h1 className="text-xl font-bold">My Requests</h1>
      </div>

      {/* Message Taj Banner */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-[#222]">
        <div className="info-banner flex items-center gap-4 p-4 rounded-2xl bg-red-50 dark:bg-[#1a1a1a]">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#E50914' }}
          >
            <MessageCircle size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[15px]">Tell her who you need and she'll find matches for you</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">To create a request, message Taj</p>
          </div>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-white font-bold text-sm whitespace-nowrap"
            style={{ background: '#E50914' }}
          >
            Message Taj
          </a>
        </div>
      </div>

      {/* Requests */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Send size={48} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No requests yet</h2>
          <p className="text-gray-500">Message Taj to create your first request</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-[#222]">
          {requests.map((request) => {
            const statusStyle = getStatusColor(request.status);
            const hasMatches = request.matches_count > 0;
            const needsAction = request.status === 'awaiting_approval';
            
            return (
              <article 
                key={request.id} 
                className={`px-4 py-4 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors ${needsAction ? 'cursor-pointer' : ''}`}
                onClick={() => needsAction && handleViewMatches(request)}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: request.category === 'pro' ? '#0a0a0a' : '#E50914' }}
                  >
                    <Send size={18} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[15px]">You</span>
                      <span className="text-gray-500 text-[15px]">·</span>
                      <span className="text-gray-500 text-[15px]">{formatDate(request.created_at)}</span>
                      {needsAction && (
                        <ChevronRight size={18} className="ml-auto text-gray-400" />
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span 
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                      >
                        {getStatusIcon(request.status)}
                        <span>{getStatusLabel(request.status)}</span>
                      </span>
                      {hasMatches && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          <Users size={12} />
                          {request.matches_count} matches
                        </span>
                      )}
                      {request.approved_count > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          <Check size={12} />
                          {request.approved_count} approved
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-[15px] mb-1">{request.title}</h3>
                    <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">{request.description}</p>
                    
                    {/* View Matches Button */}
                    {hasMatches && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMatches(request);
                        }}
                        className="mt-3 flex items-center gap-2 text-sm font-semibold hover:underline"
                        style={{ color: '#E50914' }}
                      >
                        <Eye size={16} />
                        View {request.matches_count} matches
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Matches Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Matches for your request</DialogTitle>
            {selectedRequest && (
              <p className="text-sm text-gray-500 mt-1">"{selectedRequest.title}"</p>
            )}
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
            {matchesLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="spinner"></div>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-10">
                <Users size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No matches found yet</p>
                <p className="text-sm text-gray-400 mt-1">Taj is still searching...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => {
                  const statusBadge = getMatchStatusBadge(match.status);
                  const canTakeAction = match.status === 'suggested';
                  
                  return (
                    <div 
                      key={match.id}
                      className="match-card border border-gray-200 dark:border-[#333] rounded-xl p-4 dark:bg-[#111]"
                    >
                      {/* User Info */}
                      <div className="flex items-start gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                          {match.matched_user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[15px]">{match.matched_user?.name || 'Unknown'}</h4>
                            <span 
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: statusBadge.bg, color: statusBadge.text }}
                            >
                              {statusBadge.label}
                            </span>
                          </div>
                          {match.matched_user?.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{match.matched_user.bio}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Skills */}
                      {match.matched_user?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {match.matched_user.skills.map((skill, i) => (
                            <span 
                              key={i}
                              className="connection-skill-tag px-2 py-0.5 bg-gray-100 dark:bg-[#222] rounded-full text-xs text-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Match Reason */}
                      {match.match_reason && (
                        <p className="text-xs text-gray-500 mb-3">
                          <Sparkles size={12} className="inline mr-1" />
                          {match.match_reason}
                        </p>
                      )}
                      
                      {/* Actions */}
                      {canTakeAction && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-[#333]">
                          <button
                            onClick={() => handleMatchAction(match.id, 'approve')}
                            disabled={actionLoading === match.id}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: '#22c55e' }}
                          >
                            <Check size={16} />
                            Reach out
                          </button>
                          <button
                            onClick={() => handleMatchAction(match.id, 'reject')}
                            disabled={actionLoading === match.id}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                          >
                            <X size={16} />
                            Skip
                          </button>
                        </div>
                      )}
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
