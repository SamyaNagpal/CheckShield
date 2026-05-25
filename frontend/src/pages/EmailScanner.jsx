import { useState } from 'react';
import { scanEmail } from '../api';

export default function EmailScanner() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!email) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await scanEmail(email);
      setResult({
        riskLevel: data.risk_level,
        riskScore: data.email_risk_score || data.risk_score,
        reasons: data.reasons,
        urlsAnalyzed: data.urls_analyzed || [],
        hasVirusTotal: data.urls_analyzed?.some(url => url.blacklist_flag) || false
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColorByScore = (score) => {
    if (score >= 50) return '#ef4444'; // Red for high risk
    return '#22c55e'; // Green for safe
  };

  const getRiskColor = (level) => {
    if (level === 'Critical') return '#ef4444';
    if (level === 'High') return '#f59e0b';
    return '#22c55e';
  };

  const getRiskScore = (level) => {
    if (level === 'Critical') return 85;
    if (level === 'High') return 60;
    return 25;
  };

  const getBgColorByScore = (score) => {
    if (score >= 50) return 'rgba(239, 68, 68, 0.1)'; // Red background for high risk
    return 'rgba(34, 197, 94, 0.1)'; // Green background for safe
  };

  const getBgColor = (level) => {
    if (level === 'Critical') return 'rgba(239, 68, 68, 0.1)';
    if (level === 'High') return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(34, 197, 94, 0.1)';
  };

  const getRiskBadgeClassByScore = (score) => {
    if (score >= 50) return 'badge-high'; // Red badge for high risk
    return 'badge-safe'; // Green badge for safe
  };

  const getRiskBadgeClass = (level) => {
    if (level === 'Critical') return 'badge-high';
    if (level === 'High') return 'badge-medium';
    return 'badge-safe';
  };

  return (
    <div>
      <h1 className="page-title">Email Scanner</h1>
      <p className="page-subtitle">Detect phishing emails and scam indicators. Paste email headers or content below.</p>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Paste Email Headers or Content</label>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Include sender information, subject line, and any suspicious content you want analyzed
          </p>
          <textarea
            placeholder="From: sender@example.com&#10;Subject: Urgent: Verify Your Account&#10;To: you@email.com&#10;&#10;Dear User, please verify your account immediately..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              minHeight: '240px', 
              padding: '12px 14px', 
              fontFamily: 'monospace', 
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--secondary-bg)'
            }}
          />
        </div>
        <button 
          className="button-primary"
          onClick={handleScan}
          disabled={isLoading}
          style={{ padding: '12px 24px', marginTop: '16px', borderRadius: '8px', fontWeight: 600 }}
        >
          {isLoading ? '⏳ Analyzing...' : '📧 Analyze Email'}
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
          <p style={{ marginTop: '16px', fontSize: '15px' }}>Analyzing email content for threats and phishing indicators...</p>
        </div>
      )}

      {result && (
        <div className="card" style={{ marginTop: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Threat Assessment
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Email Analysis Report</div>
            </div>
            <span className={`badge ${getRiskBadgeClassByScore(result.riskScore)}`} style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
              {result.riskLevel.toUpperCase()}
            </span>
          </div>

          <div style={{ 
            padding: '24px', 
            background: getBgColorByScore(result.riskScore), 
            borderRadius: '12px',
            marginBottom: '30px',
            border: `2px solid ${getRiskColorByScore(result.riskScore)}20`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '40px' }}>
                {result.riskScore >= 50 && '🚨'}
                {result.riskScore < 50 && '✅'}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Risk Level
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: getRiskColorByScore(result.riskScore), marginTop: '4px' }}>
                  {result.riskScore >= 50 ? 'HIGH RISK' : 'SAFE'}
                </div>
              </div>
            </div>
            {result.riskScore && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Risk Score
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: getRiskColorByScore(result.riskScore) }}>
                    {result.riskScore}%
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${result.riskScore}%`,
                      backgroundColor: getRiskColorByScore(result.riskScore),
                      borderRadius: '3px',
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {result.hasVirusTotal && (
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
                  MALICIOUS URLS DETECTED
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  This email contains one or more URLs that have been flagged as malicious by VirusTotal. Do not click these links.
                </div>
              </div>
            </div>
          )}

          {result.urlsAnalyzed && result.urlsAnalyzed.length > 0 && (
            <div style={{ 
              marginBottom: '30px', 
              padding: '20px', 
              background: 'var(--secondary-bg)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                🔗 Detected URLs in Email
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.urlsAnalyzed.map((urlData, idx) => (
                  <div key={idx} style={{ 
                    padding: '14px 16px', 
                    background: 'var(--primary-bg)',
                    border: `1px solid ${urlData.blacklist_flag ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>
                        URL #{idx + 1}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '6px' }}>
                        {urlData.url}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Risk: <strong style={{ color: urlData.risk_score >= 70 ? '#ef4444' : urlData.risk_score >= 40 ? '#f59e0b' : '#22c55e' }}>
                          {urlData.risk_score}% - {urlData.risk_level}
                        </strong>
                        {urlData.blacklist_flag && <span style={{ marginLeft: '8px', color: '#ef4444', fontWeight: 700 }}>⚠️ FLAGGED BY VIRUSTOTAL</span>}
                      </div>
                    </div>
                  </div>
                ))}
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
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Analysis Method
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              <strong>Detection Method:</strong> Heuristic pattern analysis and machine learning-based phishing detection on email content, headers, and sender information.
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
                    <span style={{ flexShrink: 0, fontSize: '16px' }}>🚩</span>
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
              <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>No suspicious indicators detected. This email appears to be safe.</p>
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
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>📧</div>
          <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
            Paste an email above to check for phishing attempts and spam indicators.<br />
            Our AI will analyze the email for common scam patterns and threat signatures.
          </p>
        </div>
      )}
    </div>
  );
}
