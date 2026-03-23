/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Gift, Copy, Users, MessageCircle } from "lucide-react";

const ReferralsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await axios.get(`${API}/graph/intent-signals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReferralData(response.data);
      } catch {
        setReferralData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReferralData();
  }, [token]);

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  const referralLink = referralData?.referral_link || "https://getgiggy.ai";
  const referralCount = referralData?.referral_count || 0;
  const rewardBalance = referralData?.reward_balance || 0;
  const referred = referralData?.referred_users || [];

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Referrals</h1>
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-red-500/10" : "bg-red-50"}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center flex-shrink-0">
              <Gift size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Earn when your friends earn</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                Invite someone. When they close their first gig through Giggy, you both earn a reward.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>People Referred</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{referralCount}</p>
          </div>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Reward Balance</p>
            <p className={`text-2xl font-bold ${rewardBalance > 0 ? (darkMode ? "text-green-400" : "text-green-600") : (darkMode ? "text-white" : "text-gray-900")}`}>
              {rewardBalance > 0 ? `$${rewardBalance}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Your referral link</p>
        <div className={`flex items-center gap-2 p-3 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
          <p className={`flex-1 text-sm truncate font-mono ${darkMode ? "text-white/70" : "text-gray-600"}`}>{referralLink}</p>
          <button
            onClick={() => handleCopy(referralLink)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-semibold flex-shrink-0"
            style={{ background: "#E50914" }}
          >
            <Copy size={14} />
            Copy
          </button>
        </div>
      </div>

      {/* Referred Users */}
      {referred.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Users size={40} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <p className={`mt-4 ${darkMode ? "text-white/50" : "text-gray-500"}`}>No referrals yet</p>
          <p className={`text-sm mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>Share your link to start earning</p>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {referred.map((r, i) => (
            <div key={i} className={`px-4 py-4 flex items-center gap-3 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                {r.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{r.name}</p>
                <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{r.status === "converted" ? "Closed first gig ✓" : "Signed up"}</p>
              </div>
              {r.status === "converted" && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"}`}>Earned</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
