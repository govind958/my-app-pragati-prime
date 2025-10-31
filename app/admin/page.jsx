"use client"; // REQUIRED for using React hooks (useState, useEffect) in Next.js App Router

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust path as needed

// Initialize Supabase Client
const supabase = createClient();

//----------------------------------------------------------------------
// MAIN COMPONENT
//----------------------------------------------------------------------

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Data stores
  const [stats, setStats] = useState({ totalUsers: 0, paidUsers: 0, articles: 0, revenue: 0 });
  const [members, setMembers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [team, setTeam] = useState([]);

  // --- Data Fetching Functions ---

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: users }, { data: posts }, { data: subs }] = await Promise.all([
        supabase.from('profiles').select('id, email, role, created_at, name'),
        // Ensure 'published' is included for consistency
        supabase.from('articles').select('id, title, is_paid, published, created_at, author_id'),
        supabase.from('payments').select('id, amount, user_id, status, created_at'),
      ]);

      const totalUsers = users?.length ?? 0;
      const paidUsers = users?.filter(u => u.role === 'paid').length ?? 0;
      const articlesCount = posts?.length ?? 0;
      const revenue = subs?.reduce((s, p) => s + (p.amount ?? 0), 0) ?? 0;

      setStats({ totalUsers, paidUsers, articles: articlesCount, revenue });
      setMembers(users || []);
      setArticles(posts || []);
      setPayments(subs || []);
    } catch (err) {
      console.error('fetchDashboard Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('profiles').select('id, email, name, role, created_at');
      setMembers(data || []);
    } catch (err) {
      console.error('loadMembers Error:', err);
    } finally { setLoading(false); }
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('articles').select('id, title, is_paid, published, created_at, author_id');
      setArticles(data || []);
    } catch (err) {
      console.error('loadArticles Error:', err);
    } finally { setLoading(false); }
  }, []);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('payments').select('id, user_id, amount, status, created_at');
      setPayments(data || []);
    } catch (err) { console.error('loadPayments Error:', err); } finally { setLoading(false); }
  }, []);

  const loadTeam = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('core_team').select('*');
      setTeam(data || []);
    } catch (err) { console.error('loadTeam Error:', err); } finally { setLoading(false); }
  }, []);

  // --- Effects and Handlers ---

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const switchSection = (sec) => {
    setSection(sec);
    // Lazy load section data
    if (sec === 'members') loadMembers();
    else if (sec === 'articles') loadArticles();
    else if (sec === 'payments') loadPayments();
    else if (sec === 'team') loadTeam();
  };

  // Function to determine which component to render
  const renderSection = () => {
    switch (section) {
      case 'dashboard':
        return <Dashboard stats={stats} refresh={fetchDashboard} />;
      case 'members':
        return <MembersTable members={members} refresh={loadMembers} supabase={supabase} />;
      case 'articles':
        return <ArticlesTable articles={articles} refresh={loadArticles} supabase={supabase} />;
      case 'payments':
        return <PaymentsTable payments={payments} refresh={loadPayments} />;
      case 'team':
        return <TeamManager team={team} refresh={loadTeam} supabase={supabase} />;
      case 'settings':
        return <SettingsPanel supabase={supabase} />;
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r p-4 sticky top-0 h-screen">
        <h1 className="text-xl font-semibold mb-6 text-indigo-800">NGO Admin</h1>
        <nav className="space-y-2">
          <NavButton active={section === 'dashboard'} onClick={() => switchSection('dashboard')}>Dashboard</NavButton>
          <NavButton active={section === 'members'} onClick={() => switchSection('members')}>Members</NavButton>
          <NavButton active={section === 'articles'} onClick={() => switchSection('articles')}>Articles</NavButton>
          <NavButton active={section === 'payments'} onClick={() => switchSection('payments')}>Payments</NavButton>
          <NavButton active={section === 'team'} onClick={() => switchSection('team')}>Core Team</NavButton>
          <NavButton active={section === 'settings'} onClick={() => switchSection('settings')}>Settings</NavButton>
        </nav>
        <div className="mt-8 pt-4 border-t">
          <button
            className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </h2>
            <p className="text-sm text-gray-500">Admin control panel — manage site content & members.</p>
          </div>
          {section === 'articles' && (
            <button
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-medium"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('admin:add-article'));
              }}
            >
              + Add Article
            </button>
          )}
        </header>

        <section className="bg-white p-6 rounded-xl shadow-lg min-h-[70vh]">
          {loading && (
            <div className="flex justify-center items-center h-full text-lg text-indigo-600">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
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
      className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition duration-150 ${active
        ? 'bg-indigo-100 text-indigo-700 shadow-sm'
        : 'text-gray-700 hover:bg-gray-100'
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} />
        <StatCard title="Paid Members" value={stats.paidUsers.toLocaleString()} />
        <StatCard title="Articles Published" value={stats.articles.toLocaleString()} />
        <StatCard title="Total Revenue" value={`₹ ${stats.revenue.toLocaleString()}`} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-100 shadow-inner">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Quick Actions & Status</h3>
        <p className="text-sm text-gray-500">
          The metrics above are generated from the latest data.
        </p>
        <div className="mt-4">
          <button
            onClick={refresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function MembersTable({ members = [], refresh, supabase }) {
  async function toggleRole(member) {
    const newRole = member.role === 'member' ? 'paid' : 'member';
    if (!confirm(`Change ${member.email} role to '${newRole}'?`)) return;

    try {
      await supabase.from('profiles').update({ role: newRole }).eq('id', member.id);
      refresh();
    } catch (error) {
      console.error('Error toggling role:', error);
      alert('Failed to update member role.');
    }
  }

  async function deleteMember(member) {
    if (!confirm(`Permanently delete member ${member.email}? This action cannot be undone.`)) return;

    try {
      await supabase.from('profiles').delete().eq('id', member.id);
      refresh();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member. Check RLS policies.');
    }
  }

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Site Members ({members.length})</h3>
      <table className="min-w-full text-sm table-auto border-collapse">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="p-3 font-medium text-gray-600">Email</th>
            <th className="p-3 font-medium text-gray-600">Name</th>
            <th className="p-3 font-medium text-gray-600">Role</th>
            <th className="p-3 font-medium text-gray-600">Joined</th>
            <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-mono text-xs">{m.email}</td>
              <td className="p-3">{m.name || 'N/A'}</td>
              <td className="p-3">
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${m.role === 'paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {m.role || 'member'}
                </span>
              </td>
              <td className="p-3 text-gray-500">{new Date(m.created_at).toLocaleDateString()}</td>
              <td className="p-3 text-right whitespace-nowrap">
                <button
                  className="mr-2 px-3 py-1 text-xs bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  onClick={() => toggleRole(m)}
                >
                  {m.role === 'paid' ? 'Demote' : 'Promote'}
                </button>
                <button
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  onClick={() => deleteMember(m)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {members.length === 0 && <p className="text-center py-4 text-gray-500">No members found.</p>}
    </div>
  );
}

function ArticlesTable({ articles = [], refresh, supabase }) {
  const openArticleEditor = useCallback((article) => {
    const url = article ? `/admin/articles/edit/${article.id}` : `/admin/articles/new`;
    window.location.href = url;
  }, []);

  useEffect(() => {
    const handler = () => openArticleEditor(null);
    window.addEventListener('admin:add-article', handler);
    return () => window.removeEventListener('admin:add-article', handler);
  }, [openArticleEditor]);

  async function publishToggle(a) {
    try {
      await supabase.from('articles').update({ published: !a.published }).eq('id', a.id);
      refresh();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update article status.');
    }
  }

  async function deleteArticle(a) {
    if (!confirm(`Permanently delete article "${a.title || a.id}"?`)) return;

    try {
      await supabase.from('articles').delete().eq('id', a.id);
      refresh();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Check RLS policies.');
    }
  }

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Content Articles ({articles.length})</h3>
      <table className="min-w-full text-sm table-auto border-collapse">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="p-3 font-medium text-gray-600">Title</th>
            <th className="p-3 font-medium text-gray-600">Paid</th>
            <th className="p-3 font-medium text-gray-600">Published</th>
            <th className="p-3 font-medium text-gray-600">Created</th>
            <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(a => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium text-indigo-700">{a.title || 'Untitled'}</td>
              <td className="p-3">{a.is_paid ? 'Yes' : 'No'}</td>
              <td className="p-3">
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${a.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {a.published ? 'Live' : 'Draft'}
                </span>
              </td>
              <td className="p-3 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
              <td className="p-3 text-right whitespace-nowrap">
                <button
                  className="mr-2 px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  onClick={() => openArticleEditor(a)}
                >
                  Edit
                </button>
                <button
                  className={`mr-2 px-3 py-1 text-xs text-white rounded-md transition ${a.published ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
                  onClick={() => publishToggle(a)}
                >
                  {a.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  onClick={() => deleteArticle(a)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {articles.length === 0 && <p className="text-center py-4 text-gray-500">No articles found.</p>}
    </div>
  );
}

function PaymentsTable({ payments = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Payment Transactions ({payments.length})</h3>
      <table className="min-w-full text-sm table-auto border-collapse">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="p-3 font-medium text-gray-600">Txn ID (Partial)</th>
            <th className="p-3 font-medium text-gray-600">User ID (Partial)</th>
            <th className="p-3 font-medium text-gray-600">Amount</th>
            <th className="p-3 font-medium text-gray-600">Status</th>
            <th className="p-3 font-medium text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-mono text-xs text-gray-600">{p.id.substring(0, 8)}...</td>
              <td className="p-3 font-mono text-xs text-gray-600">{p.user_id ? p.user_id.substring(0, 8) + '...' : 'N/A'}</td>
              <td className="p-3 font-semibold">₹ {p.amount ? p.amount.toLocaleString() : '0'}</td>
              <td className="p-3">
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(p.status)}`}>
                  {p.status || 'unknown'}
                </span>
              </td>
              <td className="p-3 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {payments.length === 0 && <p className="text-center py-4 text-gray-500">No payments found.</p>}
    </div>
  );
}

function TeamManager({ team = [], refresh, supabase }) {
  async function addMember() {
    const name = prompt('Enter New Core Team Member Name:');
    if (!name || name.trim() === '') return;

    try {
      await supabase.from('core_team').insert([{ name: name.trim() }]);
      refresh();
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Failed to add team member.');
    }
  }

  async function removeMember(t) {
    if (!confirm(`Remove ${t.name} from the Core Team?`)) return;

    try {
      await supabase.from('core_team').delete().eq('id', t.id);
      refresh();
    } catch (error) {
      console.error('Error removing team member:', error);
      alert('Failed to remove team member.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <h3 className="text-lg font-semibold">Core Team ({team.length})</h3>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
          onClick={addMember}
        >
          + Add Member
        </button>
      </div>
      <ul className="space-y-2">
        {team.map(t => (
          <li key={t.id} className="flex items-center justify-between border-b last:border-b-0 py-3 px-2 hover:bg-gray-50 rounded-md transition">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 truncate">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role || 'Team Member'}</div>
            </div>
            <div>
              <button
                className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                onClick={() => removeMember(t)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      {team.length === 0 && <p className="text-center py-4 text-gray-500">No team members listed.</p>}
    </div>
  );
}

function SettingsPanel({ supabase }) {
  const [site, setSite] = useState({ id: 1, title: 'NGO', contact_email: '' });
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      if (data) {
        setSite(data);
      } else {
        setSite(prev => ({ ...prev, id: 1 }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function save() {
    setLoading(true);
    try {
      await supabase.from('site_settings').upsert(site, { onConflict: 'id' });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-4 text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Global Site Settings</h3>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="site-title">Site Title</label>
          <input
            id="site-title"
            value={site.title}
            onChange={e => setSite({ ...site, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-email">Contact Email</label>
          <input
            id="contact-email"
            value={site.contact_email}
            onChange={e => setSite({ ...site, contact_email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            type="email"
          />
        </div>
        <div>
          <button
            onClick={save}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}