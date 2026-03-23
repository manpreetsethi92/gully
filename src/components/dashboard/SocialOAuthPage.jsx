/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useAuth, API } from "../../App";
import axios from "axios";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Check,
  Loader,
  Users,
  Github,
  Music,
  Palette,
  Play,
  Twitter,
  Briefcase
} from "lucide-react";

const OAUTH_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: Briefcase, color: "#0A66C2" },
  { id: "instagram", label: "Instagram", icon: Users, color: "#E4405F" },
  { id: "google", label: "Google", icon: Users, color: "#4285F4" },
  { id: "github", label: "GitHub", icon: Github, color: "#333" },
  { id: "tiktok", label: "TikTok", icon: Play, color: "#25F4EE" },
  { id: "youtube", label: "YouTube", icon: Play, color: "#FF0000" },
  { id: "behance", label: "Behance", icon: Palette, color: "#0057FF" },
  { id: "dribbble", label: "Dribbble", icon: Palette, color: "#EA4C89" },
  { id: "spotify", label: "Spotify", icon: Music, color: "#1DB954" },
  { id: "twitter", label: "Twitter/X", icon: Twitter, color: "#000" }
];

const SocialOAuthPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [connectedAccounts, setConnectedAccounts] = useState({});
  const [loading, setLoading] = useState({});
  const [accountData, setAccountData] = useState({});

  useEffect(() => {
    fetchConnectedAccounts();
  }, [token]);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await axios.get(`${API}/oauth/connected`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConnectedAccounts(response.data.connected);
      setAccountData(response.data.account_data || {});
    } catch (error) {
      console.error("Failed to fetch connected accounts:", error);
    }
  };

  const handleOAuthClick = (platform) => {
    setLoading(prev => ({ ...prev, [platform]: true }));
    
    if (connectedAccounts[platform]) {
      // Handle disconnect
      disconnectAccount(platform);
    } else {
      // Initiate OAuth flow
      const authUrl = `${API}/oauth/${platform}/authorize?redirect_uri=${encodeURIComponent(
        window.location.origin + '/app/profile'
      )}`;
      window.location.href = authUrl;
    }
  };

  const disconnectAccount = async (platform) => {
    try {
      await axios.post(`${API}/oauth/${platform}/disconnect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConnectedAccounts(prev => {
        const updated = { ...prev };
        delete updated[platform];
        return updated;
      });
      setAccountData(prev => {
        const updated = { ...prev };
        delete updated[platform];
        return updated;
      });
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  return (
    <div className={`min-h-screen p-4 lg:p-6 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`font-syne font-bold text-3xl mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Connect Social Accounts
          </h1>
          <p className={`font-mono text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            Link your social profiles to showcase your work and grow your network
          </p>
        </div>

        {/* Connection Stats */}
        <Card className={`mb-8 p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-mono text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>CONNECTED ACCOUNTS</p>
              <p className={`font-syne font-bold text-2xl mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {Object.keys(connectedAccounts).length} of {OAUTH_PLATFORMS.length}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#E50914]/10 flex items-center justify-center">
              <span className="font-syne font-bold text-[#E50914] text-xl">
                {Math.round((Object.keys(connectedAccounts).length / OAUTH_PLATFORMS.length) * 100)}%
              </span>
            </div>
          </div>
        </Card>

        {/* OAuth Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {OAUTH_PLATFORMS.map(platform => {
            const isConnected = connectedAccounts[platform.id];
            const data = accountData[platform.id];
            const isLoading = loading[platform.id];

            return (
              <Card
                key={platform.id}
                className={`p-6 cursor-pointer transition-all ${
                  isConnected
                    ? darkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'
                    : darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      <platform.icon size={20} />
                    </div>
                    <div>
                      <h3 className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {platform.label}
                      </h3>
                      <p className={`font-mono text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        {isConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {isConnected && (
                    <Check size={20} className="text-green-500" strokeWidth={3} />
                  )}
                </div>

                {/* Account Data Display */}
                {data && (
                  <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    {data.followers && (
                      <p className={`font-mono text-xs mb-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{data.followers.toLocaleString()}</span> followers
                      </p>
                    )}
                    {data.connections && (
                      <p className={`font-mono text-xs mb-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{data.connections.toLocaleString()}</span> connections
                      </p>
                    )}
                    {data.portfolio_items && (
                      <p className={`font-mono text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{data.portfolio_items}</span> portfolio items
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => handleOAuthClick(platform.id)}
                  disabled={isLoading}
                  className={`w-full font-syne font-semibold transition-all ${
                    isConnected
                      ? `${darkMode ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-700'}`
                      : 'bg-[#E50914] hover:bg-[#d00810] text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      {isConnected ? 'Disconnecting...' : 'Connecting...'}
                    </>
                  ) : isConnected ? (
                    `Disconnect ${platform.label}`
                  ) : (
                    `Connect ${platform.label}`
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Info Box */}
        <Card className={`p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'}`}>
          <h3 className={`font-syne font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Why connect accounts?
          </h3>
          <ul className={`font-mono text-sm space-y-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            <li>✓ Showcase your portfolio and work samples</li>
            <li>✓ Let hirers verify your experience and skills</li>
            <li>✓ Automatically sync followers and connections for credibility</li>
            <li>✓ Get more high-quality gig matches</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SocialOAuthPage;
