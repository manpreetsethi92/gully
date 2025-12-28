import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Check, Instagram, Linkedin, Twitter, Film, Music, MapPin, ExternalLink, Camera } from "lucide-react";

const SKILL_CATEGORIES = {
  creative: ["Photography", "Videography", "Graphic Design", "Music Production", "Writing", "Fashion Design", "Makeup Artistry"],
  tech: ["Software Development", "Data Science", "UI/UX Design", "AI/ML", "Mobile Development"],
  business: ["Marketing", "Sales", "Finance", "Consulting", "Project Management", "Business Development"],
  other: ["Fitness Training", "Life Coaching", "Event Planning", "Teaching", "Public Speaking"]
};

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("creative");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    location: user?.location || "",
    bio: user?.bio || "",
    skills: user?.skills || [],
    photo_url: user?.photo_url || "",
    social_links: {
      instagram: user?.social_links?.instagram || "",
      linkedin: user?.social_links?.linkedin || "",
      twitter: user?.social_links?.twitter || "",
      imdb: user?.social_links?.imdb || "",
      soundcloud: user?.social_links?.soundcloud || ""
    }
  });

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    } else if (formData.skills.length < 5) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    } else {
      toast.error("Maximum 5 skills");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
        setFormData({ ...formData, photo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    if (!formData.bio.trim()) { toast.error("Bio is required"); return; }
    if (formData.skills.length === 0) { toast.error("Select at least one skill"); return; }

    setSaving(true);
    try {
      const response = await axios.put(`${API}/users/me`, {
        bio: formData.bio,
        skills: formData.skills,
        social_links: formData.social_links,
        location: formData.location,
        photo_url: formData.photo_url
      }, { headers: { Authorization: `Bearer ${token}` } });
      updateUser(response.data);
      setShowEditModal(false);
      setPreviewPhoto(null);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const socialLinks = [
    { key: 'instagram', icon: Instagram, label: 'Instagram', color: '#E4405F' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { key: 'twitter', icon: Twitter, label: 'X', color: '#000' },
    { key: 'imdb', icon: Film, label: 'IMDB', color: '#F5C518' },
    { key: 'soundcloud', icon: Music, label: 'SoundCloud', color: '#FF5500' }
  ];

  const activeSocials = socialLinks.filter(s => user?.social_links?.[s.key]);

  const calculateCompletion = () => {
    let completed = 0;
    let total = 7;
    if (user?.name) completed++;
    if (user?.age) completed++;
    if (user?.bio) completed++;
    if (user?.skills?.length > 0) completed++;
    if (activeSocials.length > 0) completed++;
    if (user?.location) completed++;
    if (user?.photo_url) completed++;
    return Math.round((completed / total) * 100);
  };

  const completionPercent = calculateCompletion();
  const displayPhoto = user?.photo_url || null;

  return (
    <div>
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold">Profile</h1>
        <button
          onClick={() => {
            setFormData({
              name: user?.name || "",
              age: user?.age || "",
              location: user?.location || "",
              bio: user?.bio || "",
              skills: user?.skills || [],
              photo_url: user?.photo_url || "",
              social_links: user?.social_links || {}
            });
            setPreviewPhoto(null);
            setShowEditModal(true);
          }}
          className="px-4 py-2 rounded-2xl border border-gray-200 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Edit profile
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {displayPhoto ? (
              <img src={displayPhoto} alt={user?.name} className="w-28 h-28 rounded-full object-cover" />
            ) : (
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.phone}</p>
        </div>

        <div className="space-y-4">
          {(user?.location || user?.age) && (
            <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
              {user?.location && (
                <>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                  {user?.age && <span className="text-gray-300">•</span>}
                </>
              )}
              {user?.age && <span>{user.age} years old</span>}
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-2">About</h3>
            <p className="text-sm leading-relaxed">{user?.bio || "No bio yet"}</p>
          </div>

          {user?.skills?.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: '#0a0a0a', color: 'white' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeSocials.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-3">Links</h3>
              <div className="space-y-2">
                {activeSocials.map(({ key, icon: Icon, label, color }) => (
                  <a
                    key={key}
                    href={user.social_links[key].startsWith('http') ? user.social_links[key] : `https://${user.social_links[key]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: color }}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-gray-400 text-xs truncate">{user.social_links[key]}</div>
                    </div>
                    <ExternalLink size={14} className="text-gray-300" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide">Profile Completion</h3>
              <span className="text-sm font-bold" style={{ color: completionPercent === 100 ? '#22c55e' : '#E50914' }}>
                {completionPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${completionPercent}%`,
                  background: completionPercent === 100 ? '#22c55e' : '#E50914'
                }}
              />
            </div>
            {completionPercent < 100 && (
              <p className="text-xs text-gray-400 mt-2">Complete your profile to get better matches from Taj</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                {previewPhoto || formData.photo_url ? (
                  <img src={previewPhoto || formData.photo_url} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                    style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
                  >
                    {formData.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <Camera size={14} className="text-gray-600" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Click camera to upload photo</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">NAME</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="h-10" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">AGE</Label>
                <Input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="25" className="h-10" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">LOCATION</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="New York, NY" className="h-10" />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">BIO</Label>
              <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..." className="resize-none h-20" maxLength={300} />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">SKILLS ({formData.skills.length}/5)</Label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {Object.keys(SKILL_CATEGORIES).map(cat => (
                  <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES[activeCategory].map(skill => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.skills.includes(skill) ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {formData.skills.includes(skill) && <Check size={12} className="inline mr-1" />}{skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">SOCIAL LINKS</Label>
              <div className="space-y-3">
                {socialLinks.map(({ key, icon: Icon, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Icon size={18} className="text-gray-400 flex-shrink-0" />
                    <Input
                      placeholder={`${label} URL`}
                      value={formData.social_links[key] || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_links: { ...formData.social_links, [key]: e.target.value }
                      })}
                      className="h-10"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-11 rounded-2xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25"
              style={{ background: '#E50914' }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
