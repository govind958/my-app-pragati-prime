"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button1";
import { X, LogOut, LayoutDashboard, Users, FileText, CreditCard, UsersRound, Settings, BadgeDollarSign, Inbox } from "lucide-react";
import NavButton from "./shared/NavButton";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function Sidebar({ section, onSectionChange, siteSettings, onClose, sidebarOpen }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } h-screen flex flex-col`}
      >
        {/* Scrollable content area */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Image 
                src={siteSettings.logo_url || "/logo1.jpeg"} 
                alt={`${siteSettings.title} Logo`} 
                width={32} 
                height={32} 
                className="rounded-full object-contain"
              />
              <h1 className="text-xl font-semibold text-primary">
                {siteSettings.title || "Admin Dashboard"}
              </h1>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <nav className="space-y-2">
            <NavButton
              active={section === "dashboard"}
              onClick={() => onSectionChange("dashboard")}
              icon={LayoutDashboard}
            >
              Dashboard
            </NavButton>
            <NavButton
              active={section === "members"}
              onClick={() => onSectionChange("members")}
              icon={Users}
            >
              Members
            </NavButton>
            <NavButton
              active={section === "articles"}
              onClick={() => onSectionChange("articles")}
              icon={FileText}
            >
              Articles
            </NavButton>
            <NavButton
              active={section === "payments"}
              onClick={() => onSectionChange("payments")}
              icon={CreditCard}
            >
              Payments
            </NavButton>
            <NavButton
              active={section === "plans"}
              onClick={() => onSectionChange("plans")}
              icon={BadgeDollarSign}
            >
              Membership Plans
            </NavButton>
            <NavButton
              active={section === "forms"}
              onClick={() => onSectionChange("forms")}
              icon={Inbox}
            >
              Forms Collection
            </NavButton>
            <NavButton
              active={section === "team"}
              onClick={() => onSectionChange("team")}
              icon={UsersRound}
            >
              Core Team
            </NavButton>
            <NavButton
              active={section === "settings"}
              onClick={() => onSectionChange("settings")}
              icon={Settings}
            >
              Settings
            </NavButton>
          </nav>
        </div>
        
        {/* Sign Out Button - Fixed at bottom */}
        <div className="p-4 border-t bg-white shrink-0">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}

