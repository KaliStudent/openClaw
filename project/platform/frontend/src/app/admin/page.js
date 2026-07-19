'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { window.location.href = '/login'; return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') { window.location.href = '/dashboard'; return; }
    setUser(parsed);
  }, []);

  if (!user) return null;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '◉' },
    { id: 'agents', label: 'Agents', icon: '◎' },
    { id: 'users', label: 'Users', icon: '◈' },
    { id: 'skills', label: 'Skills', icon: '▣' },
    { id: 'deployments', label: 'Deploy', icon: '◐' },
    { id: 'logs', label: 'Logs', icon: '⬡' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: 'var(--bg-secondary)', borderRight: '2px solid var(--border-default)', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <Link href="/" className="mono text-green" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '48px', display: 'block' }}>
          MAINSTREET_AI
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                background: tab === t.id ? 'var(--bg-hover)' : 'transparent',
                border: tab === t.id ? '1px solid var(--neon-green)' : '1px solid transparent',
                color: tab === t.id ? 'var(--neon-green)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                cursor: 'pointer', textAlign: 'left',
                textTransform: 'uppercase', letterSpacing: '0.05em'
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="mono"
          style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '8px 12px' }}
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 48px', overflow: 'auto' }}>
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'agents' && <AdminAgents />}
        {tab === 'users' && <AdminUsers />}
        {tab === 'skills' && <AdminSkills />}
        {tab === 'deployments' && <AdminDeployments />}
        {tab === 'logs' && <AdminLogs />}
      </main>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Dashboard</h2>
      <div className="grid grid-4" style={{ marginBottom: '48px' }}>
        <div className="stat">
          <div className="stat-value">0</div>
          <div className="stat-label">Users</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{ color: 'var(--neon-orange)' }}>0</div>
          <div className="stat-label">Agents</div>
        </div>
        <div className="stat">
          <div className="stat-value">0</div>
          <div className="stat-label">Conversations</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{ color: 'var(--neon-magenta)' }}>0</div>
          <div className="stat-label">Calls</div>
        </div>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: '12px' }}>Recent Activity</h4>
        <p className="text-muted">No activity yet. Deploy an agent to start.</p>
      </div>
    </div>
  );
}

function AdminAgents() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Agent Builder</h2>
        <button className="btn btn-primary">+ Create Template</button>
      </div>
      <div className="grid grid-2">
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="text-green" style={{ fontSize: '2rem', marginBottom: '12px' }}>◉</div>
          <h4 style={{ marginBottom: '8px' }}>Master Agent</h4>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Full capability — all skills</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="text-orange" style={{ fontSize: '2rem', marginBottom: '12px' }}>◎</div>
          <h4 style={{ marginBottom: '8px' }}>Specialist</h4>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Single skill focus</p>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Users</h2>
      <div className="card">
        <p className="text-muted">No users registered yet.</p>
      </div>
    </div>
  );
}

function AdminSkills() {
  const skills = [
    { id: 'core_conversation', name: 'Core Conversation', category: 'core', status: 'active' },
    { id: 'business_info', name: 'Business Info', category: 'core', status: 'active' },
    { id: 'language', name: 'Multilingual', category: 'core', status: 'active' },
    { id: 'escalation', name: 'Escalation', category: 'core', status: 'active' },
    { id: 'appointment_scheduling', name: 'Appointments', category: 'ops', status: 'active' },
    { id: 'lead_qualification', name: 'Lead Qualifier', category: 'sales', status: 'active' },
    { id: 'receptionist_phone', name: 'Phone Receptionist', category: 'voice', status: 'active' },
    { id: 'faq_management', name: 'FAQ Bot', category: 'support', status: 'active' },
    { id: 'basic_coding', name: 'Basic Coding', category: 'tech', status: 'active' },
    { id: 'landing_page_builder', name: 'Page Builder', category: 'tech', status: 'active' },
    { id: 'fullstack_dev', name: 'Full-Stack Dev', category: 'addon', status: 'addon' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Skill Modules</h2>
      <div style={{ border: '2px solid var(--border-default)' }}>
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td><span className="tag">{s.category}</span></td>
                <td>
                  <span className={`tag ${s.status === 'active' ? 'tag-green' : 'tag-orange'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="mono text-green" style={{ fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDeployments() {
  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Deployments</h2>
      <div className="card">
        <p className="text-muted">No active deployments.</p>
      </div>
    </div>
  );
}

function AdminLogs() {
  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>System Logs</h2>
      <div className="card" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        <p className="text-muted">Waiting for events...</p>
      </div>
    </div>
  );
}
