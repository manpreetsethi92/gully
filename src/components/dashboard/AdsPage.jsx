/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Megaphone, MessageCircle, Eye } from "lucide-react";

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
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Promote</h1>
        {isPromoted && <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>Promotion active</p>}
      </div>

      {/* How it works */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-yellow-500/10" : "bg-yellow-50"}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
              <Megaphone size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Show up first in your category</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                Promoted profiles appear at the top of results for hirers searching your skill and city.
                You only show up in searches you already qualify for — vetting is never compromised.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current promotion status */}
      {isPromoted ? (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {campaigns.map((c, i) => (
            <div key={i} className={`px-4 py-5 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-yellow-500/20" : "bg-yellow-100"}`}>
                  <Megaphone size={18} className={darkMode ? "text-yellow-400" : "text-yellow-600"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{c.category} · {c.location}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"}`}>Active</span>
                  </div>
                  {c.impressions > 0 && (
                    <p className={`flex items-center gap-1 text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                      <Eye size={12} /> {c.impressions.toLocaleString()} views
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Pricing tiers */}
          <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Pricing</p>
            <div className="space-y-3">
              {[
                { label: "Weekly", price: "$9", description: "Try it for a week" },
                { label: "Monthly", price: "$29", description: "Best value — save 20%" },
              ].map((tier) => (
                <div key={tier.label} className={`p-4 rounded-2xl border ${darkMode ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{tier.label}</p>
                      <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{tier.description}</p>
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{tier.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              Message Taj to set up your first promoted placement. Pick your skill category, city, and budget.
            </p>
            <a
              href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20want%20to%20promote%20my%20profile"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
              style={{ background: "#E50914" }}
            >
              <MessageCircle size={18} /> Set up promotion via Taj
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default AdsPage;
