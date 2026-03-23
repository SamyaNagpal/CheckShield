export default function Analytics() {
  const moduleStats = [
    { name: 'URL Scanner', scans: 450, detected: 38 },
    { name: 'Email Scanner', scans: 320, detected: 28 },
    { name: 'UPI Protection', scans: 280, detected: 18 },
    { name: 'QR Scanner', scans: 197, detected: 5 }
  ];

  const riskDistribution = [
    { level: 'High Risk', percentage: 35, count: 31 },
    { level: 'Medium Risk', percentage: 45, count: 40 },
    { level: 'Low Risk', percentage: 20, count: 18 }
  ];

  return (
    <div>
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">Performance metrics and threat analysis</p>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">Module Performance</div>
          <table className="table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Scans</th>
                <th>Detected</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {moduleStats.map((stat, idx) => {
                const rate = ((stat.detected / stat.scans) * 100).toFixed(1);
                return (
                  <tr key={idx}>
                    <td>{stat.name}</td>
                    <td>{stat.scans}</td>
                    <td>{stat.detected}</td>
                    <td style={{ color: rate > 10 ? '#ef4444' : '#22c55e' }}>
                      {rate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Risk Distribution</div>
          <div style={{ marginTop: '20px' }}>
            {riskDistribution.map(item => (
              <div key={item.level} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {item.level} ({item.count})
                  </span>
                  <span style={{ fontWeight: 'bold' }}>{item.percentage}%</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: 'var(--border-color)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%',
                    width: `${item.percentage}%`,
                    backgroundColor: item.level === 'High Risk' ? '#ef4444' : item.level === 'Medium Risk' ? '#f59e0b' : '#22c55e',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginTop: '20px' }}>
        <div className="stat-card">
          <div className="stat-label">Avg Response Time</div>
          <div className="stat-value">0.8s</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Detection Accuracy</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>94%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">False Positives</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>3%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">System Uptime</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>99.8%</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-title">Weekly Threat Trend</div>
        <div style={{ marginTop: '20px' }}>
          {[
            { day: 'Mon', threats: 8 },
            { day: 'Tue', threats: 12 },
            { day: 'Wed', threats: 10 },
            { day: 'Thu', threats: 15 },
            { day: 'Fri', threats: 18 },
            { day: 'Sat', threats: 14 },
            { day: 'Sun', threats: 12 }
          ].map(item => (
            <div key={item.day} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '15px' }}>
              <div style={{ width: '40px', fontSize: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                {item.day}
              </div>
              <div style={{
                flex: 1,
                height: `${item.threats * 8}px`,
                backgroundColor: 'var(--primary-blue)',
                borderRadius: '4px 4px 0 0'
              }}></div>
              <div style={{ width: '30px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {item.threats}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
