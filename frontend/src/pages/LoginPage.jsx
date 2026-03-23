import { useState } from 'react';
import { loginUser } from '../api';

export default function LoginPage({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-header-icon">🛡️</span>
          <h1 className="auth-header-title">CheckShield</h1>
          <p className="auth-header-subtitle">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-form-label">Email Address</label>
            <input
              type="email"
              className="auth-form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Password</label>
            <input
              type="password"
              className="auth-form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="auth-form-button"
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : '🔓 Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-form-link">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onGoToRegister();
          }}>
            Create one now
          </a>
        </div>
      </div>
    </div>
  );
}