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
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
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

  const getIcon = (type) => {
    switch (type) {
      case "match": return { bg: darkMode ? "bg-green-500/20" : "bg-green-100", color: darkMode ? "text-green-400" : "text-green-600" };
      case "message": return { bg: darkMode ? "bg-blue-500/20" : "bg-blue-100", color: darkMode ? "text-blue-400" : "text-blue-600" };
      case "connection": return { bg: darkMode ? "bg-purple-500/20" : "bg-purple-100", color: darkMode ? "text-purple-400" : "text-purple-600" };
      default: return { bg: darkMode ? "bg-white/10" : "bg-gray-100", color: darkMode ? "text-white/60" : "text-gray-500" };
    }
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
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b flex items-center justify-between ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Notifications</h1>
        {notifications.some(n => !n.read) && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>
            {notifications.filter(n => !n.read).length} new
          </span>
        )}
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Bell size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>All caught up</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            Notifications for matches, connections, and messages will appear here.
          </p>
          <a
            href="https://wa.me/12134147369?text=Hi%20Taj!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: "#E50914" }}
          >
            <MessageCircle size={18} />
            Message Taj to get matches
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {notifications.map((notif, i) => {
            const iconStyle = getIcon(notif.type);
            return (
              <div
                key={notif.id || i}
                className={`px-4 py-4 flex items-start gap-3 transition-colors ${!notif.read ? (darkMode ? "bg-white/5" : "bg-blue-50/50") : ""} ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconStyle.bg}`}>
                  <Bell size={18} className={iconStyle.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] ${notif.read ? (darkMode ? "text-white/70" : "text-gray-700") : (darkMode ? "text-white" : "text-gray-900")} font-medium`}>
                    {notif.title || notif.message}
                  </p>
                  {notif.body && (
                    <p className={`text-sm mt-0.5 ${darkMode ? "text-white/50" : "text-gray-500"}`}>{notif.body}</p>
                  )}
                  <p className={`text-xs mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>{formatDate(notif.created_at)}</p>
                </div>
                {notif.read && (
                  <Check size={16} className={darkMode ? "text-white/20 flex-shrink-0 mt-1" : "text-gray-300 flex-shrink-0 mt-1"} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
