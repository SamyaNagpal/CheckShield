export default function LandingPage({ onGoToLogin, onGoToRegister }) {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <div className="landing-navbar">
        <div className="landing-navbar-logo">
          <span>🛡️</span>
          <span>CheckShield</span>
        </div>
        
        <div className="landing-navbar-menu">
          <a href="#home">Home</a>
          <a href="#scanners">Scanners</a>
          <a href="#features">Features</a>
          <a href="#community">Community</a>
        </div>
        
        <div className="landing-navbar-cta">
          <button 
            className="button-secondary" 
            onClick={onGoToLogin}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Sign In
          </button>
          <button 
            className="button-primary" 
            onClick={onGoToRegister}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="landing-hero">
        <div className="landing-hero-icon">🛡️</div>
        <h1 className="landing-hero-title">Protect Yourself from Cyber Threats</h1>
        <p className="landing-hero-subtitle">
          CheckShield empowers you with powerful tools to identify phishing, malicious URLs, and email threats. 
          Join thousands of security-conscious users protecting themselves online.
        </p>
        <div className="landing-hero-cta">
          <button 
            className="button-primary" 
            onClick={onGoToRegister}
            style={{ padding: '12px 32px', fontSize: '15px', fontWeight: 600 }}
          >
            Start Scanning Now
          </button>
          <button 
            className="button-secondary" 
            onClick={onGoToLogin}
            style={{ padding: '12px 32px', fontSize: '15px', fontWeight: 600 }}
          >
            View Dashboard
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary-blue)' }}>240+</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Total Scans</div>
        </div>
        <div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent-red)' }}>27</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Threats Detected</div>
        </div>
        <div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent-green)' }}>185</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Safe URLs</div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        background: 'var(--primary-bg)',
        padding: '60px 40px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          textAlign: 'center', 
          marginBottom: '10px',
          color: 'var(--text-primary)'
        }}>
          Comprehensive Security Tools
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--text-secondary)', 
          textAlign: 'center', 
          marginBottom: '50px',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Comprehensive suite of scanners designed to protect you from multiple cyber threats
        </p>

        <div className="landing-features">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🔗</div>
            <div className="landing-feature-title">URL Phishing Scanner</div>
            <div className="landing-feature-desc">
              Analyze any URL for phishing attacks and malicious content before you click
            </div>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">📧</div>
            <div className="landing-feature-title">Email Scam Detection</div>
            <div className="landing-feature-desc">
              Detect phishing emails and scam indicators with advanced ML analysis
            </div>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">💳</div>
            <div className="landing-feature-title">UPI Protection</div>
            <div className="landing-feature-desc">
              Secure your UPI transactions from fraud and unauthorized payments
            </div>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">📱</div>
            <div className="landing-feature-title">QR Code Scanner</div>
            <div className="landing-feature-desc">
              Scan QR codes safely to identify malicious links and phishing attempts
            </div>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">📊</div>
            <div className="landing-feature-title">Analytics Dashboard</div>
            <div className="landing-feature-desc">
              Monitor your scanning activity and security metrics in real-time
            </div>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">🔒</div>
            <div className="landing-feature-title">Secure & Private</div>
            <div className="landing-feature-desc">
              Your data is encrypted and never shared with third parties
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '60px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)'
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          color: 'white',
          marginBottom: '15px'
        }}>
          Ready to Secure Your Online Life?
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)', 
          marginBottom: '30px',
          maxWidth: '600px',
          margin: '0 auto 30px'
        }}>
          Join thousands of users already using CheckShield to protect themselves from cyber threats
        </p>
        <button 
          className="button-secondary" 
          onClick={onGoToRegister}
          style={{ 
            padding: '12px 32px', 
            fontSize: '15px', 
            fontWeight: 600,
            background: 'white',
            color: 'var(--primary-blue)',
            border: 'none'
          }}
        >
          Start Free Today
        </button>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        padding: '30px 40px',
        textAlign: 'center',
        background: 'white'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          © 2026 CheckShield. All rights reserved. | Privacy Policy | Terms of Service
        </p>
      </div>
    </div>
  );
}
