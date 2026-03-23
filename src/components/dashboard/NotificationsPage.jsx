/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../../App";
import { Bell, MessageCircle, Check } from "lucide-react";

const NotificationsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No /notifications endpoint yet — pull recent activity from stats
    const fetch = async () => {
      try {
        const [oppRes, connRes] = await Promise.allSettled([
          axios.get(`${API}/opportunities`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/connections`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const notifs = [];
        if (oppRes.status === "fulfilled" && oppRes.value.data?.length > 0) {
          oppRes.value.data.slice(0, 5).forEach(opp => {
            notifs.push({
              id: `opp-${opp.id}`,
              type: "match",
              title: `New opportunity from ${opp.from_user?.name || "someone"}`,
              body: opp.request_title || opp.request_description,
              created_at: opp.created_at,
              read: false,
            });
          });
        }
        if (connRes.status === "fulfilled" && connRes.value.data?.length > 0) {
          connRes.value.data.slice(0, 3).forEach(conn => {
            const other = conn.other_user || conn;
            notifs.push({
              id: `conn-${conn.id}`,
              type: "connection",
              title: `You connected with ${other.name || "someone"}`,
              body: conn.request_title || null,
              created_at: conn.created_at || conn.createdAt,
              read: true,
            });
          });
        }
        notifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(notifs);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return days < 7 ? `${days}d ago` : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getStyle = (type) => {
    if (type === "match") return { bg: darkMode ? "bg-green-500/20" : "bg-green-100", color: darkMode ? "text-green-400" : "text-green-600" };
    if (type === "connection") return { bg: darkMode ? "bg-purple-500/20" : "bg-purple-100", color: darkMode ? "text-purple-400" : "text-purple-600" };
    return { bg: darkMode ? "bg-white/10" : "bg-gray-100", color: darkMode ? "text-white/60" : "text-gray-500" };
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b flex items-center justify-between ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Notifications</h1>
        {notifications.some(n => !n.read) && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>
            {notifications.filter(n => !n.read).length} new
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Bell size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>All caught up</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>Matches, connections and messages will appear here.</p>
          <a href="https://wa.me/12134147369?text=Hi%20Taj!" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm" style={{ background: "#E50914" }}>
            <MessageCircle size={18} /> Message Taj to get matches
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {notifications.map((n) => {
            const s = getStyle(n.type);
            return (
              <div key={n.id} className={`px-4 py-4 flex items-start gap-3 transition-colors ${!n.read ? (darkMode ? "bg-white/5" : "bg-blue-50/50") : ""} ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${s.bg}`}>
                  <Bell size={18} className={s.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] font-medium ${n.read ? (darkMode ? "text-white/70" : "text-gray-700") : (darkMode ? "text-white" : "text-gray-900")}`}>{n.title}</p>
                  {n.body && <p className={`text-sm mt-0.5 line-clamp-1 ${darkMode ? "text-white/50" : "text-gray-500"}`}>{n.body}</p>}
                  <p className={`text-xs mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>{formatDate(n.created_at)}</p>
                </div>
                {n.read && <Check size={16} className={`flex-shrink-0 mt-1 ${darkMode ? "text-white/20" : "text-gray-300"}`} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
