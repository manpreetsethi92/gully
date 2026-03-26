/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Gift, Copy, Users, Share2 } from "lucide-react";

const ReferralsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await axios.get(`${API}/referrals/my-link`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReferral(res.data);
      } catch {
        setReferral(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReferral();
  }, [token]);

  const handleCopy = () => {
    if (!referral?.referral_url) return;
    navigator.clipboard.writeText(referral.referral_url);
    toast.success("Referral link copied!");
  };

  const handleWhatsAppShare = () => {
    if (!referral?.referral_url) return;
    const text = encodeURIComponent(
      `Join me on Titlii — find creative gigs and collaborators. ${referral.referral_url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (!referral?.referral_url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Titlii",
          text: "Find creative gigs and collaborators.",
          url: referral.referral_url,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  const referralUrl = referral?.referral_url || "";
  const clicks = referral?.clicks || 0;
  const signups = referral?.signups || 0;
  const proMonths = referral?.pro_months_earned || 0;

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
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>
                Get 1 month of Pro — free
              </p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                Share your link. Every time someone signs up using it, you earn 1 free month of Pro. No limits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Link Clicks</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{clicks}</p>
          </div>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Signed Up</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{signups}</p>
          </div>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Pro Months</p>
            <p className={`text-2xl font-bold ${proMonths > 0 ? "text-[#E50914]" : (darkMode ? "text-white" : "text-gray-900")}`}>
              {proMonths > 0 ? `+${proMonths}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
          Your referral link
        </p>
        {referralUrl ? (
          <>
            <div className={`flex items-center gap-2 p-3 rounded-xl border mb-3 ${darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
              <p className={`flex-1 text-sm truncate font-mono ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                {referralUrl}
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-semibold flex-shrink-0"
                style={{ background: "#E50914" }}
              >
                <Copy size={14} /> Copy
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: "#25D366" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>
              <button
                onClick={handleNativeShare}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border ${darkMode ? "border-white/10 text-white hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                <Share2 size={15} /> Share
              </button>
            </div>
          </>
        ) : (
          <p className={`text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            Could not load referral link. Try refreshing.
          </p>
        )}
      </div>

      {/* Empty state */}
      {signups === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Users size={40} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <p className={`mt-4 font-medium ${darkMode ? "text-white/50" : "text-gray-500"}`}>No referrals yet</p>
          <p className={`text-sm mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
            Share your link — every signup earns you a free month of Pro
          </p>
        </div>
      )}

      {signups > 0 && (
        <div className={`px-4 py-4`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            {signups} {signups === 1 ? "person" : "people"} joined
          </p>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-sm ${darkMode ? "text-white/60" : "text-gray-600"}`}>
              You've earned <span className="font-bold text-[#E50914]">{proMonths} month{proMonths !== 1 ? "s" : ""}</span> of Pro through referrals.
              {proMonths > 0 && " Keep sharing to keep earning."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
