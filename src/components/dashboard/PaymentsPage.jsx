/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { CreditCard, MessageCircle, ArrowDownLeft, Clock } from "lucide-react";

const PaymentsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [subStatus, setSubStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/subscription/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubStatus(res.data);
      } catch {
        setSubStatus(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const handlePortal = async () => {
    try {
      const res = await axios.post(`${API}/subscription/portal`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.url) window.open(res.data.url, "_blank");
    } catch {
      toast.error("Could not open billing portal");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  const tier = subStatus?.subscription_tier || "free";
  const isActive = subStatus?.is_active === true;
  const renewsAt = subStatus?.current_period_end;

  const formatDate = (ts) => {
    if (!ts) return "";
    return new Date(ts * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div>
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Payments</h1>
      </div>

      {/* Current plan */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Current plan</p>
              <p className={`text-2xl font-bold capitalize ${darkMode ? "text-white" : "text-gray-900"}`}>{tier}</p>
              {renewsAt && isActive && (
                <p className={`text-sm mt-1 ${darkMode ? "text-white/50" : "text-gray-500"}`}>Renews {formatDate(renewsAt)}</p>
              )}
            </div>
            <span className={`px-3 py-1.5 text-sm rounded-full font-semibold ${
              isActive && tier !== "free"
                ? (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700")
                : (darkMode ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-600")
            }`}>
              {isActive && tier !== "free" ? "Active" : "Free"}
            </span>
          </div>
          {isActive && tier !== "free" && (
            <button
              onClick={handlePortal}
              className={`mt-3 w-full py-2.5 rounded-full text-sm font-semibold border transition-colors ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Manage billing →
            </button>
          )}
        </div>
      </div>

      {/* Upgrade CTA if free */}
      {(!isActive || tier === "free") && (
        <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-red-500/10" : "bg-red-50"}`}>
            <p className={`font-bold text-[15px] mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>Upgrade to Pro — $12.99/mo</p>
            <p className={`text-sm mb-3 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
              Unlimited searches, unlimited reach-outs, AI agent autonomy, priority matching.
            </p>
            <a
              href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20want%20to%20upgrade%20to%20Pro"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-white font-semibold"
              style={{ background: "#E50914" }}
            >
              <MessageCircle size={18} /> Upgrade via Taj
            </a>
          </div>
        </div>
      )}

      {/* Escrow section — coming soon */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Escrow & Earnings</p>
        <div className="flex flex-col items-center py-8 text-center">
          <CreditCard size={40} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <p className={`mt-3 ${darkMode ? "text-white/50" : "text-gray-500"}`}>No earnings yet</p>
          <p className={`text-sm mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
            When you close escrow-protected gigs, your earnings will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
