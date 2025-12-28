import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../App";
import { useNavigate } from "react-router-dom";
import { ChevronRight, LogOut, Trash2 } from "lucide-react";

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [primaryIntent, setPrimaryIntent] = useState("Professional");
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [newOpportunities, setNewOpportunities] = useState(true);
  const [connectionUpdates, setConnectionUpdates] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out");
  };

  return (
    <div>
      <div className="content-header">
        <h1>Settings</h1>
      </div>
      
      <div className="content-body" style={{ maxWidth: 600 }}>
        <div className="settings-section">
          <h2>Matching Preferences</h2>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <h3>Primary Intent</h3>
              <p>What type of connections are you looking for?</p>
            </div>
            <div className="settings-tabs">
              <button
                className={`settings-tab ${primaryIntent === "Professional" ? "active" : ""}`}
                onClick={() => setPrimaryIntent("Professional")}
              >
                Professional
              </button>
              <button
                className={`settings-tab ${primaryIntent === "Community" ? "active" : ""}`}
                onClick={() => setPrimaryIntent("Community")}
              >
                Community
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Privacy</h2>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <h3>Profile visibility</h3>
              <p>Allow others to discover your profile</p>
            </div>
            <div 
              className={`toggle-switch ${profileVisibility ? "active" : ""}`}
              onClick={() => setProfileVisibility(!profileVisibility)}
            />
          </div>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <h3>Blocked contacts</h3>
              <p>Manage people you've blocked</p>
            </div>
            <ChevronRight size={20} style={{ color: '#536471' }} />
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <h3>New opportunities</h3>
              <p>Get notified when Taj finds a match</p>
            </div>
            <div 
              className={`toggle-switch ${newOpportunities ? "active" : ""}`}
              onClick={() => setNewOpportunities(!newOpportunities)}
            />
          </div>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <h3>Connection updates</h3>
              <p>When someone accepts your introduction</p>
            </div>
            <div 
              className={`toggle-switch ${connectionUpdates ? "active" : ""}`}
              onClick={() => setConnectionUpdates(!connectionUpdates)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Account</h2>
          
          <div 
            className="settings-item cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded-lg"
            onClick={handleLogout}
          >
            <div className="settings-item-info">
              <h3 style={{ color: '#E50914' }}>Log out</h3>
            </div>
            <LogOut size={20} style={{ color: '#E50914' }} />
          </div>
          
          <div className="settings-item cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded-lg">
            <div className="settings-item-info">
              <h3 style={{ color: '#536471' }}>Delete account</h3>
              <p>Permanently remove your data</p>
            </div>
            <Trash2 size={20} style={{ color: '#536471' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
