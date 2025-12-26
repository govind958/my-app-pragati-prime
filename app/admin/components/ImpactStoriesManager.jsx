"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function ImpactStoriesManager({ stories = [], refresh, supabase }) {
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    main_title: "",
    description: "",
    image_url: "",
    display_order: 1,
  });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: "",
      main_title: "",
      description: "",
      image_url: "",
      display_order: stories.length + 1,
    });
    setEditingStory(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (story) => {
    setFormData({
      title: story.title || "",
      main_title: story.main_title || "",
      description: story.description || "",
      image_url: story.image_url || "",
      display_order: story.display_order || 1,
    });
    setEditingStory(story);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageUpload = async (e) => {
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

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `impact-story-${Date.now()}.${fileExt}`;
      const filePath = `impact-stories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        let errorMessage = "Image upload failed. ";
        
        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage += "The 'images' bucket doesn't exist. Please create it in Supabase Storage first.";
        } else if (uploadError.message?.includes('new row violates row-level security')) {
          errorMessage += "Permission denied. Please run the storage policy migration in Supabase SQL Editor.";
        } else {
          errorMessage += uploadError.message || "Please try again.";
        }
        
        alert(errorMessage);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setFormData({ ...formData, image_url: urlData.publicUrl });
        alert("Image uploaded successfully!");
      } else {
        alert("Image uploaded but could not get public URL. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message || "Please try again or use a direct image URL."}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.main_title.trim() || !formData.description.trim()) {
      alert("Title, Main Title, and Description are required.");
      return;
    }

    try {
      const dataToSave = {
        title: formData.title.trim(),
        main_title: formData.main_title.trim(),
        description: formData.description.trim(),
        image_url: formData.image_url.trim() || null,
        display_order: formData.display_order || 1,
      };

      if (editingStory) {
        const { error } = await supabase
          .from("impact_stories")
          .update(dataToSave)
          .eq("id", editingStory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("impact_stories")
          .insert([dataToSave]);
        if (error) throw error;
      }

      closeModal();
      refresh();
    } catch (error) {
      console.error("Error saving impact story:", error);
      alert(`Failed to ${editingStory ? "update" : "add"} impact story: ${error.message}`);
    }
  };

  const removeStory = async (story) => {
    if (!confirm(`Remove "${story.main_title}" from Impact Stories?`)) return;

    try {
      await supabase.from("impact_stories").delete().eq("id", story.id);
      refresh();
    } catch (error) {
      console.error("Error removing impact story:", error);
      alert("Failed to remove impact story.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-2 border-b gap-4">
        <CardTitle className="text-lg">Impact Stories ({stories.length})</CardTitle>
        <Button
          className="w-full sm:w-auto"
          onClick={openAddModal}
        >
          Add Story
        </Button>
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {story.image_url && (
                <div className="relative w-full h-32 md:h-full min-h-[200px] rounded-md overflow-hidden">
                  <Image
                    src={story.image_url}
                    alt={story.main_title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className={`${story.image_url ? 'md:col-span-2' : 'md:col-span-3'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide bg-primary/10 px-2 py-1 rounded">
                        {story.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Order: {story.display_order}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{story.main_title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {story.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(story)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStory(story)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {stories.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No impact stories listed. Click &quot;Add Story&quot; to get started.
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  {editingStory ? "Edit Impact Story" : "Add Impact Story"}
                </CardTitle>
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
                  <Label htmlFor="title">Title (Category) *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Education, Empowerment, Infrastructure"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="main_title">Main Title *</Label>
                  <Input
                    id="main_title"
                    value={formData.main_title}
                    onChange={(e) => setFormData({ ...formData, main_title: e.target.value })}
                    placeholder="e.g., Keeping Girls in School"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md bg-background resize-y"
                    placeholder="Enter description paragraph..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower numbers appear first (1, 2, 3...)
                  </p>
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Enter image URL or upload image below"
                  />
                </div>

                <div>
                  <Label htmlFor="image_upload">Upload Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    {uploading && (
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border border-input">
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {editingStory ? "Update Story" : "Add Story"}
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

