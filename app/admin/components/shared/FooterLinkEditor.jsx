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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm sm:text-base truncate">{formData.label}</div>
          <div className="text-xs sm:text-sm text-muted-foreground truncate">{formData.href}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{formData.section}</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="text-xs sm:text-sm flex-1 sm:flex-none">
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(formData.id)} className="text-xs sm:text-sm flex-1 sm:flex-none">
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border rounded-lg space-y-3">
      <div>
        <Label className="text-xs sm:text-sm">Section</Label>
        <select
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
        >
          <option value="quick_links">Quick Links</option>
          <option value="resources">Resources</option>
          <option value="contact">Contact</option>
          <option value="legal">Legal</option>
        </select>
      </div>
      <div>
        <Label className="text-xs sm:text-sm">Label</Label>
        <Input
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="mt-1 text-xs sm:text-sm"
        />
      </div>
      <div>
        <Label className="text-xs sm:text-sm">URL</Label>
        <Input
          value={formData.href}
          onChange={(e) => setFormData({ ...formData, href: e.target.value })}
          className="mt-1 text-xs sm:text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} className="text-xs sm:text-sm flex-1 sm:flex-none">Save</Button>
        <Button size="sm" variant="outline" onClick={() => { setEditing(false); setFormData(link); }} className="text-xs sm:text-sm flex-1 sm:flex-none">
          Cancel
        </Button>
      </div>
    </div>
  );
}
