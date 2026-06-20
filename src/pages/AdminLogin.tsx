/**
 * AdminLogin — Glassmorphism login page for the CRM admin panel.
 * Posts credentials to Django JWT endpoint and stores tokens.
 */
import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminLogin, setTokens } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await adminLogin(form.username, form.password);
      setTokens(data.access, data.refresh);
      localStorage.setItem('crm_admin', JSON.stringify(data.admin));
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: '20px',
    }}>
      {/* Animated background orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'pulse 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'pulse 6s ease-in-out infinite 2s',
        }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.1);opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-input {
          width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
          border-radius:12px; padding:14px 16px; color:#f1f5f9; font-size:15px;
          outline:none; transition:all 0.2s; box-sizing:border-box; font-family:inherit;
        }
        .login-input:focus { border-color:#6366f1; background:rgba(99,102,241,0.08); box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
        .login-input::placeholder { color:#475569; }
        .login-btn {
          width:100%; padding:15px; background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border:none; border-radius:12px; color:#fff; font-size:15px; font-weight:600;
          cursor:pointer; transition:all 0.2s; font-family:inherit; letter-spacing:0.3px;
        }
        .login-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 25px rgba(99,102,241,0.4); }
        .login-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 420,
        animation: 'slideUp 0.5s ease-out',
        position: 'relative', zIndex: 1,
      }}>
        {/* Card */}
        <div style={{
          background: 'rgba(30,41,59,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '48px 40px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              borderRadius: 18, margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
            }}>
              🔐
            </div>
            <h1 style={{ margin: 0, color: '#f1f5f9', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>
              Admin Portal
            </h1>
            <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 14 }}>
              ExpertiseCo CRM Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
                Username
              </label>
              <input
                id="admin-username"
                className="login-input"
                type="text"
                placeholder="Enter admin username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
                Password
              </label>
              <input
                id="admin-password"
                className="login-input"
                type="password"
                placeholder="Enter admin password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '12px 16px',
                color: '#fca5a5', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button id="admin-login-btn" className="login-btn" type="submit" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : '→ Sign In'}
            </button>
          </form>

          <p style={{ margin: '24px 0 0', textAlign: 'center', color: '#334155', fontSize: 12 }}>
            Secured with JWT Authentication
          </p>
        </div>

        {/* Back to site link */}
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ color: '#6366f1', textDecoration: 'none', fontSize: 14, opacity: 0.7 }}>
            ← Back to ExpertiseCo
          </a>
        </p>
      </div>
    </div>
  );
}
