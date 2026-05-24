import { useState } from 'react';
import { scanURL } from '../api';

export default function URLScanner() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await scanURL(url);
      setResult({
        url: data.url,
        riskScore: data.risk_score,
        riskLevel: data.risk_level,
        ruleRisk: data.rule_risk,
        blacklistFlag: data.blacklist_flag,
        reasons: data.reasons
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return '#ef4444';
    if (score >= 40) return '#f59e0b';
    return '#22c55e';
  };

  const getBgColor = (score) => {
    if (score >= 70) return 'rgba(239, 68, 68, 0.1)';
    if (score >= 40) return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(34, 197, 94, 0.1)';
  };

  const getRiskBadgeClass = (level) => {
    if (level === 'High') return 'badge-high';
    if (level === 'Medium') return 'badge-medium';
    return 'badge-safe';
  };

  return (
    <div>
      <h1 className="page-title">URL Scanner</h1>
      <p className="page-subtitle">Analyze any URL for phishing, malware, and security threats before you click</p>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Enter URL to Scan</label>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Paste a URL below and we'll analyze it for potential threats
          </p>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          />
        </div>
        <button 
          className="button-primary"
          onClick={handleScan}
          disabled={isLoading}
          style={{ padding: '12px 24px', marginTop: '16px', borderRadius: '8px', fontWeight: 600 }}
        >
          {isLoading ? '⏳ Scanning...' : '🔍 Scan URL'}
        </button>
      </div>

      {error && (
        <div className="form-error" style={{ marginTop: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {isLoading && (
        <div className="loading" style={{ marginTop: '40px' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', fontSize: '15px' }}>Analyzing URL for security threats...</p>
        </div>
      )}

      {result && (
        <div className="card" style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Scanned URL
              </div>
              <div style={{ fontSize: '14px', wordBreak: 'break-all', color: 'var(--text-primary)', fontWeight: 500, lineHeight: '1.5' }}>
                {result.url}
              </div>
            </div>
            <span className={`badge ${getRiskBadgeClass(result.riskLevel)}`} style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
              {result.riskLevel.toUpperCase()}
            </span>
          </div>

          <div style={{ 
            marginBottom: '30px', 
            padding: '24px', 
            background: getBgColor(result.riskScore),
            borderRadius: '12px', 
            border: `2px solid ${getRiskColor(result.riskScore)}20`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Risk Score
              </label>
              <span style={{ fontSize: '32px', fontWeight: 800, color: getRiskColor(result.riskScore) }}>
                {result.riskScore}%
              </span>
            </div>
            <div className="risk-bar" style={{ height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                className="risk-bar-fill"
                style={{ 
                  width: `${result.riskScore}%`,
                  backgroundColor: getRiskColor(result.riskScore),
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
          </div>

          {result.blacklistFlag ? (
            <div style={{ 
              marginBottom: '30px', 
              padding: '18px 20px', 
              background: 'rgba(239, 68, 68, 0.15)',
              borderRadius: '12px',
              border: '2px solid #ef4444',
              display: 'flex',
              gap: '14px',
              alignItems: 'start'
            }}>
              <div style={{ fontSize: '28px', flexShrink: 0 }}>🚨</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
                  MALWARE DETECTED
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  This URL has been flagged as malicious by VirusTotal's threat intelligence database. Do not visit this website.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              marginBottom: '30px', 
              padding: '18px 20px', 
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '12px',
              border: '2px solid #22c55e',
              display: 'flex',
              gap: '14px',
              alignItems: 'start'
            }}>
              <div style={{ fontSize: '28px', flexShrink: 0 }}>✅</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e', marginBottom: '4px' }}>
                  VIRUSTOTAL VERIFIED SAFE
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  This URL has been checked against VirusTotal's threat intelligence database and is not detected as malicious.
                </div>
              </div>
            </div>
          )}


          <div style={{ 
            marginBottom: '30px', 
            padding: '20px', 
            background: 'var(--secondary-bg)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
              Analysis Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Rule-Based Analysis
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: getRiskColor(result.ruleRisk) }}>
                  {result.ruleRisk}%
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', paddingTop: '8px' }}>
                <strong>Final Score:</strong> {result.riskScore}% (based on security heuristics, pattern matching, and threat intelligence)
              </div>
            </div>
          </div>

          {result.reasons && result.reasons.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <h3 style={{ marginBottom: '18px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🚨 Threat Indicators
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.reasons.map((reason, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    padding: '14px 16px', 
                    background: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.5'
                  }}>
                    <span style={{ flexShrink: 0, fontSize: '16px' }}>⚠️</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!result.reasons || result.reasons.length === 0) && (
            <div style={{ 
              padding: '20px', 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>✅</div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>No threats detected. This URL appears to be safe.</p>
            </div>
          )}
        </div>
      )}

      {!result && !isLoading && !error && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)',
          marginTop: '30px'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🔗</div>
          <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
            Enter a URL above to get started. Our advanced scanning engine will analyze the URL <br />
            for phishing attempts, malware, and other security threats.
          </p>
        </div>
      )}
    </div>
  );
}

