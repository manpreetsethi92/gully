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
  Search,
  Bell,
  Moon,
  Sun
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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('titli-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showNotifications, setShowNotifications] = useState(false);

  const currentPath = location.pathname.split("/").pop() || "opportunities";

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('titli-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

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
    <div className={`min-h-screen flex justify-center transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-between px-4 lg:hidden z-50 transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
          <Menu size={24} className={darkMode ? 'text-white' : 'text-gray-900'} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/butterfly.png" alt="Titli" className="w-6 h-auto" />
          <span className="font-syne font-bold text-xl text-[#E50914]">titli</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full relative ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <Bell size={20} className={darkMode ? 'text-white' : 'text-gray-700'} />
            {stats.opportunities > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50914] rounded-full" />
            )}
          </button>
        </div>
      </header>

      <div className="flex w-full max-w-[1280px]">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:sticky top-0 left-0 h-screen z-50
            w-[260px] border-r
            flex flex-col
            transition-all duration-300 ease-out
            ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 lg:hidden"
          >
            <X size={20} className={darkMode ? 'text-white' : 'text-gray-900'} />
          </button>

          {/* Logo + Dark Mode Toggle - Added pt-12 for mobile safe area */}
          <div className="px-6 py-6 pt-14 lg:pt-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-3">
              <img src="/butterfly.png" alt="Titli" className="w-8 h-auto" />
              <span className="font-syne font-bold text-2xl tracking-tight text-[#E50914]">titli</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
                    ${isActive 
                      ? (darkMode ? 'bg-white/10' : 'bg-gray-100') 
                      : (darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50')
                    }
                  `}
                >
                  <div className="relative">
                    <item.icon 
                      size={22} 
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={isActive ? 'text-[#E50914]' : (darkMode ? 'text-white/70' : 'text-gray-700')}
                    />
                    {item.count > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold text-white rounded-full bg-[#E50914]"
                      >
                        {item.count > 9 ? '9+' : item.count}
                      </span>
                    )}
                  </div>
                  <span className={`font-syne text-[15px] ${isActive ? (darkMode ? 'font-semibold text-white' : 'font-semibold text-gray-900') : (darkMode ? 'font-medium text-white/70' : 'font-medium text-gray-700')}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={handleStartTexting}
              className="w-full mt-6 py-3.5 rounded-full text-white font-syne font-semibold text-[15px] transition-all hover:shadow-lg hover:shadow-red-500/25 bg-[#E50914]"
            >
              Message Taj
            </button>
          </nav>

          {/* Profile Section - Added pb-20 for mobile safe area (URL bar) */}
          <div className="p-4 pb-20 lg:pb-4">
            <button 
              onClick={() => navigate("/app/profile")}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-syne font-semibold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className={`font-syne font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</div>
                <div className={`font-mono text-xs truncate ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>{user?.phone}</div>
              </div>
              <MoreHorizontal size={16} className={darkMode ? 'text-white/40' : 'text-gray-400'} />
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
        <main className={`flex-1 min-h-screen border-r pt-14 lg:pt-0 max-w-[600px] transition-colors duration-300 ${darkMode ? 'border-white/10 bg-[#0a0a0a]' : 'border-gray-100 bg-white'}`}>
          <Routes>
            <Route index element={<OpportunitiesPage onRefresh={fetchStats} darkMode={darkMode} />} />
            <Route path="opportunities" element={<OpportunitiesPage onRefresh={fetchStats} darkMode={darkMode} />} />
            <Route path="requests" element={<RequestsPage onRefresh={fetchStats} darkMode={darkMode} />} />
            <Route path="connections" element={<ConnectionsPage onRefresh={fetchStats} darkMode={darkMode} />} />
            <Route path="profile" element={<ProfilePage darkMode={darkMode} />} />
            <Route path="settings" element={<SettingsPage darkMode={darkMode} />} />
          </Routes>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-[320px] px-5 py-4">
          <div className="sticky top-4">
            {/* Notification Bell for Desktop */}
            <div className="flex items-center justify-between mb-5">
              <div className="relative flex-1 mr-3">
                <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search"
                  className={`w-full h-11 pl-11 pr-4 rounded-2xl border-0 font-syne text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all ${darkMode ? 'bg-white/10 text-white placeholder-white/40 focus:bg-white/15' : 'bg-gray-100 focus:bg-white'}`}
                />
              </div>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-full relative ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <Bell size={20} className={darkMode ? 'text-white' : 'text-gray-700'} />
                {stats.opportunities > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E50914] rounded-full" />
                )}
              </button>
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`mb-5 rounded-2xl overflow-hidden border ${darkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'} shadow-lg`}>
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                  <h3 className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                </div>
                {stats.opportunities > 0 ? (
                  <div className={`px-4 py-3 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} cursor-pointer`} onClick={() => { setShowNotifications(false); navigate('/app/opportunities'); }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E50914]/10 flex items-center justify-center">
                        <Sparkles size={18} className="text-[#E50914]" />
                      </div>
                      <div>
                        <p className={`font-syne text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {stats.opportunities} new {stats.opportunities === 1 ? 'opportunity' : 'opportunities'}
                        </p>
                        <p className={`font-mono text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>People want to connect</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className={`font-syne text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>No new notifications</p>
                  </div>
                )}
              </div>
            )}

            <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <h2 className={`font-syne font-bold text-lg px-4 pt-4 pb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>What's happening</h2>
              <TrendItem category="Music" title="Studio Sessions" posts="2,485" darkMode={darkMode} />
              <TrendItem category="Business" title="Startup Funding" posts="5,129" darkMode={darkMode} />
              <TrendItem category="Creative" title="NYC Creators" posts="1,847" darkMode={darkMode} />
              <TrendItem category="Tech" title="AI Tools" posts="12.4K" darkMode={darkMode} />
              <button className={`w-full px-4 py-3 text-left font-syne text-sm font-medium transition-colors text-[#E50914] ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                Show more
              </button>
            </div>

            <div className={`mt-4 px-2 font-mono text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
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

const TrendItem = ({ category, title, posts, darkMode }) => (
  <div className={`px-4 py-3 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
    <div className={`font-mono text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{category}</div>
    <div className={`font-syne font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</div>
    <div className={`font-mono text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{posts} posts</div>
  </div>
);

export default DashboardLayout;
