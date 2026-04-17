import { useState, useRef, startTransition } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Instagram, Linkedin, Twitter, Film, Music, ExternalLink, Camera, Search, X, Loader2, BadgeCheck } from "lucide-react";

// Cloudinary config — cloud name only, no preset (signed uploads via backend)
const CLOUDINARY_CLOUD_NAME = "ds7znu6zd";

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

const ProfilePage = ({ hideHeader = false } = {}) => {
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

  // Upload image to Cloudinary via server-signed request (no unsigned preset)
  const uploadToCloudinary = async (file) => {
    // 1. Get signature from our backend (requires valid JWT)
    const sigRes = await axios.get(`${API}/upload/signature`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { timestamp, signature, api_key, folder } = sigRes.data;

    // 2. Build signed FormData
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('timestamp', timestamp);
    uploadData.append('signature', signature);
    uploadData.append('api_key', api_key);
    uploadData.append('folder', folder);

    // 3. Upload directly to Cloudinary with signature
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: uploadData }
    );

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.secure_url;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Photo must be less than 10MB");
        return;
      }

      // Validate MIME type - only allow common image formats
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error("Only JPEG, PNG, GIF, and WebP images are allowed");
        return;
      }

      // Additional validation: Check file extension matches MIME type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        toast.error("Invalid file extension. Only .jpg, .jpeg, .png, .gif, .webp are allowed");
        return;
      }

      // Validate that MIME type matches extension (prevent spoofing)
      const mimeToExtension = {
        'image/jpeg': ['jpg', 'jpeg'],
        'image/jpg': ['jpg', 'jpeg'],
        'image/png': ['png'],
        'image/gif': ['gif'],
        'image/webp': ['webp']
      };

      const expectedExtensions = mimeToExtension[file.type.toLowerCase()];
      if (!expectedExtensions || !expectedExtensions.includes(fileExtension)) {
        toast.error("File extension doesn't match file type. File may be corrupted or renamed.");
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
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
    if (formData.skills.length < 1) { toast.error("Select at least 1 skill"); return; }
    if (formData.skills.length > 10) { toast.error("Maximum 10 skills"); return; }
    if (uploadingPhoto) { toast.error("Please wait for photo to finish uploading"); return; }

    setSaving(true);
    try {
      const response = await axios.put(`${API}/users/me`, {
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
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

  const EditProfileButton = () => (
    <button
      onClick={() => {
        startTransition(() => {
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
        });
      }}
      className="px-4 py-2 rounded-full border border-gray-200 dark:border-[#333] font-medium text-[13px] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
      data-testid="edit-profile-btn"
    >
      edit profile
    </button>
  );

  return (
    <div>
      {/* Header — hidden when rendered inside YouPage (which has its own header) */}
      {!hideHeader && (
        <div className="sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 dark:border-[#222] flex items-center justify-between">
          <h1 className="text-xl font-bold">Profile</h1>
          <EditProfileButton />
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-end mb-4">
          <EditProfileButton />
        </div>
      )}

      {/* Profile Content — editorial layout */}
      <div>
        {/* Avatar + name block */}
        <div className="flex flex-col items-center text-center mb-6">
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
                className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-semibold"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
              >
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-[18px] font-semibold">
              {(user?.name || "unnamed").toLowerCase()}
            </h2>
            {user?.is_verified && (
              <BadgeCheck size={18} className="text-blue-500" fill="currentColor" strokeWidth={0} />
            )}
          </div>
          <p className="font-mono text-[11px] tracking-wide text-gray-400">
            {user?.phone}
          </p>
          {(user?.location || user?.age) && (
            <p className="font-mono text-[11px] tracking-wide text-gray-400 mt-1">
              {[user.location?.toLowerCase(), user.age ? `${user.age}` : null].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* About */}
        <section className="mb-5">
          <div className="font-mono text-[10px] text-gray-400 mb-2">
            about
          </div>
          <p className="text-[14.5px] leading-relaxed text-gray-800 dark:text-white/90">
            {user?.bio || <span className="text-gray-400 italic">no bio yet — tap edit profile to add one.</span>}
          </p>
        </section>

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <section className="mb-5">
            <div className="font-mono text-[10px] text-gray-400 mb-2">
              skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-[12px] bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/80"
                >
                  {skill.toLowerCase()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {activeSocials.length > 0 && (
          <section className="mb-5">
            <div className="font-mono text-[10px] text-gray-400 mb-2">
              links
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSocials.map(({ key, icon: Icon, label, color }) => (
                <a
                  key={key}
                  href={user.social_links[key].startsWith('http') ? user.social_links[key] : `https://${user.social_links[key]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 transition-colors"
                >
                  <Icon size={12} style={{ color }} />
                  <span className="text-gray-800 dark:text-white/80">{label.toLowerCase()}</span>
                  <ExternalLink size={10} className="text-gray-300 dark:text-white/30" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Profile Completion */}
        <section className="rounded-2xl border border-gray-100 dark:border-white/10 p-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] text-gray-400">
              profile completion
            </div>
            <span
              className="font-mono text-[12px] font-semibold"
              style={{ color: completionPercent === 100 ? '#22c55e' : '#E50914' }}
            >
              {completionPercent}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${completionPercent}%`,
                background: completionPercent === 100 ? '#22c55e' : '#E50914'
              }}
            />
          </div>
          {completionPercent < 100 && (
            <p className="text-[12px] text-gray-500 dark:text-white/50 mt-2">
              complete your profile to get better matches from taj.
            </p>
          )}
        </section>
      </div>

      {/* Edit Profile Modal — editorial redesign */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="font-mono text-[10px] text-gray-400 mb-1">
              edit profile
            </div>
            <DialogTitle className="text-[18px] font-semibold">
              who are you, really?
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 pt-2 space-y-6">
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
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
                    style={{ background: 'linear-gradient(135deg, #E50914 0%, #ff4757 100%)' }}
                  >
                    {formData.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
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
              <p className="font-mono text-[10.5px] tracking-wide text-gray-400 mt-2">
                {uploadingPhoto ? "uploading…" : "tap the camera to upload a photo"}
              </p>
            </div>

            {/* Name & Age */}
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div>
                <div className="font-mono text-[10px] text-gray-400 mb-1.5">
                  name
                </div>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="your name"
                  className="h-11 rounded-xl text-[14px] placeholder:"
                />
              </div>
              <div>
                <div className="font-mono text-[10px] text-gray-400 mb-1.5">
                  age
                </div>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                  className="h-11 rounded-xl font-mono text-[14px] w-20 text-center"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="font-mono text-[10px] text-gray-400 mb-1.5">
                location
              </div>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="brooklyn, ny"
                className="h-11 rounded-xl text-[14px] placeholder:"
              />
            </div>

            {/* Bio */}
            <div>
              <div className="font-mono text-[10px] text-gray-400 mb-1.5">
                bio
              </div>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="what do you do? how should taj pitch you?"
                className="resize-none h-20 rounded-xl text-[14px] placeholder:"
                maxLength={300}
              />
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="font-mono text-[10px] text-gray-400">
                  skills — {formData.skills.length}/10
                </div>
                {formData.skills.length < 5 && (
                  <div className="font-mono text-[10px] text-gray-400">
                    min 5 recommended
                  </div>
                )}
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    >
                      {skill.toLowerCase()}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-white/20 dark:hover:bg-black/20 rounded-full p-0.5 -mr-1"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {formData.skills.length < 10 && (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    placeholder="search skills…"
                    className="h-11 pl-9 rounded-xl text-[14px] placeholder:"
                  />

                  {showSkillDropdown && filteredSkills.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredSkills.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {skill.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  )}

                  {showSkillDropdown && skillSearch.trim() && filteredSkills.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg p-3">
                      <p className="font-mono text-[11px] text-gray-500">
                        no matches for "{skillSearch.toLowerCase()}"
                      </p>
                      <button
                        type="button"
                        onClick={() => addSkill(skillSearch.trim())}
                        className="mt-2 text-[12px] font-medium text-[#E50914] hover:underline"
                      >
                        + add "{skillSearch.trim().toLowerCase()}" anyway
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div>
              <div className="font-mono text-[10px] text-gray-400 mb-2">
                social links
              </div>
              <div className="space-y-2">
                {socialLinks.map(({ key, icon: Icon, label, color }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <Input
                      placeholder={`${label.toLowerCase()} url or @handle`}
                      value={formData.social_links[key] || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_links: { ...formData.social_links, [key]: e.target.value }
                      })}
                      className="h-10 rounded-xl text-[13px] placeholder:"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || uploadingPhoto}
              className="w-full h-11 rounded-full text-white font-medium text-[13.5px] transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ background: '#0a0a0a' }}
            >
              {saving ? 'saving…' : uploadingPhoto ? 'uploading photo…' : 'save changes'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
