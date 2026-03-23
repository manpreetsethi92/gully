/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Bell,
  Zap,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Settings,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../App';

const NotificationsPage = ({ darkMode = false }) => {
  const { token, API } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [demandForecast, setDemandForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [markAsRead, setMarkAsRead] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
    demand: true,
  });

  useEffect(() => {
    fetchNotifications();
    fetchDemandForecast();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchDemandForecast();
    }, 30000);
    return () => clearInterval(interval);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotifications = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${API}/notifications`, { headers });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const fetchDemandForecast = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${API}/demand-forecast`, { headers });
      if (response.ok) {
        const data = await response.json();
        setDemandForecast(data);
      }
    } catch (error) {
      console.error('Error fetching demand forecast:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await fetch(`${API}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers,
      });
      setMarkAsRead(prev => ({ ...prev, [notificationId]: true }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await fetch(`${API}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers,
      });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleSettingChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read && !markAsRead[n.id]).length;

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`relative p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <Bell className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Demand Forecast Alert */}
        {demandForecast && (
          <DemandForecastCard
            forecast={demandForecast}
            darkMode={darkMode}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Filters and Settings */}
          <div className="space-y-6">
            {/* Filter Card */}
            <Card className={`p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Filter
              </h3>
              <div className="space-y-2">
                <FilterButton
                  label="All"
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                  count={notifications.length}
                  darkMode={darkMode}
                />
                <FilterButton
                  label="Messages"
                  active={filter === 'message'}
                  onClick={() => setFilter('message')}
                  count={notifications.filter(n => n.type === 'message').length}
                  darkMode={darkMode}
                />
                <FilterButton
                  label="Gig Updates"
                  active={filter === 'gig'}
                  onClick={() => setFilter('gig')}
                  count={notifications.filter(n => n.type === 'gig').length}
                  darkMode={darkMode}
                />
                <FilterButton
                  label="System"
                  active={filter === 'system'}
                  onClick={() => setFilter('system')}
                  count={notifications.filter(n => n.type === 'system').length}
                  darkMode={darkMode}
                />
              </div>
            </Card>

            {/* Settings Card */}
            <Card className={`p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Settings className="w-4 h-4" />
                Settings
              </h3>
              <div className="space-y-3">
                <SettingToggle
                  label="Push Notifications"
                  enabled={notificationSettings.push}
                  onChange={() => handleSettingChange('push')}
                  darkMode={darkMode}
                />
                <SettingToggle
                  label="Email Notifications"
                  enabled={notificationSettings.email}
                  onChange={() => handleSettingChange('email')}
                  darkMode={darkMode}
                />
                <SettingToggle
                  label="SMS Notifications"
                  enabled={notificationSettings.sms}
                  onChange={() => handleSettingChange('sms')}
                  darkMode={darkMode}
                />
                <SettingToggle
                  label="Demand Forecast"
                  enabled={notificationSettings.demand}
                  onChange={() => handleSettingChange('demand')}
                  darkMode={darkMode}
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Notifications Feed */}
          <div className="lg:col-span-2">
            <Card className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              {loading ? (
                <div className="p-8 text-center">
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                  <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No notifications
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: darkMode ? '#1f2937' : '#e5e7eb' }}>
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isRead={markAsRead[notification.id] || notification.read}
                      onMarkAsRead={() => handleMarkAsRead(notification.id)}
                      onDelete={() => handleDeleteNotification(notification.id)}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemandForecastCard = ({ forecast, darkMode }) => {
  const getForecastIcon = () => {
    if (forecast.demandLevel === 'high') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (forecast.demandLevel === 'medium') return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <TrendingUp className="w-5 h-5 text-gray-500" />;
  };

  const getForecastBgColor = () => {
    if (forecast.demandLevel === 'high') {
      return darkMode ? 'bg-green-900 border-green-800' : 'bg-green-50 border-green-200';
    }
    if (forecast.demandLevel === 'medium') {
      return darkMode ? 'bg-yellow-900 border-yellow-800' : 'bg-yellow-50 border-yellow-200';
    }
    return darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200';
  };

  return (
    <Card className={`mb-8 p-6 border-2 ${getForecastBgColor()}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {getForecastIcon()}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${
            forecast.demandLevel === 'high'
              ? darkMode ? 'text-green-200' : 'text-green-900'
              : forecast.demandLevel === 'medium'
                ? darkMode ? 'text-yellow-200' : 'text-yellow-900'
                : darkMode ? 'text-gray-300' : 'text-gray-900'
          }`}>
            Demand Forecast
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            {forecast.message}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Demand Level</p>
              <p className={`text-lg font-bold capitalize ${
                forecast.demandLevel === 'high'
                  ? darkMode ? 'text-green-300' : 'text-green-700'
                  : forecast.demandLevel === 'medium'
                    ? darkMode ? 'text-yellow-300' : 'text-yellow-700'
                    : darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {forecast.demandLevel}
              </p>
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Skills</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {forecast.topSkills.slice(0, 2).join(', ')}
              </p>
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Budget</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ₹{forecast.avgBudget}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const NotificationItem = ({
  notification,
  isRead,
  onMarkAsRead,
  onDelete,
  darkMode,
}) => {
  const getIcon = () => {
    if (notification.type === 'message') return <MessageSquare className="w-5 h-5" />;
    if (notification.type === 'gig') return <Zap className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  const getIconColor = () => {
    if (notification.type === 'message') return darkMode ? 'text-blue-400' : 'text-blue-600';
    if (notification.type === 'gig') return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-gray-400' : 'text-gray-600';
  };

  return (
    <div
      className={`p-4 flex items-start gap-4 hover:bg-opacity-50 transition ${
        !isRead
          ? darkMode
            ? 'bg-gray-800 bg-opacity-50'
            : 'bg-blue-50'
          : ''
      }`}
    >
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div className={getIconColor()}>{getIcon()}</div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {notification.title}
            </h4>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {notification.message}
            </p>
          </div>
          {!isRead && (
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 ml-2 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {notification.timestamp}
          </p>
          <div className="flex items-center gap-2">
            {!isRead && (
              <Button
                onClick={onMarkAsRead}
                className="text-xs px-2 py-1 h-auto bg-blue-600 hover:bg-blue-700"
              >
                Mark Read
              </Button>
            )}
            <button
              onClick={onDelete}
              className={`p-1.5 rounded transition ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-500 hover:text-red-400'
                  : 'hover:bg-gray-200 text-gray-500 hover:text-red-600'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ label, active, onClick, count, darkMode }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-lg transition font-medium text-sm flex items-center justify-between ${
      active
        ? darkMode
          ? 'bg-blue-600 text-white'
          : 'bg-blue-100 text-blue-700'
        : darkMode
          ? 'text-gray-400 hover:text-gray-300'
          : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    <span>{label}</span>
    <span className={`text-xs px-2 py-0.5 rounded ${
      active
        ? darkMode
          ? 'bg-blue-700'
          : 'bg-blue-200'
        : darkMode
          ? 'bg-gray-800'
          : 'bg-gray-200'
    }`}>
      {count}
    </span>
  </button>
);

const SettingToggle = ({ label, enabled, onChange, darkMode }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {label}
    </span>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        enabled
          ? darkMode
            ? 'bg-blue-600'
            : 'bg-blue-500'
          : darkMode
            ? 'bg-gray-700'
            : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default NotificationsPage;