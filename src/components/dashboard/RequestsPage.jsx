import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Send, Clock, Users, CheckCircle, MessageCircle, Eye, Sparkles, Check, X } from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/titliworkBot?start=welcome";
const WHATSAPP_BOT_URL = "https://wa.me/19454093334?text=Hi%20Taj!";

const RequestsPage = ({ onRefresh, darkMode }) => {
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

  // Clean up request text
  const getCleanRequest = (title, description) => {
    const text = description || title || "";
    const firstSentence = text.split(/[.!?]/)[0];
    if (firstSentence.length <= 100) {
      return firstSentence.trim();
    }
    return text.substring(0, 100).trim() + "...";
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "matching": return { icon: <Sparkles size={12} />, label: "Finding", color: "text-amber-600 bg-amber-50" };
      case "awaiting_approval": return { icon: <Eye size={12} />, label: "Review", color: "text-blue-600 bg-blue-50" };
      case "in_progress": return { icon: <Clock size={12} />, label: "Waiting", color: "text-amber-600 bg-amber-50" };
      case "completed": return { icon: <CheckCircle size={12} />, label: "Done", color: "text-green-600 bg-green-50" };
      default: return { icon: <Clock size={12} />, label: status, color: "text-gray-600 bg-gray-50" };
    }
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
      <div className={`sticky top-0 z-10 px-4 py-3 border-b backdrop-blur-md ${darkMode ? 'bg-[#0a0a0a]/80 border-white/10' : 'bg-white/80 border-gray-100'}`}>
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
          <div className="flex gap-2">
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0088cc] hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
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
      </div>

      {/* Requests */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Send size={48} className={darkMode ? 'text-white/20' : 'text-gray-300'} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No requests yet</h2>
          <p className={darkMode ? 'text-white/50' : 'text-gray-500'}>Message Taj to create your first request</p>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? 'divide-white/10' : 'divide-gray-100'}`}>
          {requests.map((request) => {
            const status = getStatusInfo(request.status);
            const hasMatches = request.matches_count > 0;
            
            return (
              <article 
                key={request.id} 
                className={`px-4 py-4 transition-colors cursor-pointer ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                onClick={() => hasMatches && handleViewMatches(request)}
              >
                <div className="flex items-start gap-3">
                  {/* Status indicator */}
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    request.status === 'awaiting_approval' ? 'bg-blue-500' :
                    request.status === 'completed' ? 'bg-green-500' :
                    'bg-amber-500'
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        {formatDate(request.created_at)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-white/10 text-white/60' : status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      {hasMatches && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
                          <Users size={12} />
                          {request.matches_count}
                        </span>
                      )}
                    </div>

                    {/* Request text */}
                    <p className={`text-[15px] leading-relaxed ${darkMode ? 'text-white/90' : 'text-gray-800'}`}>
                      "{getCleanRequest(request.title, request.description)}"
                    </p>

                    {/* View matches link */}
                    {hasMatches && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMatches(request);
                        }}
                        className="mt-2 text-sm font-medium text-[#E50914] hover:underline"
                      >
                        View matches →
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
        <DialogContent className={`sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col ${darkMode ? 'bg-[#111] border-white/10' : ''}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : ''}>Matches</DialogTitle>
            {selectedRequest && (
              <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                "{getCleanRequest(selectedRequest.title, selectedRequest.description)}"
              </p>
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
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                          {match.matched_user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        
                        {/* Name + Status */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {match.matched_user?.name || 'Unknown'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-white/10 text-white/60' : status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          {match.match_reason && (
                            <p className={`text-xs mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                              {match.match_reason}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        {canAct && (
                          <div className="flex gap-2">
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
    </div>
  );
};

export default RequestsPage;
