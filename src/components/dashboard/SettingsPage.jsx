import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import axios from "axios";
import { LogOut, Trash2, Crown, CheckCircle, ExternalLink, HelpCircle, MessageCircle, Bug, Mail } from "lucide-react";

const SettingsPage = ({ darkMode }) => {
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
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
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
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { plan }
        }
      );
      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error("Failed to start checkout:", error);
      toast.error("Failed to start checkout");
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
    } catch (error) {
      console.error("Failed to open portal:", error);
      toast.error("Failed to open subscription portal");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Account deleted");
      logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getTierDisplay = (tier) => {
    switch (tier) {
      case "pro": return { label: "Pro", color: "text-purple-500", bg: "bg-purple-500/10" };
      case "verified": return { label: "Verified", color: "text-blue-500", bg: "bg-blue-500/10" };
      default: return { label: "Free", color: "text-gray-500", bg: "bg-gray-500/10" };
    }
  };

  const tierDisplay = subscription ? getTierDisplay(subscription.tier) : getTierDisplay("free");

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
      </div>

      <div className="content-body" style={{ maxWidth: 600 }}>
        {/* Subscription Section */}
        <div className="settings-section">
          <h2 className={darkMode ? 'text-white' : ''}>Subscription</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {/* Current Plan */}
              <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                      Your Plan
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tierDisplay.color} ${tierDisplay.bg}`}>
                      {tierDisplay.label}
                    </span>
                  </div>
                  {subscription?.is_verified && (
                    <div className="flex items-center gap-1 text-blue-500">
                      <CheckCircle size={16} />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>

                {subscription?.subscription_status === "active" && subscription?.subscription_expires_at && (
                  <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    Renews {new Date(subscription.subscription_expires_at).toLocaleDateString()}
                  </p>
                )}

                {subscription?.subscription_status === "canceled" && (
                  <p className={`text-xs text-amber-500`}>
                    Cancels at end of billing period
                  </p>
                )}
              </div>

              {/* Usage Stats */}
              <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                  Today's Usage
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Requests</span>
                      <span className={darkMode ? 'text-white/60' : 'text-gray-500'}>
                        {subscription?.requests?.used || 0} / {subscription?.requests?.limit || 1000}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{
                          width: `${Math.min(100, ((subscription?.requests?.used || 0) / (subscription?.requests?.limit || 1000)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Job Alerts</span>
                      <span className={darkMode ? 'text-white/60' : 'text-gray-500'}>
                        {subscription?.scraped_jobs?.used || 0} / {subscription?.scraped_jobs?.limit || 15}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min(100, ((subscription?.scraped_jobs?.used || 0) / (subscription?.scraped_jobs?.limit || 15)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className={`text-xs mt-3 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                  Resets at midnight UTC
                </p>
              </div>

              {/* Upgrade Buttons - Only show if show_pricing_ui is true */}
              {subscription?.show_pricing_ui && subscription?.tier === "free" && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleUpgrade("pro_monthly")}
                    disabled={upgrading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all"
                  >
                    <Crown size={18} />
                    Upgrade to Pro - ${subscription?.pricing?.pro_monthly}/mo
                  </button>
                  <button
                    onClick={() => handleUpgrade("verified_monthly")}
                    disabled={upgrading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <CheckCircle size={18} />
                    Get Verified - ${subscription?.pricing?.verified_monthly}/mo
                  </button>
                </div>
              )}

              {/* Manage Subscription - Show if subscribed */}
              {subscription?.tier !== "free" && subscription?.subscription_status === "active" && (
                <button
                  onClick={handleManageSubscription}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <ExternalLink size={18} />
                  Manage Subscription
                </button>
              )}
            </>
          )}
        </div>

        {/* Support Section */}
        <div className="settings-section">
          <h2 className={darkMode ? 'text-white' : ''}>Support</h2>

          <a
            href="https://wa.me/12134147369?text=Hi%20Taj!%20I%20have%20a%20question..."
            target="_blank"
            rel="noopener noreferrer"
            className={`settings-item cursor-pointer -mx-4 px-4 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
          >
            <div className="settings-item-info">
              <h3 className={darkMode ? 'text-white' : ''}>Chat with Taj</h3>
              <p className={darkMode ? 'text-white/50' : ''}>Ask questions or get help via WhatsApp</p>
            </div>
            <MessageCircle size={20} className={darkMode ? 'text-white/40' : 'text-gray-400'} />
          </a>

          <a
            href="mailto:taj@titlii.social?subject=Support%20Request"
            className={`settings-item cursor-pointer -mx-4 px-4 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
          >
            <div className="settings-item-info">
              <h3 className={darkMode ? 'text-white' : ''}>Email Support</h3>
              <p className={darkMode ? 'text-white/50' : ''}>taj@titlii.social</p>
            </div>
            <Mail size={20} className={darkMode ? 'text-white/40' : 'text-gray-400'} />
          </a>

          <a
            href="mailto:taj@titlii.social?subject=Bug%20Report"
            className={`settings-item cursor-pointer -mx-4 px-4 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
          >
            <div className="settings-item-info">
              <h3 className={darkMode ? 'text-white' : ''}>Report a Bug</h3>
              <p className={darkMode ? 'text-white/50' : ''}>Found something broken? Let us know</p>
            </div>
            <Bug size={20} className={darkMode ? 'text-white/40' : 'text-gray-400'} />
          </a>

          <a
            href="https://titlii.social/faq"
            target="_blank"
            rel="noopener noreferrer"
            className={`settings-item cursor-pointer -mx-4 px-4 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
          >
            <div className="settings-item-info">
              <h3 className={darkMode ? 'text-white' : ''}>FAQ</h3>
              <p className={darkMode ? 'text-white/50' : ''}>Frequently asked questions</p>
            </div>
            <HelpCircle size={20} className={darkMode ? 'text-white/40' : 'text-gray-400'} />
          </a>
        </div>

        {/* Account Section */}
        <div className="settings-section">
          <h2 className={darkMode ? 'text-white' : ''}>Account</h2>

          <div
            className={`settings-item cursor-pointer -mx-4 px-4 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            onClick={() => setShowLogoutConfirm(true)}
          >
            <div className="settings-item-info">
              <h3 style={{ color: '#E50914' }}>Log out</h3>
            </div>
            <LogOut size={20} style={{ color: '#E50914' }} />
          </div>

          <div
            className={`settings-item cursor-pointer -mx-4 px-4 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <div className="settings-item-info">
              <h3 className={darkMode ? 'text-white/60' : ''} style={{ color: darkMode ? undefined : '#536471' }}>Delete account</h3>
              <p className={darkMode ? 'text-white/40' : ''}>Permanently remove your data</p>
            </div>
            <Trash2 size={20} style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#536471' }} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className={`relative w-full max-w-sm mx-4 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-[#111]' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Account?</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              This action cannot be undone. All your data will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 py-3 rounded-full font-semibold ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-full font-semibold bg-[#E50914] text-white hover:bg-[#c50810]"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className={`relative w-full max-w-sm mx-4 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-[#111]' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Log out?</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              Are you sure you want to log out?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-3 rounded-full font-semibold ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-full font-semibold bg-[#E50914] text-white hover:bg-[#c50810]"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
