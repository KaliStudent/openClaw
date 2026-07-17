'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [agents, setAgents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }
    setUser(JSON.parse(stored));
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/agents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAgents(data.agents || []);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🤖</span>
            <h1 className="text-lg font-bold">MainStreet AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Agents" value={agents.filter(a => a.status === 'deployed').length} />
          <StatCard label="Total Agents" value={agents.length} />
          <StatCard label="Conversations Today" value="—" />
          <StatCard label="Calls Today" value="—" />
        </div>

        {/* Agents Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Agents</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            + Create Agent
          </button>
        </div>

        {agents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="text-5xl mb-4 block">🤖</span>
            <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI agent to start serving customers 24/7.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </main>

      {/* Create Agent Modal (placeholder) */}
      {showCreateModal && (
        <CreateAgentModal onClose={() => setShowCreateModal(false)} onCreated={fetchAgents} />
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function AgentCard({ agent }) {
  const statusColor = agent.status === 'deployed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-lg">{agent.name}</h4>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
          {agent.status}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{agent.business_profile?.name}</p>
      <div className="flex flex-wrap gap-1 mb-4">
        {agent.skills?.enabled?.slice(0, 4).map(skill => (
          <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {skill.replace('_', ' ')}
          </span>
        ))}
        {(agent.skills?.enabled?.length || 0) > 4 && (
          <span className="text-xs text-gray-500">+{agent.skills.enabled.length - 4} more</span>
        )}
      </div>
      <div className="flex space-x-2">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Configure</button>
        <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">Test Chat</button>
      </div>
    </div>
  );
}

function CreateAgentModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    business_name: '',
    business_type: '',
    description: '',
    skills: ['appointment_scheduling', 'faq_management'],
    languages: ['en', 'es']
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          business_profile: {
            name: form.business_name,
            type: form.business_type,
            description: form.description
          },
          skills: form.skills,
          languages: form.languages
        })
      });

      if (res.ok) {
        onCreated();
        onClose();
      }
    } catch (err) {
      console.error('Failed to create agent:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Create New Agent</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="My Business Assistant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={form.business_name}
              onChange={(e) => setForm({...form, business_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Acme Auto Repair"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select
              value={form.business_type}
              onChange={(e) => setForm({...form, business_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select type...</option>
              <option value="auto_repair">Auto Repair</option>
              <option value="medical">Medical</option>
              <option value="dental">Dental</option>
              <option value="legal">Legal</option>
              <option value="restaurant">Restaurant</option>
              <option value="salon">Salon</option>
              <option value="retail">Retail</option>
              <option value="construction">Construction</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Brief description of what this business does..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="checkbox" checked={form.languages.includes('en')}
                  onChange={(e) => {
                    const langs = e.target.checked 
                      ? [...form.languages, 'en'] 
                      : form.languages.filter(l => l !== 'en');
                    setForm({...form, languages: langs});
                  }}
                  className="mr-2"
                />
                English
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={form.languages.includes('es')}
                  onChange={(e) => {
                    const langs = e.target.checked 
                      ? [...form.languages, 'es'] 
                      : form.languages.filter(l => l !== 'es');
                    setForm({...form, languages: langs});
                  }}
                  className="mr-2"
                />
                Español
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'appointment_scheduling',
                'lead_qualification',
                'receptionist_phone',
                'faq_management',
                'basic_coding',
                'landing_page_builder'
              ].map(skill => (
                <label key={skill} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={form.skills.includes(skill)}
                    onChange={(e) => {
                      const skills = e.target.checked
                        ? [...form.skills, skill]
                        : form.skills.filter(s => s !== skill);
                      setForm({...form, skills});
                    }}
                    className="mr-2"
                  />
                  {skill.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Agent'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
