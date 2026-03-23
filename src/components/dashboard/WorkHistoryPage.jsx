import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import axios from 'axios';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react';

const WorkHistoryPage = ({ darkMode = false }) => {
  const { user, token, API } = useAuth();
  const [workHistory, setWorkHistory] = useState([]);
  const [skillAffinity, setSkillAffinity] = useState([]);
  const [rateBenchmark, setRateBenchmark] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('history');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchWorkData();
  }, []);

  const fetchWorkData = async () => {
    try {
      setLoading(true);
      const [historyRes, affinityRes, benchmarkRes] = await Promise.all([
        axios.get(`${API}/work-history`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/skill-affinity`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/rate-benchmark`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setWorkHistory(historyRes.data.workHistory || []);
      setSkillAffinity(affinityRes.data.skills || []);
      setRateBenchmark(benchmarkRes.data.benchmark || {});
    } catch (err) {
      setError('Failed to fetch work history');
    } finally {
      setLoading(false);
    }
  };

  const bgColor = darkMode ? 'bg-slate-900' : 'bg-white';
  const textColor = darkMode ? 'text-slate-100' : 'text-slate-900';
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-slate-50';
  const borderColor = darkMode ? 'border-slate-700' : 'border-slate-200';

  const filteredHistory = filterStatus === 'all'
    ? workHistory
    : workHistory.filter(w => w.status === filterStatus);

  const completedGigs = workHistory.filter(w => w.status === 'completed').length;
  const activeGigs = workHistory.filter(w => w.status === 'active').length;
  const totalEarnings = workHistory.reduce((sum, w) => sum + (w.earned || 0), 0);
  const avgRating = workHistory.length > 0
    ? (workHistory.reduce((sum, w) => sum + (w.rating || 0), 0) / workHistory.length).toFixed(2)
    : '0.00';

  return (
    <div className={`p-6 space-y-6 ${bgColor}`}>
      <div>
        <h1 className={`text-3xl font-bold ${textColor}`}>Work History</h1>
        <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Track your completed projects and performance metrics
        </p>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStatCard
          label="Completed"
          value={completedGigs}
          icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <QuickStatCard
          label="Active"
          value={activeGigs}
          icon={<Clock className="w-6 h-6 text-blue-500" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <QuickStatCard
          label="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <QuickStatCard
          label="Avg Rating"
          value={`${avgRating} ⭐`}
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="history">Work History</TabsTrigger>
          <TabsTrigger value="skills">Skill Affinity</TabsTrigger>
          <TabsTrigger value="benchmark">Rate Benchmark</TabsTrigger>
        </TabsList>

        {/* Work History Tab */}
        <TabsContent value="history" className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {['all', 'completed', 'active', 'paused'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {filteredHistory.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No work history found
              </p>
            </Card>
          ) : (
            filteredHistory.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              />
            ))
          )}
        </TabsContent>

        {/* Skill Affinity Tab */}
        <TabsContent value="skills" className="space-y-4">
          {skillAffinity.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No skill data yet. Complete projects to build affinity metrics.
              </p>
            </Card>
          ) : (
            <Card className={`p-6 border ${borderColor} ${cardBg}`}>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Your Skill Strengths</h2>
              <div className="space-y-4">
                {skillAffinity.map((skill) => (
                  <SkillAffinityRow
                    key={skill.id}
                    skill={skill}
                    darkMode={darkMode}
                    textColor={textColor}
                  />
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Rate Benchmark Tab */}
        <TabsContent value="benchmark" className="space-y-4">
          <Card className={`p-6 border ${borderColor} ${cardBg}`}>
            <h2 className={`text-xl font-bold mb-6 ${textColor}`}>Your Rate Benchmark</h2>

            {Object.keys(rateBenchmark).length === 0 ? (
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                Rate data will appear after you complete projects
              </p>
            ) : (
              <div className="space-y-6">
                <BenchmarkMetric
                  label="Your Average Rate"
                  value={`₹${rateBenchmark.averageRate?.toLocaleString()}/hour`}
                  comparison={rateBenchmark.rateComparison}
                  darkMode={darkMode}
                  textColor={textColor}
                />

                <BenchmarkMetric
                  label="Market Rate (Your Region)"
                  value={`₹${rateBenchmark.marketRate?.toLocaleString()}/hour`}
                  darkMode={darkMode}
                  textColor={textColor}
                />

                <BenchmarkMetric
                  label="Recommended Rate"
                  value={`₹${rateBenchmark.recommendedRate?.toLocaleString()}/hour`}
                  comparison={rateBenchmark.rateRecommendation}
                  darkMode={darkMode}
                  textColor={textColor}
                />

                {/* Rate by Skill */}
                <div className="pt-4 border-t border-slate-700">
                  <h3 className={`font-bold mb-3 ${textColor}`}>Rate by Skill</h3>
                  <div className="space-y-2">
                    {rateBenchmark.skillRates?.map((skillRate) => (
                      <div
                        key={skillRate.skill}
                        className={`flex justify-between p-3 rounded ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
                      >
                        <span className={textColor}>{skillRate.skill}</span>
                        <span className={`font-bold ${textColor}`}>
                          ₹{skillRate.rate?.toLocaleString()}/hour
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const QuickStatCard = ({
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

const WorkCard = ({
  work,
  darkMode,
  cardBg,
  borderColor,
  textColor
}) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    active: 'bg-blue-100 text-blue-700',
    paused: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <Card className={`p-6 border ${borderColor} ${cardBg}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${textColor}`}>{work.projectTitle}</h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            with {work.clientName}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[work.status] || 'bg-gray-100'}`}>
            {work.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Budget
          </p>
          <p className={`font-bold ${textColor}`}>₹{work.budget?.toLocaleString()}</p>
        </div>
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Earned
          </p>
          <p className={`font-bold ${textColor}`}>₹{work.earned?.toLocaleString()}</p>
        </div>
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Duration
          </p>
          <p className={`font-bold ${textColor}`}>{work.duration} days</p>
        </div>
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Rating
          </p>
          <p className={`font-bold ${textColor}`}>{work.rating || 'N/A'} ⭐</p>
        </div>
      </div>

      <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {work.description}
      </p>

      {work.skills && work.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {work.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
};

const SkillAffinityRow = ({
  skill,
  darkMode,
  textColor
}) => {
  const percentage = skill.affinity || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className={textColor}>{skill.name}</span>
        <span className={`font-bold text-green-600`}>{percentage}% affinity</span>
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {skill.projectCount} projects • ₹{skill.totalEarned?.toLocaleString()} earned
      </p>
    </div>
  );
};

const BenchmarkMetric = ({
  label,
  value,
  comparison,
  darkMode,
  textColor
}) => {
  return (
    <div className={`p-4 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-100'}`}>
      <p className={`text-xs uppercase font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {label}
      </p>
      <div className="flex justify-between items-end">
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        {comparison && (
          <span className={`text-sm font-medium ${
            comparison === 'above'
              ? 'text-green-600'
              : comparison === 'below'
              ? 'text-orange-600'
              : 'text-gray-600'
          }`}>
            {comparison === 'above' && '↑ Above market'}
            {comparison === 'below' && '↓ Below market'}
            {comparison === 'average' && '= Market average'}
          </span>
        )}
      </div>
    </div>
  );
};

export default WorkHistoryPage;
