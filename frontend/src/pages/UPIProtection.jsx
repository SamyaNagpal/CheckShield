import { useState } from 'react';
import { scanUPI } from '../api';

export default function UPIProtection() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!message) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await scanUPI(message);
      setResult({
        riskScore: data.final_risk,
        riskLevel: data.risk_level,
        explanations: data.explanations,
        uri_present: data.uri_present
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

  const getRiskBadgeClass = (level) => {
    if (level === 'High') return 'badge-high';
    if (level === 'Medium') return 'badge-medium';
    return 'badge-safe';
  };

  return (
    <div>
      <h1 className="page-title">UPI Scam Protection</h1>
      <p className="page-subtitle">Analyze SMS and payment messages to detect UPI fraud attempts</p>

      <div className="card">
        <div className="form-group">
          <label className="form-label">SMS/Payment Message</label>
          <textarea
            placeholder="Paste the SMS or payment message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', minHeight: '150px' }}
          />
        </div>
        <button 
          className="button-primary"
          onClick={handleScan}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Message'}
        </button>
      </div>

      {error && (
        <div className="form-error">
          ⚠️ {error}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '10px' }}>Analyzing message...</p>
        </div>
      )}

      {result && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Risk Assessment</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>UPI Fraud Detection</div>
            </div>
            <span className={`badge ${getRiskBadgeClass(result.riskLevel)}`}>
              {result.riskLevel}
            </span>
          </div>

          <div className="risk-meter">
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Risk Score</div>
                <div className="risk-bar">
                  <div 
                    className="risk-bar-fill"
                    style={{ 
                      width: `${result.riskScore}%`,
                      backgroundColor: getRiskColor(result.riskScore)
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="risk-score" style={{ color: getRiskColor(result.riskScore) }}>
              {result.riskScore}%
            </div>
          </div>

          {result.uri_present && (
            <div style={{ 
              padding: '12px', 
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              marginTop: '15px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              ⚠️ UPI URI detected in message
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>🔍 Analysis Details</h3>
            <div>
              {result.explanations.map((explanation, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  padding: '10px', 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  <span>⚡</span>
                  {explanation}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
