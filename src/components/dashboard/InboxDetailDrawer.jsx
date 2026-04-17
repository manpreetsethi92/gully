// InboxDetailDrawer — slides in from the right when user clicks a card body.
//
// One component renders detail for any inbox item type (opportunity/external/request/saved).
// Action buttons inside the drawer call the same doAction() handler HomePage uses.

import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const WHATSAPP_BOT_URL = "https://wa.me/12134147369?text=Hi%20Taj!";

const SocialLinks = ({ links, darkMode }) => {
  if (!links) return null;
  const entries = Object.entries(links).filter(([, v]) => !!v);
  if (entries.length === 0) return null;
  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {entries.map(([platform, handle]) => {
        const url = platform === "instagram"
          ? `https://instagram.com/${String(handle).replace(/^@/, "")}`
          : platform === "linkedin"
            ? (String(handle).startsWith("http") ? handle : `https://linkedin.com/in/${handle}`)
            : null;
        if (!url) return null;
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-mono text-[10.5px] tracking-wide px-2.5 py-1 rounded-md lowercase ${
              darkMode ? "bg-white/10 text-white/80 hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {platform}
          </a>
        );
      })}
    </div>
  );
};

const Field = ({ label, value, darkMode }) => {
  if (!value) return null;
  return (
    <div className="mb-4">
      <div className={`font-mono text-[10px] tracking-[0.2em] lowercase mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
        {label}
      </div>
      <div className={`text-[14px] leading-relaxed ${darkMode ? "text-white/90" : "text-gray-900"}`}>
        {value}
      </div>
    </div>
  );
};


const OpportunityDetail = ({ item, darkMode }) => {
  const data = item.data || {};
  const isExternal = item.type === "external";
  const from = data.from_user || {};

  return (
    <>
      {/* Who */}
      {from.name && (
        <div className="flex items-start gap-3 mb-5">
          {from.photo_url ? (
            <img src={from.photo_url} alt={from.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
              style={{ background: isExternal ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              {isExternal ? <ExternalLink size={20} /> : (from.name?.charAt(0).toUpperCase() || "?")}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className={`text-[16px] font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {from.name}
            </div>
            {from.location && (
              <div className={`text-[12px] ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                {from.location}
              </div>
            )}
            {from.bio && (
              <div className={`text-[13px] mt-1 ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                {from.bio}
              </div>
            )}
            <SocialLinks links={from.social_links} darkMode={darkMode} />
          </div>
        </div>
      )}

      <div className={`h-px w-full ${darkMode ? "bg-white/10" : "bg-gray-100"} my-4`} />

      <Field
        label={isExternal ? "job" : "the ask"}
        value={data.request_description || data.request_title}
        darkMode={darkMode}
      />

      <div className="grid grid-cols-2 gap-4">
        {data.budget_display && <Field label="budget" value={data.budget_display} darkMode={darkMode} />}
        {data.timeline_display && <Field label="timeline" value={data.timeline_display} darkMode={darkMode} />}
        {data.work_type && <Field label="type" value={data.work_type.replace(/-/g, " ")} darkMode={darkMode} />}
        {data.location && <Field label="location" value={data.location} darkMode={darkMode} />}
      </div>

      {Array.isArray(data.matched_skills) && data.matched_skills.length > 0 && (
        <div className="mt-2">
          <div className={`font-mono text-[10px] tracking-[0.2em] lowercase mb-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            {isExternal ? "skills needed" : "why you matched"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.matched_skills.map((skill, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full text-[12px] lowercase ${
                  isExternal
                    ? (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-50 text-green-700")
                    : (darkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-50 text-purple-700")
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const RequestDetail = ({ item, darkMode }) => {
  const data = item.data || {};
  return (
    <>
      <Field label="your ask" value={data.title || data.description} darkMode={darkMode} />
      {data.description && data.description !== data.title && (
        <Field label="description" value={data.description} darkMode={darkMode} />
      )}
      <div className="grid grid-cols-2 gap-4">
        {data.budget_display && <Field label="budget" value={data.budget_display} darkMode={darkMode} />}
        {data.timeline_display && <Field label="timeline" value={data.timeline_display} darkMode={darkMode} />}
        {data.work_type && <Field label="type" value={data.work_type.replace(/-/g, " ")} darkMode={darkMode} />}
        {data.location && <Field label="location" value={data.location} darkMode={darkMode} />}
        {data.urgency && <Field label="urgency" value={data.urgency} darkMode={darkMode} />}
        {data.category && <Field label="category" value={data.category} darkMode={darkMode} />}
      </div>

      <div className={`rounded-xl p-4 mt-3 ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className={`font-mono text-[10px] tracking-[0.2em] lowercase mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              matches found
            </div>
            <div className={`text-[22px] font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {data.matches_count || 0}
            </div>
          </div>
          <div>
            <div className={`font-mono text-[10px] tracking-[0.2em] lowercase mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              applicants
            </div>
            <div className={`text-[22px] font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {data.applicants_count || 0}
            </div>
          </div>
        </div>
      </div>

      {Array.isArray(data.skills_needed) && data.skills_needed.length > 0 && (
        <div className="mt-4">
          <div className={`font-mono text-[10px] tracking-[0.2em] lowercase mb-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            skills you asked for
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.skills_needed.map((skill, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full text-[12px] lowercase ${
                  darkMode ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const SavedJobDetail = ({ item, darkMode }) => {
  const data = item.data || {};
  return (
    <>
      <Field label="job" value={data.title} darkMode={darkMode} />
      {data.description && <Field label="description" value={data.description} darkMode={darkMode} />}
      <div className="grid grid-cols-2 gap-4">
        {data.source && <Field label="source" value={data.source} darkMode={darkMode} />}
        {data.budget_range && <Field label="budget" value={data.budget_range} darkMode={darkMode} />}
        {data.location && <Field label="location" value={data.location} darkMode={darkMode} />}
        {data.category && <Field label="category" value={data.category} darkMode={darkMode} />}
        {data.urgency && <Field label="urgency" value={data.urgency} darkMode={darkMode} />}
      </div>
      {Array.isArray(data.skills_needed) && data.skills_needed.length > 0 && (
        <div className="mt-2">
          <div className={`font-mono text-[10px] tracking-[0.2em] lowercase mb-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
            skills needed
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.skills_needed.map((skill, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full text-[12px] lowercase ${
                  darkMode ? "bg-amber-500/20 text-amber-300" : "bg-amber-50 text-amber-700"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};


const InboxDetailDrawer = ({ item, isOpen, onClose, onAction, loadingAction, darkMode }) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!item) return null;

  const renderBody = () => {
    if (item.type === "opportunity" || item.type === "external") return <OpportunityDetail item={item} darkMode={darkMode} />;
    if (item.type === "request") return <RequestDetail item={item} darkMode={darkMode} />;
    if (item.type === "saved") return <SavedJobDetail item={item} darkMode={darkMode} />;
    return null;
  };

  const title = {
    opportunity: "a new match for you",
    external: "a gig for you",
    request: "your ask",
    saved: "saved gig"
  }[item.type] || "details";

  const isLoading = loadingAction === item.id;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } bg-black/40`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] z-[101] transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${darkMode ? "bg-[#0a0a0a] border-l border-white/10" : "bg-white border-l border-gray-100"}`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${
          darkMode ? "bg-[#0a0a0a]/90 border-white/10 backdrop-blur" : "bg-white/90 border-gray-100 backdrop-blur"
        }`}>
          <div>
            <div className={`font-mono text-[10px] tracking-[0.25em] lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              taj's note
            </div>
            <div className={`font-syne text-[15px] font-semibold lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
              {title}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              darkMode ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="close details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Taj's message reproduced */}
        <div className={`px-6 py-4 ${darkMode ? "bg-white/[0.03]" : "bg-gray-50"}`}>
          <div className="flex gap-3 items-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-[12px] flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
            >
              T
            </div>
            <p className={`text-[13.5px] leading-[1.55] lowercase ${darkMode ? "text-white/90" : "text-gray-800"}`}>
              {item.taj_says}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {renderBody()}
        </div>

        {/* Sticky action footer */}
        <div className={`sticky bottom-0 z-10 px-6 py-4 border-t flex gap-2 ${
          darkMode ? "bg-[#0a0a0a]/95 border-white/10 backdrop-blur" : "bg-white/95 border-gray-100 backdrop-blur"
        }`}>
          {(item.actions || []).map((action) => (
            <button
              key={action.id}
              onClick={() => onAction?.(item, action.id)}
              disabled={isLoading}
              className={`flex-1 py-2.5 rounded-full font-syne text-[13px] font-medium transition-colors lowercase disabled:opacity-50 ${
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
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-syne text-[13px] font-medium transition-colors lowercase flex-shrink-0 ${
              darkMode ? "bg-transparent text-white border border-white/20 hover:border-white/40" : "bg-white text-gray-900 border border-gray-200 hover:border-gray-400"
            }`}
          >
            <WhatsAppIcon size={12} color="#25D366" />
            taj
          </a>
        </div>
      </div>
    </>
  );
};

export default InboxDetailDrawer;
