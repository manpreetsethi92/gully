import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
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
  Sun,
  Bookmark,
  BadgeCheck
} from "lucide-react";

const OpportunitiesPage = lazy(() => import("../components/dashboard/OpportunitiesPage"));
const RequestsPage = lazy(() => import("../components/dashboard/RequestsPage"));
const ConnectionsPage = lazy(() => import("../components/dashboard/ConnectionsPage"));
const SettingsPage = lazy(() => import("../components/dashboard/SettingsPage"));
const ProfilePage = lazy(() => import("../components/dashboard/ProfilePage"));
const SavedJobsPage = lazy(() => import("../components/dashboard/SavedJobsPage"));
const SocialOAuthPage = lazy(() => import("../components/dashboard/SocialOAuthPage"));
const OnboardingFlow = lazy(() => import("../components/dashboard/OnboardingFlow"));
const HirerDashboard = lazy(() => import("../components/dashboard/HirerDashboard"));
const AdsPage = lazy(() => import("../components/dashboard/AdsPage"));
const TeamsPage = lazy(() => import("../components/dashboard/TeamsPage"));
const PaymentsPage = lazy(() => import("../components/dashboard/PaymentsPage"));
const AgentSettingsPage = lazy(() => import("../components/dashboard/AgentSettingsPage"));
const WorkHistoryPage = lazy(() => import("../components/dashboard/WorkHistoryPage"));
const ReferralsPage = lazy(() => import("../components/dashboard/ReferralsPage"));
const NotificationsPage = lazy(() => import("../components/dashboard/NotificationsPage"));

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ opportunities: 0, requests: 0, connections: 0, savedJobs: 0 });
  const [trending, setTrending] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('titli-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWhatsAppBanner, setShowWhatsAppBanner] = useState(() => {
    // Show banner if user hasn't dismissed it yet
    return !sessionStorage.getItem('titli-wa-banner-dismissed');
  });

  const currentPath = location.pathname.split("/").pop() || "opportunities";

  // Fetch all data in parallel on mount
  const fetchAllData = useCallback(async () => {
    try {
      const [oppsRes, reqsRes, connsRes, trendingRes, savedJobsRes] = await Promise.all([
        axios.get(`${API}/opportunities`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/connections`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/stats/trending`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/saved-jobs`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);

      setStats({
        opportunities: oppsRes.data.length,
        requests: reqsRes.data.length,
        connections: connsRes.data.filter(c => c.status === 'connected').length,
        savedJobs: savedJobsRes.data.length
      });
      setTrending(trendingRes.data.trending || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAllData();
  }, [token, fetchAllData]);

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

  const navItems = [
    { id: "opportunities", label: "Opportunities", icon: Sparkles, count: stats.opportunities },
    { id: "saved-jobs", label: "Saved Jobs", icon: Bookmark, count: stats.savedJobs },
    { id: "requests", label: "My Requests", icon: Send, count: stats.requests },
    { id: "connections", label: "Connections", icon: Users, count: stats.connections },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const handleStartTexting = () => {
    window.open(WHATSAPP_BOT_URL, "_blank");
  };

  return (
    <div className={`min-h-screen flex justify-center transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-between px-4 lg:hidden z-50 transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
          <Menu size={24} className={darkMode ? 'text-white' : 'text-gray-900'} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/butterfly.png" alt="Giggy" className="w-6 h-auto" />
          <span className="font-syne font-bold text-xl text-[#E50914]">giggy</span>
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
              <img src="/butterfly.png" alt="Giggy" className="w-8 h-auto" />
              <span className="font-syne font-bold text-2xl tracking-tight text-[#E50914]">giggy</span>
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
          <div className="p-4 lg:pb-4">
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
                <div className={`font-syne font-semibold text-sm truncate flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                  {user?.is_verified && <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" fill="currentColor" strokeWidth={0} />}
                </div>
                <div className={`font-mono text-xs truncate ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>{user?.phone}</div>
              </div>
              <MoreHorizontal size={16} className={darkMode ? 'text-white/40' : 'text-gray-400'} />
            </button>
          </div>

          {/* Mobile Footer Links */}
          <div className="px-6 pb-6 lg:hidden">
            <div className="pt-4 border-t border-gray-100 dark:border-white/10">
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-gray-400">
                <a href="/terms" className="hover:text-gray-600 dark:hover:text-white/60">Terms</a>
                <a href="/privacy" className="hover:text-gray-600 dark:hover:text-white/60">Privacy</a>
                <a href="mailto:taj@getgiggy.ai" className="hover:text-gray-600 dark:hover:text-white/60">Contact</a>
              </div>
              <p className="mt-2 font-mono text-xs text-gray-400">© 2025 giggy</p>
            </div>
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
          {/* WhatsApp Onboarding Banner */}
          {showWhatsAppBanner && (
            <div className={`mx-4 mt-4 p-4 rounded-2xl border relative ${darkMode ? 'bg-[#1a2e1a] border-green-800' : 'bg-green-50 border-green-200'}`}>
              <button
                onClick={() => {
                  setShowWhatsAppBanner(false);
                  sessionStorage.setItem('titli-wa-banner-dismissed', 'true');
                }}
                className={`absolute top-2 right-2 p-1 rounded-full ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Text Taj to get started! 🦋</p>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Say hi on WhatsApp so Taj can start matching you</p>
                </div>
              </div>
              <a
                href={`https://wa.me/12134147369?text=${encodeURIComponent("Hey Taj! Just signed up 🦋")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-full text-white font-semibold text-sm"
                style={{ background: '#25D366' }}
              >
                Open WhatsApp
              </a>
            </div>
          )}
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="spinner" /></div>}>
            <Routes>
              <Route index element={<OpportunitiesPage onRefresh={fetchAllData} darkMode={darkMode} />} />
              <Route path="opportunities" element={<OpportunitiesPage onRefresh={fetchAllData} darkMode={darkMode} />} />
              <Route path="saved-jobs" element={<SavedJobsPage onRefresh={fetchAllData} darkMode={darkMode} />} />
              <Route path="requests" element={<RequestsPage onRefresh={fetchAllData} darkMode={darkMode} />} />
              <Route path="connections" element={<ConnectionsPage onRefresh={fetchAllData} darkMode={darkMode} />} />
              <Route path="profile" element={<ProfilePage darkMode={darkMode} />} />
              <Route path="settings" element={<SettingsPage darkMode={darkMode} />} />
              <Route path="social-connect" element={<SocialOAuthPage />} />
              <Route path="onboarding" element={<OnboardingFlow />} />
              <Route path="hirer" element={<HirerDashboard />} />
              <Route path="ads" element={<AdsPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="agent-settings" element={<AgentSettingsPage />} />
              <Route path="work-history" element={<WorkHistoryPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Routes>
          </Suspense>
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
              {trending.length > 0 ? (
                trending.map((item, index) => (
                  <TrendItem
                    key={index}
                    category={item.category}
                    title={item.title}
                    posts={item.count}
                    darkMode={darkMode}
                  />
                ))
              ) : (
                <div className={`px-4 py-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  <span className="font-mono text-sm">Loading trends...</span>
                </div>
              )}
              <button className={`w-full px-4 py-3 text-left font-syne text-sm font-medium transition-colors text-[#E50914] ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                Show more
              </button>
            </div>

            <div className={`mt-4 px-2 font-mono text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="/terms" className="hover:underline">Terms of Service</a>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="mailto:taj@getgiggy.ai" className="hover:underline">Contact Us</a>
              </div>
              <p className="mt-2">© 2026 giggy</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const TrendItem = React.memo(({ category, title, posts, darkMode }) => (
  <div className={`px-4 py-3 cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
    <div className={`font-mono text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{category}</div>
    <div className={`font-syne font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</div>
    <div className={`font-mono text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{posts} jobs</div>
  </div>
));

export default DashboardLayout;
