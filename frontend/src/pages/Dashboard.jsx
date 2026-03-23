import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalScans: 240,
    threatsDetected: 27,
    safeUrls: 185,
    securityScore: 1850
  });

  const [threatData, setThreatData] = useState([
    { name: 'Safe', value: 185, color: '#16a34a' },
    { name: 'Dangerous', value: 27, color: '#dc2626' }
  ]);

  const [recentActivity] = useState([
    { type: 'URL Scan', status: 'HIGH', time: '2 mins ago' },
    { type: 'Email Scan', status: 'MEDIUM', time: '15 mins ago' },
    { type: 'QR Code', status: 'SAFE', time: '28 mins ago' },
    { type: 'UPI Protection', status: 'HIGH', time: '1 hour ago' }
  ]);

  const getStatusBadgeClass = (status) => {
    if (status === 'HIGH') return 'badge-high';
    if (status === 'MEDIUM') return 'badge-medium';
    return 'badge-safe';
  };

  return (
    <div>
      <h1 className="page-title">Your Security Dashboard</h1>
      <p className="page-subtitle">Monitor your scanning activity and security metrics</p>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Scans</div>
          <div className="stat-value">{stats.totalScans}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '8px' }}>
            +12% from last week
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Threats Detected</div>
          <div className="stat-value" style={{ color: 'var(--accent-red)' }}>{stats.threatsDetected}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-orange)', marginTop: '8px' }}>
            +3% from last week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Safe URLs</div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{stats.safeUrls}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '8px' }}>
            +15% from last week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Security Score</div>
          <div className="stat-value">{stats.securityScore}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '8px' }}>
            +45 from last week
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-2" style={{ marginTop: '30px' }}>
        {/* Weekly Scanning Activity */}
        <div className="card">
          <div className="card-title">Weekly Scanning Activity</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Scans and threats detected over the past week
          </p>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '8px' }}>
            {[
              { day: 'M', scans: 20 },
              { day: 'T', scans: 30 },
              { day: 'W', scans: 8 },
              { day: 'Th', scans: 40 },
              { day: 'F', scans: 28 },
              { day: 'Sa', scans: 0 },
              { day: 'Su', scans: 0 }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    height: `${(item.scans / 40) * 150}px`,
                    background: 'linear-gradient(180deg, var(--primary-blue) 0%, rgba(37, 99, 235, 0.6) 100%)',
                    borderRadius: '6px 6px 0 0',
                    marginBottom: '8px',
                    minHeight: item.scans > 0 ? '20px' : '0px'
                  }}
                />
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="card">
          <div className="card-title">Threat Distribution</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Results from your recent scans
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
              <svg
                viewBox="0 0 100 100"
                style={{
                  transform: 'rotate(-90deg)',
                  width: '100%',
                  height: '100%'
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="12"
                  strokeDasharray={`${(185 / 212) * 283} 283`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="12"
                  strokeDasharray={`${(27 / 212) * 283} 283`}
                  strokeDashoffset={`-${(185 / 212) * 283}`}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  87%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Safe</div>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#16a34a' }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    Safe: 185
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>87% of scans</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#dc2626' }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    Dangerous: 27
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>13% of scans</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: '30px' }}>
        <div className="card-title">Recent Activity</div>
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity, idx) => (
              <tr key={idx}>
                <td>{activity.type}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(activity.status)}`}>
                    {activity.status}
                  </span>
                </td>
                <td>{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

