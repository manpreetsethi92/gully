import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth, API } from "../App";
import { toast } from "sonner";
import axios from "axios";
import { 
  Sparkles, 
  Send, 
  Users, 
  Settings as SettingsIcon,
  MessageCircle,
  Menu,
  X,
  MoreHorizontal,
  Search
} from "lucide-react";

import OpportunitiesPage from "../components/dashboard/OpportunitiesPage";
import RequestsPage from "../components/dashboard/RequestsPage";
import ConnectionsPage from "../components/dashboard/ConnectionsPage";
import SettingsPage from "../components/dashboard/SettingsPage";
import ProfilePage from "../components/dashboard/ProfilePage";

const TELEGRAM_BOT_URL = "https://t.me/titliworkBot?start=welcome";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ opportunities: 0, requests: 0, connections: 0 });

  const currentPath = location.pathname.split("/").pop() || "opportunities";

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const [oppsRes, reqsRes, connsRes] = await Promise.all([
        axios.get(`${API}/opportunities`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/connections`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats({ 
        opportunities: oppsRes.data.length, 
        requests: reqsRes.data.length,
        connections: connsRes.data.filter(c => c.status === 'connected').length
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const navItems = [
    { id: "opportunities", label: "Opportunities", icon: Sparkles, count: stats.opportunities },
    { id: "requests", label: "My Requests", icon: Send, count: stats.requests },
    { id: "connections", label: "Connections", icon: Users, count: stats.connections },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const handleStartTexting = () => {
    window.open(TELEGRAM_BOT_URL, "_blank");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:hidden z-50">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src="/butterfly.png" alt="Titli" className="w-6 h-auto" />
          <span className="font-syne font-bold text-xl text-[#E50914]">titli</span>
        </Link>
        <div className="w-10" />
      </header>

      <div className="flex w-full max-w-[1280px]">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:sticky top-0 left-0 h-screen z-50
            w-[260px] bg-white border-r border-gray-100
            flex flex-col
            transition-transform duration-300 ease-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 lg:hidden"
          >
            <X size={20} />
          </button>

          {/* Logo */}
          <div className="px-6 py-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
              <span className="font-syne font-bold text-2xl tracking-tight text-[#E50914]">titli</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col justify-center px-4">
            {navItems.map((item) => {
              const isActive = currentPath === item.id;
              return (
                <Link
                  key={item.id}
                  to={`/app/${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl
                    transition-all duration-200 mb-1
                    ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="relative">
                    <item.icon 
                      size={22} 
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={isActive ? 'text-[#E50914]' : 'text-gray-700'}
                    />
                    {item.count > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold text-white rounded-full bg-[#E50914]"
                      >
                        {item.count > 9 ? '9+' : item.count}
                      </span>
                    )}
                  </div>
                  <span className={`font-syne text-[15px] ${isActive ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={handleStartTexting}
              className="w-full mt-6 py-3.5 rounded-2xl text-white font-syne font-semibold text-[15px] transition-all hover:shadow-lg hover:shadow-red-500/25 bg-[#E50914]"
            >
              Message Taj
            </button>
          </nav>

          {/* Profile Section */}
          <div className="p-4">
            <button 
              onClick={() => navigate("/app/profile")}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-syne font-semibold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-syne font-semibold text-sm truncate">{user?.name}</div>
                <div className="font-mono text-gray-500 text-xs truncate">{user?.phone}</div>
              </div>
              <MoreHorizontal size={16} className="text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen border-r border-gray-100 pt-14 lg:pt-0 max-w-[600px]">
          <Routes>
            <Route index element={<OpportunitiesPage onRefresh={fetchStats} />} />
            <Route path="opportunities" element={<OpportunitiesPage onRefresh={fetchStats} />} />
            <Route path="requests" element={<RequestsPage onRefresh={fetchStats} />} />
            <Route path="connections" element={<ConnectionsPage onRefresh={fetchStats} />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-[320px] px-5 py-4">
          <div className="sticky top-4">
            <div className="relative mb-5">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-gray-100 border-0 font-syne text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
              />
            </div>

            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <h2 className="font-syne font-bold text-lg px-4 pt-4 pb-2">What's happening</h2>
              <TrendItem category="Music" title="Studio Sessions" posts="2,485" />
              <TrendItem category="Business" title="Startup Funding" posts="5,129" />
              <TrendItem category="Creative" title="NYC Creators" posts="1,847" />
              <TrendItem category="Tech" title="AI Tools" posts="12.4K" />
              <button className="w-full px-4 py-3 text-left font-syne text-sm font-medium hover:bg-gray-100 transition-colors text-[#E50914]">
                Show more
              </button>
            </div>

            <div className="mt-4 px-2 font-mono text-xs text-gray-400">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Contact Us</a>
              </div>
              <p className="mt-2">© 2025 titli</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const TrendItem = ({ category, title, posts }) => (
  <div className="px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer">
    <div className="font-mono text-xs text-gray-400">{category}</div>
    <div className="font-syne font-semibold text-sm">{title}</div>
    <div className="font-mono text-xs text-gray-400">{posts} posts</div>
  </div>
);

export default DashboardLayout;
