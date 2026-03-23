import { useState } from 'react';
import { scanQR } from '../api';

export default function QRScanner() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create FormData and append the actual file
      const formData = new FormData();
      formData.append('file', file);
      
      const data = await scanQR(formData);
      setResult({
        content: data.qr_content,
        riskScore: data.analysis.final_risk,
        riskLevel: data.analysis.risk_level,
        explanations: data.analysis.explanations,
        isUPI: data.qr_content.includes('upi://')
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
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
      <h1 className="page-title">QR Code Scanner</h1>
      <p className="page-subtitle">Scan QR codes to detect malicious links and UPI fraud</p>

      <div 
        className="card"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px solid var(--primary-blue)' : '2px dashed var(--border-color)',
          background: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📱</div>
        <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Upload QR Code Image</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Drag and drop your QR code image here or click to select
        </p>
        
        <label style={{ display: 'inline-block' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button 
            className="button-primary"
            as="span"
            onClick={(e) => e.currentTarget.previousElementSibling.click()}
            disabled={isLoading}
            style={{ cursor: 'pointer' }}
          >
            {isLoading ? 'Scanning...' : 'Select Image'}
          </button>
        </label>
      </div>

      {error && (
        <div className="form-error">
          ⚠️ {error}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '10px' }}>Analyzing QR code...</p>
        </div>
      )}

      {result && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Decoded Content</div>
              <div style={{ fontSize: '14px', wordBreak: 'break-all', marginTop: '5px' }}>
                {result.content}
              </div>
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

          {result.isUPI && (
            <div style={{ 
              padding: '12px', 
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              marginTop: '15px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              💳 UPI Transaction Detected
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>🔍 Analysis</h3>
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
                  <span>ℹ️</span>
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
