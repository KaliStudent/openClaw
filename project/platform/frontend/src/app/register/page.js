'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    business_name: '',
    business_type: '',
    language: 'en'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          business_name: form.business_name,
          language: form.language
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.errors?.[0]?.msg || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ marginBottom: '48px' }}>
          <Link href="/" className="mono text-green" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            MAINSTREET_AI
          </Link>
        </div>

        <h2 style={{ marginBottom: '8px' }}>Create Account</h2>
        <p className="text-muted" style={{ marginBottom: '32px' }}>
          Deploy your AI agent in minutes
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: '24px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label>Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="John Smith"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="you@business.com"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Business Name</label>
            <input
              type="text"
              required
              value={form.business_name}
              onChange={(e) => setForm({...form, business_name: e.target.value})}
              placeholder="Acme Auto Repair"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label>Industry</label>
              <select
                value={form.business_type}
                onChange={(e) => setForm({...form, business_type: e.target.value})}
              >
                <option value="">Select...</option>
                <option value="auto_repair">Auto Repair</option>
                <option value="medical">Medical / Doctor</option>
                <option value="dental">Dental</option>
                <option value="legal">Legal</option>
                <option value="restaurant">Restaurant</option>
                <option value="salon">Salon / Beauty</option>
                <option value="retail">Retail</option>
                <option value="construction">Construction</option>
                <option value="real_estate">Real Estate</option>
                <option value="fitness">Fitness</option>
                <option value="cleaning">Cleaning</option>
                <option value="msp">IT / MSP</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label>Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({...form, language: e.target.value})}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label>Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <label>Confirm</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                placeholder="Repeat password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: '32px' }}>
          <Link href="/login" className="mono" style={{ fontSize: '0.8rem' }}>
            ← Already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
