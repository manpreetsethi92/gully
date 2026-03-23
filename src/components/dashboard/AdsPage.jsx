/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Megaphone, MessageCircle, TrendingUp, Eye } from "lucide-react";

const AdsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(`${API}/infrastructure/promoted`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaigns(response.data || []);
      } catch {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === "active");

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Promote</h1>
        {campaigns.length > 0 && (
          <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{activeCampaigns.length} active campaign{activeCampaigns.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-yellow-500/10" : "bg-yellow-50"}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
              <Megaphone size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Show up first in your category</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                Promoted profiles appear at the top of results for hirers in your skill and city. You only show up in searches you already qualify for.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {campaigns.length > 0 && (
        <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active", value: activeCampaigns.length },
              { label: "Total Views", value: campaigns.reduce((s, c) => s + (c.impressions || 0), 0) },
              { label: "Connects", value: campaigns.reduce((s, c) => s + (c.clicks || 0), 0) },
            ].map((stat) => (
              <div key={stat.label} className={`p-3 rounded-xl text-center ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stat.value.toLocaleString()}</div>
                <div className={`text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign List or Empty */}
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Megaphone size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>No active promotions</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            Message Taj to set up your first promoted placement. Pick your skill category, city, and weekly budget.
          </p>
          <a
            href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20want%20to%20promote%20my%20profile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: "#E50914" }}
          >
            <MessageCircle size={18} />
            Set up promotion via Taj
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {campaigns.map((c, i) => (
            <div key={i} className={`px-4 py-5 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${c.status === "active" ? (darkMode ? "bg-yellow-500/20" : "bg-yellow-100") : (darkMode ? "bg-white/10" : "bg-gray-100")}`}>
                  <Megaphone size={18} className={c.status === "active" ? (darkMode ? "text-yellow-400" : "text-yellow-600") : (darkMode ? "text-white/40" : "text-gray-400")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{c.category} · {c.location}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${c.status === "active" ? (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700") : (darkMode ? "bg-gray-500/20 text-gray-400" : "bg-gray-100 text-gray-500")}`}>
                      {c.status === "active" ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className={`flex gap-4 text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                    {c.impressions > 0 && <span className="flex items-center gap-1"><Eye size={12} /> {c.impressions.toLocaleString()} views</span>}
                    {c.budget_display && <span>{c.budget_display}/wk</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsPage;
