// YouPage — identity page.
//
// Tabbed view:
//   - about:   ProfilePage (name, bio, skills, photo, social links)
//   - socials: SocialOAuthPage (connect IG, LinkedIn, GitHub, etc.)
//
// Work history moved to Home (history tab) — that belongs with
// the rest of your gig-related stuff, not with your identity.
//
// Supports ?tab=socials query param so the Connect Socials modal
// jumps straight to the right tab.

import { useState, Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, Link2 } from "lucide-react";

const ProfilePage = lazy(() => import("./ProfilePage"));
const SocialOAuthPage = lazy(() => import("./SocialOAuthPage"));

const TABS = [
  { id: "about",   label: "About",   icon: User,  component: ProfilePage },
  { id: "socials", label: "Socials", icon: Link2, component: SocialOAuthPage }
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
      <h1 className={`text-[20px] font-semibold mb-5 ${darkMode ?"text-white" :"text-gray-900"}`}>
        Profile
      </h1>

      {/* Tabs */}
      <div className={`flex gap-1 mb-6 border-b ${darkMode ?"border-white/10" :"border-gray-100"}`}>
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 text-[13.5px] py-2.5 pr-5 transition-colors relative ${
 isActive
 ? (darkMode ?"text-white font-semibold" :"text-gray-900 font-semibold")
 : (darkMode ?"text-white/50 hover:text-white/80" :"text-gray-500 hover:text-gray-700")
 }`}
            >
              <Icon size={14} strokeWidth={isActive ? 2 : 1.5} />
              {tab.label}
              {isActive && (
                <span className={`absolute bottom-[-0.5px] left-0 right-5 h-[2px] ${darkMode ?"bg-white" :"bg-gray-900"}`} />
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
