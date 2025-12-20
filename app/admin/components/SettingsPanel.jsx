"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ExternalLink, Info } from "lucide-react";
import FooterLinkEditor from "./shared/FooterLinkEditor";
import SocialIconEditor from "./shared/SocialIconEditor";

export default function SettingsPanel({ supabase, onSettingsSaved }) {
  const [activeTab, setActiveTab] = useState("general");
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
    about_mission_paragraph1: "",
    about_mission_paragraph2: "",
    about_mission_paragraph3: "",
    about_vision_title: "Vision for Rural Girls & Women",
    about_vision_description: "",
    about_team_image_url: "",
    about_vision_image_url: ""
  });
  const [pageBanners, setPageBanners] = useState({
    about_page_banner_image_url: "",
    team_page_banner_image_url: "",
    articles_page_banner_image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsResult, linksResult, iconsResult] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).maybeSingle(),
        supabase.from("footer_links").select("*").order("display_order", { ascending: true }),
        supabase.from("footer_social_icons").select("*").order("display_order", { ascending: true })
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
        setBannerImages(Array.isArray(banners) ? banners : []);
        
        // Load about page content
        if (settingsResult.data) {
          setAboutContent({
            about_mission_paragraph1: settingsResult.data.about_mission_paragraph1 ?? "",
            about_mission_paragraph2: settingsResult.data.about_mission_paragraph2 ?? "",
            about_mission_paragraph3: settingsResult.data.about_mission_paragraph3 ?? "",
            about_vision_title: settingsResult.data.about_vision_title ?? "Vision for Rural Girls & Women",
            about_vision_description: settingsResult.data.about_vision_description ?? "",
            about_team_image_url: settingsResult.data.about_team_image_url ?? "",
            about_vision_image_url: settingsResult.data.about_vision_image_url ?? ""
          });
          
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
        ...aboutContent,
        ...pageBanners
      }, { onConflict: "id" });
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
        setBannerImages([...bannerImages, urlData.publicUrl]);
        alert("Banner uploaded successfully! Click 'Save Home Page Content' to save.");
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
      <CardTitle className="text-base sm:text-lg mb-3 sm:mb-4">Site Content Management</CardTitle>
      
      {/* Tabs - Scrollable on mobile */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="flex gap-1 sm:gap-2 border-b min-w-max sm:min-w-0 px-2 sm:px-0">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === "general" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("home")}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === "home" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            Home Page
          </button>
          <button
            onClick={() => setActiveTab("footer")}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === "footer" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            Footer
          </button>
          <button
            onClick={() => setActiveTab("footer-links")}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === "footer-links" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            Footer Links
          </button>
          <button
            onClick={() => setActiveTab("social-media")}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === "social-media" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === "about" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            About Page
          </button>
          <button
            onClick={() => setActiveTab("page-banners")}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === "page-banners" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          >
            Page Banners
          </button>
      </div>
    </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <Card>
          <CardContent className="pt-4 sm:pt-6 space-y-4 px-3 sm:px-6">
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
            <div>
              <Label htmlFor="logo-upload">Logo Image</Label>
              <div className="mt-2">
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
                  <p className="text-xs text-green-600 mt-2">✓ Logo uploaded. Click &apos;Save Settings&apos; to apply.</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Upload a logo image that will appear in the navbar</p>
            </div>
            <Button
              onClick={saveSiteSettings}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Save Settings"}
            </Button>
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
          <CardContent className="pt-4 sm:pt-6 space-y-4 px-3 sm:px-6">
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
                <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                  {bannerImages.map((banner, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg">
                      <div className="relative w-full sm:w-20 h-32 sm:h-12 rounded overflow-hidden">
                        <Image 
                          src={banner} 
                          alt={`Banner ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 80px"
                        />
                      </div>
                      <div className="flex-1 w-full sm:w-auto min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Banner {index + 1}</p>
                        <p className="text-xs text-gray-500 truncate">{banner}</p>
                      </div>
                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveBannerImage(index, -1)}
                          disabled={index === 0}
                          className="flex-1 sm:flex-none text-xs"
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveBannerImage(index, 1)}
                          disabled={index === bannerImages.length - 1}
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
                  ))}
                </div>
              )}

              {bannerImages.length === 0 && (
                <p className="text-sm text-gray-500 italic">No banner images uploaded. Default images will be used.</p>
              )}
            </div>

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
          <CardContent className="space-y-4 px-3 sm:px-6 pt-4 sm:pt-6">
            <div>
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
            <Button
              onClick={saveSiteSettings}
              disabled={saving}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {saving ? "Saving..." : "Save Footer Content"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Footer Links Tab */}
      {activeTab === "footer-links" && (
        <Card>
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
            <div className="space-y-3">
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
      )}

      {/* Social Media Tab */}
      {activeTab === "social-media" && (
        <Card>
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
            >
              Add Icon
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
      )}

      {/* About Page Tab */}
      {activeTab === "about" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold">About Page Content</h3>
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
          {/* Mission Section */}
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg">Mission Section</CardTitle>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">About Page</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Content displayed in the Mission section on the About Us page
              </p>
            </CardHeader>
            <CardContent className="space-y-4 px-3 sm:px-6 pt-4 sm:pt-6">
              <div>
                <Label htmlFor="about-mission-p1" className="text-sm sm:text-base">Mission Paragraph 1</Label>
                <textarea
                  id="about-mission-p1"
                  value={aboutContent.about_mission_paragraph1 || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_mission_paragraph1: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="Pragati Prime is committed to empowering rural women and adolescent girls in Western Uttar Pradesh and Delhi NCR through health, education, and economic independence."
                />
              </div>
              <div>
                <Label htmlFor="about-mission-p2" className="text-sm sm:text-base">Mission Paragraph 2</Label>
                <textarea
                  id="about-mission-p2"
                  value={aboutContent.about_mission_paragraph2 || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_mission_paragraph2: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="We bridge the gap between communities and government schemes, ensuring women can easily access healthcare services, social security benefits, and livelihood opportunities."
                />
              </div>
              <div>
                <Label htmlFor="about-mission-p3" className="text-sm sm:text-base">Mission Paragraph 3</Label>
                <textarea
                  id="about-mission-p3"
                  value={aboutContent.about_mission_paragraph3 || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_mission_paragraph3: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="By partnering with local leaders, institutions, and CSR initiatives, we design programs that are practical, culturally rooted, and focused on long-term impact."
                />
              </div>
            </CardContent>
          </Card>

          {/* Vision Section */}
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Vision Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-3 sm:px-6 pt-4 sm:pt-6">
              <div>
                <Label htmlFor="about-vision-title" className="text-sm sm:text-base">Vision Title</Label>
                <Input
                  id="about-vision-title"
                  value={aboutContent.about_vision_title || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_vision_title: e.target.value })}
                  className="mt-1 text-sm sm:text-base"
                  placeholder="Vision for Rural Girls & Women"
                />
              </div>
              <div>
                <Label htmlFor="about-vision-description" className="text-sm sm:text-base">Vision Description</Label>
                <textarea
                  id="about-vision-description"
                  value={aboutContent.about_vision_description || ""}
                  onChange={(e) => setAboutContent({ ...aboutContent, about_vision_description: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  placeholder="A Western Uttar Pradesh and Delhi NCR where every girl is healthy, educated, and economically confident—and every woman can claim government entitlements, livelihoods, and her own voice."
                />
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">About Page Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pt-4 sm:pt-6">
              {/* Team Image */}
              <div>
                <Label className="text-sm sm:text-base">About Us Section Image (Team Image)</Label>
                <div className="mt-2 space-y-2">
                  {aboutContent.about_team_image_url && (
                    <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={aboutContent.about_team_image_url}
                        alt="Team Image Preview"
                        fill
                        className="object-contain"
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
                        className="flex items-center gap-2 w-full sm:w-auto text-sm"
                        onClick={() => document.getElementById('team-image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAboutImage ? "Uploading..." : aboutContent.about_team_image_url ? "Change Image" : "Upload Team Image"}
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
              </div>

              {/* Vision Image */}
              <div>
                <Label className="text-sm sm:text-base">Vision Section Image</Label>
                <div className="mt-2 space-y-2">
                  {aboutContent.about_vision_image_url && (
                    <div className="relative w-full h-40 sm:h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={aboutContent.about_vision_image_url}
                        alt="Vision Image Preview"
                        fill
                        className="object-contain"
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
                        className="flex items-center gap-2 w-full sm:w-auto text-sm"
                        onClick={() => document.getElementById('vision-image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAboutImage ? "Uploading..." : aboutContent.about_vision_image_url ? "Change Image" : "Upload Vision Image"}
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
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={saveSiteSettings}
            disabled={saving}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save About Page Content"}
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
    </div>
  );
}

