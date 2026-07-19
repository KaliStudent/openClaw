'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isAdmin ? 'admin-login' : 'login';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = data.user.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ marginBottom: '48px' }}>
          <Link href="/" className="mono text-green" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            MAINSTREET_AI
          </Link>
        </div>

        <h2 style={{ marginBottom: '8px' }}>{isAdmin ? 'Admin Access' : 'Log In'}</h2>
        <p className="text-muted" style={{ marginBottom: '32px' }}>
          {isAdmin ? 'Agent management interface' : 'Access your dashboard'}
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: '24px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              placeholder="you@business.com"
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Connecting...' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/register" className="mono" style={{ fontSize: '0.8rem' }}>
            Create Account →
          </Link>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="mono"
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isAdmin ? '← User login' : 'Admin →'}
          </button>
        </div>
      </div>
    </div>
  );
}
