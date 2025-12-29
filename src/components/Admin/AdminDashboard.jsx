import { useState, useEffect } from "react";

const API = "https://titly-backend-production.up.railway.app/api";
const ADMIN_PASSWORD = "titli2024";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Data
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [unfilled, setUnfilled] = useState([]);
  
  // Search
  const [search, setSearch] = useState("");

  // Check saved auth
  useEffect(() => {
    if (localStorage.getItem("titli_admin") === "true") {
      setAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, r, uf] = await Promise.all([
        fetch(`${API}/admin/users`).then(res => res.json()).catch(() => []),
        fetch(`${API}/admin/requests`).then(res => res.json()).catch(() => []),
        fetch(`${API}/admin/unfilled-requests`).then(res => res.json()).catch(() => [])
      ]);
      setUsers(u || []);
      setRequests(r || []);
      setUnfilled(uf || []);
    } catch (e) {
      console.error("Fetch error:", e);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("titli_admin", "true");
    } else {
      alert("Wrong password");
    }
  };

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("titli_admin");
  };

  // LOGIN SCREEN
  if (!authenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <form onSubmit={handleLogin} style={{
          background: "rgba(255,255,255,0.05)",
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          width: "100%",
          maxWidth: "360px"
        }}>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", marginBottom: "8px", textAlign: "center" }}>
            TITLI
          </h1>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px", textAlign: "center" }}>
            Admin Dashboard
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          <button type="submit" style={{
            width: "100%",
            padding: "14px",
            marginTop: "16px",
            background: "#e63946",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  // DASHBOARD
  const stats = {
    users: users.length,
    requests: requests.length,
    unfilled: unfilled.length,
    connected: users.filter(u => u.telegram_connected).length
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredRequests = requests.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "#0a0a0f",
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px", fontWeight: "800", color: "#e63946" }}>TITLI</span>
          <span style={{ color: "#666", fontSize: "14px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={fetchData} style={{
            padding: "8px 16px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "13px"
          }}>
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button onClick={logout} style={{
            padding: "8px 16px",
            background: "transparent",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: "13px"
          }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px"
        }}>
          <StatCard label="Total Users" value={stats.users} color="#3b82f6" />
          <StatCard label="Total Requests" value={stats.requests} color="#8b5cf6" />
          <StatCard label="Unfilled" value={stats.unfilled} color="#f59e0b" />
          <StatCard label="Telegram Connected" value={stats.connected} color="#10b981" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["overview", "users", "requests", "unfilled"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                background: activeTab === tab ? "#e63946" : "rgba(255,255,255,0.05)",
                border: "none",
                borderRadius: "8px",
                color: activeTab === tab ? "#fff" : "#888",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                textTransform: "capitalize"
              }}
            >
              {tab}
              {tab === "unfilled" && stats.unfilled > 0 && (
                <span style={{
                  marginLeft: "8px",
                  padding: "2px 8px",
                  background: "#f59e0b",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#000"
                }}>{stats.unfilled}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users, requests, skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "14px",
            marginBottom: "24px",
            outline: "none",
            boxSizing: "border-box"
          }}
        />

        {/* Content */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <Card title="Recent Users">
              {users.slice(0, 5).map(u => (
                <UserRow key={u.id} user={u} />
              ))}
              {users.length === 0 && <Empty text="No users yet" />}
            </Card>
            <Card title="Unfilled Requests" highlight>
              {unfilled.slice(0, 5).map(r => (
                <RequestRow key={r.id} request={r} />
              ))}
              {unfilled.length === 0 && <Empty text="All requests have matches!" />}
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <Card title={`Users (${filteredUsers.length})`}>
            {filteredUsers.map(u => (
              <UserRow key={u.id} user={u} showDetails />
            ))}
            {filteredUsers.length === 0 && <Empty text="No users found" />}
          </Card>
        )}

        {activeTab === "requests" && (
          <Card title={`Requests (${filteredRequests.length})`}>
            {filteredRequests.map(r => (
              <RequestRow key={r.id} request={r} showDetails />
            ))}
            {filteredRequests.length === 0 && <Empty text="No requests found" />}
          </Card>
        )}

        {activeTab === "unfilled" && (
          <Card title="Recruitment Opportunities" highlight>
            {unfilled.map(r => (
              <UnfilledRow key={r.id} request={r} />
            ))}
            {unfilled.length === 0 && <Empty text="All requests have matches! 🎉" />}
          </Card>
        )}
      </div>
    </div>
  );
}

// Components
function StatCard({ label, value, color }) {
  return (
    <div style={{
      padding: "20px",
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      borderRadius: "12px"
    }}>
      <div style={{ fontSize: "28px", fontWeight: "700", color: "#fff" }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

function Card({ title, children, highlight }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: highlight ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      overflow: "hidden"
    }}>
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        fontWeight: "600",
        fontSize: "15px",
        color: highlight ? "#f59e0b" : "#fff"
      }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function UserRow({ user, showDetails }) {
  return (
    <div style={{
      padding: "14px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }}>
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #e63946, #f97316)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        fontSize: "14px"
      }}>
        {user.name?.charAt(0) || "?"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "500", fontSize: "14px" }}>{user.name || "Unknown"}</div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          {user.skills?.slice(0, 3).join(", ") || "No skills"}
        </div>
      </div>
      {user.telegram_connected && (
        <span style={{
          padding: "4px 10px",
          background: "rgba(16,185,129,0.15)",
          color: "#10b981",
          borderRadius: "20px",
          fontSize: "11px"
        }}>Telegram</span>
      )}
      {showDetails && user.location && (
        <span style={{ fontSize: "12px", color: "#666" }}>{user.location}</span>
      )}
    </div>
  );
}

function RequestRow({ request, showDetails }) {
  const statusColors = {
    in_progress: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
    completed: { bg: "rgba(16,185,129,0.15)", color: "#10b981" },
    awaiting_approval: { bg: "rgba(139,92,246,0.15)", color: "#8b5cf6" }
  };
  const style = statusColors[request.status] || statusColors.in_progress;

  return (
    <div style={{
      padding: "14px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "500", fontSize: "14px" }}>{request.title}</div>
        <span style={{
          padding: "4px 10px",
          background: style.bg,
          color: style.color,
          borderRadius: "20px",
          fontSize: "11px"
        }}>{request.status?.replace("_", " ")}</span>
      </div>
      {showDetails && (
        <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
          {new Date(request.created_at).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

function UnfilledRow({ request }) {
  return (
    <div style={{
      padding: "16px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div style={{ fontWeight: "500", fontSize: "14px", color: "#fbbf24" }}>{request.title}</div>
      <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
        By {request.requester} · {request.location || "No location"} · {new Date(request.created_at).toLocaleDateString()}
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <a
          href={`https://www.instagram.com/explore/tags/${encodeURIComponent(request.title?.split(" ").pop() || "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 14px",
            background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "500",
            color: "#fff",
            textDecoration: "none"
          }}
        >Find on Instagram</a>
        <a
          href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(request.title || "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 14px",
            background: "#0a66c2",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "500",
            color: "#fff",
            textDecoration: "none"
          }}
        >Find on LinkedIn</a>
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{
      padding: "40px 20px",
      textAlign: "center",
      color: "#666",
      fontSize: "14px"
    }}>{text}</div>
  );
}
