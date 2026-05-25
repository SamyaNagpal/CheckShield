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
      const formData = new FormData();
      formData.append('file', file);

      const data = await scanQR(formData);
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.analysis) {
        throw new Error('QR analysis response was incomplete');
      }

      setResult({
        content: data.qr_content,
        riskScore: data.analysis.final_risk || 0,
        riskLevel: data.analysis.risk_level,
        explanations: data.analysis.explanations || [],
        textRisk: data.analysis.text_risk || 0,
        vpaRisk: data.analysis.vpa_risk || 0,
        uriPresent: data.analysis.uri_present || false,
        isUPI: data.qr_content.toLowerCase().includes('upi://')
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
    if (level?.includes('CRITICAL') || level?.includes('HIGH')) return 'badge-high';
    if (level?.includes('MEDIUM')) return 'badge-medium';
    return 'badge-safe';
  };

  const getContentType = (content) => {
    if (content?.toLowerCase().startsWith('upi://')) return 'UPI payment URI';
    if (/^https?:\/\//i.test(content)) return 'Web link';
    if (/^www\./i.test(content)) return 'Web link';
    return 'Plain text or custom payload';
  };

  const getDestination = (content) => {
    try {
      const normalized = /^https?:\/\//i.test(content) ? content : `https://${content}`;
      const url = new URL(normalized);
      return url.hostname;
    } catch {
      return 'No web domain detected';
    }
  };

  const getRecommendation = (score, isUPI) => {
    if (score >= 70) {
      return 'High risk. Do not proceed, do not enter payment details, and verify the QR source through an official channel.';
    }
    if (score >= 40) {
      return 'Some warning signs were found. Verify the destination and avoid sharing credentials or UPI PINs.';
    }
    if (isUPI) {
      return 'Low risk, but still confirm the payee name and amount inside your UPI app before approving anything.';
    }
    return 'No QR-specific scam indicators were found. For web links, scan the decoded URL separately before opening sensitive pages.';
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
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>QR</div>
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
          Warning: {error}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', gap: '20px' }}>
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
              UPI transaction detected
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Scan Analysis</h3>

            <div className="grid grid-4" style={{ marginBottom: '18px' }}>
              <div style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Content Type</div>
                <div style={{ fontWeight: 700 }}>{getContentType(result.content)}</div>
              </div>

              <div style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Destination</div>
                <div style={{ fontWeight: 700, wordBreak: 'break-word' }}>{getDestination(result.content)}</div>
              </div>

              <div style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Text Pattern Risk</div>
                <div style={{ fontWeight: 700, color: getRiskColor(result.textRisk) }}>{result.textRisk}%</div>
              </div>

              <div style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>VPA Risk</div>
                <div style={{ fontWeight: 700, color: getRiskColor(result.vpaRisk) }}>{result.vpaRisk}%</div>
              </div>
            </div>

            <div style={{
              padding: '14px',
              background: result.riskScore >= 40 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              border: result.riskScore >= 40 ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '6px',
              marginBottom: '14px',
              fontSize: '14px',
              color: 'var(--text-primary)'
            }}>
              <strong>Recommendation:</strong> {getRecommendation(result.riskScore, result.isUPI)}
            </div>

            <div>
              {result.explanations.length === 0 ? (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '10px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  <span>OK</span>
                  No suspicious UPI phrases, payment URI risks, or VPA issues were detected in this QR payload.
                </div>
              ) : result.explanations.map((explanation, idx) => (
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
                  <span>Info</span>
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
