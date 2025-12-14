"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsersRound, X } from "lucide-react";

export default function TeamManager({ team = [], refresh, supabase }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
    links: { linkedin: "" },
  });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      image: "",
      links: { linkedin: "" },
    });
    setEditingMember(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setFormData({
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      image: member.image || "",
      links: typeof member.links === "string" 
        ? JSON.parse(member.links || "{}") 
        : (member.links || { linkedin: "" }),
    });
    setEditingMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `team-${Date.now()}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        // If storage bucket doesn't exist or fails, use file URL directly
        console.warn("Storage upload failed, using file object:", uploadError);
        // For now, we'll just use the file name - you may want to handle this differently
        alert("Image upload failed. Please use a direct image URL instead.");
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: urlData.publicUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please use a direct image URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required.");
      return;
    }

    try {
      const linksData = formData.links.linkedin.trim() 
        ? { linkedin: formData.links.linkedin.trim() }
        : null;
      
      const dataToSave = {
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        bio: formData.bio.trim() || null,
        image: formData.image.trim() || null,
        links: linksData ? JSON.stringify(linksData) : null,
      };

      if (editingMember) {
        const { error } = await supabase
          .from("core_team")
          .update(dataToSave)
          .eq("id", editingMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("core_team")
          .insert([dataToSave]);
        if (error) throw error;
      }

      closeModal();
      refresh();
    } catch (error) {
      console.error("Error saving team member:", error);
      alert(`Failed to ${editingMember ? "update" : "add"} team member: ${error.message}`);
    }
  };

  const removeMember = async (t) => {
    if (!confirm(`Remove ${t.name} from the Core Team?`)) return;

    try {
      await supabase.from("core_team").delete().eq("id", t.id);
      refresh();
    } catch (error) {
      console.error("Error removing team member:", error);
      alert("Failed to remove team member.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-2 border-b gap-4">
        <CardTitle className="text-lg">Core Team ({team.length})</CardTitle>
        <Button
          className="w-full sm:w-auto"
          onClick={openAddModal}
        >
          <UsersRound className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((t) => {
          const links = typeof t.links === "string" 
            ? JSON.parse(t.links || "{}") 
            : (t.links || {});
          
          return (
            <Card
              key={t.id}
              className="overflow-hidden hover:shadow-lg transition"
            >
              {t.image && (
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-1">
                  {t.name}
                </CardTitle>
                {t.role && (
                  <CardDescription className="text-primary font-medium mb-2">
                    {t.role}
                  </CardDescription>
                )}
                {t.bio && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {t.bio}
                  </p>
                )}
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mb-3 inline-block"
                  >
                    LinkedIn →
                  </a>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(t)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => removeMember(t)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {team.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          No team members listed. Click &quot;Add Member&quot; to get started.
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
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
                {/* Name */}
                <div>
                  <Label>
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter team member name"
                    className="mt-1"
                  />
                </div>

                {/* Role */}
                <div>
                  <Label>Role</Label>
                  <Input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="e.g., Founder & President"
                    className="mt-1"
                  />
                </div>

                {/* Bio */}
                <div>
                  <Label>Bio</Label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter a brief biography..."
                  />
                </div>

                {/* Image */}
                <div>
                  <Label>Image</Label>
                  <div className="space-y-2 mt-1">
                    <Input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                        disabled={uploading}
                      >
                        <label htmlFor="image-upload" className="cursor-pointer">
                          {uploading ? "Uploading..." : "Or Upload Image"}
                        </label>
                      </Button>
                    </div>
                    {formData.image && (
                      <div className="mt-2 relative w-32 h-32">
                        <Image
                          src={formData.image}
                          alt="Preview"
                          width={128}
                          height={128}
                          className="object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* LinkedIn Link */}
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input
                    type="url"
                    value={formData.links.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="mt-1"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={closeModal}
                variant="outline"
                className="w-full sm:flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:flex-1"
              >
                {editingMember ? "Update" : "Add"} Member
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

