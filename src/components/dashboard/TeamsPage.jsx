/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { UsersRound, MessageCircle, Plus, Star } from "lucide-react";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const TeamsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API}/graph/micro-teams`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeams(response.data || []);
      } catch {
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
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
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b flex items-center justify-between ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Teams</h1>
        {teams.length > 0 && (
          <span className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{teams.length} team{teams.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Info Banner */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`p-4 rounded-2xl ${darkMode ? "bg-purple-500/10" : "bg-purple-50"}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <UsersRound size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>Your collaborative teams</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/60" : "text-gray-600"}`}>
                When you work with the same person twice, Giggy suggests forming a named team. Teams have a shared rate card and reputation — hirers can book the whole team for bigger projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <UsersRound size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>No teams formed yet</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            Close 2+ gigs with the same collaborator and Giggy will prompt you to form a named team. Unlike Work History (your solo track record), teams are bookable units — hirers can hire the whole team at once.
          </p>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: "#E50914" }}
          >
            <MessageCircle size={18} />
            Find collaborators via Taj →
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {teams.map((team) => (
            <div key={team._id || team.id} className={`px-4 py-5 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                  {(team.name || "T").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-bold text-[15px] ${darkMode ? "text-white" : "text-gray-900"}`}>{team.name || "Unnamed Team"}</p>
                    {team.reputation_score > 0 && (
                      <span className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${darkMode ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-700"}`}>
                        <Star size={10} />
                        {team.reputation_score?.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {team.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {team.skills.slice(0, 4).map((s, i) => (
                        <span key={i} className={`px-2.5 py-1 text-xs rounded-full border ${darkMode ? "bg-white/10 text-white/80 border-white/20" : "bg-gray-100 text-gray-700 border-gray-200"}`}>{s}</span>
                      ))}
                    </div>
                  )}
                  {team.members?.length > 0 && (
                    <p className={`text-sm mt-2 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                      {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
