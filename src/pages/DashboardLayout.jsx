// DashboardLayout v3 — Network folded into Home.
//
// Changes from v2:
// - 3-item nav: Home, You, Settings (Network is now a tab on Home)
// - /app/network redirects to /app?tab=network
//
// Previous notes preserved:
// - Single centered column layout (was Twitter-style 3-column)
// - No right rail, search bar, bell icon, or "Text Taj" banner
// - Phase 2 will replace OpportunitiesPage with a unified HomePage

import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth, API } from "../App";
import axios from "axios";
import {
  Sparkles,
  User,
  Settings as SettingsIcon,
  Menu,
  X,
  Moon,
  Sun,
  MoreHorizontal,
  BadgeCheck
} from "lucide-react";

const HomePage = lazy(() => import("../components/dashboard/HomePage"));
const YouPage = lazy(() => import("../components/dashboard/YouPage"));
const SettingsPage = lazy(() => import("../components/dashboard/SettingsPage"));
const OnboardingFlow = lazy(() => import("../components/dashboard/OnboardingFlow"));

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const WhatsAppIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ opportunities: 0, requests: 0, connections: 0, savedJobs: 0 });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('gully-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showConnectSocialsModal, setShowConnectSocialsModal] = useState(false);

  // Determine active nav item from the current path.
  // Legacy paths map to their new homes. /app/network maps to "home" now.
  const pathSegment = location.pathname.split("/").pop() || "";
  const activeNav = (() => {
    if (["", "app", "home", "opportunities", "requests", "saved-jobs", "network"].includes(pathSegment)) return "home";
    if (["you", "profile", "work-history", "social-connect"].includes(pathSegment)) return "you";
    if (["settings", "notifications"].includes(pathSegment)) return "settings";
    return "home";
  })();

  // Check if we should show Connect Socials modal (from signup flow)
  useEffect(() => {
    if (location.state?.showConnectSocials) {
      setShowConnectSocialsModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch stats in background so Home can show unread count
  const fetchStats = useCallback(async (signal = null) => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const config = signal ? { headers, signal } : { headers };
      const [oppsRes, reqsRes, connsRes, savedJobsRes] = await Promise.all([
        axios.get(`${API}/opportunities`, config),
        axios.get(`${API}/requests`, config),
        axios.get(`${API}/connections`, config),
        axios.get(`${API}/saved-jobs`, config).catch(() => ({ data: [] }))
      ]);
      if (!signal || !signal.aborted) {
        setStats({
          opportunities: oppsRes.data.length,
          requests: reqsRes.data.length,
          connections: connsRes.data.filter(c => c.status === 'connected').length,
          savedJobs: savedJobsRes.data.length
        });
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error("Failed to fetch stats:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, [token, fetchStats]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gully-dark-mode', JSON.stringify(darkMode));
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [darkMode]);

  // "Home" badge = opportunities + requests (everything that needs your attention)
  const homeCount = stats.opportunities + stats.requests;

  const navItems = [
    { id: "home", label: "home", icon: Sparkles, path: "/app", count: homeCount },
    { id: "you", label: "you", icon: User, path: "/app/you" },
    { id: "settings", label: "settings", icon: SettingsIcon, path: "/app/settings" }
  ];

  const handleMessageTaj = () => {
    window.open(WHATSAPP_BOT_URL, "_blank");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-[#fafaf9]'}`}>
      {/* ========== MOBILE HEADER ========== */}
      <header className={`fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-between px-4 lg:hidden z-50 transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
          <Menu size={22} className={darkMode ? 'text-white' : 'text-gray-900'} />
        </button>
        <span className={`font-syne font-semibold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>gully</span>
        <div className="w-8" />
      </header>

      <div className="flex w-full">
        {/* ========== SIDEBAR ========== */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen z-50
            w-[220px] border-r flex flex-col flex-shrink-0
            transition-all duration-300 ease-out
            ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 lg:hidden"
            aria-label="close menu"
          >
            <X size={20} className={darkMode ? 'text-white' : 'text-gray-900'} />
          </button>

          {/* Logo + dark mode toggle */}
          <div className="px-6 pt-14 lg:pt-6 pb-8 flex items-center justify-between">
            <span className={`font-syne font-semibold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              gully
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
              aria-label="toggle dark mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col px-3">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5
                    transition-colors
                    ${isActive
                      ? (darkMode ? 'bg-white/10' : 'bg-gray-100')
                      : (darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50')
                    }
                  `}
                >
                  <item.icon
                    size={18}
                    strokeWidth={isActive ? 2 : 1.6}
                    className={isActive ? (darkMode ? 'text-white' : 'text-gray-900') : (darkMode ? 'text-white/60' : 'text-gray-500')}
                  />
                  <span className={`font-syne text-[14.5px] lowercase ${isActive ? (darkMode ? 'font-semibold text-white' : 'font-semibold text-gray-900') : (darkMode ? 'font-medium text-white/60' : 'font-medium text-gray-500')}`}>
                    {item.label}
                  </span>
                  {item.count > 0 && (
                    <span className="ml-auto font-mono text-[10px] font-semibold text-white bg-[#E50914] px-1.5 py-0.5 rounded-md">
                      {item.count > 9 ? '9+' : item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ========== SIDEBAR FOOTER ========== */}
          <div className="p-3 flex flex-col gap-2">
            {/* Persistent message taj button */}
            <button
              onClick={handleMessageTaj}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-syne font-medium text-[13px] transition-colors hover:opacity-90 lowercase"
              style={{ background: '#25D366' }}
            >
              <WhatsAppIcon size={13} />
              message taj
            </button>

            {/* Profile card */}
            <button
              onClick={() => navigate("/app/you")}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-syne font-semibold text-xs flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'G'}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className={`font-syne font-medium text-[13px] truncate flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name || 'you'}
                  {user?.is_verified && <BadgeCheck size={12} className="text-blue-500 flex-shrink-0" fill="currentColor" strokeWidth={0} />}
                </div>
                <div className={`font-mono text-[10px] truncate ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  {user?.phone || ''}
                </div>
              </div>
              <MoreHorizontal size={14} className={darkMode ? 'text-white/40' : 'text-gray-400'} />
            </button>
          </div>

          {/* Mobile footer links */}
          <div className="px-6 pb-6 lg:hidden">
            <div className="pt-4 border-t border-gray-100 dark:border-white/10">
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-gray-400">
                <a href="/terms" className="hover:text-gray-600 dark:hover:text-white/60">terms</a>
                <a href="/privacy" className="hover:text-gray-600 dark:hover:text-white/60">privacy</a>
                <a href="mailto:taj@trygully.com" className="hover:text-gray-600 dark:hover:text-white/60">contact</a>
              </div>
              <p className="mt-2 font-mono text-xs text-gray-400">© 2026 gully</p>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* ========== MAIN ========== */}
        <main className={`flex-1 min-h-screen pt-14 lg:pt-0 transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-[#fafaf9]'}`}>
          <div className="max-w-[720px] mx-auto px-6 lg:px-8 py-6 lg:py-10">
            <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="spinner" /></div>}>
              <Routes>
                {/* === HOME (Phase 2 — unified Taj inbox) === */}
                <Route index element={<HomePage onRefresh={fetchStats} darkMode={darkMode} />} />
                <Route path="home" element={<HomePage onRefresh={fetchStats} darkMode={darkMode} />} />

                {/* === LEGACY ROUTES — redirect to the unified inbox === */}
                <Route path="opportunities" element={<Navigate to="/app" replace />} />
                <Route path="requests" element={<Navigate to="/app" replace />} />
                <Route path="saved-jobs" element={<Navigate to="/app" replace />} />

                {/* === NETWORK — now folded into Home as a tab === */}
                <Route path="network" element={<Navigate to="/app?tab=network" replace />} />

                {/* === YOU (Phase 3 — tabbed identity page) === */}
                <Route path="you" element={<YouPage darkMode={darkMode} />} />
                <Route path="profile" element={<Navigate to="/app/you" replace />} />
                <Route path="work-history" element={<Navigate to="/app/you?tab=work" replace />} />
                <Route path="social-connect" element={<Navigate to="/app/you?tab=socials" replace />} />

                {/* === SETTINGS (Phase 4 — unified settings with sub-nav) === */}
                <Route path="settings" element={<SettingsPage darkMode={darkMode} />} />
                <Route path="notifications" element={<Navigate to="/app/settings?section=notifications" replace />} />

                {/* === ONBOARDING (shown from signup redirect) === */}
                <Route path="onboarding" element={<OnboardingFlow />} />

                {/* Unknown /app/* subpaths → back to home */}
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>

      {/* Connect Socials modal (shown after signup) */}
      {showConnectSocialsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <button
              onClick={() => setShowConnectSocialsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <X size={20} className={darkMode ? 'text-white' : 'text-gray-900'} />
            </button>
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}>
                <User size={32} className="text-white" />
              </div>
              <h2 className={`font-display text-[28px] leading-tight font-normal mb-2 lowercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                let taj know you.
              </h2>
              <p className={`font-syne text-sm mb-6 lowercase ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                connect your socials so taj can learn your style and pitch you better.
              </p>
              <button
                onClick={() => {
                  setShowConnectSocialsModal(false);
                  navigate('/app/you?tab=socials');
                }}
                className="w-full h-11 rounded-full text-white font-syne font-semibold bg-[#E50914] hover:bg-red-700 transition-colors text-[14px] lowercase"
              >
                connect socials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
