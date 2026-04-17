// HomePage — the unified Taj Inbox.
//
// Merges three old pages (Opportunities, Requests, SavedJobs) into one feed.
// Each item renders as a "message from Taj" card via TajMessageCard.
//
// Tabs:
//   - incoming: opportunities (things pitched to you)
//   - my asks: requests you've posted
//   - saved: external jobs you saved for later
//   - all: everything, sorted by timestamp
//
// Actions on cards:
//   - opportunity (internal): accept / pass → POST /opportunities/:id/action
//   - external gig: save / pass → same endpoint, different UI wording
//   - my ask: open source url (if any) / close post
//   - saved: open url / remove → DELETE /saved-jobs/:id

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import TajMessageCard from "./TajMessageCard";
import InboxDetailDrawer from "./InboxDetailDrawer";

// ===== Taj-voice copy generators =====

const tajSaysForOpportunity = (opp) => {
  const isExternal = opp.type === "external" || !opp.from_user_id;
  const requester = opp.from_user?.name || "someone";
  const title = (opp.request_description || opp.request_title || "").toLowerCase().trim();
  if (isExternal) {
    const source = opp.from_user?.name || "a site";
    return `found a gig on ${source.toLowerCase()} that fits you — ${title}`;
  }
  return `${requester.toLowerCase()} is looking for exactly what you do — ${title}`;
};

const tajSaysForRequest = (req) => {
  const title = (req.title || req.description || "").toLowerCase().trim();
  const matches = req.matches_count || 0;
  const applicants = req.applicants_count || 0;
  if (applicants > 0) {
    return `${applicants} ${applicants === 1 ? "person has" : "people have"} applied to your ask — ${title}`;
  }
  if (matches > 0) {
    return `i found ${matches} ${matches === 1 ? "person" : "people"} for your ask — ${title}`;
  }
  return `still scanning for your ask — ${title}`;
};

const tajSaysForSavedJob = (job) => {
  const title = (job.title || "").toLowerCase().trim();
  const src = (job.source || "a site").toLowerCase();
  return `you saved this gig from ${src} — ${title}`;
};

// ===== Normalize each source into InboxItem =====

const normalizeOpportunity = (opp) => {
  const isExternal = opp.type === "external" || !opp.from_user_id;
  const from = opp.from_user || {};
  const meta = [
    from.name,
    opp.category || opp.work_type,
    opp.location || from.location
  ].filter(Boolean).join(" · ").toLowerCase();

  const actions = isExternal
    ? [
        { id: "save",    label: "save this gig", style: "primary" },
        { id: "decline", label: "pass",          style: "secondary" }
      ]
    : [
        { id: "accept",  label: "accept",   style: "primary" },
        { id: "decline", label: "pass",     style: "secondary" }
      ];

  return {
    id: `opp_${opp.id}`,
    raw_id: opp.id,
    type: isExternal ? "external" : "opportunity",
    kind: isExternal ? "gig_for_you" : "new_match",
    taj_says: tajSaysForOpportunity(opp),
    meta_line: meta,
    timestamp: opp.created_at,
    actions,
    data: opp
  };
};

const normalizeRequest = (req) => {
  const meta = [
    req.category,
    req.work_type,
    req.location,
    req.budget_display
  ].filter(Boolean).join(" · ").toLowerCase();

  const actions = [];
  if (req.status !== "closed") {
    actions.push({ id: "close", label: "close ask", style: "secondary" });
  }

  return {
    id: `req_${req.id}`,
    raw_id: req.id,
    type: "request",
    kind: "my_ask",
    taj_says: tajSaysForRequest(req),
    meta_line: meta,
    timestamp: req.created_at,
    actions,
    data: req
  };
};

const normalizeSavedJob = (job) => {
  const meta = [
    job.source,
    job.category,
    job.location,
    job.budget_range
  ].filter(Boolean).join(" · ").toLowerCase();

  const actions = [];
  if (job.source_url) {
    actions.push({ id: "open_url", label: "open job", style: "primary" });
  }
  actions.push({ id: "remove", label: "remove", style: "danger" });

  return {
    id: `saved_${job.id}`,
    raw_id: job.id,
    type: "saved",
    kind: "saved",
    taj_says: tajSaysForSavedJob(job),
    meta_line: meta,
    timestamp: job.saved_at || job.created_at,
    actions,
    data: job
  };
};


const TABS = [
  { id: "incoming", label: "incoming", kinds: ["new_match", "gig_for_you", "warm_intro"] },
  { id: "my_asks",  label: "my asks",  kinds: ["my_ask"] },
  { id: "saved",    label: "saved",    kinds: ["saved"] },
  { id: "all",      label: "all",      kinds: null }
];

