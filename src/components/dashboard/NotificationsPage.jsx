// NotificationsPage — editorial redesign.
// Keeps SSE live stream + data behavior.

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../../App";
import { Check } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const NotificationsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data.notifications || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();

    const sseUrl = `${API}/notifications/stream?token=${token}`;
    const es = new EventSource(sseUrl);
    es.addEventListener("notification", (e) => {
      try {
        const notif = JSON.parse(e.data);
        setNotifications(prev => [notif, ...prev]);
      } catch {}
    });
    return () => es.close();
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return days < 7 ? `${days}d ago` : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase();
  };

  const getKindPill = (type) => {
    if (type === "match") return { label: "match", fg: "#E50914", bg: "#fff1f1" };
    if (type === "connection") return { label: "connection", fg: "#7c3aed", bg: "#f5f3ff" };
    return { label: "update", fg: "#6b7280", bg: "#f3f4f6" };
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      {unreadCount > 0 && (
        <div className={`flex items-center justify-between mb-4 font-mono text-[10.5px] ${darkMode ?"text-white/40" :"text-gray-400"}`}>
          <span>Notifications</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md"
            style={{ color: "#E50914", background: darkMode ? "rgba(229,9,20,0.15)" : "#fff1f1" }}>
            {unreadCount} new
          </span>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-[14px] mb-4"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
          >
            T
          </div>
          <h3 className={`text-[16px] font-semibold mb-2 ${darkMode ?"text-white" :"text-gray-900"}`}>
            all caught up.
          </h3>
          <p className={`text-[14px] max-w-sm mb-5 ${darkMode ?"text-white/50" :"text-gray-500"}`}>
            matches, connections, and updates land here as they happen.
          </p>
          <a
            href="https://wa.me/12134147369?text=Hi%20Taj!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-medium text-white"
            style={{ background: "#25D366" }}
          >
            <WhatsAppIcon size={12} /> message taj
          </a>
        </div>
      ) : (
        <div>
          {notifications.map((n) => {
            const pill = getKindPill(n.type);
            return (
              <article
                key={n.id}
                className={`rounded-2xl border p-5 mb-3 transition-colors ${
 !n.read
 ? (darkMode ?"border-red-500/30 bg-white/[0.04]" :"border-red-100 bg-red-50/30")
 : (darkMode ?"border-white/10 bg-white/[0.02]" :"border-gray-100 bg-white")
 }`}
              >
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}>
                    T
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-1">
                      <span className={`text-[14px] font-semibold ${darkMode ?"text-white" :"text-gray-900"}`}>
                        taj
                      </span>
                      <span className={`font-mono text-[10.5px] ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                        · {formatDate(n.created_at)}
                      </span>
                      <span
                        className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide"
                        style={{ color: pill.fg, background: darkMode ? `${pill.fg}22` : pill.bg }}
                      >
                        {pill.label}
                      </span>
                    </div>
                    <p className={`text-[14.5px] leading-[1.5] ${darkMode ?"text-white/90" :"text-gray-900"}`}>
                      {(n.title || "").toLowerCase()}
                    </p>
                    {n.body && (
                      <p className={`font-mono text-[11px] tracking-wide mt-1 ${darkMode ?"text-white/40" :"text-gray-400"}`}>
                        {n.body.toLowerCase()}
                      </p>
                    )}
                  </div>
                  {n.read && <Check size={14} className={`flex-shrink-0 mt-2 ${darkMode ?"text-white/20" :"text-gray-300"}`} />}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
