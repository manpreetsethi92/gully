import React, { useState, useEffect } from "react";
import { useAuth, API } from "../../App";
import axios from "axios";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs } from "../ui/tabs";
import {
  Plus,
  MessageSquare,
  Check,
  Clock,
  ChevronRight,
  X,
  MapPin,
  DollarSign,
  Briefcase
} from "lucide-react";

const HirerDashboard = ({ darkMode }) => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("post");
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
    category: "",
    deadline: ""
  });

  useEffect(() => {
    fetchGigs();
  }, [token]);

  const fetchGigs = async () => {
    try {
      const response = await axios.get(`${API}/gigs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGigs(response.data);
    } catch (error) {
      console.error("Failed to fetch gigs:", error);
    }
  };

  const handlePostGig = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/gigs`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: "", description: "", budget: "", location: "", category: "", deadline: "" });
      setShowPostForm(false);
      fetchGigs();
    } catch (error) {
      console.error("Failed to post gig:", error);
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen p-4 lg:p-6 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`font-syne font-bold text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Manage Gigs
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Post jobs and manage your team of contractors
            </p>
          </div>
          <Button
            onClick={() => setShowPostForm(!showPostForm)}
            className="bg-[#E50914] hover:bg-[#d00810] text-white gap-2"
          >
            <Plus size={18} />
            Post a Gig
          </Button>
        </div>

        {/* Post Form */}
        {showPostForm && (
          <Card className={`mb-8 p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
            <h2 className={`font-syne font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Post a New Gig
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Gig Title (e.g., Kitchen Renovation)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={darkMode ? 'bg-white/10 border-white/20 text-white' : ''}
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="construction">Construction</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="it">IT/Software</option>
                  <option value="design">Design</option>
                  <option value="writing">Writing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Textarea
                placeholder="Describe the gig details, requirements, and expectations..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={darkMode ? 'bg-white/10 border-white/20 text-white' : ''}
                rows={4}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Budget (e.g., $500-1000)"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className={darkMode ? 'bg-white/10 border-white/20 text-white' : ''}
                />
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={darkMode ? 'bg-white/10 border-white/20 text-white' : ''}
                />
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className={darkMode ? 'bg-white/10 border-white/20 text-white' : ''}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePostGig}
                  disabled={loading || !formData.title || !formData.description}
                  className="flex-1 bg-[#E50914] hover:bg-[#d00810] text-white"
                >
                  {loading ? "Posting..." : "Post Gig"}
                </Button>
                <Button
                  onClick={() => setShowPostForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Posted", value: gigs.length, icon: Briefcase, color: "text-blue-500" },
            { label: "Active", value: gigs.filter(g => g.status === 'posted').length, icon: Clock, color: "text-yellow-500" },
            { label: "Matched", value: gigs.filter(g => g.status === 'matched').length, icon: Check, color: "text-green-500" },
            { label: "Closed", value: gigs.filter(g => g.status === 'closed').length, icon: Briefcase, color: "text-gray-500" }
          ].map((stat, i) => (
            <Card
              key={i}
              className={`p-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color} opacity-20`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className={`text-xs font-mono ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`font-syne font-bold text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gigs Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'} mb-6 flex gap-6`}>
            {["post", "candidates", "active"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-syne font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-[#E50914] text-[#E50914]'
                    : `border-transparent ${darkMode ? 'text-white/60 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Posted Gigs */}
          {activeTab === "post" && (
            <div className="space-y-4">
              {gigs.length === 0 ? (
                <Card className={`p-8 text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    No gigs posted yet. Click "Post a Gig" to get started!
                  </p>
                </Card>
              ) : (
                gigs.map(gig => <GigCard key={gig.id} gig={gig} darkMode={darkMode} />)
              )}
            </div>
          )}

          {/* Candidates */}
          {activeTab === "candidates" && (
            <div className="space-y-4">
              {gigs.flatMap(g => g.candidates || []).length === 0 ? (
                <Card className={`p-8 text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    No candidates yet. Keep an eye here for applications!
                  </p>
                </Card>
              ) : (
                gigs.flatMap(g => (g.candidates || []).map(c => (
                  <CandidateCard key={c.id} candidate={c} gig={g} darkMode={darkMode} />
                )))
              )}
            </div>
          )}

          {/* Active Gigs */}
          {activeTab === "active" && (
            <div className="space-y-4">
              {gigs.filter(g => g.status !== 'closed').map(gig => (
                <GigStatusCard key={gig.id} gig={gig} darkMode={darkMode} />
              ))}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

const GigCard = ({ gig, darkMode }) => (
  <Card className={`p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'} hover:shadow-lg transition-all`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className={`font-syne font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {gig.title}
        </h3>
        <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          {gig.description.substring(0, 100)}...
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        gig.status === 'posted' ? (darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700') :
        gig.status === 'matched' ? (darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
        (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
      }`}>
        {gig.status}
      </span>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <p className={`text-xs font-mono ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>BUDGET</p>
        <p className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{gig.budget}</p>
      </div>
      <div>
        <p className={`text-xs font-mono ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>LOCATION</p>
        <p className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{gig.location}</p>
      </div>
      <div>
        <p className={`text-xs font-mono ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>APPLICANTS</p>
        <p className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{(gig.candidates || []).length}</p>
      </div>
    </div>

    <Button className="w-full bg-[#E50914] hover:bg-[#d00810] text-white gap-2">
      Manage <ChevronRight size={16} />
    </Button>
  </Card>
);

const CandidateCard = ({ candidate, gig, darkMode }) => (
  <Card className={`p-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#E50914]/20 flex items-center justify-center">
            <span className="font-syne font-bold text-[#E50914]">
              {candidate.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {candidate.name}
            </h4>
            <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Applied for {gig.title}
            </p>
          </div>
        </div>
        <p className={`text-sm mt-2 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
          {candidate.pitch}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="bg-[#E50914] hover:bg-[#d00810] text-white gap-1">
          <MessageSquare size={14} />
          Contact
        </Button>
        <Button size="sm" variant="outline">
          <Check size={14} />
        </Button>
      </div>
    </div>
  </Card>
);

const GigStatusCard = ({ gig, darkMode }) => (
  <Card className={`p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className={`font-syne font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {gig.title}
      </h3>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className={`text-sm font-mono ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Active
        </span>
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Posted 2 days ago</span>
        <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {(gig.candidates || []).length} applicants
        </span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
        <div className="h-full bg-[#E50914]" style={{ width: "60%" }} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <Button className="bg-[#E50914] hover:bg-[#d00810] text-white" size="sm">
        View Applicants
      </Button>
      <Button variant="outline" size="sm">
        Edit Gig
      </Button>
    </div>
  </Card>
);

export default HirerDashboard;
