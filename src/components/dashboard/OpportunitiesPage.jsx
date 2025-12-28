import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Sparkles, User, Check, X, MoreHorizontal, Share2, Copy, MessageCircle } from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/titliworkBot?start=welcome";

const OpportunitiesPage = ({ onRefresh }) => {
  const { token } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink] = useState("https://titliwork-website.vercel.app");

  useEffect(() => {
    fetchOpportunities();
  }, [token]);

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

  const handleAction = async (opportunityId, action) => {
    setActionLoading(opportunityId);
    try {
      await axios.post(
        `${API}/opportunities/${opportunityId}/action`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove from list
      setOpportunities(opportunities.filter(o => o.id !== opportunityId));
      
      if (action === "accept") {
        toast.success("🎉 You're connected! Check your Connections page.");
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
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold">Opportunities</h1>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          <Share2 size={18} />
          Invite
        </button>
      </div>

      {/* Info Banner */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[15px]">People want to connect with you!</p>
              <p className="text-gray-600 text-sm mt-1">
                When you accept, you'll both be connected and can start collaborating.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Sparkles size={48} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No opportunities yet</h2>
          <p className="text-gray-500 mb-4">When someone's request matches your skills, it'll appear here.</p>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: '#E50914' }}
          >
            <MessageCircle size={18} />
            Message Taj to get more matches
          </a>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {opportunities.map((opp) => (
            <article key={opp.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex gap-3">
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  {opp.from_user?.name?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[15px]">{opp.from_user?.name || 'Someone'}</span>
                    <span className="text-gray-400">wants to connect</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{formatDate(opp.created_at)}</p>

                  {/* Request Content */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Looking for help with:</p>
                    <h3 className="font-bold text-[15px] mb-1">{opp.request_title}</h3>
                    <p className="text-sm text-gray-700 line-clamp-3">{opp.request_description}</p>
                  </div>

                  {/* User Info */}
                  {opp.from_user && (
                    <div className="mb-3">
                      {opp.from_user.bio && (
                        <p className="text-sm text-gray-600 mb-2">{opp.from_user.bio}</p>
                      )}
                      {opp.from_user.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {opp.from_user.skills.map((skill, i) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAction(opp.id, "accept")}
                      disabled={actionLoading === opp.id}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: '#22c55e' }}
                    >
                      <Check size={16} />
                      Accept & Connect
                    </button>
                    <button
                      onClick={() => handleAction(opp.id, "decline")}
                      disabled={actionLoading === opp.id}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <X size={16} />
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a friend</DialogTitle>
            <DialogDescription>
              Share this link with friends to invite them to Titli
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="flex-1"
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
                className="flex-1 py-3 rounded-full border border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
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
