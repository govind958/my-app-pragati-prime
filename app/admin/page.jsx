"use client"; // REQUIRED for using React hooks (useState, useEffect) in Next.js App Router

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust path as needed

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
  });
  const [members, setMembers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [team, setTeam] = useState([]);

  // --- Data Fetching Functions ---

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: users }, { data: posts }, { data: subs }, { data: members }] =
        await Promise.all([
          supabase.from("profiles").select("id, email, role, created_at, name"),
          // Ensure 'published' is included for consistency
          supabase
            .from("articles")
            .select("id, title, is_paid, published, created_at, author_id"),
          supabase
            .from("payments")
            .select("id, amount, profile_id, status, created_at"),
            supabase
            .from("members")
            .select("id, profile_id, membership_type, created_at"),
        ]);

      const totalUsers = users?.length ?? 0;
      const paidUsers = members?.filter((u) => u.membership_type === "paid").length ?? 0;
      const articlesCount = posts?.length ?? 0;
      const revenue = subs?.reduce((s, p) => s + (p.amount ?? 0), 0) ?? 0;

      setStats({ totalUsers, paidUsers, articles: articlesCount, revenue });
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
        .select("id, title, is_paid, published, created_at, author_id");
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
        .select("id, profile_id, amount, status, created_at");
      setPayments(data || []);
    } catch (err) {
      console.error("loadPayments Error:", err);
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

  // --- Effects and Handlers ---

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const switchSection = (sec) => {
    setSection(sec);
    setSidebarOpen(false); // Close sidebar on mobile when switching sections
    // Lazy load section data
    if (sec === "members") loadMembers();
    else if (sec === "articles") loadArticles();
    else if (sec === "payments") loadPayments();
    else if (sec === "team") loadTeam();
  };

  // Function to determine which component to render
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
      case "team":
        return (
          <TeamManager team={team} refresh={loadTeam} supabase={supabase} />
        );
      case "settings":
        return <SettingsPanel supabase={supabase} />;
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r p-4 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-indigo-800">
            NGO Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          <NavButton
            active={section === "dashboard"}
            onClick={() => switchSection("dashboard")}
          >
            Dashboard
          </NavButton>
          <NavButton
            active={section === "members"}
            onClick={() => switchSection("members")}
          >
            Members
          </NavButton>
          <NavButton
            active={section === "articles"}
            onClick={() => switchSection("articles")}
          >
            Articles
          </NavButton>
          <NavButton
            active={section === "payments"}
            onClick={() => switchSection("payments")}
          >
            Payments
          </NavButton>
          <NavButton
            active={section === "team"}
            onClick={() => switchSection("team")}
          >
            Core Team
          </NavButton>
          <NavButton
            active={section === "settings"}
            onClick={() => switchSection("settings")}
          >
            Settings
          </NavButton>
        </nav>
        <div className="mt-8 pt-4 border-t">
          <button
            className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full lg:w-auto">
        <header className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 p-2"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
            <button
              className="px-4 md:px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-medium text-sm md:text-base whitespace-nowrap"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("admin:add-article"));
              }}
            >
              + Add Article
            </button>
          )}
        </header>

        <section className="bg-white p-4 md:p-6 rounded-xl shadow-lg min-h-[70vh]">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {!loading && renderSection()}
        </section>
      </main>
    </div>
  );
}

//----------------------------------------------------------------------
// SHARED UI COMPONENTS
//----------------------------------------------------------------------

function NavButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition duration-150 ${
        active
          ? "bg-indigo-100 text-indigo-700 shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-lg shadow-md flex flex-col">
      <div className="text-sm font-medium text-indigo-600">{title}</div>
      <div className="text-3xl font-bold mt-2 text-gray-900">{value}</div>
    </div>
  );
}

//----------------------------------------------------------------------
// SECTION COMPONENTS
//----------------------------------------------------------------------

