import { useState, useEffect } from 'react';
import { getDashboardStats, getThreatDistribution } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalScans: 0,
    threatsDetected: 0,
    safeUrls: 0,
    securityScore: 0
  });

  const [threatData, setThreatData] = useState([
    { name: 'Safe', value: 0, color: '#16a34a' },
    { name: 'Dangerous', value: 0, color: '#dc2626' }
  ]);

  const [recentActivity] = useState([
    { type: 'URL Scan', status: 'HIGH', time: '2 mins ago' },
    { type: 'Email Scan', status: 'MEDIUM', time: '15 mins ago' },
    { type: 'QR Code', status: 'SAFE', time: '28 mins ago' },
    { type: 'UPI Protection', status: 'HIGH', time: '1 hour ago' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await getDashboardStats();

        // Optional if you actually use this API
        await getThreatDistribution();

        const safeCount = dashboardStats.safe_verified || 0;
        const totalScans = dashboardStats.total_scans || 1;

        const securityScore = Math.round(
          (safeCount / totalScans) * 100
        );

        setStats({
          totalScans: dashboardStats.total_scans || 0,
          threatsDetected: dashboardStats.threats_detected || 0,
          safeUrls: dashboardStats.safe_verified || 0,
          securityScore
        });

        setThreatData([
          {
            name: 'Safe',
            value: dashboardStats.safe_verified || 0,
            color: '#16a34a'
          },
          {
            name: 'Dangerous',
            value: dashboardStats.threats_detected || 0,
            color: '#dc2626'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const getStatusBadgeClass = (status) => {
    if (status === 'HIGH') return 'badge-high';
    if (status === 'MEDIUM') return 'badge-medium';
    return 'badge-safe';
  };

  const totalThreats =
    threatData[0].value + threatData[1].value || 1;

  const safePercentage = Math.round(
    (threatData[0].value / totalThreats) * 100
  );

  return (
    <div>
      <h1 className="page-title">Your Security Dashboard</h1>
      <p className="page-subtitle">
        Monitor your scanning activity and security metrics
      </p>

      {/* Stats Grid */}
      <div
        className="grid grid-4"
        style={{ marginBottom: '30px' }}
      >
        <div className="stat-card">
          <div className="stat-label">Total Scans</div>
          <div className="stat-value">{stats.totalScans}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Threats Detected</div>
          <div
            className="stat-value"
            style={{ color: 'var(--accent-red)' }}
          >
            {stats.threatsDetected}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Safe URLs</div>
          <div
            className="stat-value"
            style={{ color: 'var(--accent-green)' }}
          >
            {stats.safeUrls}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Security Score</div>
          <div className="stat-value">
            {stats.securityScore}%
          </div>
        </div>
      </div>

      {/* Threat Distribution */}
      <div className="card">
        <div className="card-title">Threat Distribution</div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '150px',
              height: '150px'
            }}
          >
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
                strokeDasharray={`${
                  (threatData[0].value / totalThreats) * 283
                } 283`}
              />

              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#dc2626"
                strokeWidth="12"
                strokeDasharray={`${
                  (threatData[1].value / totalThreats) * 283
                } 283`}
                strokeDashoffset={`-${
                  (threatData[0].value / totalThreats) * 283
                }`}
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
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 700
                }}
              >
                {safePercentage}%
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                Safe
              </div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    background: '#16a34a'
                  }}
                />

                <span>
                  Safe: {threatData[0].value}
                </span>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    background: '#dc2626'
                  }}
                />

                <span>
                  Dangerous: {threatData[1].value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="card"
        style={{ marginTop: '30px' }}
      >
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
                  <span
                    className={`badge ${getStatusBadgeClass(
                      activity.status
                    )}`}
                  >
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