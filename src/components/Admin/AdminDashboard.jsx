import { useState, useEffect } from "react";
import { 
  Users, 
  Send, 
  UserPlus, 
  TrendingUp,
  ExternalLink,
  Check,
  X,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Instagram,
  Linkedin,
  Globe,
  Mail,
  MessageSquare
} from "lucide-react";

const API = "https://titly-backend-production.up.railway.app/api";

// Simple password protection - change this!
const ADMIN_PASSWORD = "titli2024";

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [unfilledRequests, setUnfilledRequests] = useState([]);
  const [outreach, setOutreach] = useState([]);
  const [matches, setMatches] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check if already authenticated
  useEffect(() => {
    const saved = localStorage.getItem("titli_admin_auth");
    if (saved === "true") {
      setAuthenticated(true);
    }
  }, []);

  // Fetch all data
  useEffect(() => {
    if (authenticated) {
      fetchAllData();
    }
  }, [authenticated]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, requestsRes, unfilledRes, outreachRes, matchesRes] = await Promise.all([
        fetch(`${API}/admin/users`).then(r => r.json()),
        fetch(`${API}/admin/requests`).then(r => r.json()),
        fetch(`${API}/admin/unfilled-requests`).then(r => r.json()),
        fetch(`${API}/admin/outreach`).then(r => r.json()).catch(() => []),
        fetch(`${API}/admin/matches`).then(r => r.json()).catch(() => [])
      ]);
      
      setUsers(usersRes || []);
      setRequests(requestsRes || []);
      setUnfilledRequests(unfilledRes || []);
      setOutreach(outreachRes || []);
      setMatches(matchesRes || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("titli_admin_auth", "true");
    } else {
      alert("Wrong password");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("titli_admin_auth");
  };

  // Create new outreach
  const createOutreach = async (name, platform, profileUrl, requestId) => {
    try {
      const params = new URLSearchParams({ name, platform, profile_url: profileUrl });
      if (requestId) params.append("request_id", requestId);
      
      await fetch(`${API}/admin/outreach?${params}`, { method: "POST" });
      fetchAllData();
    } catch (error) {
      console.error("Failed to create outreach:", error);
    }
  };

  // Update outreach status
  const updateOutreachStatus = async (outreachId, status) => {
    try {
      await fetch(`${API}/admin/outreach/${outreachId}?status=${status}`, { method: "PATCH" });
      fetchAllData();
    } catch (error) {
      console.error("Failed to update outreach:", error);
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white tracking-tight">TITLI</h1>
            <p className="text-gray-400 mt-2">Admin Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Stats
  const stats = {
    totalUsers: users.length,
    totalRequests: requests.length,
    unfilledRequests: unfilledRequests.length,
    activeOutreach: outreach.filter(o => o.status === "pending" || o.status === "contacted").length,
    successfulOutreach: outreach.filter(o => o.status === "joined").length,
    matchRate: requests.length > 0 
      ? Math.round((requests.filter(r => r.status !== "in_progress").length / requests.length) * 100) 
      : 0
  };

  // Filter functions
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="text-red-500">TITLI</span>
                <span className="text-gray-400 font-normal text-lg ml-2">Admin</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchAllData}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
          <StatCard label="Total Requests" value={stats.totalRequests} icon={Send} color="purple" />
          <StatCard label="Unfilled" value={stats.unfilledRequests} icon={Clock} color="yellow" />
          <StatCard label="Active Outreach" value={stats.activeOutreach} icon={UserPlus} color="orange" />
          <StatCard label="Recruited" value={stats.successfulOutreach} icon={Check} color="green" />
          <StatCard label="Match Rate" value={`${stats.matchRate}%`} icon={TrendingUp} color="red" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users" },
            { id: "requests", label: "All Requests" },
            { id: "unfilled", label: "Unfilled (Recruit)" },
            { id: "outreach", label: "Outreach Tracking" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-red-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
              {tab.id === "unfilled" && stats.unfilledRequests > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-500 text-black rounded-full">
                  {stats.unfilledRequests}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search users, requests, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
          
          {(activeTab === "requests" || activeTab === "overview") && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_approval">Awaiting Approval</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab 
            users={filteredUsers.slice(0, 5)} 
            requests={filteredRequests.slice(0, 5)}
            unfilledRequests={unfilledRequests.slice(0, 5)}
            outreach={outreach.slice(0, 5)}
          />
        )}
        
        {activeTab === "users" && (
          <UsersTab users={filteredUsers} />
        )}
        
        {activeTab === "requests" && (
          <RequestsTab requests={filteredRequests} users={users} />
        )}
        
        {activeTab === "unfilled" && (
          <UnfilledTab 
            requests={unfilledRequests} 
            onCreateOutreach={createOutreach}
          />
        )}
        
        {activeTab === "outreach" && (
          <OutreachTab 
            outreach={outreach} 
            onUpdateStatus={updateOutreachStatus}
            unfilledRequests={unfilledRequests}
          />
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
    yellow: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/30",
    green: "from-green-500/20 to-green-600/5 border-green-500/30",
    red: "from-red-500/20 to-red-600/5 border-red-500/30"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon size={20} className="text-gray-400" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ users, requests, unfilledRequests, outreach }) => (
  <div className="grid lg:grid-cols-2 gap-6">
    {/* Recent Users */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold">Recent Users</h3>
      </div>
      <div className="divide-y divide-white/5">
        {users.map(user => (
          <div key={user.id} className="px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold">
              {user.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-gray-400 truncate">
                {user.skills?.slice(0, 2).join(", ") || "No skills"}
              </div>
            </div>
            {user.telegram_connected && (
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                Telegram
              </span>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Unfilled Requests */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-yellow-400">🔥 Recruitment Opportunities</h3>
        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
          {unfilledRequests.length} unfilled
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {unfilledRequests.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            All requests have matches! 🎉
          </div>
        ) : (
          unfilledRequests.map(req => (
            <div key={req.id} className="px-4 py-3">
              <div className="font-medium text-yellow-100">{req.title}</div>
              <div className="text-sm text-gray-400 mt-1">
                By {req.requester} · {new Date(req.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden lg:col-span-2">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold">Recent Requests</h3>
      </div>
      <div className="divide-y divide-white/5">
        {requests.map(req => (
          <div key={req.id} className="px-4 py-3 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{req.title}</div>
              <div className="text-sm text-gray-400">
                {new Date(req.created_at).toLocaleDateString()}
              </div>
            </div>
            <StatusBadge status={req.status} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Users Tab
const UsersTab = ({ users }) => (
  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">User</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Skills</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Location</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Socials</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-white/5">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {user.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {user.skills?.length > 3 && (
                    <span className="text-xs text-gray-500">+{user.skills.length - 3}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {user.location || "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {user.social_links?.instagram && <Instagram size={16} className="text-pink-400" />}
                  {user.social_links?.linkedin && <Linkedin size={16} className="text-blue-400" />}
                  {user.social_links?.imdb && <Globe size={16} className="text-yellow-400" />}
                </div>
              </td>
              <td className="px-4 py-3">
                {user.telegram_connected ? (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    Connected
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full">
                    Not connected
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Requests Tab
const RequestsTab = ({ requests, users }) => (
  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
    <div className="divide-y divide-white/5">
      {requests.map(req => {
        const user = users.find(u => u.id === req.user_id);
        return (
          <div key={req.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium">{req.title}</div>
                <div className="text-sm text-gray-400 mt-1">{req.description}</div>
                <div className="text-xs text-gray-500 mt-2">
                  By {user?.name || "Unknown"} · {new Date(req.created_at).toLocaleString()}
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Unfilled Requests Tab (Recruitment Opportunities)
const UnfilledTab = ({ requests, onCreateOutreach }) => {
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({ name: "", platform: "instagram", url: "" });

  const handleSubmit = (requestId) => {
    if (formData.name && formData.url) {
      onCreateOutreach(formData.name, formData.platform, formData.url, requestId);
      setFormData({ name: "", platform: "instagram", url: "" });
      setShowForm(null);
    }
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl font-semibold">All requests have matches!</div>
          <div className="text-gray-400 mt-2">No recruitment needed right now.</div>
        </div>
      ) : (
        requests.map(req => (
          <div key={req.id} className="bg-white/5 rounded-xl border border-yellow-500/30 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-yellow-100">{req.title}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Requested by {req.requester} · {req.location || "No location"} · {new Date(req.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                  Needs match
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <a 
                  href={`https://www.instagram.com/explore/tags/${encodeURIComponent(req.title.split(" ").slice(-1)[0])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Instagram size={16} /> Find on Instagram
                </a>
                <a 
                  href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(req.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Linkedin size={16} /> Find on LinkedIn
                </a>
                <button
                  onClick={() => setShowForm(showForm === req.id ? null : req.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <UserPlus size={16} /> Log Outreach
                </button>
              </div>

              {/* Outreach Form */}
              {showForm === req.id && (
                <div className="mt-4 p-4 bg-black/20 rounded-lg space-y-3">
                  <div className="text-sm font-medium text-gray-300">Log someone you're reaching out to:</div>
                  <input
                    type="text"
                    placeholder="Person's name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                  <div className="flex gap-2">
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="email">Email</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Profile URL"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    />
                  </div>
                  <button
                    onClick={() => handleSubmit(req.id)}
                    className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Save Outreach
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Outreach Tracking Tab
const OutreachTab = ({ outreach, onUpdateStatus, unfilledRequests }) => {
  const getRequestTitle = (requestId) => {
    const req = unfilledRequests.find(r => r.id === requestId);
    return req?.title || "General outreach";
  };

  const statusColors = {
    pending: "bg-gray-500/20 text-gray-400",
    contacted: "bg-blue-500/20 text-blue-400",
    joined: "bg-green-500/20 text-green-400",
    declined: "bg-red-500/20 text-red-400"
  };

  return (
    <div className="space-y-4">
      {outreach.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-4">📤</div>
          <div className="text-xl font-semibold">No outreach yet</div>
          <div className="text-gray-400 mt-2">Start recruiting from the Unfilled tab!</div>
        </div>
      ) : (
        outreach.map(o => (
          <div key={o.id} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{o.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {o.platform} · <a href={o.profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{o.profile_url}</a>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  For: {getRequestTitle(o.request_id)} · {new Date(o.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {/* Status Update Buttons */}
              <div className="flex gap-2">
                {o.status === "pending" && (
                  <button
                    onClick={() => onUpdateStatus(o.id, "contacted")}
                    className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    Mark Contacted
                  </button>
                )}
                {(o.status === "pending" || o.status === "contacted") && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(o.id, "joined")}
                      className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                    >
                      Joined ✓
                    </button>
                    <button
                      onClick={() => onUpdateStatus(o.id, "declined")}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                    >
                      Declined
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    matching: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-yellow-500/20 text-yellow-400",
    awaiting_approval: "bg-purple-500/20 text-purple-400",
    completed: "bg-green-500/20 text-green-400"
  };

  const labels = {
    matching: "Matching",
    in_progress: "Unfilled",
    awaiting_approval: "Has Matches",
    completed: "Completed"
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || "bg-gray-500/20 text-gray-400"}`}>
      {labels[status] || status}
    </span>
  );
};

export default AdminDashboard;