function Dashboard({ stats, refresh }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
        />
        <StatCard
          title="Paid Members"
          value={stats.paidUsers.toLocaleString()}
        />
        <StatCard
          title="Articles Published"
          value={stats.articles.toLocaleString()}
        />
        <StatCard
          title="Total Revenue"
          value={`₹ ${stats.revenue.toLocaleString()}`}
        />
      </div>

      <div className="mt-6 md:mt-8 bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-inner">
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
          Quick Actions & Status
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          The metrics above are generated from the latest data.
        </p>
        <div className="mt-4">
          <button
            onClick={refresh}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium text-sm md:text-base"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleSelector({ member, supabase, refresh }) {
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
        className="hidden sm:block w-auto border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Mobile: Button that opens modal */}
      <button
        onClick={() => setShowMobileModal(true)}
        className="sm:hidden w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {roleOptions.find((opt) => opt.value === member.role)?.label || member.role}
      </button>

      {/* Mobile Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:hidden p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Role for {member.email}
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRoleChange(option.value)}
                  disabled={isChanging}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    member.role === option.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  } ${isChanging ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowMobileModal(false)}
                disabled={isChanging}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MembersTable({ members = [], refresh, supabase }) {

  async function deleteMember(member) {
    if (
      !confirm(
        `Permanently delete member ${member.email}? This action cannot be undone.`
      )
    )
      return;

    try {
      await supabase.from("profiles").delete().eq("id", member.id);
      refresh();
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member. Check RLS policies.");
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Site Members ({members.length})
      </h3>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-xs md:text-sm table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="p-2 md:p-3 font-medium text-gray-600">Email</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden sm:table-cell">Name</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Role</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">Joined</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3">
                    <div className="font-medium">{m.email}</div>
                    <div className="text-gray-500 text-xs sm:hidden">{m.name}</div>
                  </td>
                  <td className="p-2 md:p-3 hidden sm:table-cell">{m.name}</td>
                  <td className="p-2 md:p-3">
                    <RoleSelector member={m} supabase={supabase} refresh={refresh} />
                  </td>

                  {/* Joined */}
                  <td className="p-2 md:p-3 text-gray-500 hidden md:table-cell">
                    {m.created_at ? new Date(m.created_at).toLocaleDateString() : "-"}
                  </td>

                  {/* Actions */}
                  <td className="p-2 md:p-3 text-right whitespace-nowrap">
                    <button
                      className="px-2 md:px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      onClick={() => deleteMember(m)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {members.length === 0 && (
        <p className="text-center py-4 text-gray-500">No members found.</p>
      )}
    </div>
  );
}

