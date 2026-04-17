// TajMessageCard — one card type, every feed item.
//
// Renders an inbox item as if Taj is speaking to the user.
// Supports:
//  - primary action button (e.g. "see profile", "view gig")
//  - accept/decline inline actions (for opportunities)
//  - custom secondary actions (array, for requests with "view matches" / "close")
//  - "reply in whatsapp" shortcut (always present)

import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const KIND_BADGES = {
  new_match:    { label: "new match",   fg: "#E50914", bg: "#fff1f1" },
  gig_for_you:  { label: "gig for you", fg: "#10b981", bg: "#ecfdf5" },
  warm_intro:   { label: "warm intro",  fg: "#7c3aed", bg: "#f5f3ff" },
  my_ask:       { label: "your ask",    fg: "#0a0a0a", bg: "#f4f4f3" },
  saved:        { label: "saved",       fg: "#d97706", bg: "#fffbeb" }
};

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const formatRelativeTime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const TajMessageCard = ({ item, darkMode, onAction, onOpen, loadingAction }) => {
  const badge = KIND_BADGES[item.kind] || KIND_BADGES.new_match;
  const isLoading = loadingAction === item.id;

  // Stop propagation so button clicks don't also open the drawer
  const stop = (e) => e.stopPropagation();

  return (
    <article
      onClick={() => onOpen?.(item)}
      className={`rounded-2xl border p-5 mb-3 transition-colors cursor-pointer ${
        darkMode
          ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
          : "bg-white border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className="flex gap-3 items-start mb-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
        >
          T
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className={`text-[14px] font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              taj
            </span>
            <span className={`font-mono text-[10.5px] ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              · {formatRelativeTime(item.timestamp)}
            </span>
            <span
              className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide lowercase"
              style={{
                color: badge.fg,
                background: darkMode ? `${badge.fg}22` : badge.bg
              }}
            >
              {badge.label}
            </span>
          </div>
          <p className={`text-[14.5px] leading-[1.55] mb-1 ${darkMode ? "text-white/90" : "text-gray-900"} lowercase`}>
            {item.taj_says}
          </p>
          {item.meta_line && (
            <p className={`font-mono text-[11px] tracking-wide lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              {item.meta_line}
            </p>
          )}
        </div>
      </div>

      {/* Action row — stopPropagation so buttons don't open the drawer */}
      <div className="flex flex-wrap gap-2 ml-12 mt-3" onClick={stop}>
        {(item.actions || []).map((action) => (
          <button
            key={action.id}
            onClick={(e) => { e.stopPropagation(); onAction?.(item, action.id); }}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full font-syne text-[12.5px] font-medium transition-colors lowercase disabled:opacity-50 ${
              action.style === "primary"
                ? (darkMode ? "bg-white text-black hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-black")
                : action.style === "danger"
                  ? (darkMode ? "bg-transparent text-red-400 border border-red-400/30 hover:border-red-400/60" : "bg-white text-red-600 border border-red-200 hover:border-red-400")
                  : (darkMode ? "bg-transparent text-white border border-white/20 hover:border-white/40" : "bg-white text-gray-900 border border-gray-200 hover:border-gray-400")
            }`}
          >
            {action.label}
          </button>
        ))}
        <a
          href={WHATSAPP_BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-syne text-[12.5px] font-medium transition-colors lowercase ${
            darkMode
              ? "bg-transparent text-white border border-white/20 hover:border-white/40"
              : "bg-white text-gray-900 border border-gray-200 hover:border-gray-400"
          }`}
        >
          <WhatsAppIcon size={12} color="#25D366" />
          reply in whatsapp
        </a>
      </div>
    </article>
  );
};

export default TajMessageCard;
