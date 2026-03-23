import { useState } from 'react';

export default function ScanHistory() {
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allScans = [
    { id: 1, type: 'URL', content: 'https://example.com/verify', risk: 'High', status: '85%', time: '2 mins ago' },
    { id: 2, type: 'Email', content: 'Verify your PayPal account...', risk: 'Critical', status: '92%', time: '15 mins ago' },
    { id: 3, type: 'QR', content: 'upi://pay?pa=test@okhdfcbank', risk: 'High', status: '78%', time: '28 mins ago' },
    { id: 4, type: 'UPI', content: 'Your refund is pending...', risk: 'Medium', status: '45%', time: '1 hour ago' },
    { id: 5, type: 'URL', content: 'https://secure-bank.xyz/login', risk: 'High', status: '88%', time: '2 hours ago' },
    { id: 6, type: 'Email', content: 'Claim your prize now!', risk: 'Critical', status: '95%', time: '3 hours ago' },
    { id: 7, type: 'QR', content: 'https://bit.ly/checkout', risk: 'Medium', status: '52%', time: '4 hours ago' },
    { id: 8, type: 'UPI', content: 'Confirm transaction for ₹5000', risk: 'Low', status: '15%', time: '5 hours ago' },
  ];

  const filtered = allScans.filter(scan => {
    if (filterType !== 'all' && scan.type !== filterType) return false;
    if (filterRisk !== 'all' && scan.risk !== filterRisk) return false;
    if (searchTerm && !scan.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getRiskColor = (risk) => {
    if (risk === 'Critical') return '#ef4444';
    if (risk === 'High') return '#f59e0b';
    if (risk === 'Medium') return '#f59e0b';
    return '#22c55e';
  };

  const getRiskBadgeClass = (risk) => {
    if (risk === 'Critical' || risk === 'High') return 'badge-high';
    if (risk === 'Medium') return 'badge-medium';
    return 'badge-safe';
  };

  return (
    <div>
      <h1 className="page-title">Scan History</h1>
      <p className="page-subtitle">View all your security scans and analysis results</p>

      <div className="card">
        <div className="grid grid-4">
          <div className="form-group">
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search scans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="URL">URL Scanner</option>
              <option value="Email">Email Scanner</option>
              <option value="UPI">UPI Protection</option>
              <option value="QR">QR Scanner</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Risk Level</label>
            <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ visibility: 'hidden' }}>Action</label>
            <button 
              className="button-secondary"
              onClick={() => {
                setFilterType('all');
                setFilterRisk('all');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          Found {filtered.length} scans
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Content</th>
              <th>Risk Level</th>
              <th>Score</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(scan => (
                <tr key={scan.id}>
                  <td>
                    <span style={{ fontSize: '12px' }}>
                      {scan.type === 'URL' && '🔗'}
                      {scan.type === 'Email' && '✉️'}
                      {scan.type === 'UPI' && '💳'}
                      {scan.type === 'QR' && '📱'}
                      {' '}
                      {scan.type}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {scan.content}
                  </td>
                  <td>
                    <span className={`badge ${getRiskBadgeClass(scan.risk)}`}>
                      {scan.risk}
                    </span>
                  </td>
                  <td style={{ color: getRiskColor(scan.risk), fontWeight: '600' }}>
                    {scan.status}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {scan.time}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                  No scans found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
