// PaymentsPage — editorial redesign, same data + Stripe portal flow.

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { WhatsAppIcon } from "./WhatsAppIcon";

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
      toast.error("couldn't open billing");
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
    return new Date(ts * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toLowerCase();
  };

  const isPaid = isActive && tier !== "free";

  return (
    <div>
      {/* Current plan */}
      <section className={`rounded-2xl border p-5 mb-5 ${darkMode ?"border-white/10 bg-white/[0.03]" :"border-gray-100 bg-white"}`}>
        <div className="flex items-start justify-between mb-2">
          <div className={`font-mono text-[10px] ${darkMode ?"text-white/40" :"text-gray-400"}`}>
            current plan
          </div>
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide"
            style={{
              color: isPaid ? "#059669" : "#6b7280",
              background: darkMode ? (isPaid ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.1)") : (isPaid ? "#d1fae5" : "#f3f4f6")
            }}
          >
            {isPaid ? "active" : "free"}
          </span>
        </div>
        <div className={`text-[18px] font-semibold ${darkMode ?"text-white" :"text-gray-900"}`}>
          {tier}
        </div>
        {renewsAt && isPaid && (
          <div className={`font-mono text-[11px] tracking-wide mt-2 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
            renews {formatDate(renewsAt)}
          </div>
        )}
        {isPaid && (
          <button
            onClick={handlePortal}
            className={`mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12.5px] font-medium transition-colors ${
 darkMode ?"bg-transparent text-white border border-white/20 hover:border-white/40" :"bg-white text-gray-900 border border-gray-200 hover:border-gray-400"
 }`}
          >
            manage billing →
          </button>
        )}
      </section>

      {/* Upgrade CTA if free */}
      {!isPaid && (
        <section className={`rounded-2xl border p-5 mb-5 ${darkMode ?"border-red-500/20 bg-red-500/5" :"border-red-100 bg-red-50/40"}`}>
          <div className="flex gap-3 items-start mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}>
              T
            </div>
            <div className="flex-1">
              <p className={`text-[14.5px] leading-[1.55] ${darkMode ?"text-white/90" :"text-gray-900"}`}>
                upgrade to pro — $12.99/mo. unlimited searches, unlimited reach-outs, full agent autonomy, priority matching.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20want%20to%20upgrade%20to%20Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12.5px] font-medium text-white ml-12"
            style={{ background: "#25D366" }}
          >
            <WhatsAppIcon size={12} /> Upgrade via Taj
          </a>
        </section>
      )}

      {/* Escrow placeholder */}
      <section>
        <div className={`font-mono text-[10px] mb-3 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
          escrow & earnings
        </div>
        <div className="flex flex-col items-center py-10 px-6 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-[14px] mb-4"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
          >
            T
          </div>
          <h3 className={`text-[16px] font-semibold mb-2 ${darkMode ?"text-white" :"text-gray-900"}`}>
            no earnings yet.
          </h3>
          <p className={`text-[14px] max-w-sm ${darkMode ?"text-white/50" :"text-gray-500"}`}>
            when you close escrow-protected gigs, your earnings show up here.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PaymentsPage;
