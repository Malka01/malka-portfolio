'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stethoscope, Loader2, AlertCircle } from 'lucide-react';

export default function MediCare360Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/medicare360/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed');
        return;
      }

      // Redirect based on role
      const role = data.data?.user?.role;
      if (role === 'PATIENT') {
        router.push('/medicare360');
      } else {
        router.push('/medicare360');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo@1234');
    setError('');
  };

  return (
    <div className="mc360-login-page">
      <div className="mc360-login-card">
        <Link href="/medicare360" className="mc360-login-logo">
          <span className="mc360-logo-mark">
            <Stethoscope size={18} strokeWidth={2.4} />
          </span>
          <span className="mc360-logo-text">
            MediCare<strong>360</strong>
          </span>
        </Link>

        <h1 className="mc360-login-title">Sign in</h1>
        <p className="mc360-login-sub">
          Demo platform — use one of the demo accounts below.
        </p>

        {error && (
          <div className="mc360-login-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mc360-login-form">
          <div className="mc360-login-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@medicare360.demo"
              required
              autoComplete="email"
            />
          </div>

          <div className="mc360-login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="mc360-btn mc360-btn-primary mc360-login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mc360-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mc360-login-demos">
          <div className="mc360-login-demos-title">
            Quick demo access (password: Demo@1234)
          </div>
          <div className="mc360-login-demo-grid">
            {[
              ['Admin', 'admin@medicare360.demo'],
              ['Doctor', 'doctor@medicare360.demo'],
              ['Reception', 'reception@medicare360.demo'],
              ['Patient', 'patient@medicare360.demo'],
              ['Pharmacist', 'pharmacist@medicare360.demo'],
              ['Lab', 'lab@medicare360.demo'],
              ['Super Admin', 'superadmin@medicare360.demo'],
            ].map(([label, mail]) => (
              <button
                key={mail}
                type="button"
                onClick={() => fillDemo(mail)}
                className="mc360-login-demo-btn"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="mc360-login-note">
          Demo credentials — never use in production.
        </p>
      </div>
    </div>
  );
}