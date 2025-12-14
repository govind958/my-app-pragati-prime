"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button1";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function RoleSelector({ member, supabase, refresh }) {
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleRoleChange = async (newRole) => {
    if (confirm(`Change ${member.email}'s role to ${newRole}?`)) {
      setIsChanging(true);
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ role: newRole })
          .eq("id", member.id);
        if (error) throw error;
        refresh();
        setShowMobileModal(false);
      } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role.");
      } finally {
        setIsChanging(false);
      }
    }
  };

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "member", label: "Member" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <>
      {/* Desktop: Native Select */}
      <select
        value={member.role}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="hidden sm:block w-auto rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Mobile: Button that opens modal */}
      <Button
        onClick={() => setShowMobileModal(true)}
        variant="outline"
        className="sm:hidden w-full"
      >
        {roleOptions.find((opt) => opt.value === member.role)?.label || member.role}
      </Button>

      {/* Mobile Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 sm:hidden p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Change Role for {member.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {roleOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleRoleChange(option.value)}
                  disabled={isChanging}
                  variant={member.role === option.value ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setShowMobileModal(false)}
                disabled={isChanging}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
