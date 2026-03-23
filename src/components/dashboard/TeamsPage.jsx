/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, Plus, X, Trash2, Shield } from 'lucide-react';

const TeamsPage = ({ darkMode = false }) => {
  const { user, token, API } = useAuth();
  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('myteams');

  useEffect(() => {
    fetchTeams();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserTeams(response.data.myTeams || []);
      setTeams(response.data.allTeams || []);
    } catch (err) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${API}/teams`,
        {
          name: formData.name,
          description: formData.description,
          category: formData.category
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserTeams([response.data.team, ...userTeams]);
      setFormData({ name: '', description: '', category: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/teams/${teamId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTeams();
    } catch (err) {
      setError('Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      setLoading(true);
      await axios.post(
        `${API}/teams/${selectedTeam.id}/invite`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInviteEmail('');
      setShowInviteForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      await axios.delete(
        `${API}/teams/${teamId}/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTeams();
    } catch (err) {
      setError('Failed to remove member');
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      await axios.post(
        `${API}/teams/${teamId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTeams();
      setSelectedTeam(null);
    } catch (err) {
      setError('Failed to leave team');
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
          <h1 className={`text-3xl font-bold ${textColor}`}>Teams</h1>
          <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Collaborate and build together
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {error}
        </div>
      )}

      {/* Create Team Form */}
      {showCreateForm && (
        <Card className={`p-6 border ${borderColor} ${cardBg}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${textColor}`}>Create New Team</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className={`p-1 hover:${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Team Name
              </label>
              <Input
                type="text"
                placeholder="e.g., Design Collective"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={darkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Description
              </label>
              <Textarea
                placeholder="What's your team about?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className={darkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              >
                <option value="">Select a category</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="content">Content Creation</option>
                <option value="product">Product</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Creating...' : 'Create Team'}
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

      {/* Tabs for My Teams and Discover */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="myteams">My Teams ({userTeams.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover ({teams.filter(t => !userTeams.find(ut => ut.id === t.id)).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="myteams" className="space-y-4">
          {userTeams.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                You're not in any teams yet. Create or join one to get started.
              </p>
            </Card>
          ) : (
            userTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isOwner={team.ownerId === user?.id}
                onSelect={() => setSelectedTeam(team)}
                isSelected={selectedTeam?.id === team.id}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          {teams.filter(t => !userTeams.find(ut => ut.id === t.id)).length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No teams available to join.
              </p>
            </Card>
          ) : (
            teams
              .filter(t => !userTeams.find(ut => ut.id === t.id))
              .map((team) => (
                <DiscoverTeamCard
                  key={team.id}
                  team={team}
                  onJoin={handleJoinTeam}
                  darkMode={darkMode}
                  cardBg={cardBg}
                  borderColor={borderColor}
                  textColor={textColor}
                />
              ))
          )}
        </TabsContent>
      </Tabs>

      {/* Team Detail Panel */}
      {selectedTeam && (
        <TeamDetailPanel
          team={selectedTeam}
          isOwner={selectedTeam.ownerId === user?.id}
          onInvite={() => setShowInviteForm(!showInviteForm)}
          onRemoveMember={handleRemoveMember}
          onLeave={() => handleLeaveTeam(selectedTeam.id)}
          darkMode={darkMode}
          cardBg={cardBg}
          borderColor={borderColor}
          textColor={textColor}
          showInviteForm={showInviteForm}
          inviteEmail={inviteEmail}
          onInviteEmailChange={setInviteEmail}
          onSendInvite={handleInviteMember}
          loading={loading}
        />
      )}
    </div>
  );
};

const TeamCard = ({
  team,
  isOwner,
  onSelect,
  isSelected,
  darkMode,
  cardBg,
  borderColor,
  textColor
}) => {
  return (
    <Card
      onClick={onSelect}
      className={`p-6 border-2 cursor-pointer transition ${
        isSelected
          ? darkMode
            ? 'border-blue-500 bg-slate-700'
            : 'border-blue-500 bg-blue-50'
          : `border-${borderColor}`
      } ${cardBg}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${textColor}`}>{team.name}</h3>
          {isOwner && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 mt-1">
              <Shield className="w-3 h-3" />
              Owner
            </span>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
        }`}>
          {team.memberCount || 0} members
        </span>
      </div>
      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {team.description}
      </p>
      {team.category && (
        <p className={`text-xs font-semibold mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {team.category.toUpperCase()}
        </p>
      )}
    </Card>
  );
};

const DiscoverTeamCard = ({
  team,
  onJoin,
  darkMode,
  cardBg,
  borderColor,
  textColor
}) => {
  return (
    <Card className={`p-6 border ${borderColor} ${cardBg}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${textColor}`}>{team.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
        }`}>
          {team.memberCount || 0} members
        </span>
      </div>
      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {team.description}
      </p>
      <div className="flex justify-between items-center mt-4">
        {team.category && (
          <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {team.category.toUpperCase()}
          </span>
        )}
        <Button
          onClick={() => onJoin(team.id)}
          className="bg-green-600 hover:bg-green-700"
        >
          Join
        </Button>
      </div>
    </Card>
  );
};

const TeamDetailPanel = ({
  team,
  isOwner,
  onInvite,
  onRemoveMember,
  onLeave,
  darkMode,
  cardBg,
  borderColor,
  textColor,
  showInviteForm,
  inviteEmail,
  onInviteEmailChange,
  onSendInvite,
  loading
}) => {
  return (
    <Card className={`p-6 border-2 border-blue-500 ${cardBg}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`text-2xl font-bold ${textColor}`}>{team.name}</h2>
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {team.description}
            </p>
          </div>
          {!isOwner && (
            <Button
              onClick={onLeave}
              variant="outline"
              className="text-red-600"
            >
              Leave Team
            </Button>
          )}
        </div>

        {/* Members Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${textColor}`}>Members ({team.members?.length || 0})</h3>
            {isOwner && (
              <Button
                onClick={onInvite}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Invite
              </Button>
            )}
          </div>

          {showInviteForm && isOwner && (
            <div className={`p-4 rounded-lg border mb-4 ${borderColor} ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <form onSubmit={onSendInvite} className="space-y-3">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => onInviteEmailChange(e.target.value)}
                  required
                  className={darkMode ? 'bg-slate-600 border-slate-500 text-white' : ''}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Send Invite
                  </Button>
                  <Button
                    type="button"
                    onClick={onInvite}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-2">
            {team.members?.map((member) => (
              <div
                key={member.id}
                className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              >
                <div>
                  <p className={`font-medium ${textColor}`}>{member.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {member.email}
                  </p>
                </div>
                {isOwner && member.id !== team.ownerId && (
                  <Button
                    onClick={() => onRemoveMember(team.id, member.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio & Booking Links */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div>
            <p className={`text-xs uppercase font-semibold mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Team Portfolio
            </p>
            <Button variant="outline" className="w-full">
              View Portfolio
            </Button>
          </div>
          <div>
            <p className={`text-xs uppercase font-semibold mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Team Booking Page
            </p>
            <Button variant="outline" className="w-full">
              View Booking
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeamsPage;
