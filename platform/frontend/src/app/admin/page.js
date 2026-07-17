'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    setUser(parsed);
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-xl">🤖</span>
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>

        <nav className="space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="📊 Dashboard" />
          <NavItem active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} label="🤖 Agent Builder" />
          <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="👥 Users" />
          <NavItem active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} label="🧠 Skills" />
          <NavItem active={activeTab === 'deployments'} onClick={() => setActiveTab('deployments')} label="🚀 Deployments" />
          <NavItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="📋 Logs" />
        </nav>

        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="text-sm text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'agents' && <AgentBuilder />}
        {activeTab === 'users' && <UsersPanel />}
        {activeTab === 'skills' && <SkillsPanel />}
        {activeTab === 'deployments' && <DeploymentsPanel />}
        {activeTab === 'logs' && <LogsPanel />}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value="0" trend="+0 today" />
        <StatCard label="Active Agents" value="0" trend="0 deployed" />
        <StatCard label="Conversations" value="0" trend="0 today" />
        <StatCard label="Phone Calls" value="0" trend="0 today" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <p className="text-gray-500">No activity yet. Deploy an agent to see activity here.</p>
      </div>
    </div>
  );
}

function AgentBuilder() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Agent Builder</h2>
      <p className="text-gray-600 mb-6">Create and configure agent templates that can be deployed to customer accounts.</p>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Agent Creation Interface</h3>
        <p className="text-gray-500 mb-4">
          This interface allows you to build agents with specific skill combinations, 
          configure their personality and capabilities, and deploy them to customer environments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <span className="text-3xl mb-2 block">🧠</span>
            <h4 className="font-medium">Master Agent</h4>
            <p className="text-sm text-gray-500">Full capability — all skills enabled</p>
            <button className="mt-3 text-sm text-blue-600 hover:underline">Deploy as Master</button>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <span className="text-3xl mb-2 block">⚡</span>
            <h4 className="font-medium">Specialist Agent</h4>
            <p className="text-sm text-gray-500">Single skill focus — optimized for one task</p>
            <button className="mt-3 text-sm text-blue-600 hover:underline">Create Specialist</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersPanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">No users registered yet.</p>
      </div>
    </div>
  );
}

function SkillsPanel() {
  const skills = [
    { id: 'core_conversation', name: 'Core Conversation', category: 'core', status: 'active' },
    { id: 'business_info', name: 'Business Info', category: 'core', status: 'active' },
    { id: 'language', name: 'Multilingual', category: 'core', status: 'active' },
    { id: 'escalation', name: 'Escalation', category: 'core', status: 'active' },
    { id: 'appointment_scheduling', name: 'Appointment Scheduling', category: 'operations', status: 'active' },
    { id: 'lead_qualification', name: 'Lead Qualification', category: 'sales', status: 'active' },
    { id: 'receptionist_phone', name: 'Phone Receptionist', category: 'voice', status: 'active' },
    { id: 'faq_management', name: 'FAQ Management', category: 'support', status: 'active' },
    { id: 'basic_coding', name: 'Basic Coding', category: 'technical', status: 'active' },
    { id: 'landing_page_builder', name: 'Landing Page Builder', category: 'technical', status: 'active' },
    { id: 'fullstack_dev', name: 'Full-Stack Development', category: 'addon', status: 'addon' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Skill Modules</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Skill</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {skills.map(skill => (
              <tr key={skill.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{skill.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">{skill.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    skill.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {skill.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-sm text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeploymentsPanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Deployments</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">No active deployments. Create an agent and deploy it to see it here.</p>
      </div>
    </div>
  );
}

function LogsPanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Logs</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">Conversation logs, API calls, and system events will appear here.</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
    </div>
  );
}
