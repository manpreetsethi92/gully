import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Users, MessageCircle, ExternalLink, Instagram, Linkedin, Twitter } from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/titliworkBot?start=welcome";

const ConnectionsPage = ({ onRefresh }) => {
  const { token } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${API}/connections`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConnections(response.data);
      } catch (error) {
        toast.error("Failed to fetch connections");
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [token]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'instagram': return <Instagram size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'twitter': return <Twitter size={16} />;
      default: return <ExternalLink size={16} />;
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
      <div className="sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 dark:border-[#222]">
        <h1 className="text-xl font-bold">Connections</h1>
        {connections.length > 0 && (
          <p className="text-sm text-gray-500">{connections.length} connection{connections.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* Content */}
      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Users size={48} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No connections yet</h2>
          <p className="text-gray-500 mb-6">
            When you and someone both accept to connect, they'll appear here.
          </p>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: '#E50914' }}
          >
            <MessageCircle size={18} />
            Message Taj to find connections
          </a>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-[#222]">
          {connections.map((conn) => (
            <article key={conn.id} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
              <div className="flex gap-3">
                {/* Avatar */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                >
                  {conn.other_user?.name?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name and Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[17px]">{conn.other_user?.name || 'Unknown'}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Connected
                    </span>
                  </div>
                  
                  {/* Connected for */}
                  <p className="text-gray-500 text-sm mb-2">
                    Connected on {formatDate(conn.created_at)}
                    {conn.request_title && (
                      <span> · For: <span className="text-gray-700 dark:text-gray-300">{conn.request_title}</span></span>
                    )}
                  </p>

                  {/* Bio */}
                  {conn.other_user?.bio && (
                    <p className="text-[15px] text-gray-700 dark:text-gray-300 mb-3">{conn.other_user.bio}</p>
                  )}

                  {/* Skills */}
                  {conn.other_user?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {conn.other_user.skills.map((skill, i) => (
                        <span 
                          key={i}
                          className="connection-skill-tag px-2.5 py-1 bg-gray-100 dark:bg-[#222] rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Links */}
                  {conn.other_user?.social_links && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.entries(conn.other_user.social_links).map(([platform, url]) => {
                        if (!url) return null;
                        return (
                          <a
                            key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 transition-colors"
                          >
                            {getSocialIcon(platform)}
                            <span className="capitalize">{platform}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
