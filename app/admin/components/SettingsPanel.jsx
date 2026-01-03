"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ExternalLink, Info, Trash2, Plus, ChevronDown } from "lucide-react";
import FooterLinkEditor from "./shared/FooterLinkEditor";
import SocialIconEditor from "./shared/SocialIconEditor";
import ImpactStoriesManager from "./ImpactStoriesManager";
import FocusAreasManager from "./FocusAreasManager";
import DynamicContentManager from "./DynamicContentManager";

export default function SettingsPanel({ supabase, onSettingsSaved }) {
  const [activeTab, setActiveTab] = useState("general");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  const tabs = [
    { id: "general", label: "General" },
    { id: "home", label: "Home Page" },
    { id: "footer", label: "Footer" },
    { id: "about", label: "About Page" },
    { id: "team", label: "Team Page" },
    { id: "page-banners", label: "Page Banners" },
    { id: "banner-texts", label: "Banner Texts" },
    { id: "focus-areas", label: "We Provide Page" },
  ];
  const [site, setSite] = useState({ 
    id: 1, 
    title: "NGO", 
    contact_email: "",
    logo_url: "",
    hero_title_line1: "Empowering Rural Women.",
    hero_title_line2: "Health. Education. Economic Independence.",
    mission_statement: "Healthy, Educated, and Empowered Girls Build a Stronger Nation.",
    tagline: "Swasth, Shikshit aur Samarth Meri Beti.",
    footer_description: "Empowering communities for a better tomorrow through education, healthcare, and sustainable development programs.",
    footer_email: "",
    footer_phone: "",
    footer_address: "",
    footer_copyright: "© 2025 Pragati Prime. All rights reserved."
  });
  const [footerLinks, setFooterLinks] = useState([]);
  const [socialIcons, setSocialIcons] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [aboutContent, setAboutContent] = useState({
    about_vision_title: "Vision for Rural Girls & Women",
    about_vision_description: "",
    about_team_image_url: "",
    about_vision_image_url: "",
    about_us_paragraph1: "",
    about_us_paragraph2: "",
    impact_areas: [],
    our_approach_paragraph: "",
    why_pragati_paragraphs: [],
    mission_paragraphs: [],
    child_initiatives_paragraph: "",
    women_empowerment_vision: "",
    protection_initiatives: "",
    cta_join_mission: "",
    what_we_do_paragraphs: []
  });
  const [volunteerContent, setVolunteerContent] = useState({
    volunteer_info: {
      paragraph1: "",
      paragraph2: ""
    },
    volunteer_opportunities: []
  });
  const [internshipContent, setInternshipContent] = useState({
    internship_info: {
      paragraph1: "",
      paragraph2: ""
    },
    internship_opportunities: []
  });
  const [careerPositions, setCareerPositions] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [missionTexts, setMissionTexts] = useState([]);
  const [pageBanners, setPageBanners] = useState({
    about_page_banner_image_url: "",
    team_page_banner_image_url: "",
    articles_page_banner_image_url: ""
  });
  const [bannerTexts, setBannerTexts] = useState([
    {
      page: "about",
      title: "",
      subtitle: "",
      description: ""
    },
    {
      page: "team",
      title: "",
      subtitle: "",
      description: ""
    },
    {
      page: "vision",
      title: "",
      subtitle: "",
      description: ""
    },
    {
      page: "articles",
      title: "",
      subtitle: "",
      description: ""
    }
  ]);
  const [impactStories, setImpactStories] = useState([]);
  const [focusArea, setFocusArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsResult, linksResult, iconsResult, storiesResult, focusAreaResult] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).maybeSingle(),
        supabase.from("footer_links").select("*").order("display_order", { ascending: true }),
        supabase.from("footer_social_icons").select("*").order("display_order", { ascending: true }),
        supabase.from("impact_stories").select("*").order("display_order", { ascending: true }),
        supabase.from("focus_areas").select("*").limit(1).maybeSingle()
      ]);

      if (settingsResult.data) {
        setSite({
          id: 1,
          title: settingsResult.data.title || "NGO",
          contact_email: settingsResult.data.contact_email || "",
          logo_url: settingsResult.data.logo_url || "",
          hero_title_line1: settingsResult.data.hero_title_line1 || "Empowering Rural Women.",
          hero_title_line2: settingsResult.data.hero_title_line2 || "Health. Education. Economic Independence.",
          mission_statement: settingsResult.data.mission_statement || "Healthy, Educated, and Empowered Girls Build a Stronger Nation.",
          tagline: settingsResult.data.tagline || "Swasth, Shikshit aur Samarth Meri Beti.",
          footer_description: settingsResult.data.footer_description || "Empowering communities for a better tomorrow through education, healthcare, and sustainable development programs.",
          footer_email: settingsResult.data.footer_email || "",
          footer_phone: settingsResult.data.footer_phone || "",
          footer_address: settingsResult.data.footer_address || "",
          footer_copyright: settingsResult.data.footer_copyright || "© 2025 Pragati Prime. All rights reserved."
        });
        // Load banner images
        const banners = settingsResult.data.banner_images || [];
        if (Array.isArray(banners) && banners.length > 0) {
          // Handle both old string format and new object format
          const processedBanners = banners.map(banner => {
            if (typeof banner === 'string') {
              // Old format: just image URL string
              return {
                image: banner,
                titleLine1: '',
                titleLine2: ''
              };
            } else {
              // New format: object with image, titleLine1, titleLine2
              return {
                image: banner.image || banner,
                titleLine1: banner.titleLine1 || '',
                titleLine2: banner.titleLine2 || ''
              };
            }
          });
          setBannerImages(processedBanners);
        } else {
          setBannerImages([]);
        }

        // Load banner texts
        const bannerTextsData = settingsResult.data.banner_texts || [];
        if (Array.isArray(bannerTextsData) && bannerTextsData.length > 0) {
          setBannerTexts(bannerTextsData);
        }

        // Load about page content
        if (settingsResult.data) {
          setAboutContent({
            about_vision_title: settingsResult.data.about_vision_title ?? "Vision for Rural Girls & Women",
            about_vision_description: settingsResult.data.about_vision_description ?? "",
            about_team_image_url: settingsResult.data.about_team_image_url ?? "",
            about_vision_image_url: settingsResult.data.about_vision_image_url ?? "",
            about_us_paragraph1: settingsResult.data.about_us_paragraph1 ?? "",
            about_us_paragraph2: settingsResult.data.about_us_paragraph2 ?? "",
            impact_areas: settingsResult.data.impact_areas ?? [],
            our_approach_paragraph: settingsResult.data.our_approach_paragraph ?? "",
            why_pragati_paragraphs: settingsResult.data.why_pragati_paragraphs ?? [],
            mission_paragraphs: settingsResult.data.mission_paragraphs ?? [],
            child_initiatives_paragraph: settingsResult.data.child_initiatives_paragraph ?? "",
            women_empowerment_vision: settingsResult.data.women_empowerment_vision ?? "",
            protection_initiatives: settingsResult.data.protection_initiatives ?? "",
            cta_join_mission: settingsResult.data.cta_join_mission ?? "",
            what_we_do_paragraphs: settingsResult.data.what_we_do_paragraphs ?? []
          });

          // Load volunteer content from site_settings (already migrated)
          const { data: volunteerData } = await supabase
            .from("site_settings")
            .select("volunteer_info, volunteer_opportunities")
            .limit(1)
            .maybeSingle();

          if (volunteerData) {
            setVolunteerContent({
              volunteer_info: volunteerData.volunteer_info ?? {
                paragraph1: "",
                paragraph2: ""
              },
              volunteer_opportunities: volunteerData.volunteer_opportunities ?? []
            });
          }

          // Load internship content and career positions from team_page_content table
          const { data: teamContent } = await supabase
            .from("team_page_content")
            .select("*")
            .eq("section", "content")
            .single();

          if (teamContent) {
            setInternshipContent({
              internship_info: teamContent.internship_info ?? {
                paragraph1: "",
                paragraph2: ""
              },
              internship_opportunities: teamContent.internship_opportunities ?? []
            });
            setCareerPositions(teamContent.career_positions ?? []);
          }

          // Load recent updates and mission texts from site_settings
          if (settingsResult.data) {
            setRecentUpdates(settingsResult.data.recent_updates ?? []);
            setMissionTexts(settingsResult.data.mission_texts ?? []);
          }

          // Load page banner images
          setPageBanners({
            about_page_banner_image_url: settingsResult.data.about_page_banner_image_url ?? "",
            team_page_banner_image_url: settingsResult.data.team_page_banner_image_url ?? "",
            articles_page_banner_image_url: settingsResult.data.articles_page_banner_image_url ?? ""
          });
          
        }
      }
      setFooterLinks(linksResult.data || []);
      setSocialIcons(iconsResult.data || []);
      setImpactStories(storiesResult.data || []);
      setFocusArea(focusAreaResult.data || null);
      setFocusArea(focusAreaResult.data || null);
      setImpactStories(storiesResult.data || []);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("logo")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Logo upload failed:", uploadError);
        alert("Logo upload failed. Please try again.");
        setUploadingLogo(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("logo")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setSite({ ...site, logo_url: urlData.publicUrl });
        alert("Logo uploaded successfully! Click 'Save Settings' to save.");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function saveSiteSettings() {
    setSaving(true);
    try {
      await supabase.from("site_settings").upsert({
        ...site,
        banner_images: bannerImages,
        banner_texts: bannerTexts,
        about_vision_title: aboutContent.about_vision_title,
        about_vision_description: aboutContent.about_vision_description,
        about_team_image_url: aboutContent.about_team_image_url,
        about_vision_image_url: aboutContent.about_vision_image_url,
        about_us_paragraph1: aboutContent.about_us_paragraph1,
        about_us_paragraph2: aboutContent.about_us_paragraph2,
        impact_areas: aboutContent.impact_areas,
        our_approach_paragraph: aboutContent.our_approach_paragraph,
        why_pragati_paragraphs: aboutContent.why_pragati_paragraphs,
        mission_paragraphs: aboutContent.mission_paragraphs,
        child_initiatives_paragraph: aboutContent.child_initiatives_paragraph,
        women_empowerment_vision: aboutContent.women_empowerment_vision,
        protection_initiatives: aboutContent.protection_initiatives,
        cta_join_mission: aboutContent.cta_join_mission,
        what_we_do_paragraphs: aboutContent.what_we_do_paragraphs,
        volunteer_info: volunteerContent.volunteer_info,
        volunteer_opportunities: volunteerContent.volunteer_opportunities,
        recent_updates: recentUpdates,
        mission_texts: missionTexts,
        ...pageBanners
      }, { onConflict: "id" });

      // Save internship content and career positions to team_page_content table
      await supabase.from("team_page_content").upsert({
        section: "content",
        internship_info: internshipContent.internship_info,
        internship_opportunities: internshipContent.internship_opportunities,
        career_positions: careerPositions
      }, { onConflict: "section" });
      alert("Settings saved successfully!");
      loadSettings();
      // Notify parent component to refresh site settings (for logo/title update)
      if (onSettingsSaved) {
        onSettingsSaved();
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePageBannerUpload(e, pageType) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    setUploadingAboutImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `page-banner-${pageType}-${Date.now()}.${fileExt}`;
      const filePath = `page-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Page banner upload failed:", uploadError);
        let errorMessage = "Image upload failed. ";
        
        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage += "The 'images' bucket doesn't exist. Please create it in Supabase Storage first.";
        } else if (uploadError.message?.includes('new row violates row-level security')) {
          errorMessage += "Permission denied. Please run the storage policy migration in Supabase SQL Editor.";
        } else {
          errorMessage += uploadError.message || "Please try again.";
        }
        
        alert(errorMessage);
        setUploadingAboutImage(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        if (pageType === "about") {
          setPageBanners({ ...pageBanners, about_page_banner_image_url: urlData.publicUrl });
        } else if (pageType === "team") {
          setPageBanners({ ...pageBanners, team_page_banner_image_url: urlData.publicUrl });
        } else if (pageType === "articles") {
          setPageBanners({ ...pageBanners, articles_page_banner_image_url: urlData.publicUrl });
        }
        alert("Banner image uploaded successfully! Click 'Save Page Banner Images' to save.");
      } else {
        alert("Image uploaded but could not get public URL. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading page banner:", error);
      alert(`Failed to upload image: ${error.message || "Please try again."}`);
    } finally {
      setUploadingAboutImage(false);
      e.target.value = '';
    }
  }

  async function handleAboutImageUpload(e, imageType) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    setUploadingAboutImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `about-${imageType}-${Date.now()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("About image upload failed:", uploadError);
        let errorMessage = "Image upload failed. ";
        
        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage += "The 'images' bucket doesn't exist. Please create it in Supabase Storage first.";
        } else if (uploadError.message?.includes('new row violates row-level security')) {
          errorMessage += "Permission denied. Please run the storage policy migration in Supabase SQL Editor.";
        } else if (uploadError.message?.includes('duplicate')) {
          errorMessage += "An image with this name already exists. Please try again.";
        } else {
          errorMessage += uploadError.message || "Please try again.";
        }
        
        alert(errorMessage);
        setUploadingAboutImage(false);
        return;
      }

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        if (imageType === "team") {
          setAboutContent({ ...aboutContent, about_team_image_url: urlData.publicUrl });
        } else if (imageType === "vision") {
          setAboutContent({ ...aboutContent, about_vision_image_url: urlData.publicUrl });
        }
        alert("Image uploaded successfully! Click 'Save About Page Content' to save.");
      } else {
        alert("Image uploaded but could not get public URL. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading about image:", error);
      alert(`Failed to upload image: ${error.message || "Please try again."}`);
    } finally {
      setUploadingAboutImage(false);
      // Reset the file input so the same file can be selected again if needed
      e.target.value = '';
    }
  }

  async function handleBannerUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    setUploadingBanner(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Banner upload failed:", uploadError);
        let errorMessage = "Banner upload failed. ";
        
        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage += "The 'images' bucket doesn't exist. Please create it in Supabase Storage first.";
        } else if (uploadError.message?.includes('new row violates row-level security')) {
          errorMessage += "Permission denied. Please run the storage policy migration in Supabase SQL Editor.";
        } else {
          errorMessage += uploadError.message || "Please try again.";
        }
        
        alert(errorMessage);
        setUploadingBanner(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        const newBanner = {
          image: urlData.publicUrl,
          titleLine1: '',
          titleLine2: ''
        };
        setBannerImages([...bannerImages, newBanner]);
        alert("Banner uploaded successfully! You can now add title text for this banner. Click 'Save Home Page Content' to save.");
      } else {
        alert("Banner uploaded but could not get public URL. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert(`Failed to upload banner: ${error.message || "Please try again."}`);
    } finally {
      setUploadingBanner(false);
    }
  }

  function removeBannerImage(index) {
    if (confirm("Are you sure you want to remove this banner image?")) {
      const newBanners = bannerImages.filter((_, i) => i !== index);
      setBannerImages(newBanners);
    }
  }

  function moveBannerImage(index, direction) {
    const newBanners = [...bannerImages];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newBanners.length) {
      [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
      setBannerImages(newBanners);
    }
  }

  function updateBannerText(index, field, value) {
    const newBanners = [...bannerImages];
    if (newBanners[index]) {
      newBanners[index] = { ...newBanners[index], [field]: value };
      setBannerImages(newBanners);
    }
  }

  async function saveFooterLink(link) {
    try {
      if (link.id) {
        await supabase.from("footer_links").update(link).eq("id", link.id);
      } else {
        await supabase.from("footer_links").insert(link);
      }
      loadSettings();
    } catch (error) {
      console.error("Error saving footer link:", error);
      alert("Failed to save footer link.");
    }
  }

  async function deleteFooterLink(id) {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      await supabase.from("footer_links").delete().eq("id", id);
      loadSettings();
    } catch (error) {
      console.error("Error deleting footer link:", error);
      alert("Failed to delete footer link.");
    }
  }

  async function saveSocialIcon(icon) {
    try {
      if (icon.id) {
        await supabase.from("footer_social_icons").update(icon).eq("id", icon.id);
      } else {
        await supabase.from("footer_social_icons").insert(icon);
      }
      loadSettings();
    } catch (error) {
      console.error("Error saving social icon:", error);
      alert("Failed to save social icon.");
    }
  }

  async function deleteSocialIcon(id) {
    if (!confirm("Are you sure you want to delete this social icon?")) return;
    try {
      await supabase.from("footer_social_icons").delete().eq("id", id);
      loadSettings();
    } catch (error) {
      console.error("Error deleting social icon:", error);
      alert("Failed to delete social icon.");
    }
  }


  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <h1 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Site Content Management</h1>
      
      {/* Responsive Tabs Navigation */}
      <div className="relative">
        {/* Mobile Dropdown */}
        <div className="md:hidden mobile-menu-container">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {tabs.find(tab => tab.id === activeTab)?.label || "Select Tab"}
            <ChevronDown className={`w-4 h-4 transition-transform ${showMobileMenu ? "rotate-180" : ""}`} />
          </button>

          {showMobileMenu && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    activeTab === tab.id ? "bg-primary/10 text-primary font-medium" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Tabs - Scrollable */}
        <div className="hidden md:block overflow-x-auto -mx-2 lg:mx-0">
          <div className="flex gap-1 lg:gap-2 border-b min-w-max lg:min-w-0 px-2 lg:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            {/* Basic Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <Label htmlFor="site-title" className="text-sm sm:text-base">Organization Name (appears after logo in navbar)</Label>
                <Input
                  id="site-title"
                  value={site.title}
                  onChange={(e) => setSite({ ...site, title: e.target.value })}
                  type="text"
                  placeholder="Pragati Prime"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">This text will appear next to the logo in the navbar</p>
              </div>
              <div>
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  value={site.contact_email}
                  onChange={(e) => setSite({ ...site, contact_email: e.target.value })}
                  type="email"
                  className="mt-1"
                />
              </div>
            </div>
            {/* Logo Upload Section */}
            <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
              <Label htmlFor="logo-upload" className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">Logo Image</Label>
              <div className="space-y-3">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingLogo}
                  className="w-full sm:w-auto"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingLogo ? "Uploading..." : site.logo_url ? "Replace Logo" : "Upload Logo"}
                </Button>
                {site.logo_url && (
                  <p className="text-xs text-green-600">✓ Logo uploaded. Click &apos;Save Settings&apos; to apply.</p>
                )}
                <p className="text-xs text-muted-foreground">Upload a logo image that will appear in the navbar</p>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
              <Button
                onClick={saveSiteSettings}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Home Page Tab */}
      {activeTab === "home" && (
        <Card>
          <CardHeader className="px-3 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Home Page Content</CardTitle>
              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                View Homepage
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="hero-line1" className="text-sm sm:text-base">Hero Title Line 1</Label>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Hero Section</span>
                </div>
                <Input
                  id="hero-line1"
                  value={site.hero_title_line1 || ""}
                  onChange={(e) => setSite({ ...site, hero_title_line1: e.target.value })}
                  type="text"
                  className="mt-1 text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  First line of the main heading in the hero section
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="hero-line2" className="text-sm sm:text-base">Hero Title Line 2</Label>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Hero Section</span>
                </div>
                <Input
                  id="hero-line2"
                  value={site.hero_title_line2 || ""}
                  onChange={(e) => setSite({ ...site, hero_title_line2: e.target.value })}
                  type="text"
                  className="mt-1 text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Second line of the main heading in the hero section
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="mission" className="text-sm sm:text-base">Mission Statement</Label>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">Mission Section</span>
                </div>
                <textarea
                  id="mission"
                  value={site.mission_statement || ""}
                  onChange={(e) => setSite({ ...site, mission_statement: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Displayed in the &quot;Our Mission&quot; section on the homepage
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="tagline" className="text-sm sm:text-base">Tagline</Label>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">Mission Section</span>
                </div>
                <Input
                  id="tagline"
                  value={site.tagline || ""}
                  onChange={(e) => setSite({ ...site, tagline: e.target.value })}
                  type="text"
                  className="mt-1 text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Shown below the mission statement in the &quot;Our Mission&quot; section
                </p>
              </div>
            </div>

            {/* Banner Images Section */}
            <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
              <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">Banner Images</Label>
              <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
                Upload banner images for the hero section slider. Images will be displayed in the order shown below.
              </p>
              
              <div className="mb-3 sm:mb-4">
                <input
                  type="file"
                  id="banner-upload"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploadingBanner}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingBanner}
                  className="w-full sm:w-auto text-sm"
                  onClick={() => document.getElementById('banner-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingBanner ? "Uploading..." : "Add Banner Image"}
                </Button>
              </div>

              {bannerImages.length > 0 && (
                <div className="space-y-4 mt-3 sm:mt-4">
                  {bannerImages.map((banner, index) => (
                    <Card key={index} className="p-3 sm:p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Banner Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-full lg:w-32 h-24 rounded overflow-hidden border">
                            <Image
                              src={banner.image || banner}
                              alt={`Banner ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 128px"
                            />
                          </div>
                        </div>

                        {/* Banner Text Fields */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Banner {index + 1}</h4>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => moveBannerImage(index, -1)}
                                disabled={index === 0}
                                className="px-2"
                              >
                                ↑
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => moveBannerImage(index, 1)}
                                disabled={index === bannerImages.length - 1}
                                className="px-2"
                              >
                                ↓
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeBannerImage(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`banner-title1-${index}`} className="text-sm">Title Line 1</Label>
                              <Input
                                id={`banner-title1-${index}`}
                                value={banner.titleLine1 || ''}
                                onChange={(e) => updateBannerText(index, 'titleLine1', e.target.value)}
                                placeholder="Enter first line of banner text"
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`banner-title2-${index}`} className="text-sm">Title Line 2</Label>
                              <Input
                                id={`banner-title2-${index}`}
                                value={banner.titleLine2 || ''}
                                onChange={(e) => updateBannerText(index, 'titleLine2', e.target.value)}
                                placeholder="Enter second line of banner text"
                                className="mt-1 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {bannerImages.length === 0 && (
                <p className="text-sm text-gray-500 italic">No banner images uploaded. Default images will be used.</p>
              )}
            </div>


          </CardContent>
        </Card>
      )}

      {/* Footer Tab */}
      {activeTab === "footer" && (
        <Card>
          <CardHeader className="px-3 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Footer Text Content</CardTitle>
              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                View Footer
              </a>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
            {/* Footer Description - Full Width */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="footer-desc" className="text-sm sm:text-base">Footer Description</Label>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Footer</span>
              </div>
              <textarea
                id="footer-desc"
                value={site.footer_description || ""}
                onChange={(e) => setSite({ ...site, footer_description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Description text shown at the top of the footer on all pages
              </p>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="footer-email" className="text-sm sm:text-base">Footer Email</Label>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Footer</span>
                </div>
                <Input
                  id="footer-email"
                  value={site.footer_email || ""}
                  onChange={(e) => setSite({ ...site, footer_email: e.target.value })}
                  type="email"
                  className="mt-1 text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Contact email displayed in the footer
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="footer-phone" className="text-sm sm:text-base">Footer Phone</Label>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Footer</span>
                </div>
                <Input
                  id="footer-phone"
                  value={site.footer_phone || ""}
                  onChange={(e) => setSite({ ...site, footer_phone: e.target.value })}
                  type="tel"
                  className="mt-1 text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Contact phone number displayed in the footer
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="footer-address" className="text-sm sm:text-base">Footer Address</Label>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Footer</span>
                </div>
                <textarea
                  id="footer-address"
                  value={site.footer_address || ""}
                  onChange={(e) => setSite({ ...site, footer_address: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                />
              </div>
              <div>
                <Label htmlFor="footer-copyright" className="text-sm sm:text-base">Copyright Text</Label>
                <Input
                  id="footer-copyright"
                  value={site.footer_copyright || ""}
                  onChange={(e) => setSite({ ...site, footer_copyright: e.target.value })}
                  type="text"
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Footer Links */}
            <Card className="mt-6">
              <CardHeader className="px-3 sm:px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">Footer Links</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      const newLink = {
                        section: "quick_links",
                        label: "New Link",
                        href: "#",
                        display_order: footerLinks.length
                      };
                      saveFooterLink(newLink);
                    }}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {footerLinks.map((link) => (
                    <FooterLinkEditor
                      key={link.id}
                      link={link}
                      onSave={saveFooterLink}
                      onDelete={deleteFooterLink}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media Icons */}
            <Card className="mt-6">
              <CardHeader className="px-3 sm:px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base sm:text-lg">Social Media Icons</CardTitle>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Footer</span>
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    View Footer
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Social media icons displayed in the footer on all pages
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    const newIcon = {
                      platform: "facebook",
                      url: "#",
                      icon_name: "facebook",
                      display_order: socialIcons.length
                    };
                    saveSocialIcon(newIcon);
                  }}
                  className="w-full sm:w-auto text-xs sm:text-sm mt-2"
                >
                  Add Icon
                </Button>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {socialIcons.map((icon) => (
                    <SocialIconEditor
                      key={icon.id}
                      icon={icon}
                      onSave={saveSocialIcon}
                      onDelete={deleteSocialIcon}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
              <Button
                onClick={saveSiteSettings}
                disabled={saving}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {saving ? "Saving..." : "Save Footer Content"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}



      {/* Mission Texts Section */}
      {activeTab === "home" && (
        <Card>
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Mission Texts</CardTitle>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Dynamic mission text paragraphs displayed in the Our Mission section on the home page.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-6 pt-4 sm:pt-6">
            {missionTexts.map((text, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mission Text {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newTexts = missionTexts.filter((_, i) => i !== index);
                      setMissionTexts(newTexts);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <textarea
                  value={text || ''}
                  onChange={(e) => {
                    const newTexts = [...missionTexts];
                    newTexts[index] = e.target.value;
                    setMissionTexts(newTexts);
                  }}
                  rows={3}
                  placeholder="Enter mission text..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                />
                
              </div>
              
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMissionTexts([...missionTexts, '']);
              }}
              className="w-full flex items-center gap-2 h-8"
            >
              <Plus className="w-3 h-3" />
              Add Mission Text
            </Button>
          </CardContent>
          
        </Card>
        

      )}

      {/* Recent Updates Section */}
      {activeTab === "home" && (
        <Card>
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Recent Updates</CardTitle>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Recent updates displayed on the home page with heading and description.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-6 pt-4 sm:pt-6">
            {recentUpdates.map((update, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Update {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newUpdates = recentUpdates.filter((_, i) => i !== index);
                      setRecentUpdates(newUpdates);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`update-heading-${index}`} className="text-sm">
                    Heading
                  </Label>
                  <Input
                    id={`update-heading-${index}`}
                    value={update.heading || ''}
                    onChange={(e) => {
                      const newUpdates = [...recentUpdates];
                      newUpdates[index] = { ...newUpdates[index], heading: e.target.value };
                      setRecentUpdates(newUpdates);
                    }}
                    placeholder="e.g., New Health Camp Initiative"
                    className="mt-1 w-full text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor={`update-description-${index}`} className="text-sm">
                    Description
                  </Label>
                  <textarea
                    id={`update-description-${index}`}
                    value={update.description || ''}
                    onChange={(e) => {
                      const newUpdates = [...recentUpdates];
                      newUpdates[index] = { ...newUpdates[index], description: e.target.value };
                      setRecentUpdates(newUpdates);
                    }}
                    rows={3}
                    placeholder="Describe the recent update..."
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRecentUpdates([...recentUpdates, {
                  heading: '',
                  description: ''
                }]);
              }}
              className="w-full flex items-center gap-2 h-8"
            >
              <Plus className="w-3 h-3" />
              Add New Update
            </Button>
          </CardContent>
          <Button
              onClick={saveSiteSettings}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Save Home Page Content"}
            </Button>
        </Card>
      )}

      {/* Impact Stories Section */}
      {activeTab === "home" && (
        <Card>
          <CardHeader className="px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">Manage Impact Stories</CardTitle>
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">Home Page</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Manage the 3 Key Impact Stories displayed on the homepage. Each story requires a title, main title, description, and image.
            </p>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
            <ImpactStoriesManager
              stories={impactStories}
              refresh={loadSettings}
              supabase={supabase}
            />
          </CardContent>
        </Card>
      )}

      {/* What We Do Section */}
      {activeTab === "home" && (
        <Card>
          <CardHeader className="px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">What We Do Content</CardTitle>
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">Home Page</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Manage the paragraphs for the &ldquo;What We Do&rdquo; section on the homepage. Each paragraph will be displayed as a bullet point.
            </p>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
            <DynamicContentManager
              title="What We Do Paragraphs"
              description="Add paragraphs that will be displayed as bullet points in the What We Do section on the homepage."
              items={Array.isArray(aboutContent.what_we_do_paragraphs) ? aboutContent.what_we_do_paragraphs : []}
              onChange={(items) => setAboutContent({ ...aboutContent, what_we_do_paragraphs: items })}
              itemTemplate={{ content: "" }}
              placeholder={{ content: 'Enter a paragraph for the What We Do section...' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Save Home Page Content Button */}
      {activeTab === "home" && (
        <Card>
          <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
            <Button
              onClick={saveSiteSettings}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Save Home Page Content"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* About Page Tab */}
      {activeTab === "about" && (
        <Card>
          <CardHeader className="px-3 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">About Page Content</CardTitle>
              <a
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                View About Page
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Vision Section */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="about-vision-title" className="text-sm sm:text-base">Vision Title</Label>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">Vision Section</span>
                </div>
                <Input
                  id="about-vision-title"
                  value={aboutContent.about_vision_title || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_vision_title: e.target.value })}
                  className="mt-1 text-sm sm:text-base"
                  placeholder="Vision for Rural Girls & Women"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Title displayed in the Vision section
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="about-vision-description" className="text-sm sm:text-base">Vision Description</Label>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">Vision Section</span>
                </div>
                <textarea
                  id="about-vision-description"
                  value={aboutContent.about_vision_description || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_vision_description: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="A Western Uttar Pradesh and Delhi NCR where every girl is healthy, educated, and economically confident—and every woman can claim government entitlements, livelihoods, and her own voice."
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Description text for the Vision section
                </p>
              </div>

              {/* About Us Section */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="about-us-p1" className="text-sm sm:text-base">About Us Paragraph 1</Label>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">About Us Section</span>
                </div>
                <textarea
                  id="about-us-p1"
                  value={aboutContent.about_us_paragraph1 || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_us_paragraph1: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="Pragati Prime – Meri Beti Mera Abhiman Mahila Sangathan (Regd.) is a New Delhi-based NGO dedicated to empowering rural women and adolescent girls by promoting health, education, and economic independence."
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  First paragraph in the About Us section
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="about-us-p2" className="text-sm sm:text-base">About Us Paragraph 2</Label>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">About Us Section</span>
                </div>
                <textarea
                  id="about-us-p2"
                  value={aboutContent.about_us_paragraph2 || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_us_paragraph2: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="Our mission is to uplift women from rural communities, especially in Western Uttar Pradesh and Delhi, by connecting them with government welfare schemes, creating awareness about health, and providing opportunities for skill development and financial growth."
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Second paragraph in the About Us section
                </p>
              </div>

              {/* Our Approach Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="our-approach" className="text-sm sm:text-base">Our Approach Paragraph</Label>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Our Approach Section</span>
                </div>
                <textarea
                  id="our-approach"
                  value={aboutContent.our_approach_paragraph || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, our_approach_paragraph: e.target.value })}
                  rows={5}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="Our methodology combines community engagement, data-driven solutions, and sustainable practices to create lasting impact."
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Main paragraph displayed in the Our Approach section
                </p>
              </div>

              {/* Images Section */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm sm:text-base">About Us Section Image</Label>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Images</span>
                </div>
                <div className="mt-2 space-y-2">
                  {aboutContent.about_team_image_url && (
                    <div className="relative w-full h-24 rounded-md overflow-hidden border border-input">
                      <Image
                        src={aboutContent.about_team_image_url}
                        alt="Team Image Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAboutImageUpload(e, "team")}
                        className="hidden"
                        disabled={uploadingAboutImage}
                        id="team-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingAboutImage}
                        className="flex items-center gap-2 w-full text-sm"
                        onClick={() => document.getElementById('team-image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAboutImage ? "Uploading..." : aboutContent.about_team_image_url ? "Change Image" : "Upload Image"}
                      </Button>
                    </label>
                    <Input
                      value={aboutContent.about_team_image_url || ""}
                      onChange={(e) => setAboutContent({ ...aboutContent, about_team_image_url: e.target.value })}
                      placeholder="Or enter image URL directly"
                      className="w-full text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Image displayed in the About Us section
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm sm:text-base">Vision Section Image</Label>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Images</span>
                </div>
                <div className="mt-2 space-y-2">
                  {aboutContent.about_vision_image_url && (
                    <div className="relative w-full h-24 rounded-md overflow-hidden border border-input">
                      <Image
                        src={aboutContent.about_vision_image_url}
                        alt="Vision Image Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAboutImageUpload(e, "vision")}
                        className="hidden"
                        disabled={uploadingAboutImage}
                        id="vision-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingAboutImage}
                        className="flex items-center gap-2 w-full text-sm"
                        onClick={() => document.getElementById('vision-image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAboutImage ? "Uploading..." : aboutContent.about_vision_image_url ? "Change Image" : "Upload Image"}
                      </Button>
                    </label>
                    <Input
                      value={aboutContent.about_vision_image_url || ""}
                      onChange={(e) => setAboutContent({ ...aboutContent, about_vision_image_url: e.target.value })}
                      placeholder="Or enter image URL directly"
                      className="w-full text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Image displayed in the Vision section
                </p>
              </div>
            </div>

            {/* Dynamic Content Sections */}
            <div className="space-y-6">
              {/* Mission Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-sm sm:text-base font-medium">Mission Section</h4>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">About Page</span>
                </div>
                <DynamicContentManager
                  title="Mission Paragraphs"
                  description="Add mission paragraphs that will be displayed in the Mission section on the About page."
                  items={Array.isArray(aboutContent.mission_paragraphs) ? aboutContent.mission_paragraphs : []}
                  onChange={(items) => setAboutContent({ ...aboutContent, mission_paragraphs: items })}
                  itemTemplate={{ content: "" }}
                  placeholder={{ content: "Mission paragraph" }}
                />
              </div>

              {/* Impact Areas Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-sm sm:text-base font-medium">Impact Areas Section</h4>
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">About Page</span>
                </div>
                <DynamicContentManager
                  title="Impact Areas Cards"
                  description="Dynamic cards displayed in the Impact Areas section. Each item will appear as a card with a title and content."
                  items={aboutContent.impact_areas || []}
                  onChange={(items) => setAboutContent({ ...aboutContent, impact_areas: items })}
                  itemTemplate={{ title: '', content: '' }}
                  placeholder={{ title: 'Card Title (e.g., Education)', content: 'Card Content' }}
                />
              </div>

              {/* Why Pragati Prime Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-sm sm:text-base font-medium">Why Pragati Prime Section</h4>
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">About Page</span>
                </div>
                <DynamicContentManager
                  title="Why Pragati Prime Cards"
                  description="Dynamic cards displayed in the Why Pragati Prime section. Each item will appear as a card with a title and content."
                  items={aboutContent.why_pragati_paragraphs || []}
                  onChange={(items) => setAboutContent({ ...aboutContent, why_pragati_paragraphs: items })}
                  itemTemplate={{ title: '', content: '' }}
                  placeholder={{ title: 'Card Title (e.g., Proven Track Record)', content: 'Card Content' }}
                />
              </div>
            </div>
            <Button
              onClick={saveSiteSettings}
              disabled={saving}
              className="w-full sm:w-auto text-sm sm:text-base mt-4"
            >
              {saving ? "Saving..." : "Save About Page Content"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Team Page Tab */}
      {activeTab === "team" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold">Team Page Content</h3>
            <div className="flex gap-2">
              <a
                href="/team"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                View Team Page
              </a>
            </div>
          </div>

          {/* Volunteer Section - Combined */}
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Volunteer Section</CardTitle>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Volunteer information and opportunities displayed on the team page
              </p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Volunteer Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                    Volunteer Information
                  </h4>
                  <div>
                    <Label htmlFor="volunteer-para1" className="text-sm">First Paragraph</Label>
                    <textarea
                      id="volunteer-para1"
                      value={volunteerContent.volunteer_info.paragraph1 || ""}
                      onChange={(e) => setVolunteerContent({
                        ...volunteerContent,
                        volunteer_info: {
                          ...volunteerContent.volunteer_info,
                          paragraph1: e.target.value
                        }
                      })}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                      placeholder="Enter volunteer information paragraph 1..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="volunteer-para2" className="text-sm">Second Paragraph</Label>
                    <textarea
                      id="volunteer-para2"
                      value={volunteerContent.volunteer_info.paragraph2 || ""}
                      onChange={(e) => setVolunteerContent({
                        ...volunteerContent,
                        volunteer_info: {
                          ...volunteerContent.volunteer_info,
                          paragraph2: e.target.value
                        }
                      })}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                      placeholder="Enter volunteer information paragraph 2..."
                    />
                  </div>
                </div>

                {/* Right Side - Volunteer Opportunities */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                    Volunteer Opportunities
                  </h4>
                  <div className="space-y-3">
                    {volunteerContent.volunteer_opportunities && volunteerContent.volunteer_opportunities.map((opportunity, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Opportunity {index + 1}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOpportunities = volunteerContent.volunteer_opportunities.filter((_, i) => i !== index);
                              setVolunteerContent({
                                ...volunteerContent,
                                volunteer_opportunities: newOpportunities
                              });
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <textarea
                          value={opportunity.content || ''}
                          onChange={(e) => {
                            const newOpportunities = [...volunteerContent.volunteer_opportunities];
                            newOpportunities[index] = { content: e.target.value };
                            setVolunteerContent({
                              ...volunteerContent,
                              volunteer_opportunities: newOpportunities
                            });
                          }}
                          rows={2}
                          placeholder="Enter volunteer opportunity..."
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVolunteerContent({
                          ...volunteerContent,
                          volunteer_opportunities: [...(volunteerContent.volunteer_opportunities || []), { content: '' }]
                        });
                      }}
                      className="w-full flex items-center gap-2 h-8"
                    >
                      <Plus className="w-3 h-3" />
                      Add Opportunity
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internship Section - Combined */}
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Internship Program Section</CardTitle>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Internship information and opportunities displayed on the team page
              </p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Internship Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                    Internship Information
                  </h4>
                  <div>
                    <Label htmlFor="internship-para1" className="text-sm">First Paragraph</Label>
                    <textarea
                      id="internship-para1"
                      value={internshipContent.internship_info.paragraph1 || ""}
                      onChange={(e) => setInternshipContent({
                        ...internshipContent,
                        internship_info: {
                          ...internshipContent.internship_info,
                          paragraph1: e.target.value
                        }
                      })}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                      placeholder="Enter internship program description paragraph 1..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="internship-para2" className="text-sm">Second Paragraph</Label>
                    <textarea
                      id="internship-para2"
                      value={internshipContent.internship_info.paragraph2 || ""}
                      onChange={(e) => setInternshipContent({
                        ...internshipContent,
                        internship_info: {
                          ...internshipContent.internship_info,
                          paragraph2: e.target.value
                        }
                      })}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                      placeholder="Enter internship program description paragraph 2..."
                    />
                  </div>
                </div>

                {/* Right Side - Internship Opportunities */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                    Internship Opportunities
                  </h4>
                  <div className="space-y-3">
                    {internshipContent.internship_opportunities && internshipContent.internship_opportunities.map((opportunity, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Opportunity {index + 1}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOpportunities = internshipContent.internship_opportunities.filter((_, i) => i !== index);
                              setInternshipContent({
                                ...internshipContent,
                                internship_opportunities: newOpportunities
                              });
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <textarea
                          value={opportunity.content || ''}
                          onChange={(e) => {
                            const newOpportunities = [...internshipContent.internship_opportunities];
                            newOpportunities[index] = { content: e.target.value };
                            setInternshipContent({
                              ...internshipContent,
                              internship_opportunities: newOpportunities
                            });
                          }}
                          rows={2}
                          placeholder="Enter internship opportunity..."
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInternshipContent({
                          ...internshipContent,
                          internship_opportunities: [...(internshipContent.internship_opportunities || []), { content: '' }]
                        });
                      }}
                      className="w-full flex items-center gap-2 h-8"
                    >
                      <Plus className="w-3 h-3" />
                      Add Opportunity
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Positions Section */}
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Career Positions</CardTitle>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Open positions displayed in the Careers section on the team page. Each position includes title, type (Remote/Field-based/Hybrid), and description.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 px-3 sm:px-6 pt-4 sm:pt-6">
              {careerPositions.map((position, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Position {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPositions = careerPositions.filter((_, i) => i !== index);
                        setCareerPositions(newPositions);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`position-title-${index}`} className="text-sm">
                        Position Title
                      </Label>
                      <Input
                        id={`position-title-${index}`}
                        value={position.title || ''}
                        onChange={(e) => {
                          const newPositions = [...careerPositions];
                          newPositions[index] = { ...newPositions[index], title: e.target.value };
                          setCareerPositions(newPositions);
                        }}
                        placeholder="e.g., Program Manager"
                        className="mt-1 w-full text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`position-type-${index}`} className="text-sm">
                        Type
                      </Label>
                      <select
                        id={`position-type-${index}`}
                        value={position.type || 'Full-time • Remote'}
                        onChange={(e) => {
                          const newPositions = [...careerPositions];
                          newPositions[index] = { ...newPositions[index], type: e.target.value };
                          setCareerPositions(newPositions);
                        }}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                      >
                        <option value="Full-time • Remote">Full-time • Remote</option>
                        <option value="Full-time • Field-based">Full-time • Field-based</option>
                        <option value="Full-time • Hybrid">Full-time • Hybrid</option>
                        <option value="Part-time • Remote">Part-time • Remote</option>
                        <option value="Part-time • Field-based">Part-time • Field-based</option>
                        <option value="Part-time • Hybrid">Part-time • Hybrid</option>
                        <option value="Contract • Remote">Contract • Remote</option>
                        <option value="Contract • Field-based">Contract • Field-based</option>
                        <option value="Contract • Hybrid">Contract • Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`position-description-${index}`} className="text-sm">
                      Description
                    </Label>
                    <textarea
                      id={`position-description-${index}`}
                      value={position.description || ''}
                      onChange={(e) => {
                        const newPositions = [...careerPositions];
                        newPositions[index] = { ...newPositions[index], description: e.target.value };
                        setCareerPositions(newPositions);
                      }}
                      rows={3}
                      placeholder="Describe the role and responsibilities..."
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCareerPositions([...careerPositions, {
                    title: '',
                    type: 'Full-time • Remote',
                    description: ''
                  }]);
                }}
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Position
              </Button>
            </CardContent>
          </Card>


          <Button
            onClick={saveSiteSettings}
            disabled={saving}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save Team Page Content"}
          </Button>
        </div>
      )}

      {/* Page Banners Tab */}
      {activeTab === "page-banners" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold">Page Banner Images</h3>
            <div className="flex gap-2">
              <a 
                href="/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                About
              </a>
              <a 
                href="/team" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                Team
              </a>
              <a 
                href="/articles" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                Articles
              </a>
            </div>
          </div>
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Page Banner Images</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Background images for the hero sections of About Us, Team, and Articles pages
              </p>
            </CardHeader>
            <CardContent className="space-y-6 px-3 sm:px-6 pt-4 sm:pt-6">
              {/* About Us Page Banner */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm sm:text-base">About Us Page Banner</Label>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">About Page</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Background image for the hero section on the About Us page
                </p>
                <div className="mt-2 space-y-2">
                  {pageBanners.about_page_banner_image_url && (
                    <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={pageBanners.about_page_banner_image_url}
                        alt="About Us Banner Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePageBannerUpload(e, "about")}
                        className="hidden"
                        disabled={uploadingAboutImage}
                        id="about-banner-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingAboutImage}
                        className="flex items-center gap-2 w-full sm:w-auto text-sm"
                        onClick={() => document.getElementById('about-banner-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAboutImage ? "Uploading..." : pageBanners.about_page_banner_image_url ? "Change Banner" : "Upload About Us Banner"}
                      </Button>
                    </label>
                    <Input
                      value={pageBanners.about_page_banner_image_url || ""}
                      onChange={(e) => setPageBanners({ ...pageBanners, about_page_banner_image_url: e.target.value })}
                      placeholder="Or enter image URL directly"
                      className="w-full text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Team Page Banner */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm sm:text-base">Team Page Banner</Label>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">Team Page</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Background image for the hero section on the Team page
                </p>
                <div className="mt-2 space-y-2">
                  {pageBanners.team_page_banner_image_url && (
                    <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={pageBanners.team_page_banner_image_url}
                        alt="Team Page Banner Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePageBannerUpload(e, "team")}
                        className="hidden"
                        disabled={uploadingAboutImage}
                        id="team-banner-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingAboutImage}
                        className="flex items-center gap-2 w-full sm:w-auto text-sm"
                        onClick={() => document.getElementById('team-banner-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAboutImage ? "Uploading..." : pageBanners.team_page_banner_image_url ? "Change Banner" : "Upload Team Page Banner"}
                      </Button>
                    </label>
                    <Input
                      value={pageBanners.team_page_banner_image_url || ""}
                      onChange={(e) => setPageBanners({ ...pageBanners, team_page_banner_image_url: e.target.value })}
                      placeholder="Or enter image URL directly"
                      className="w-full text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Articles Page Banner */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm sm:text-base">Articles Page Banner</Label>
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">Articles Page</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Background image for the hero section on the Articles page
                </p>
                <div className="mt-2 space-y-2">
                  {pageBanners.articles_page_banner_image_url && (
                    <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={pageBanners.articles_page_banner_image_url}
                        alt="Articles Page Banner Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePageBannerUpload(e, "articles")}
                        className="hidden"
                        disabled={uploadingAboutImage}
                        id="articles-banner-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingAboutImage}
                        className="flex items-center gap-2 w-full sm:w-auto text-sm"
                        onClick={() => document.getElementById('articles-banner-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAboutImage ? "Uploading..." : pageBanners.articles_page_banner_image_url ? "Change Banner" : "Upload Articles Page Banner"}
                      </Button>
                    </label>
                    <Input
                      value={pageBanners.articles_page_banner_image_url || ""}
                      onChange={(e) => setPageBanners({ ...pageBanners, articles_page_banner_image_url: e.target.value })}
                      placeholder="Or enter image URL directly"
                      className="w-full text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={saveSiteSettings}
                disabled={saving}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {saving ? "Saving..." : "Save Page Banner Images"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Banner Texts Tab */}
      {activeTab === "banner-texts" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold">Page Banner Texts</h3>
            <div className="flex gap-2">
              <Button
                onClick={saveSiteSettings}
                disabled={saving}
                size="sm"
                className="text-xs sm:text-sm"
              >
                {saving ? "Saving..." : "Save Banner Texts"}
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg mb-4">Banner Text Management</CardTitle>
              <p className="text-sm text-muted-foreground mb-6">
                Manage the banner text (title, subtitle, and description) for each page.
              </p>

              <div className="space-y-6">
                {bannerTexts.map((bannerText, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <Label className="text-sm font-medium text-primary">
                          {bannerText.page.charAt(0).toUpperCase() + bannerText.page.slice(1)} Page
                        </Label>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`banner-title-${index}`} className="text-sm">
                            Title
                          </Label>
                          <Input
                            id={`banner-title-${index}`}
                            value={bannerText.title || ""}
                            onChange={(e) => {
                              const newBannerTexts = [...bannerTexts];
                              newBannerTexts[index] = { ...newBannerTexts[index], title: e.target.value };
                              setBannerTexts(newBannerTexts);
                            }}
                            placeholder="Enter banner title"
                            className="mt-1 w-full text-sm"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`banner-subtitle-${index}`} className="text-sm">
                            Subtitle
                          </Label>
                          <Input
                            id={`banner-subtitle-${index}`}
                            value={bannerText.subtitle || ""}
                            onChange={(e) => {
                              const newBannerTexts = [...bannerTexts];
                              newBannerTexts[index] = { ...newBannerTexts[index], subtitle: e.target.value };
                              setBannerTexts(newBannerTexts);
                            }}
                            placeholder="Enter banner subtitle"
                            className="mt-1 w-full text-sm"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`banner-description-${index}`} className="text-sm">
                            Description
                          </Label>
                          <textarea
                            id={`banner-description-${index}`}
                            value={bannerText.description || ""}
                            onChange={(e) => {
                              const newBannerTexts = [...bannerTexts];
                              newBannerTexts[index] = { ...newBannerTexts[index], description: e.target.value };
                              setBannerTexts(newBannerTexts);
                            }}
                            rows={3}
                            placeholder="Enter banner description"
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                onClick={saveSiteSettings}
                disabled={saving}
                className="w-full sm:w-auto text-sm sm:text-base mt-6"
              >
                {saving ? "Saving..." : "Save Banner Texts"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}



      {/* Focus Areas Tab */}
      {activeTab === "focus-areas" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold">We Provide Page</h3>
            <a 
              href="/vision" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              View We Provide Page
            </a>
          </div>
          
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg">Manage Focus Areas</CardTitle>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">We Provide Page</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Edit the Focus Areas section displayed on the &ldquo;We Provide&rdquo; page. Only 2 images total - paragraphs shown left of images, then 2 more paragraphs after images.
              </p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
              <FocusAreasManager
                area={focusArea}
                refresh={loadSettings}
                supabase={supabase}
              />
            </CardContent>
          </Card>

          {/* Content Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Child-Related Initiatives */}
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Child-Related Initiatives</CardTitle>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Add multiple paragraphs for the Child-Related Initiatives section on the We Provide page
                </p>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
                <DynamicContentManager
                  title="Child-Related Initiatives Paragraphs"
                  description="Add paragraphs that will be displayed in the Child-Related Initiatives section."
                  items={Array.isArray(aboutContent.child_initiatives_paragraph) ? aboutContent.child_initiatives_paragraph : []}
                  onChange={(items) => setAboutContent({ ...aboutContent, child_initiatives_paragraph: items })}
                  itemTemplate={{ content: "" }}
                  placeholder={{ content: 'Enter a paragraph for child-related initiatives...' }}
                />
              </CardContent>
            </Card>

            {/* Women Empowerment Vision */}
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Women Empowerment Vision</CardTitle>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Add multiple paragraphs for the Women Empowerment Vision section on the We Provide page
                </p>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
                <DynamicContentManager
                  title="Women Empowerment Vision Paragraphs"
                  description="Add paragraphs that will be displayed in the Women Empowerment Vision section."
                  items={Array.isArray(aboutContent.women_empowerment_vision) ? aboutContent.women_empowerment_vision : []}
                  onChange={(items) => setAboutContent({ ...aboutContent, women_empowerment_vision: items })}
                  itemTemplate={{ content: "" }}
                  placeholder={{ content: 'Enter a paragraph for women empowerment vision...' }}
                />
              </CardContent>
            </Card>

            {/* Protection Initiatives */}
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Protection Initiatives</CardTitle>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Add multiple paragraphs for the Protection Initiatives section on the We Provide page
                </p>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
                <DynamicContentManager
                  title="Protection Initiatives Paragraphs"
                  description="Add paragraphs that will be displayed in the Protection Initiatives section."
                  items={Array.isArray(aboutContent.protection_initiatives) ? aboutContent.protection_initiatives : []}
                  onChange={(items) => setAboutContent({ ...aboutContent, protection_initiatives: items })}
                  itemTemplate={{ content: "" }}
                  placeholder={{ content: 'Enter a paragraph for protection initiatives...' }}
                />
              </CardContent>
            </Card>

            {/* CTA to Join the Mission */}
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg">CTA to Join the Mission</CardTitle>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Add multiple paragraphs for the CTA to Join the Mission section on the We Provide page
                </p>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
                <DynamicContentManager
                  title="CTA to Join the Mission Paragraphs"
                  description="Add paragraphs that will be displayed in the CTA to Join the Mission section."
                  items={Array.isArray(aboutContent.cta_join_mission) ? aboutContent.cta_join_mission : []}
                  onChange={(items) => setAboutContent({ ...aboutContent, cta_join_mission: items })}
                  itemTemplate={{ content: "" }}
                  placeholder={{ content: 'Enter a paragraph for CTA to join the mission...' }}
                />
              </CardContent>
            </Card>
          </div>


          <Button
            onClick={saveSiteSettings}
            disabled={saving}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save We Provide Page Content"}
          </Button>
        </div>
      )}
    </div>
  );
}

