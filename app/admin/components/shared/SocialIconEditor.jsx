"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SocialIconEditor({ icon, onSave, onDelete }) {
  const [editing, setEditing] = useState(!icon.id);
  const [formData, setFormData] = useState(icon);

  const handleSave = () => {
    onSave(formData);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex-1">
          <div className="font-medium">{formData.platform}</div>
          <div className="text-sm text-muted-foreground">{formData.url}</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(formData.id)}>Delete</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border rounded-lg space-y-3">
      <div>
        <Label>Platform</Label>
        <select
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value, icon_name: e.target.value })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>
      <div>
        <Label>URL</Label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="mt-1"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={() => { setEditing(false); setFormData(icon); }}>Cancel</Button>
      </div>
    </div>
  );
}
