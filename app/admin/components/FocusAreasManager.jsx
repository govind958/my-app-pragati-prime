"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function FocusAreasManager({ area, refresh, supabase }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    heading: "",
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
    paragraph4: "",
    image1_url: "",
    image2_url: "",
  });
  const [uploadingImage, setUploadingImage] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load existing data when area changes
  useState(() => {
    if (area) {
      setFormData({
        heading: area.heading || "",
        paragraph1: area.paragraph1 || "",
        paragraph2: area.paragraph2 || "",
        paragraph3: area.paragraph3 || "",
        paragraph4: area.paragraph4 || "",
        image1_url: area.image1_url || "",
        image2_url: area.image2_url || "",
      });
    }
  }, [area]);

  const openEditModal = () => {
    if (area) {
      setFormData({
        heading: area.heading || "",
        paragraph1: area.paragraph1 || "",
        paragraph2: area.paragraph2 || "",
        paragraph3: area.paragraph3 || "",
        paragraph4: area.paragraph4 || "",
        image1_url: area.image1_url || "",
        image2_url: area.image2_url || "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleImageUpload = async (e, imageNumber) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    setUploadingImage(imageNumber);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `focus-area-${imageNumber}-${Date.now()}.${fileExt}`;
      const filePath = `focus-areas/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        alert("Image upload failed. Please try again.");
        setUploadingImage(null);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        if (imageNumber === 1) {
          setFormData({ ...formData, image1_url: urlData.publicUrl });
        } else {
          setFormData({ ...formData, image2_url: urlData.publicUrl });
        }
        alert("Image uploaded successfully!");
      } else {
        alert("Image uploaded but could not get public URL. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message || "Please try again."}`);
    } finally {
      setUploadingImage(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.heading.trim() || !formData.paragraph1.trim() || !formData.paragraph2.trim() || !formData.paragraph3.trim() || !formData.paragraph4.trim()) {
      alert("All fields are required.");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        heading: formData.heading.trim(),
        paragraph1: formData.paragraph1.trim(),
        paragraph2: formData.paragraph2.trim(),
        paragraph3: formData.paragraph3.trim(),
        paragraph4: formData.paragraph4.trim(),
        image1_url: formData.image1_url.trim() || null,
        image2_url: formData.image2_url.trim() || null,
      };

      if (area) {
        // Update existing
        const { error } = await supabase
          .from("focus_areas")
          .update(dataToSave)
          .eq("id", area.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("focus_areas")
          .insert([dataToSave]);
        if (error) throw error;
      }

      closeModal();
      refresh();
      alert("Focus Areas content saved successfully!");
    } catch (error) {
      console.error("Error saving focus areas:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-2 border-b gap-4">
        <CardTitle className="text-lg">Focus Areas Content</CardTitle>
        <Button onClick={openEditModal}>
          {area ? "Edit Content" : "Add Content"}
        </Button>
      </div>

      {/* Preview */}
      {area && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-2">{area.heading}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{area.paragraph1}</p>
              <p>{area.paragraph2}</p>
              <p>{area.paragraph3}</p>
              <p>{area.paragraph4}</p>
            </div>
            <div className="flex gap-2 mt-4">
              {area.image1_url && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border border-input">
                  <Image
                    src={area.image1_url}
                    alt="Image 1"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {area.image2_url && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border border-input">
                  <Image
                    src={area.image2_url}
                    alt="Image 2"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!area && (
        <p className="text-center text-muted-foreground py-8">
          No content yet. Click &quot;Add Content&quot; to get started.
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">Edit Focus Areas</CardTitle>
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  size="icon"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="heading">Heading *</Label>
                  <Input
                    id="heading"
                    value={formData.heading}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    placeholder="e.g., Our Focus Areas"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paragraph1">Paragraph 1 (Left of Image 1) *</Label>
                  <textarea
                    id="paragraph1"
                    value={formData.paragraph1}
                    onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background resize-y"
                    placeholder="Enter first paragraph..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paragraph2">Paragraph 2 (Left of Image 2) *</Label>
                  <textarea
                    id="paragraph2"
                    value={formData.paragraph2}
                    onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background resize-y"
                    placeholder="Enter second paragraph..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paragraph3">Paragraph 3 (After Images) *</Label>
                  <textarea
                    id="paragraph3"
                    value={formData.paragraph3}
                    onChange={(e) => setFormData({ ...formData, paragraph3: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background resize-y"
                    placeholder="Enter third paragraph..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paragraph4">Paragraph 4 (After Images) *</Label>
                  <textarea
                    id="paragraph4"
                    value={formData.paragraph4}
                    onChange={(e) => setFormData({ ...formData, paragraph4: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background resize-y"
                    placeholder="Enter fourth paragraph..."
                    required
                  />
                </div>

                {/* Image 1 */}
                <div>
                  <Label htmlFor="image1_url">Image 1 URL</Label>
                  <Input
                    id="image1_url"
                    value={formData.image1_url}
                    onChange={(e) => setFormData({ ...formData, image1_url: e.target.value })}
                    placeholder="Enter image URL or upload image below"
                  />
                  <div className="mt-2">
                    <Label htmlFor="image1_upload" className="text-sm">Upload Image 1</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="image1_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 1)}
                        disabled={uploadingImage === 1}
                        className="cursor-pointer"
                      />
                      {uploadingImage === 1 && (
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      )}
                    </div>
                  </div>
                  {formData.image1_url && (
                    <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={formData.image1_url}
                        alt="Preview Image 1"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Image 2 */}
                <div>
                  <Label htmlFor="image2_url">Image 2 URL</Label>
                  <Input
                    id="image2_url"
                    value={formData.image2_url}
                    onChange={(e) => setFormData({ ...formData, image2_url: e.target.value })}
                    placeholder="Enter image URL or upload image below"
                  />
                  <div className="mt-2">
                    <Label htmlFor="image2_upload" className="text-sm">Upload Image 2</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="image2_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 2)}
                        disabled={uploadingImage === 2}
                        className="cursor-pointer"
                      />
                      {uploadingImage === 2 && (
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      )}
                    </div>
                  </div>
                  {formData.image2_url && (
                    <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={formData.image2_url}
                        alt="Preview Image 2"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving || uploadingImage !== null}>
                    {saving ? "Saving..." : "Save Content"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
