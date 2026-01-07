import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Check, Instagram, Linkedin, Twitter, Film, Music, MapPin, ExternalLink, Camera, Search, X, Loader2 } from "lucide-react";

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = "ds7znu6zd";
const CLOUDINARY_UPLOAD_PRESET = "titli_uploads";

// Expanded skills list - searchable
const ALL_SKILLS = [
  // Creative - Visual
  "Photography", "Videography", "Cinematography", "Video Editing", "Photo Editing", 
  "Graphic Design", "Motion Graphics", "Animation", "3D Animation", "VFX",
  "Illustration", "Digital Art", "Fine Art", "Concept Art", "Storyboarding",
  
  // Creative - Fashion & Beauty
  "Fashion Design", "Costume Design", "Wardrobe Styling", "Fashion Styling",
  "Makeup Artist", "SFX Makeup", "Bridal Makeup", "Editorial Makeup",
  "Hair Styling", "Nail Art", "Body Painting",
  
  // Creative - Music & Audio
  "Music Production", "Beatmaking", "Mixing", "Mastering", "Sound Design",
  "Audio Engineering", "Podcast Production", "Voice Over", "Singing", "Songwriting",
  "DJ", "Composer", "Music Supervision",
  
  // Creative - Writing & Content
  "Writing", "Copywriting", "Content Writing", "Screenwriting", "Script Writing",
  "Creative Writing", "Blogging", "Journalism", "Editing", "Proofreading",
  
  // Creative - Performance
  "Acting", "Voice Acting", "Modeling", "Dance", "Choreography",
  "Stand-up Comedy", "Hosting", "MC", "Public Speaking",
  
  // Creative - Production
  "Film Directing", "Music Video Directing", "Commercial Directing",
  "Producing", "Line Producing", "Production Management", "Art Direction",
  "Set Design", "Props", "Location Scouting",
  
  // Tech
  "Software Development", "Web Development", "Mobile Development", "App Development",
  "Frontend Development", "Backend Development", "Full Stack Development",
  "iOS Development", "Android Development", "React", "Python", "JavaScript",
  "Data Science", "Machine Learning", "AI/ML", "Data Analysis", "Data Visualization",
  "UI/UX Design", "Product Design", "UX Research", "Prototyping", "Figma",
  "DevOps", "Cloud Computing", "Cybersecurity", "Blockchain", "Web3",
  "Game Development", "AR/VR Development",
  
  // Business & Marketing
  "Marketing", "Digital Marketing", "Social Media Marketing", "Content Marketing",
  "Brand Strategy", "Brand Management", "Advertising", "Media Buying",
  "SEO", "SEM", "Email Marketing", "Influencer Marketing", "Affiliate Marketing",
  "Sales", "Business Development", "Partnerships", "Account Management",
  "Finance", "Accounting", "Investment", "Fundraising", "Venture Capital",
  "Consulting", "Strategy Consulting", "Management Consulting",
  "Project Management", "Product Management", "Operations", "HR",
  "Legal", "Contracts", "Talent Management", "Artist Management",
  
  // Other Professional
  "Fitness Training", "Personal Training", "Yoga Instruction", "Nutrition",
  "Life Coaching", "Career Coaching", "Executive Coaching",
  "Event Planning", "Wedding Planning", "Event Production",
  "Teaching", "Tutoring", "Online Courses", "Workshop Facilitation",
  "Translation", "Interpretation", "Localization",
  "Real Estate", "Interior Design", "Architecture",
  "Catering", "Food Styling", "Culinary Arts"
];

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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

  // Filter skills based on search
  const filteredSkills = skillSearch.trim() 
    ? ALL_SKILLS.filter(skill => 
        skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !formData.skills.includes(skill)
      ).slice(0, 10)
    : [];

  const addSkill = (skill) => {
    if (formData.skills.length >= 10) {
      toast.error("Maximum 10 skills");
      return;
    }
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillSearch("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: uploadData
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Photo must be less than 10MB");
        return;
      }
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Upload to Cloudinary
      setUploadingPhoto(true);
      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        setFormData(prev => ({ ...prev, photo_url: cloudinaryUrl }));
        toast.success("Photo uploaded!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload photo");
        setPreviewPhoto(null);
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    if (!formData.bio.trim()) { toast.error("Bio is required"); return; }
    if (formData.skills.length < 5) { toast.error("Select at least 5 skills"); return; }
    if (formData.skills.length > 10) { toast.error("Maximum 10 skills"); return; }
    if (uploadingPhoto) { toast.error("Please wait for photo to finish uploading"); return; }

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

  // Calculate profile completion percentage
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
  const displayPhoto = (!imageError && user?.photo_url) ? user.photo_url : null;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 dark:border-[#222] flex items-center justify-between">
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
            setSkillSearch("");
            setShowEditModal(true);
          }}
          className="px-4 py-2 rounded-2xl border border-gray-200 dark:border-[#333] font-semibold text-sm hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
          data-testid="edit-profile-btn"
        >
          Edit profile
        </button>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {displayPhoto ? (
              <img 
                src={displayPhoto} 
                alt={user?.name}
                className="w-28 h-28 rounded-full object-cover"
                onError={() => setImageError(true)}
              />
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

        {/* Info */}
        <div className="space-y-4">
          {/* Location & Age */}
          {(user?.location || user?.age) && (
            <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
              {user?.location && (
                <>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                  {user?.age && <span className="text-gray-300 dark:text-gray-600">•</span>}
                </>
              )}
              {user?.age && <span>{user.age} years old</span>}
            </div>
          )}

          {/* Bio */}
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-4">
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-2">About</h3>
            <p className="text-sm leading-relaxed">{user?.bio || "No bio yet"}</p>
          </div>

          {/* Skills */}
          {user?.skills?.length > 0 && (
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-4">
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 bg-white dark:bg-[#222] rounded-full text-sm font-medium shadow-sm dark:shadow-none dark:border dark:border-[#333]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeSocials.length > 0 && (
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-4">
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-3">Links</h3>
              <div className="space-y-2">
                {activeSocials.map(({ key, icon: Icon, label, color }) => (
                  <a
                    key={key}
                    href={user.social_links[key].startsWith('http') ? user.social_links[key] : `https://${user.social_links[key]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-[#222] transition-colors"
                  >
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: color }}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-gray-400 text-xs truncate">{user.social_links[key]}</div>
                    </div>
                    <ExternalLink size={14} className="text-gray-300 dark:text-gray-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Profile Completion */}
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wide">Profile Completion</h3>
              <span className="text-sm font-bold" style={{ color: completionPercent === 100 ? '#22c55e' : '#E50914' }}>
                {completionPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#333] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${completionPercent}%`,
                  background: completionPercent === 100 ? '#22c55e' : '#E50914'
                }}
              />
            </div>
            {completionPercent < 100 && (
              <p className="text-xs text-gray-400 mt-2">
                Complete your profile to get better matches from Taj
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {(previewPhoto || (formData.photo_url && !imageError)) ? (
                  <img 
                    src={previewPhoto || formData.photo_url} 
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                    style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
                  >
                    {formData.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                
                {/* Upload button / loading state */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-[#222] border-2 border-gray-100 dark:border-[#333] flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <Loader2 size={14} className="text-gray-600 dark:text-gray-300 animate-spin" />
                  ) : (
                    <Camera size={14} className="text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {uploadingPhoto ? "Uploading..." : "Click camera to upload photo"}
              </p>
            </div>

            {/* Name & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">NAME</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">AGE</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                  className="h-10"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">LOCATION</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="New York, NY"
                className="h-10"
              />
            </div>

            {/* Bio */}
            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">BIO</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="resize-none h-20"
                maxLength={300}
              />
            </div>

            {/* Skills - Searchable */}
            <div>
              <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                SKILLS YOU WANT WORK IN ({formData.skills.length}/10) - Min 5
              </Label>
              
              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map(skill => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button 
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-white/20 dark:hover:bg-black/20 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Search Input */}
              {formData.skills.length < 10 && (
                <div className="relative">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={skillSearch}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        setShowSkillDropdown(true);
                      }}
                      onFocus={() => setShowSkillDropdown(true)}
                      placeholder="Search skills... (e.g. Makeup Artist, Video Editing)"
                      className="h-10 pl-9"
                    />
                  </div>
                  
                  {/* Dropdown */}
                  {showSkillDropdown && filteredSkills.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredSkills.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#222] transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* No results */}
                  {showSkillDropdown && skillSearch.trim() && filteredSkills.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl shadow-lg p-3">
                      <p className="text-sm text-gray-500">No skills found for "{skillSearch}"</p>
                      <button
                        type="button"
                        onClick={() => addSkill(skillSearch.trim())}
                        className="mt-2 text-sm font-medium text-red-600 hover:underline"
                      >
                        + Add "{skillSearch.trim()}" as custom skill
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-2">
                These are the skills people will find you for
              </p>
            </div>

            {/* Social Links */}
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

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || uploadingPhoto}
              className="w-full h-11 rounded-2xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
              style={{ background: '#E50914' }}
            >
              {saving ? 'Saving...' : uploadingPhoto ? 'Uploading photo...' : 'Save changes'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
