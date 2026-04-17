// YouPage — unified identity page.
//
// Merges three old pages into one tabbed view:
//   - about:   ProfilePage (name, bio, skills, photo, social links)
//   - work:    WorkHistoryPage (past gigs, both as hirer and as worker)
//   - socials: SocialOAuthPage (connect IG, LinkedIn, GitHub, etc.)
//
// Phase 3 is a shell: it tabs between the three existing components rather
// than rewriting them. They continue to own their own API calls and state.
// Future cleanup in Phase 6 can de-duplicate their internal headers.

import { useState, Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, Briefcase, Link2 } from "lucide-react";

const ProfilePage = lazy(() => import("./ProfilePage"));
const WorkHistoryPage = lazy(() => import("./WorkHistoryPage"));
const SocialOAuthPage = lazy(() => import("./SocialOAuthPage"));

const TABS = [
  { id: "about",   label: "about",   icon: User,      component: ProfilePage },
  { id: "work",    label: "work",    icon: Briefcase, component: WorkHistoryPage },
  { id: "socials", label: "socials", icon: Link2,     component: SocialOAuthPage }
];

const YouPage = ({ darkMode }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("about");

  // Respect ?tab=socials style query param (used by the Connect Socials modal)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && TABS.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component;

  return (
    <div>
      {/* Header */}
      <div className="mb-1">
        <div className={`font-mono text-[11px] tracking-[0.25em] lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
          your identity
        </div>
      </div>
      <h1 className={`font-display text-[clamp(2rem,5vw,44px)] leading-none font-normal tracking-tight mb-7 lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
        you.
      </h1>

      {/* Tabs */}
      <div className={`flex gap-1 mb-6 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 font-syne text-[13.5px] py-2.5 pr-5 transition-colors lowercase relative ${
                isActive
                  ? (darkMode ? "text-white font-semibold" : "text-gray-900 font-semibold")
                  : (darkMode ? "text-white/50 hover:text-white/80" : "text-gray-500 hover:text-gray-700")
              }`}
            >
              <Icon size={14} strokeWidth={isActive ? 2 : 1.5} />
              {tab.label}
              {isActive && (
                <span className={`absolute bottom-[-0.5px] left-0 right-5 h-[2px] ${darkMode ? "bg-white" : "bg-gray-900"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div className="you-panel">
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="spinner" /></div>}>
          {ActiveComponent && <ActiveComponent darkMode={darkMode} hideHeader />}
        </Suspense>
      </div>
    </div>
  );
};

export default YouPage;
