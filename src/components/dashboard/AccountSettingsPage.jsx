// AccountSettingsPage — default Settings landing.
// Editorial redesign. Sections: subscription / support / account (logout, delete).
// The Taj Agent toggles that used to live here have been removed — they already
// have their own dedicated sub-nav item ('taj's brain') in SettingsPage.

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import axios from "axios";
import { LogOut, Trash2, ExternalLink, HelpCircle, Bug, Mail, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const AccountSettingsPage = ({ darkMode }) => {
  const { logout, token } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(response.data);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const handleUpgrade = async (plan) => {
    setUpgrading(true);
    try {
      const response = await axios.post(
        `${API}/subscription/checkout`,
        null,
        { headers: { Authorization: `Bearer ${token}` }, params: { plan } }
      );
      window.location.href = response.data.checkout_url;
    } catch {
      toast.error("couldn't start checkout");
      setUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await axios.post(
        `${API}/subscription/portal`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.portal_url;
    } catch {
      toast.error("couldn't open billing");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("logged out");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("account deleted");
      logout();
      window.location.href = "/";
    } catch {
      toast.error("couldn't delete account");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getTierMeta = (tier) => {
    switch (tier) {
      case "pro":      return { label: "pro",      fg: "#7c3aed", bg: "#f5f3ff" };
      case "verified": return { label: "verified", fg: "#2563eb", bg: "#eff6ff" };
      default:         return { label: "free",     fg: "#6b7280", bg: "#f3f4f6" };
    }
  };

  const tierMeta = getTierMeta(subscription?.tier);

  return (
    <div>
      {/* Subscription section */}
      <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
        subscription
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="spinner"></div></div>
      ) : (
        <section className={`rounded-2xl border p-5 mb-5 ${darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-100 bg-white"}`}>
          <div className="flex items-start justify-between mb-1">
            <div className={`font-mono text-[10px] tracking-[0.25em] lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              your plan
            </div>
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-md tracking-wide lowercase"
              style={{ color: tierMeta.fg, background: darkMode ? `${tierMeta.fg}22` : tierMeta.bg }}
            >
              {tierMeta.label}
            </span>
          </div>
          <div className={`font-display text-[32px] leading-none font-normal lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
            {tierMeta.label}
          </div>

          {subscription?.subscription_status === "active" && subscription?.subscription_expires_at && (
            <div className={`font-mono text-[11px] tracking-wide lowercase mt-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              renews {new Date(subscription.subscription_expires_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toLowerCase()}
            </div>
          )}
          {subscription?.subscription_status === "canceled" && (
            <div className="font-mono text-[11px] tracking-wide lowercase mt-2 text-amber-600">
              cancels at end of billing period
            </div>
          )}

          {subscription?.show_pricing_ui && subscription?.tier === "free" && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handleUpgrade("pro_monthly")}
                disabled={upgrading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-syne text-[12.5px] font-medium lowercase text-white disabled:opacity-50"
                style={{ background: "#0a0a0a" }}
              >
                upgrade to pro — ${subscription?.pricing?.pro_monthly}/mo
              </button>
              <button
                onClick={() => handleUpgrade("verified_monthly")}
                disabled={upgrading}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-syne text-[12.5px] font-medium lowercase border ${
                  darkMode ? "bg-transparent text-white border-white/20 hover:border-white/40"
                           : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                }`}
              >
                get verified — ${subscription?.pricing?.verified_monthly}/mo
              </button>
            </div>
          )}

          {subscription?.tier !== "free" && subscription?.subscription_status === "active" && (
            <button
              onClick={handleManageSubscription}
              className={`mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-syne text-[12.5px] font-medium lowercase transition-colors ${
                darkMode ? "bg-transparent text-white border border-white/20 hover:border-white/40"
                         : "bg-white text-gray-900 border border-gray-200 hover:border-gray-400"
              }`}
            >
              <ExternalLink size={12} /> manage billing
            </button>
          )}
        </section>
      )}

      {/* Support section */}
      <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-3 mt-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
        support
      </div>

      <div className="space-y-2 mb-5">
        {[
          { href: "https://wa.me/12134147369?text=Hi%20Taj!%20I%20have%20a%20question...",
            label: "chat with taj",
            meta: "ask questions via whatsapp",
            icon: <WhatsAppIcon size={13} />,
            external: true },
          { href: "mailto:taj@trygully.com?subject=Support%20Request",
            label: "email support",
            meta: "taj@trygully.com",
            icon: <Mail size={13} /> },
          { href: "mailto:taj@trygully.com?subject=Bug%20Report",
            label: "report a bug",
            meta: "found something broken? let us know",
            icon: <Bug size={13} /> },
          { href: "https://trygully.com/faq",
            label: "faq",
            meta: "frequently asked questions",
            icon: <HelpCircle size={13} />,
            external: true },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className={`rounded-2xl border p-4 flex items-center gap-3 transition-colors ${
              darkMode ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                       : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              darkMode ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-600"
            }`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-syne text-[13.5px] font-medium lowercase ${darkMode ? "text-white" : "text-gray-900"}`}>
                {item.label}
              </div>
              <div className={`font-mono text-[11px] tracking-wide lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                {item.meta}
              </div>
            </div>
            <ChevronRight size={14} className={darkMode ? "text-white/20" : "text-gray-300"} />
          </a>
        ))}
      </div>

      {/* Account section — destructive actions */}
      <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-3 mt-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
        account
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full rounded-2xl border p-4 flex items-center gap-3 text-left transition-colors ${
            darkMode ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                     : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: darkMode ? "rgba(229,9,20,0.15)" : "#fff1f1" }}>
            <LogOut size={13} style={{ color: "#E50914" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-syne text-[13.5px] font-medium lowercase" style={{ color: "#E50914" }}>
              log out
            </div>
          </div>
          <ChevronRight size={14} className={darkMode ? "text-white/20" : "text-gray-300"} />
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className={`w-full rounded-2xl border p-4 flex items-center gap-3 text-left transition-colors ${
            darkMode ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                     : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            darkMode ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-600"
          }`}>
            <Trash2 size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-syne text-[13.5px] font-medium lowercase ${darkMode ? "text-white/70" : "text-gray-700"}`}>
              delete account
            </div>
            <div className={`font-mono text-[11px] tracking-wide lowercase ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              permanently remove your data
            </div>
          </div>
          <ChevronRight size={14} className={darkMode ? "text-white/20" : "text-gray-300"} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${darkMode ? "bg-[#0a0a0a] border border-white/10" : "bg-white border border-gray-100"}`}>
            <div className="p-6">
              <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                confirm
              </div>
              <h2 className={`font-display text-[22px] leading-tight font-normal lowercase mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                delete your account?
              </h2>
              <p className={`font-syne text-[13px] lowercase mb-5 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                this can't be undone. all your data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className={`flex-1 py-2.5 rounded-full font-syne text-[13px] font-medium lowercase border ${
                    darkMode ? "border-white/20 text-white hover:bg-white/5"
                             : "border-gray-200 text-gray-900 hover:border-gray-400"
                  }`}
                >
                  cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-full font-syne text-[13px] font-medium lowercase text-white disabled:opacity-50"
                  style={{ background: "#E50914" }}
                >
                  {deleting ? "deleting…" : "delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${darkMode ? "bg-[#0a0a0a] border border-white/10" : "bg-white border border-gray-100"}`}>
            <div className="p-6">
              <div className={`font-mono text-[10px] tracking-[0.25em] lowercase mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                confirm
              </div>
              <h2 className={`font-display text-[22px] leading-tight font-normal lowercase mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                log out?
              </h2>
              <p className={`font-syne text-[13px] lowercase mb-5 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                you'll need to sign back in to see your inbox.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 py-2.5 rounded-full font-syne text-[13px] font-medium lowercase border ${
                    darkMode ? "border-white/20 text-white hover:bg-white/5"
                             : "border-gray-200 text-gray-900 hover:border-gray-400"
                  }`}
                >
                  cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-full font-syne text-[13px] font-medium lowercase text-white"
                  style={{ background: "#0a0a0a" }}
                >
                  log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsPage;
