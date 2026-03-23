/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { TrendingUp, MessageSquare, Calendar, FileCheck, Zap, Loader } from 'lucide-react';

const AgentSettingsPage = ({ darkMode = false }) => {
  const { token, API } = useAuth();
  const [settings, setSettings] = useState({
    pitchAutonomy: false,
    negotiateAutonomy: false,
    calendarBookingAutonomy: false,
    invoiceCaseAutonomy: false
  });
  const [activePitches, setActivePitches] = useState([]);
  const [pitchStats, setPitchStats] = useState({
    totalPitches: 0,
    acceptanceRate: 0,
    avgResponseTime: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [syncStatus, setSyncStatus] = useState('connected');

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const [settingsRes, pitchesRes, statsRes] = await Promise.all([
        axios.get(`${API}/agent/settings`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/agent/pitches`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/agent/stats`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setSettings(settingsRes.data.settings || {});
      setActivePitches(pitchesRes.data.pitches || []);
      setPitchStats(statsRes.data.stats || {});
    } catch (err) {
      setError('Failed to fetch agent settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key, value) => {
    try {
      await axios.patch(
        `${API}/agent/settings`,
        { [key]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings({ ...settings, [key]: value });
    } catch (err) {
      setError('Failed to update setting');
    }
  };

  const handleAcceptPitch = async (pitchId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/agent/pitches/${pitchId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAgentData();
    } catch (err) {
      setError('Failed to accept pitch');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPitch = async (pitchId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/agent/pitches/${pitchId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAgentData();
    } catch (err) {
      setError('Failed to reject pitch');
    } finally {
      setLoading(false);
    }
  };

  const bgColor = darkMode ? 'bg-slate-900' : 'bg-white';
  const textColor = darkMode ? 'text-slate-100' : 'text-slate-900';
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-slate-50';
  const borderColor = darkMode ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className={`p-6 space-y-6 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Agent Settings</h1>
          <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Configure autonomous agent behavior and view pitch performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${syncStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {syncStatus === 'connected' ? 'Agent Active' : 'Agent Offline'}
          </span>
        </div>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Pitches"
          value={pitchStats.totalPitches || 0}
          icon={<MessageSquare className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <StatCard
          label="Acceptance Rate"
          value={`${pitchStats.acceptanceRate || 0}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <StatCard
          label="Avg Response"
          value={`${pitchStats.avgResponseTime || 0}m`}
          icon={<Calendar className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <StatCard
          label="Success Rate"
          value={`${pitchStats.successRate || 0}%`}
          icon={<FileCheck className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="settings">Agent Settings</TabsTrigger>
          <TabsTrigger value="pitches">Active Pitches ({activePitches.length})</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className={`p-6 border ${borderColor} ${cardBg}`}>
            <h2 className={`text-xl font-bold mb-6 ${textColor}`}>Autonomy Configuration</h2>

            <div className="space-y-6">
              {/* Pitch Autonomy */}
              <SettingRow
                title="Pitch Autonomy"
                description="Allow agent to send pitches to relevant opportunities automatically"
                icon={<Zap className="w-5 h-5 text-blue-500" />}
                enabled={settings.pitchAutonomy}
                onChange={(value) => handleSettingChange('pitchAutonomy', value)}
                darkMode={darkMode}
                details="Agent will analyze job descriptions and send personalized pitches when confidence > 80%"
              />

              {/* Negotiate Autonomy */}
              <SettingRow
                title="Negotiate Autonomy"
                description="Allow agent to negotiate contract terms automatically"
                icon={<MessageSquare className="w-5 h-5 text-purple-500" />}
                enabled={settings.negotiateAutonomy}
                onChange={(value) => handleSettingChange('negotiateAutonomy', value)}
                darkMode={darkMode}
                details="Agent will counter-offer on rates and timelines within your preset ranges"
              />

              {/* Calendar Booking Autonomy */}
              <SettingRow
                title="Calendar Booking Autonomy"
                description="Allow agent to schedule meetings automatically"
                icon={<Calendar className="w-5 h-5 text-green-500" />}
                enabled={settings.calendarBookingAutonomy}
                onChange={(value) => handleSettingChange('calendarBookingAutonomy', value)}
                darkMode={darkMode}
                details="Agent will book meetings during your available time slots (must set calendar availability)"
              />

              {/* Invoice Chase Autonomy */}
              <SettingRow
                title="Invoice Chase Autonomy"
                description="Allow agent to follow up on pending payments automatically"
                icon={<FileCheck className="w-5 h-5 text-orange-500" />}
                enabled={settings.invoiceCaseAutonomy}
                onChange={(value) => handleSettingChange('invoiceCaseAutonomy', value)}
                darkMode={darkMode}
                details="Agent will send payment reminders and escalate overdue invoices"
              />
            </div>
          </Card>

          {/* Risk Management */}
          <Card className={`p-6 border ${borderColor} ${cardBg} border-amber-500 border-2`}>
            <h3 className={`font-bold flex items-center gap-2 mb-3 ${textColor}`}>
              <Zap className="w-5 h-5 text-amber-500" />
              Risk Management
            </h3>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>• Agent actions are always subject to your preset constraints and limits</li>
              <li>• All autonomous decisions require your approval or will be queued for review</li>
              <li>• You can override any agent action at any time</li>
              <li>• Agent maintains full audit trail of all actions taken</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Pitches Tab */}
        <TabsContent value="pitches" className="space-y-4">
          {activePitches.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <Loader className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No active pitches at the moment
              </p>
            </Card>
          ) : (
            activePitches.map((pitch) => (
              <PitchCard
                key={pitch.id}
                pitch={pitch}
                onAccept={handleAcceptPitch}
                onReject={handleRejectPitch}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
                loading={loading}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  darkMode,
  cardBg,
  textColor
}) => {
  return (
    <Card className={`p-4 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} ${cardBg}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold mt-2 ${textColor}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

const SettingRow = ({
  title,
  description,
  icon,
  enabled,
  onChange,
  darkMode,
  details
}) => {
  return (
    <div className={`p-4 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">{icon}</div>
          <div>
            <h3 className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {title}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {description}
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onChange={onChange}
        />
      </div>
      {enabled && (
        <p className={`text-xs mt-3 p-2 rounded ${darkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
          {details}
        </p>
      )}
    </div>
  );
};

const PitchCard = ({
  pitch,
  onAccept,
  onReject,
  darkMode,
  cardBg,
  borderColor,
  textColor,
  loading
}) => {
  return (
    <Card className={`p-6 border ${borderColor} ${cardBg}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${textColor}`}>{pitch.jobTitle}</h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              from {pitch.clientName}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            pitch.status === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : pitch.status === 'accepted'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {pitch.status.toUpperCase()}
          </span>
        </div>

        <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {pitch.pitchContent}
        </p>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
          <div>
            <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Budget
            </p>
            <p className={`font-bold ${textColor}`}>₹{pitch.budget?.toLocaleString()}</p>
          </div>
          <div>
            <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Timeline
            </p>
            <p className={`font-bold ${textColor}`}>{pitch.duration} days</p>
          </div>
          <div>
            <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Confidence
            </p>
            <p className={`font-bold text-green-600`}>{pitch.confidence}%</p>
          </div>
        </div>

        {pitch.status === 'pending' && (
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onAccept(pitch.id)}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Accept
            </Button>
            <Button
              onClick={() => onReject(pitch.id)}
              disabled={loading}
              variant="outline"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AgentSettingsPage;