const HomePage = ({ darkMode, onRefresh }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("incoming");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      const [oppsRes, reqsRes, savedRes] = await Promise.all([
        axios.get(`${API}/opportunities`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/requests`,      { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/saved-jobs`,    { headers }).catch(() => ({ data: [] }))
      ]);

      const merged = [
        ...(oppsRes.data || []).map(normalizeOpportunity),
        ...(reqsRes.data || []).map(normalizeRequest),
        ...(savedRes.data || []).map(normalizeSavedJob)
      ].sort((a, b) => {
        const ta = new Date(a.timestamp || 0).getTime();
        const tb = new Date(b.timestamp || 0).getTime();
        return tb - ta;
      });

      setItems(merged);
    } catch (e) {
      console.error("Failed to fetch inbox:", e);
      toast.error("couldn't load your inbox");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ===== Action handlers =====

  const doAction = async (item, actionId) => {
    const headers = { Authorization: `Bearer ${token}` };
    setLoadingAction(item.id);

    const removeFromList = () => {
      setItems(prev => prev.filter(i => i.id !== item.id));
      // If the drawer is showing this exact item, close it
      setDetailItem(prev => (prev?.id === item.id ? null : prev));
    };

    try {
      // Opportunities: accept / save / decline
      if (item.type === "opportunity" || item.type === "external") {
        const backendAction = (actionId === "accept" || actionId === "save") ? "accept" : "decline";
        await axios.post(
          `${API}/opportunities/${item.raw_id}/action`,
          { action: backendAction },
          { headers }
        );
        removeFromList();
        if (backendAction === "accept") {
          toast.success(item.type === "external" ? "saved — check your saved tab" : "accepted — taj is connecting you");
        } else {
          toast.success("passed");
        }
        onRefresh?.();
        return;
      }

      // Request: close
      if (item.type === "request" && actionId === "close") {
        await axios.post(`${API}/requests/${item.raw_id}/close`, {}, { headers });
        removeFromList();
        toast.success("ask closed");
        onRefresh?.();
        return;
      }

      // Saved: open or remove
      if (item.type === "saved") {
        if (actionId === "open_url") {
          if (item.data?.source_url) {
            window.open(item.data.source_url, "_blank", "noopener,noreferrer");
          }
          return;
        }
        if (actionId === "remove") {
          await axios.delete(`${API}/saved-jobs/${item.raw_id}`, { headers });
          removeFromList();
          toast.success("removed");
          onRefresh?.();
          return;
        }
      }
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("something went wrong");
    } finally {
      setLoadingAction(null);
    }
  };

  const counts = {
    incoming: items.filter(i => TABS[0].kinds.includes(i.kind)).length,
    my_asks:  items.filter(i => TABS[1].kinds.includes(i.kind)).length,
    saved:    items.filter(i => TABS[2].kinds.includes(i.kind)).length,
    all:      items.length
  };

  const activeTabDef = TABS.find(t => t.id === activeTab);
  const visible = activeTabDef.kinds
    ? items.filter(i => activeTabDef.kinds.includes(i.kind))
    : items;


  return (
    <>
    <div>
      <div className="mb-1">
        <div className={`font-mono text-[11px] tracking-[0.25em] lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
          taj's inbox
        </div>
      </div>
      <h1 className={`font-display text-[clamp(2rem,5vw,44px)] leading-none font-normal tracking-tight mb-7 lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
        what's new, taj?
      </h1>

      <div className={`flex gap-1 mb-6 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-syne text-[13.5px] py-2.5 pr-5 transition-colors lowercase relative ${
                isActive
                  ? (darkMode ? "text-white font-semibold" : "text-gray-900 font-semibold")
                  : (darkMode ? "text-white/50 hover:text-white/80" : "text-gray-500 hover:text-gray-700")
              }`}
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className={`ml-1.5 font-mono text-[10.5px] ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                  {counts[tab.id]}
                </span>
              )}
              {isActive && (
                <span className={`absolute bottom-[-0.5px] left-0 right-5 h-[2px] ${darkMode ? "bg-white" : "bg-gray-900"}`} />
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState tab={activeTab} darkMode={darkMode} />
      ) : (
        <div>
          {visible.map((item) => (
            <TajMessageCard
              key={item.id}
              item={item}
              darkMode={darkMode}
              onAction={doAction}
              onOpen={setDetailItem}
              loadingAction={loadingAction}
            />
          ))}
          <div className={`text-center py-8 font-mono text-[11px] tracking-[0.1em] lowercase ${darkMode ? "text-white/30" : "text-gray-400"}`}>
            you're caught up. taj keeps watching ·
          </div>
        </div>
      )}
    </div>
    <InboxDetailDrawer
      item={detailItem}
      isOpen={!!detailItem}
      onClose={() => setDetailItem(null)}
      onAction={doAction}
      loadingAction={loadingAction}
      darkMode={darkMode}
    />
    </>
  );
};

const EmptyState = ({ tab, darkMode }) => {
  const copy = {
    incoming: {
      title: "nothing in the queue yet.",
      body: "taj is scanning. when she finds a match, it lands here first."
    },
    my_asks: {
      title: "you haven't asked for anything yet.",
      body: "text taj what you need — a plumber, a dp, a wedding singer. she'll go find them."
    },
    saved: {
      title: "no saved gigs.",
      body: "when taj shows you external gigs, save the ones you want for later."
    },
    all: {
      title: "your inbox is empty.",
      body: "give taj a minute. she's building your world."
    }
  }[tab] || { title: "empty.", body: "" };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-[14px] mb-4"
        style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
      >
        T
      </div>
      <h3 className={`font-display text-[22px] leading-tight font-normal mb-2 lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
        {copy.title}
      </h3>
      <p className={`font-syne text-[14px] max-w-sm lowercase ${darkMode ? "text-white/50" : "text-gray-500"}`}>
        {copy.body}
      </p>
    </div>
  );
};

export default HomePage;