function ArticlesTable({ articles = [], refresh, supabase }) {
  const openArticleEditor = useCallback((article) => {
    const url = article
      ? `/admin/articles/edit/${article.id}`
      : `/admin/articles/new`;
    window.location.href = url;
  }, []);

  useEffect(() => {
    const handler = () => openArticleEditor(null);
    window.addEventListener("admin:add-article", handler);
    return () => window.removeEventListener("admin:add-article", handler);
  }, [openArticleEditor]);

  async function publishToggle(a) {
    try {
      await supabase
        .from("articles")
        .update({ published: !a.published })
        .eq("id", a.id);
      refresh();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update article status.");
    }
  }

  async function deleteArticle(a) {
    if (!confirm(`Permanently delete article "${a.title || a.id}"?`)) return;

    try {
      await supabase.from("articles").delete().eq("id", a.id);
      refresh();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Check RLS policies.");
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Content Articles ({articles.length})
      </h3>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-xs md:text-sm table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="p-2 md:p-3 font-medium text-gray-600">Title</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden sm:table-cell">Paid</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Status</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">Created</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium text-indigo-700">
                    <div className="truncate max-w-[150px] md:max-w-none">{a.title || "Untitled"}</div>
                    <div className="text-gray-500 text-xs sm:hidden">{a.is_paid ? "Paid" : "Free"}</div>
                  </td>
                  <td className="p-2 md:p-3 hidden sm:table-cell">{a.is_paid ? "Yes" : "No"}</td>
                  <td className="p-2 md:p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                        a.published
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {a.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="p-2 md:p-3 text-gray-500 hidden md:table-cell">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-3 text-right whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                      <button
                        className="px-2 md:px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        onClick={() => openArticleEditor(a)}
                      >
                        Edit
                      </button>
                      <button
                        className={`px-2 md:px-3 py-1 text-xs text-white rounded-md transition ${
                          a.published
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                        onClick={() => publishToggle(a)}
                      >
                        {a.published ? "Unpub" : "Publish"}
                      </button>
                      <button
                        className="px-2 md:px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        onClick={() => deleteArticle(a)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {articles.length === 0 && (
        <p className="text-center py-4 text-gray-500">No articles found.</p>
      )}
    </div>
  );
}

function PaymentsTable({ payments = [], refresh, supabase }) {
  async function deletePayment(p) {
    if (!confirm(`Permanently delete payment "${p.id}"?`)) return;
    try {
      await supabase.from("payments").delete().eq("id", p.id);
      refresh();
    }
    catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. Check RLS policies.");
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Payment Transactions ({payments.length})
      </h3>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-xs md:text-sm table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="p-2 md:p-3 font-medium text-gray-600">Txn ID</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden lg:table-cell">User ID</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Amount</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Status</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-mono text-xs text-gray-600">
                    <div>{p.id.substring(0, 8)}...</div>
                    <div className="text-gray-400 text-xs md:hidden mt-1">
                      {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2 md:p-3 font-mono text-xs text-gray-600 hidden lg:table-cell">
                    {p.profile_id ? p.profile_id.substring(0, 8) + "..." : "N/A"}
                  </td>
                  <td className="p-2 md:p-3 font-semibold">
                    ₹ {p.amount ? p.amount.toLocaleString() : "0"}
                  </td>
                  <td className="p-2 md:p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status || "unknown"}
                    </span>
                  </td>
                  <td className="p-2 md:p-3 text-gray-500 hidden md:table-cell">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-3 text-right whitespace-nowrap">
                    <button
                      className="px-2 md:px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      onClick={() => deletePayment(p)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {payments.length === 0 && (
        <p className="text-center py-4 text-gray-500">No payments found.</p>
      )}
    </div>
  );
}

function TeamManager({ team = [], refresh, supabase }) {
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
        <h3 className="text-lg font-semibold">Core Team ({team.length})</h3>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium text-sm md:text-base"
          onClick={openAddModal}
        >
          + Add Member
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((t) => {
          const links = typeof t.links === "string" 
            ? JSON.parse(t.links || "{}") 
            : (t.links || {});
          
          return (
            <div
              key={t.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              {t.image && (
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  {t.name}
                </h4>
                {t.role && (
                  <p className="text-sm text-indigo-600 font-medium mb-2">
                    {t.role}
                  </p>
                )}
                {t.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {t.bio}
                  </p>
                )}
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline mb-3 inline-block"
                  >
                    LinkedIn →
                  </a>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 px-3 py-2 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    onClick={() => openEditModal(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 px-3 py-2 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    onClick={() => removeMember(t)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-1"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter team member name"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Founder & President"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter a brief biography..."
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      <label
                        htmlFor="image-upload"
                        className={`inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                          uploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {uploading ? "Uploading..." : "Or Upload Image"}
                      </label>
                    </div>
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* LinkedIn Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.links.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, linkedin: e.target.value },
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm md:text-base"
                  >
                    {editingMember ? "Update" : "Add"} Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ supabase }) {
  const [site, setSite] = useState({ id: 1, title: "NGO", contact_email: "" });
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (data) {
        setSite(data);
      } else {
        setSite((prev) => ({ ...prev, id: 1 }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function save() {
    setLoading(true);
    try {
      await supabase.from("site_settings").upsert(site, { onConflict: "id" });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Global Site Settings</h3>
      <div className="space-y-4 max-w-lg">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="site-title"
          >
            Site Title
          </label>
          <input
            id="site-title"
            value={site.title}
            onChange={(e) => setSite({ ...site, title: e.target.value })}
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
            type="text"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="contact-email"
          >
            Contact Email
          </label>
          <input
            id="contact-email"
            value={site.contact_email}
            onChange={(e) =>
              setSite({ ...site, contact_email: e.target.value })
            }
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
            type="email"
          />
        </div>
        <div>
          <button
            onClick={save}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-medium disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
