// AdsPage — editorial redesign.

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../../App";
import { Eye } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const AdsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  const campaigns = user?.promoted_placements || [];
  const isPromoted = user?.is_promoted === true || campaigns.length > 0;

  return (
    <div>
      {/* How it works */}
      <section className={`rounded-2xl border p-5 mb-5 ${darkMode ?"border-white/10 bg-white/[0.03]" :"border-gray-100 bg-white"}`}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}>
            T
          </div>
          <div className="flex-1">
            <p className={`text-[14.5px] leading-[1.55] ${darkMode ?"text-white/90" :"text-gray-900"}`}>
              show up first in your category. promoted profiles land at the top of search results for hirers looking for your skill in your city. you only show up in searches you already qualify for — vetting stays strict.
            </p>
          </div>
        </div>
      </section>

      {isPromoted ? (
        <div>
          <div className={`font-mono text-[10px] mb-3 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
            active campaigns
          </div>
          {campaigns.map((c, i) => (
            <article
              key={i}
              className={`rounded-2xl border p-5 mb-3 transition-colors ${
 darkMode ?"bg-white/[0.03] border-white/10 hover:bg-white/[0.05]" :"bg-white border-gray-100 hover:border-gray-200"
 }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                    <span className={`text-[15px] font-semibold ${darkMode ?"text-white" :"text-gray-900"}`}>
                      {[c.category, c.location].filter(Boolean).join(" · ").toLowerCase()}
                    </span>
                    <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide"
                      style={{ color: "#059669", background: darkMode ? "rgba(16,185,129,0.2)" : "#d1fae5" }}>
                      active
                    </span>
                  </div>
                  {c.impressions > 0 && (
                    <div className={`inline-flex items-center gap-1 mt-1 font-mono text-[11px] tracking-wide ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                      <Eye size={11} /> {c.impressions.toLocaleString()} views
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>
          {/* Pricing tiers */}
          <div className={`font-mono text-[10px] mb-3 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
            pricing
          </div>
          <div className="space-y-2 mb-5">
            {[
              { label: "weekly", price: "$9", description: "try it for a week" },
              { label: "monthly", price: "$29", description: "best value — save 20%" },
            ].map((tier) => (
              <div
                key={tier.label}
                className={`rounded-2xl border p-5 flex items-center justify-between ${darkMode ?"border-white/10 bg-white/[0.03]" :"border-gray-100 bg-white"}`}
              >
                <div>
                  <div className={`text-[14px] font-semibold ${darkMode ?"text-white" :"text-gray-900"}`}>
                    {tier.label}
                  </div>
                  <div className={`font-mono text-[11px] tracking-wide mt-0.5 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                    {tier.description}
                  </div>
                </div>
                <div className={`text-[18px] font-semibold ${darkMode ?"text-white" :"text-gray-900"}`}>
                  {tier.price}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <p className={`text-[14px] max-w-sm mb-4 ${darkMode ?"text-white/60" :"text-gray-600"}`}>
              message taj to set up your first promoted placement. pick skill, city, and budget — she does the rest.
            </p>
            <a
              href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20want%20to%20promote%20my%20profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-medium text-white"
              style={{ background: "#25D366" }}
            >
              <WhatsAppIcon size={12} /> Set up promotion via Taj
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default AdsPage;
