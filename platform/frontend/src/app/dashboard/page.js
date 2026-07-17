'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [agents, setAgents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { window.location.href = '/login'; return; }
    setUser(JSON.parse(stored));
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAgents(data.agents || []);
    } catch (err) { /* silent */ }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="container">
        <div className="header">
          <Link href="/" className="header-logo">MAINSTREET_AI</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span className="mono text-muted" style={{ fontSize: '0.8rem' }}>{user.name}</span>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
              className="mono"
              style={{ fontSize: '0.8rem', color: 'var(--neon-magenta)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '48px' }}>
        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom: '48px' }}>
          <div className="stat">
            <div className="stat-value">{agents.filter(a => a.status === 'deployed').length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat">
            <div className="stat-value" style={{ color: 'var(--neon-orange)' }}>{agents.length}</div>
            <div className="stat-label">Total Agents</div>
          </div>
          <div className="stat">
            <div className="stat-value">—</div>
            <div className="stat-label">Conversations</div>
          </div>
          <div className="stat">
            <div className="stat-value">—</div>
            <div className="stat-label">Calls Today</div>
          </div>
        </div>

        {/* Agents */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Your Agents</h3>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New Agent
          </button>
        </div>

        {agents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>◉</div>
            <h4 style={{ marginBottom: '8px' }}>No agents deployed</h4>
            <p className="text-muted" style={{ marginBottom: '24px' }}>Create your first AI agent to start serving customers 24/7.</p>
            <button className="btn btn-secondary" onClick={() => setShowCreate(true)}>
              Create Agent →
            </button>
          </div>
        ) : (
          <div className="grid grid-3">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </main>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchAgents(); }} />}
    </div>
  );
}

function AgentCard({ agent }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h4>{agent.name}</h4>
        <span className={`tag ${agent.status === 'deployed' ? 'tag-green' : 'tag-orange'}`}>
          {agent.status}
        </span>
      </div>
      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
        {agent.business_profile?.name}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
        {agent.skills?.enabled?.slice(0, 4).map(skill => (
          <span key={skill} className="tag">{skill.replace(/_/g, ' ')}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <button className="mono text-green" style={{ fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          Configure
        </button>
        <button className="mono text-orange" style={{ fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          Test Chat
        </button>
      </div>
    </div>
  );
}

function CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    business_name: '',
    business_type: '',
    description: '',
    skills: ['appointment_scheduling', 'faq_management'],
    languages: ['en', 'es']
  });
  const [loading, setLoading] = useState(false);

  const allSkills = [
    'appointment_scheduling', 'lead_qualification', 'receptionist_phone',
    'faq_management', 'basic_coding', 'landing_page_builder'
  ];

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          business_profile: { name: form.business_name, type: form.business_type, description: form.description },
          skills: form.skills,
          languages: form.languages
        })
      });
      if (res.ok) onCreated();
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
      <div style={{ background: 'var(--bg-elevated)', border: '2px solid var(--neon-green)', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3>New Agent</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '20px' }}>
            <label>Agent Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="My Business Assistant" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label>Business Name</label>
              <input type="text" required value={form.business_name} onChange={(e) => setForm({...form, business_name: e.target.value})} placeholder="Acme Repair" />
            </div>
            <div>
              <label>Type</label>
              <select value={form.business_type} onChange={(e) => setForm({...form, business_type: e.target.value})}>
                <option value="">Select...</option>
                <option value="auto_repair">Auto Repair</option>
                <option value="medical">Medical</option>
                <option value="legal">Legal</option>
                <option value="restaurant">Restaurant</option>
                <option value="salon">Salon</option>
                <option value="retail">Retail</option>
                <option value="msp">IT / MSP</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="What does this business do?" rows={3} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Skills</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              {allSkills.map(skill => (
                <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal' }}>
                  <input
                    type="checkbox"
                    checked={form.skills.includes(skill)}
                    onChange={(e) => {
                      const skills = e.target.checked ? [...form.skills, skill] : form.skills.filter(s => s !== skill);
                      setForm({...form, skills});
                    }}
                    style={{ width: 'auto' }}
                  />
                  {skill.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label>Languages</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {[['en', 'English'], ['es', 'Español']].map(([code, name]) => (
                <label key={code} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal' }}>
                  <input
                    type="checkbox"
                    checked={form.languages.includes(code)}
                    onChange={(e) => {
                      const langs = e.target.checked ? [...form.languages, code] : form.languages.filter(l => l !== code);
                      setForm({...form, languages: langs});
                    }}
                    style={{ width: 'auto' }}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Agent'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
