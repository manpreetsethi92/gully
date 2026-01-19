import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Users, MessageCircle, Instagram, Linkedin, ChevronDown, Calendar } from "lucide-react";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const ConnectionsPage = ({ onRefresh, darkMode }) => {
  const { token } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Connections</h1>
        {connections.length > 0 && (
          <p className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
            {connections.length} connection{connections.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Content */}
      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Users size={48} className={darkMode ? 'text-white/20' : 'text-gray-300'} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No connections yet</h2>
          <p className={`mb-6 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
            When you and someone both accept to connect, they'll appear here.
          </p>
          <a
            href={WHATSAPP_BOT_URL}
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
        <div>
          {connections.map((conn) => {
            const connection = conn.other_user || conn;
            const isExpanded = expandedId === conn.id;

            return (
              <div
                key={conn.id}
                className={`border-b transition-all duration-200 ${darkMode ? 'border-white/10' : 'border-gray-100'} ${isExpanded ? (darkMode ? 'bg-white/5' : 'bg-gray-50') : ''}`}
              >
                {/* COLLAPSED VIEW - always visible */}
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer"
                  onClick={() => toggleExpand(conn.id)}
                >
                  {/* Avatar */}
                  {connection.photo || connection.avatar || connection.profile_photo ? (
                    <img
                      src={connection.photo || connection.avatar || connection.profile_photo}
                      alt={connection.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {connection.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name + socials + badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {connection.name}
                      </h3>
                      {connection.instagram && (
                        <a
                          href={`https://instagram.com/${connection.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${darkMode ? 'text-white/40 hover:text-pink-400' : 'text-gray-400 hover:text-pink-500'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram size={14} />
                        </a>
                      )}
                      {connection.linkedin && (
                        <a
                          href={connection.linkedin.startsWith('http') ? connection.linkedin : `https://linkedin.com/in/${connection.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${darkMode ? 'text-white/40 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin size={14} />
                        </a>
                      )}
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                        Connected
                      </span>
                    </div>

                    {/* Bio - 1 line */}
                    {connection.bio && (
                      <p className={`text-sm mt-1 line-clamp-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        {connection.bio}
                      </p>
                    )}

                    {/* Skills - max 3 */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(connection.skills || []).slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {skill}
                        </span>
                      ))}
                      {(connection.skills || []).length > 3 && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-white/5 text-white/40' : 'bg-gray-50 text-gray-400'}`}>
                          +{connection.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <ChevronDown
                    size={18}
                    className={`${darkMode ? 'text-white/30' : 'text-gray-400'} transition-transform duration-200 flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* EXPANDED VIEW - only when tapped */}
                {isExpanded && (
                  <div className={`px-4 pb-4 pt-0 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <div className="pl-15 ml-12">
                      {/* Connection date */}
                      <div className={`flex items-center gap-2 text-xs mb-3 mt-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        <Calendar size={12} />
                        <span>Connected {new Date(conn.created_at || conn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      {/* Original request */}
                      {conn.request_title && (
                        <div className={`text-sm mb-3 p-3 rounded-lg ${darkMode ? 'bg-white/5 text-white/70' : 'bg-gray-50 text-gray-600'}`}>
                          <span className={`text-xs font-medium block mb-1 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Connected for:</span>
                          {conn.request_title}
                        </div>
                      )}

                      {/* All skills */}
                      {(connection.skills || []).length > 3 && (
                        <div className="mb-3">
                          <span className={`text-xs font-medium block mb-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>All skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(connection.skills || []).map((skill, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-600'}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/12134147369?text=Hi Taj! I want to reconnect with ${connection.name}`, '_blank');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914] text-white text-sm font-medium hover:bg-[#c5080f] transition-colors"
                      >
                        <MessageCircle size={14} />
                        Message via Taj
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
