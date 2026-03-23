/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Clock, TrendingUp, Share2, Gift, Wallet } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../App';

const ReferralsPage = ({ darkMode = false }) => {
  const { user, token, API } = useAuth();
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [rewards, setRewards] = useState({
    earned: 0,
    pending: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('referrals');

  useEffect(() => {
    fetchReferralData();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch referral link
      const linkResponse = await fetch(`${API}/referrals/link`, { headers });
      if (linkResponse.ok) {
        const linkData = await linkResponse.json();
        setReferralLink(linkData.link || `https://giggy.com/ref/${user?.id}`);
      }

      // Fetch referrals status
      const referralsResponse = await fetch(`${API}/referrals`, { headers });
      if (referralsResponse.ok) {
        const referralsData = await referralsResponse.json();
        setReferrals(referralsData.referrals || []);
      }

      // Fetch rewards balance
      const rewardsResponse = await fetch(`${API}/referrals/rewards`, { headers });
      if (rewardsResponse.ok) {
        const rewardsData = rewardsResponse.json();
        setRewards(rewardsData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async (platform) => {
    const text = `Join Giggy and get amazing gigs! Use my referral link: ${referralLink}`;
    const encodedText = encodeURIComponent(text);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      email: `mailto:?subject=Join Giggy&body=${encodedText}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const getReferralStats = () => {
    const active = referrals.filter(r => r.status === 'active').length;
    const pending = referrals.filter(r => r.status === 'pending').length;
    const successful = referrals.filter(r => r.status === 'successful').length;

    return { active, pending, successful };
  };

  const stats = getReferralStats();

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Referrals & Rewards
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Earn rewards by referring talented professionals to Giggy
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <QuickStatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Active Referrals"
            value={stats.active}
            darkMode={darkMode}
          />
          <QuickStatCard
            icon={<Clock className="w-5 h-5" />}
            label="Pending"
            value={stats.pending}
            darkMode={darkMode}
          />
          <QuickStatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Successful"
            value={stats.successful}
            darkMode={darkMode}
          />
          <QuickStatCard
            icon={<Gift className="w-5 h-5" />}
            label="Earnings"
            value={`₹${rewards.earned}`}
            darkMode={darkMode}
          />
        </div>

        {/* Referral Link Section */}
        <Card
          className={`mb-8 p-6 ${
            darkMode
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Referral Link
            </h2>
            <Share2 className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>

          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Share this link with your network and earn rewards when they sign up and complete their first gig
          </p>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={referralLink}
              readOnly
              className={`flex-1 px-4 py-3 rounded-lg border font-mono text-sm ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-100'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
            <Button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 ${
                copied
                  ? darkMode
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-500 hover:bg-green-600'
                  : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ShareButton
              icon="whatsapp"
              label="WhatsApp"
              onClick={() => shareReferral('whatsapp')}
              darkMode={darkMode}
            />
            <ShareButton
              icon="twitter"
              label="Twitter"
              onClick={() => shareReferral('twitter')}
              darkMode={darkMode}
            />
            <ShareButton
              icon="linkedin"
              label="LinkedIn"
              onClick={() => shareReferral('linkedin')}
              darkMode={darkMode}
            />
            <ShareButton
              icon="email"
              label="Email"
              onClick={() => shareReferral('email')}
              darkMode={darkMode}
            />
          </div>
        </Card>

        {/* Tabs */}
        <div className={`mb-6 flex gap-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'referrals'
                ? darkMode
                  ? 'border-blue-500 text-blue-400'
                  : 'border-blue-500 text-blue-600'
                : darkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Referral Status
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'rewards'
                ? darkMode
                  ? 'border-blue-500 text-blue-400'
                  : 'border-blue-500 text-blue-600'
                : darkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Reward Balance
          </button>
        </div>

        {/* Referral Status Tab */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            {loading ? (
              <Card className={`p-8 text-center ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading referrals...</p>
              </Card>
            ) : referrals.length === 0 ? (
              <Card className={`p-8 text-center ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                <TrendingUp className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No referrals yet
                </p>
                <p className={darkMode ? 'text-gray-500' : 'text-gray-600'}>
                  Start sharing your referral link to earn rewards
                </p>
              </Card>
            ) : (
              referrals.map(referral => (
                <ReferralCard
                  key={referral.id}
                  referral={referral}
                  darkMode={darkMode}
                />
              ))
            )}
          </div>
        )}

        {/* Reward Balance Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RewardCard
                title="Earned Rewards"
                amount={`₹${rewards.earned}`}
                description="Successfully completed referrals"
                icon={<Gift className="w-6 h-6" />}
                color="green"
                darkMode={darkMode}
              />
              <RewardCard
                title="Pending Rewards"
                amount={`₹${rewards.pending}`}
                description="Referrals in progress"
                icon={<Clock className="w-6 h-6" />}
                color="yellow"
                darkMode={darkMode}
              />
              <RewardCard
                title="Total Potential"
                amount={`₹${rewards.earned + rewards.pending}`}
                description="Earned + Pending"
                icon={<Wallet className="w-6 h-6" />}
                color="blue"
                darkMode={darkMode}
              />
            </div>

            {/* Withdrawal Section */}
            <Card
              className={`p-6 ${
                darkMode
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Withdraw Rewards
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Minimum withdrawal amount: ₹500
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Withdrawal Amount
                  </label>
                  <input
                    type="number"
                    placeholder="₹500 - ₹10,000"
                    min={500}
                    max={rewards.earned}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-gray-100'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Payment Method
                  </label>
                  <select
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-gray-100'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option>Bank Account</option>
                    <option>UPI</option>
                    <option>Wallet</option>
                  </select>
                </div>
              </div>

              <Button
                disabled={rewards.earned < 500}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Request Withdrawal
              </Button>
            </Card>

            {/* Withdrawal History */}
            <Card
              className={`p-6 ${
                darkMode
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Withdrawal History
              </h3>
              <div className="space-y-3">
                <WithdrawalRow
                  date="Mar 15, 2026"
                  amount="₹2,000"
                  method="Bank Account"
                  status="Completed"
                  darkMode={darkMode}
                />
                <WithdrawalRow
                  date="Mar 8, 2026"
                  amount="₹1,500"
                  method="UPI"
                  status="Completed"
                  darkMode={darkMode}
                />
                <WithdrawalRow
                  date="Mar 1, 2026"
                  amount="₹1,000"
                  method="Bank Account"
                  status="Completed"
                  darkMode={darkMode}
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickStatCard = ({ icon, label, value, darkMode }) => (
  <Card className={`p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className={darkMode ? 'text-blue-400' : 'text-blue-600'}>{icon}</div>
      </div>
      <div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  </Card>
);

const ShareButton = ({ icon, label, onClick, darkMode }) => {
  const iconMap = {
    whatsapp: '💬',
    twitter: '𝕏',
    linkedin: 'in',
    email: '✉️',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border font-medium transition text-sm ${
        darkMode
          ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
          : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'
      }`}
    >
      <span className="mr-2">{iconMap[icon]}</span>
      {label}
    </button>
  );
};

const ReferralCard = ({ referral, darkMode }) => {
  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    successful: 'bg-green-100 text-green-800',
  };

  const darkStatusColors = {
    active: 'bg-blue-900 text-blue-200',
    pending: 'bg-yellow-900 text-yellow-200',
    successful: 'bg-green-900 text-green-200',
  };

  const statusColor = darkMode
    ? darkStatusColors[referral.status]
    : statusColors[referral.status];

  return (
    <Card className={`p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {referral.name}
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {referral.email}
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Referred on {referral.referredDate}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {referral.status === 'active'
              ? 'In Progress'
              : referral.status === 'pending'
                ? 'Pending Activation'
                : 'Completed'}
          </span>
          {referral.status === 'successful' && (
            <p className={`text-sm font-semibold mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              +₹{referral.reward}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

const RewardCard = ({ title, amount, description, icon, color, darkMode }) => {
  const colorClasses = {
    green: darkMode ? 'text-green-400' : 'text-green-600',
    yellow: darkMode ? 'text-yellow-400' : 'text-yellow-600',
    blue: darkMode ? 'text-blue-400' : 'text-blue-600',
  };

  const bgClasses = {
    green: darkMode ? 'bg-green-900' : 'bg-green-50',
    yellow: darkMode ? 'bg-yellow-900' : 'bg-yellow-50',
    blue: darkMode ? 'bg-blue-900' : 'bg-blue-50',
  };

  return (
    <Card className={`p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className={`p-3 rounded-lg mb-4 w-fit ${bgClasses[color]}`}>
        <div className={colorClasses[color]}>{icon}</div>
      </div>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
      <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {amount}
      </p>
      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {description}
      </p>
    </Card>
  );
};

const WithdrawalRow = ({ date, amount, method, status, darkMode }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
    <div>
      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{amount}</p>
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {method} • {date}
      </p>
    </div>
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
      darkMode
        ? 'bg-green-900 text-green-200'
        : 'bg-green-100 text-green-800'
    }`}>
      {status}
    </span>
  </div>
);

export default ReferralsPage;