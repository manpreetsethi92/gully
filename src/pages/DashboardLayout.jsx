import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth, API } from "../App";
import axios from "axios";
import { 
  Sparkles, 
  Send, 
  Users, 
  Settings as SettingsIcon,
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
const WHATSAPP_BOT_URL = "https://wa.me/19454093334?text=Hi%20Taj!";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
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
  
  // Cleanup: remove dark mode when leaving dashboard
  return () => {
    document.documentElement.classList.remove('dark');
  };
}, [darkMode]);

  useEffect(() => {
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
    fetchStats();
  }, [token]);

  const navItems = [
    { id: "opportunities", label: "Opportunities", icon: Sparkles, count: stats.opportunities },
    { id: "requests", label: "My Requests", icon: Send, count: stats.requests },
    { id: "connections", label: "Connections", icon: Users, count: stats.connections },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const handleStartTexting = () => {
    setShowMessageModal(true);
  };

  const handlePlatformSelect = (platform) => {
    const url = platform === 'whatsapp' ? WHATSAPP_BOT_URL : TELEGRAM_BOT_URL;
    window.open(url, "_blank");
    setShowMessageModal(false);
  };

  return (
    <div className={`min-h-screen flex justify-center transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-between px-4 lg:hidden z-50 transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
          <Menu size={24} className={darkMode ? 'text-white' : 'text-gray-900'} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/butterfly.png" alt="Titlii" className="w-6 h-auto" />
          <span className="font-syne font-bold text-xl text-[#E50914]">titlii</span>
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
              <img src="/butterfly.png" alt="Titlii" className="w-8 h-auto" />
              <span className="font-syne font-bold text-2xl tracking-tight text-[#E50914]">titlii</span>
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
                <a href="/terms" className="hover:underline">Terms of Service</a>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="mailto:taj@titlii.social" className="hover:underline">Contact Us</a>
              </div>
              <p className="mt-2">© 2026 titlii</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Message Taj Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMessageModal(false)}
          />
          <div className={`relative w-full max-w-sm mx-4 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-[#111]' : 'bg-white'}`}>
            <button 
              onClick={() => setShowMessageModal(false)}
              className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-white/60' : 'hover:bg-gray-100 text-gray-400'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Message Taj</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>Choose your preferred platform</p>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Telegram */}
              <button 
                onClick={() => handlePlatformSelect('telegram')}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${darkMode ? 'border-white/10 hover:border-sky-400 hover:bg-sky-500/10' : 'border-gray-100 hover:border-sky-400 hover:bg-sky-50'}`}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #0088cc 0%, #0077b5 100%)', boxShadow: '0 8px 20px rgba(0, 136, 204, 0.3)' }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Telegram</span>
              </button>
              
              {/* WhatsApp */}
              <button 
                onClick={() => handlePlatformSelect('whatsapp')}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${darkMode ? 'border-white/10 hover:border-emerald-400 hover:bg-emerald-500/10' : 'border-gray-100 hover:border-emerald-400 hover:bg-emerald-50'}`}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)' }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
