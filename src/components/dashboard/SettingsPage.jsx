import { useState } from "react";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import axios from "axios";
import { LogOut, Trash2 } from "lucide-react";

const SettingsPage = ({ darkMode }) => {
  const { logout, token } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
      </div>

      <div className="content-body" style={{ maxWidth: 600 }}>
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
