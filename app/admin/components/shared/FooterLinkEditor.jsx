"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FooterLinkEditor({ link, onSave, onDelete }) {
  const [editing, setEditing] = useState(!link.id);
  const [formData, setFormData] = useState(link);

  const handleSave = () => {
    onSave(formData);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex-1">
          <div className="font-medium">{formData.label}</div>
          <div className="text-sm text-muted-foreground">{formData.href} ({formData.section})</div>
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
        <Label>Section</Label>
        <select
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="quick_links">Quick Links</option>
          <option value="resources">Resources</option>
          <option value="contact">Contact</option>
          <option value="legal">Legal</option>
        </select>
      </div>
      <div>
        <Label>Label</Label>
        <Input
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>URL</Label>
        <Input
          value={formData.href}
          onChange={(e) => setFormData({ ...formData, href: e.target.value })}
          className="mt-1"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={() => { setEditing(false); setFormData(link); }}>Cancel</Button>
      </div>
    </div>
  );
}
