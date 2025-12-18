"use client"; // REQUIRED for using React hooks (useState, useEffect) in Next.js App Router

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Menu, FileText } from "lucide-react";
import Dashboard from "./components/Dashboard";
import MembersTable from "./components/MembersTable";
import ArticlesTable from "./components/ArticlesTable";
import PaymentsTable from "./components/PaymentsTable";
import TeamManager from "./components/TeamManager";
import SettingsPanel from "./components/SettingsPanel";
import PlansTable from "./components/PlansTable";
import ContactFormsTable from "./components/ContactFormsTable";
import Sidebar from "./components/Sidebar";

// Initialize Supabase Client
const supabase = createClient();

//----------------------------------------------------------------------
// MAIN COMPONENT
//----------------------------------------------------------------------

export default function AdminPanel() {
  const [section, setSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data stores
  const [stats, setStats] = useState({
    totalUsers: 0,
    paidUsers: 0,
    articles: 0,
    revenue: 0,
    contactForms: 0,
  });
  const [members, setMembers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [contactForms, setContactForms] = useState([]);
  const [team, setTeam] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    logo_url: "/logo1.jpeg",
    title: "Admin Dashboard"
  });

  // --- Data Fetching Functions ---

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: users },
        { data: posts },
        { data: subs },
        { data: members },
        { count: contactCount },
      ] =
        await Promise.all([
          supabase.from("profiles").select("id, email, role, created_at, name"),
          // Ensure 'published' is included for consistency
          supabase
            .from("articles")
            .select("id, title, is_paid, published, created_at, author_id, required_plan_name"),
          supabase
            .from("payments")
            .select("id, amount, profile_id, status, created_at, profiles(name, email)"),
          supabase
            .from("members")
            .select("id, profile_id, membership_type, created_at"),
          supabase
            .from("contact_us")
            .select("id", { count: "exact", head: true }),
        ]);

      const totalUsers = users?.length ?? 0;
      const paidUsers = members?.filter((u) => u.membership_type === "paid").length ?? 0;
      const articlesCount = posts?.length ?? 0;
      const revenue = subs?.reduce((s, p) => s + (p.amount ?? 0), 0) ?? 0;
      const contactForms = contactCount ?? 0;

      setStats({ totalUsers, paidUsers, articles: articlesCount, revenue, contactForms });
      setMembers(users || []);
      setArticles(posts || []);
      setPayments(subs || []);
    } catch (err) {
      console.error("fetchDashboard Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, name, role, created_at");
      setMembers(data || []);
    } catch (err) {
      console.error("loadMembers Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("articles")
        .select("id, title, is_paid, published, created_at, author_id, required_plan_name");
      setArticles(data || []);
    } catch (err) {
      console.error("loadArticles Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("payments")
        .select("id, profile_id, amount, status, created_at, profiles(name, email)");
      setPayments(data || []);
    } catch (err) {
      console.error("loadPayments Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadContactForms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("contact_us")
        .select("id, name, email, phone, state, location, interested_to_connect, status, created_at")
        .order("created_at", { ascending: false });
      setContactForms(data || []);
    } catch (err) {
      console.error("loadContactForms Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTeam = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from("core_team").select("*");
      setTeam(data || []);
    } catch (err) {
      console.error("loadTeam Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);


  // Load site settings for logo and title
  const loadSiteSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url, title")
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setSiteSettings({
          logo_url: data.logo_url || "/logo1.jpeg",
          title: data.title || "Admin Dashboard"
        });
      }
    } catch (error) {
      console.error("Error loading site settings:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    loadSiteSettings();
  }, [fetchDashboard, loadSiteSettings]);

  const switchSection = (sec) => {
    setSection(sec);
    setSidebarOpen(false); 
    // Lazy load section data
    if (sec === "members") loadMembers();
    else if (sec === "articles") loadArticles();
    else if (sec === "payments") loadPayments();
    else if (sec === "team") loadTeam();
    else if (sec === "forms") loadContactForms();
  };

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <Dashboard stats={stats} refresh={fetchDashboard} />;
      case "members":
        return (
          <MembersTable
            members={members}
            refresh={loadMembers}
            supabase={supabase}
          />
        );
      case "articles":
        return (
          <ArticlesTable
            articles={articles}
            refresh={loadArticles}
            supabase={supabase}
          />
        );
      case "payments":
        return <PaymentsTable payments={payments} refresh={loadPayments} supabase={supabase} />;
      case "plans":
        return <PlansTable supabase={supabase} />;
      case "forms":
        return <ContactFormsTable forms={contactForms} refresh={loadContactForms} />;
      case "team":
        return (
          <TeamManager team={team} refresh={loadTeam} supabase={supabase} />
        );
      case "settings":
        return <SettingsPanel supabase={supabase} onSettingsSaved={loadSiteSettings} />;
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        section={section}
        onSectionChange={switchSection}
        siteSettings={siteSettings}
        onClose={() => setSidebarOpen(false)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full lg:w-auto">
        <header className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Admin control panel — manage site content & members.
              </p>
            </div>
          </div>
          {section === "articles" && (
            <Button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("admin:add-article"));
              }}
              className="whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              Add Article
            </Button>
          )}
        </header>

        <Card className="min-h-[70vh]">
          <CardContent className="p-4 md:p-6">
            {loading && (
              <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
              </div>
            )}

            {!loading && renderSection()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
