// SettingsPage — unified settings with left-rail sub-nav.
//
// Replaces the mess of 6 separate nav items (settings, notifications, payments,
// referrals, agent-settings, ads) with one page containing 6 sub-sections.
//
// Sub-pages are rendered as-is for now (they already take darkMode and own their
// state). Phase 6 cleanup can de-duplicate their internal headers.
//
// Supports ?section=notifications query param to deep-link into a specific section.

import { useState, Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, Bell, CreditCard, Gift, Sparkles, Megaphone } from "lucide-react";

const AccountSettingsPage = lazy(() => import("./AccountSettingsPage"));
const NotificationsPage = lazy(() => import("./NotificationsPage"));
const PaymentsPage = lazy(() => import("./PaymentsPage"));
const ReferralsPage = lazy(() => import("./ReferralsPage"));
const AgentSettingsPage = lazy(() => import("./AgentSettingsPage"));
const AdsPage = lazy(() => import("./AdsPage"));

const SECTIONS = [
  { id: "account",       label: "account",       icon: User,       component: AccountSettingsPage,
    desc: "subscription, logout, delete account" },
  { id: "notifications", label: "notifications", icon: Bell,       component: NotificationsPage,
    desc: "how and when taj pings you" },
  { id: "agent",         label: "taj's brain",   icon: Sparkles,   component: AgentSettingsPage,
    desc: "tune how taj pitches you" },
  { id: "payments",      label: "payments",      icon: CreditCard, component: PaymentsPage,
    desc: "billing and invoices" },
  { id: "referrals",     label: "referrals",     icon: Gift,       component: ReferralsPage,
    desc: "invite friends, earn perks" },
  { id: "ads",           label: "ads",           icon: Megaphone,  component: AdsPage,
    desc: "promote your asks" }
];

const SettingsPage = ({ darkMode }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("account");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section && SECTIONS.some(s => s.id === section)) {
      setActiveSection(section);
    }
  }, [location.search]);

  const active = SECTIONS.find(s => s.id === activeSection);
  const ActiveComponent = active?.component;

  return (
    <div>
      {/* Header */}
      <div className="mb-1">
        <div className={`font-mono text-[11px] tracking-[0.25em] lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
          settings
        </div>
      </div>
      <h1 className={`font-display text-[clamp(2rem,5vw,44px)] leading-none font-normal tracking-tight mb-7 lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
        fine-tune everything.
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sub-nav rail (left on md+, top on mobile) */}
        <nav className={`md:w-[220px] flex-shrink-0 md:border-r ${darkMode ? "md:border-white/10" : "md:border-gray-100"} md:pr-4`}>
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {SECTIONS.map((section) => {
              const isActive = section.id === activeSection;
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl flex-shrink-0 transition-colors text-left lowercase ${
                    isActive
                      ? (darkMode ? "bg-white/10" : "bg-gray-100")
                      : (darkMode ? "hover:bg-white/5" : "hover:bg-gray-50")
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={isActive ? 2 : 1.6}
                    className={isActive ? (darkMode ? "text-white" : "text-gray-900") : (darkMode ? "text-white/60" : "text-gray-500")}
                  />
                  <span className={`font-syne text-[13.5px] whitespace-nowrap ${isActive ? (darkMode ? "font-semibold text-white" : "font-semibold text-gray-900") : (darkMode ? "font-medium text-white/60" : "font-medium text-gray-500")}`}>
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Active panel */}
        <div className="flex-1 min-w-0">
          {active && (
            <div className={`font-mono text-[10.5px] tracking-[0.2em] lowercase mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              {active.desc}
            </div>
          )}
          <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="spinner" /></div>}>
            {ActiveComponent && <ActiveComponent darkMode={darkMode} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
