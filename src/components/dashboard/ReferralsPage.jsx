// ReferralsPage — editorial redesign.

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Copy, Share2 } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

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
    toast.success("link copied");
  };

  const handleWhatsAppShare = () => {
    if (!referral?.referral_url) return;
    const text = encodeURIComponent(
      `join me on gully — find creative gigs and collaborators. ${referral.referral_url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (!referral?.referral_url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Gully",
          text: "Find creative gigs and collaborators.",
          url: referral.referral_url,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;
  }

  const referralUrl = referral?.referral_url || "";
  const clicks = referral?.clicks || 0;
  const signups = referral?.signups || 0;
  const proMonths = referral?.pro_months_earned || 0;

  return (
    <div>
      {/* Intro */}
      <section className={`rounded-2xl border p-5 mb-5 ${darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-100 bg-white"}`}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}>
            T
          </div>
          <div className="flex-1">
            <p className={`text-[14.5px] leading-[1.55] lowercase ${darkMode ? "text-white/90" : "text-gray-900"}`}>
              share your link. every signup earns you one free month of pro — no limits.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: "clicks", value: clicks },
          { label: "signups", value: signups },
          { label: "pro months", value: proMonths > 0 ? `+${proMonths}` : "—", highlight: proMonths > 0 },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-100 bg-white"}`}
          >
            <div className={`font-mono text-[10px] tracking-[0.2em] lowercase mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              {stat.label}
            </div>
            <div
              className="font-display text-[28px] leading-none font-normal"
              style={{ color: stat.highlight ? "#E50914" : undefined }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
        your link
      </div>
      {referralUrl ? (
        <>
          <div className={`flex items-center gap-2 p-3 rounded-xl border mb-3 ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-100"}`}>
            <p className={`flex-1 text-[12px] truncate font-mono lowercase ${darkMode ? "text-white/70" : "text-gray-600"}`}>
              {referralUrl}
            </p>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-syne text-[12px] font-medium lowercase flex-shrink-0 text-white hover:opacity-90"
              style={{ background: "#0a0a0a" }}
            >
              <Copy size={12} /> copy
            </button>
          </div>

          <div className="flex gap-2 mb-5">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full font-syne text-[13px] font-medium lowercase text-white"
              style={{ background: "#25D366" }}
            >
              <WhatsAppIcon size={13} /> share on whatsapp
            </button>
            <button
              onClick={handleNativeShare}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full font-syne text-[13px] font-medium lowercase border ${darkMode ? "border-white/20 text-white hover:bg-white/5" : "border-gray-200 text-gray-900 hover:border-gray-400"}`}
            >
              <Share2 size={12} /> share
            </button>
          </div>
        </>
      ) : (
        <p className={`font-mono text-[11px] lowercase mb-5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
          couldn't load your link. try refreshing.
        </p>
      )}

      {/* Empty vs earned state */}
      {signups === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-[14px] mb-4"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
          >
            T
          </div>
          <h3 className={`font-display text-[22px] leading-tight font-normal mb-2 lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
            no referrals yet.
          </h3>
          <p className={`font-syne text-[14px] max-w-sm lowercase ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            share your link — every signup earns you a free month of pro.
          </p>
        </div>
      ) : (
        <section className={`rounded-2xl border p-5 ${darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-100 bg-white"}`}>
          <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            {signups} {signups === 1 ? "person" : "people"} joined
          </div>
          <p className={`text-[14px] leading-relaxed lowercase ${darkMode ? "text-white/80" : "text-gray-700"}`}>
            you've earned <span className="font-semibold" style={{ color: "#E50914" }}>{proMonths} month{proMonths !== 1 ? "s" : ""}</span> of pro through referrals.
            {proMonths > 0 && " keep sharing to keep earning."}
          </p>
        </section>
      )}
    </div>
  );
};

export default ReferralsPage;
