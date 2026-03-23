/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Zap, TrendingUp, X, Plus, Play, Pause } from 'lucide-react';

const AdsPage = ({ darkMode = false }) => {
  const { token, API } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '7',
    targetSkills: '',
    boostType: 'standard'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(response.data.campaigns || []);
    } catch (err) {
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${API}/campaigns`,
        {
          title: formData.title,
          description: formData.description,
          budget: parseFloat(formData.budget),
          duration: parseInt(formData.duration),
          targetSkills: formData.targetSkills.split(',').map(s => s.trim()),
          boostType: formData.boostType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCampaigns([response.data.campaign, ...campaigns]);
      setFormData({
        title: '',
        description: '',
        budget: '',
        duration: '7',
        targetSkills: '',
        boostType: 'standard'
      });
      setShowCreateForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCampaign = async (campaignId, isActive) => {
    try {
      await axios.patch(
        `${API}/campaigns/${campaignId}`,
        { active: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCampaigns(campaigns.map(c =>
        c.id === campaignId ? { ...c, active: !isActive } : c
      ));
    } catch (err) {
      setError('Failed to update campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await axios.delete(`${API}/campaigns/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
    } catch (err) {
      setError('Failed to delete campaign');
    }
  };

  const handleUrgentBoost = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API}/campaigns/urgent-boost`,
        { duration: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCampaigns([response.data.campaign, ...campaigns]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create urgent boost');
    } finally {
      setLoading(false);
    }
  };

  const activeCampaigns = campaigns.filter(c => c.active);
  const inactiveCampaigns = campaigns.filter(c => !c.active);

  const bgColor = darkMode ? 'bg-slate-900' : 'bg-white';
  const textColor = darkMode ? 'text-slate-100' : 'text-slate-900';
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-slate-50';
  const borderColor = darkMode ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className={`p-6 space-y-6 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Boost Your Profile</h1>
          <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Increase visibility with targeted ad campaigns
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {error}
        </div>
      )}

      {/* Urgent Boost Card */}
      <Card className={`p-6 border-2 border-amber-500 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-bold flex items-center gap-2 ${textColor}`}>
              <Zap className="w-5 h-5 text-amber-500" />
              Urgent Match Boost
            </h3>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Immediate 24-hour visibility spike to high-value opportunities
            </p>
            <p className={`text-lg font-bold mt-2 text-amber-500`}>₹2,999</p>
          </div>
          <Button
            onClick={handleUrgentBoost}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Boost Now
          </Button>
        </div>
      </Card>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card className={`p-6 border ${borderColor} ${cardBg}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${textColor}`}>Create Campaign</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className={`p-1 hover:${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Campaign Title
              </label>
              <Input
                type="text"
                placeholder="e.g., UI Designer for E-commerce"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className={darkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Description
              </label>
              <Textarea
                placeholder="Describe what makes your profile special for this campaign"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className={darkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                  Budget (₹)
                </label>
                <Input
                  type="number"
                  placeholder="999"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                  className={darkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                  Duration (days)
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  min="1"
                  max="90"
                  className={darkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Target Skills (comma-separated)
              </label>
              <Input
                type="text"
                placeholder="UI Design, React, Figma"
                value={formData.targetSkills}
                onChange={(e) => setFormData({ ...formData, targetSkills: e.target.value })}
                className={darkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Boost Type
              </label>
              <select
                value={formData.boostType}
                onChange={(e) => setFormData({ ...formData, boostType: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              >
                <option value="standard">Standard (2x reach)</option>
                <option value="premium">Premium (5x reach)</option>
                <option value="vip">VIP (10x reach)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs for Active and Inactive Campaigns */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="active">Active ({activeCampaigns.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveCampaigns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeCampaigns.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No active campaigns. Create one to boost your profile visibility.
              </p>
            </Card>
          ) : (
            activeCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onToggle={handleToggleCampaign}
                onDelete={handleDeleteCampaign}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactiveCampaigns.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No inactive campaigns.
              </p>
            </Card>
          ) : (
            inactiveCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onToggle={handleToggleCampaign}
                onDelete={handleDeleteCampaign}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CampaignCard = ({
  campaign,
  onToggle,
  onDelete,
  darkMode,
  cardBg,
  borderColor,
  textColor
}) => {
  return (
    <Card className={`p-6 border ${borderColor} ${cardBg}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${textColor}`}>{campaign.title}</h3>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {campaign.description}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            campaign.active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {campaign.active ? 'Active' : 'Paused'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Budget
            </p>
            <p className={`text-lg font-bold ${textColor}`}>₹{campaign.budget}</p>
          </div>
          <div>
            <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Duration
            </p>
            <p className={`text-lg font-bold ${textColor}`}>{campaign.duration} days</p>
          </div>
          <div>
            <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Impressions
            </p>
            <p className={`text-lg font-bold flex items-center gap-1 text-blue-600`}>
              <TrendingUp className="w-4 h-4" />
              {campaign.impressions || 0}
            </p>
          </div>
        </div>

        {campaign.targetSkills && campaign.targetSkills.length > 0 && (
          <div>
            <p className={`text-xs uppercase font-semibold mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Target Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {campaign.targetSkills.map((skill) => (
                <span
                  key={skill}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    darkMode
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => onToggle(campaign.id, campaign.active)}
            variant="outline"
            className="flex-1"
          >
            {campaign.active ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          <Button
            onClick={() => onDelete(campaign.id)}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdsPage;
