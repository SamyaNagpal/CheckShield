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
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Security Dashboard</h1>
          <p className="page-subtitle">
            A quick view of scanner activity, detected threats, and recent checks.
          </p>
        </div>
        <div className="dashboard-status">
          <span className="status-dot"></span>
          Live overview
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        <div className="stat-card dashboard-stat-card">
          <div className="stat-label">Total Scans</div>
          <div className="stat-value">{stats.totalScans}</div>
          <div className="stat-helper">Across URL, email, UPI and QR checks</div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-label">Threats Detected</div>
          <div
            className="stat-value"
            style={{ color: 'var(--accent-red)' }}
          >
            {stats.threatsDetected}
          </div>
          <div className="stat-helper">High and medium risk results</div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-label">Safe Results</div>
          <div
            className="stat-value"
            style={{ color: 'var(--accent-green)' }}
          >
            {stats.safeUrls}
          </div>
          <div className="stat-helper">Checks marked low risk</div>
        </div>

        <div className="stat-card dashboard-stat-card">
          <div className="stat-label">Security Score</div>
          <div className="stat-value">
            {stats.securityScore}%
          </div>
          <div className="stat-helper">Safe checks as a share of total scans</div>
        </div>
      </div>

      {/* Threat Distribution */}
      <div className="dashboard-grid">
        <div className="card dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="card-title">Threat Distribution</div>
              <p>Breakdown of safe versus risky scans.</p>
            </div>
          </div>

          <div className="distribution-content">
            <div className="distribution-chart">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (threatData[0].value / totalThreats) * 264
                  } 264`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (threatData[1].value / totalThreats) * 264
                  } 264`}
                  strokeDashoffset={`-${
                    (threatData[0].value / totalThreats) * 264
                  }`}
                />
              </svg>
              <div className="distribution-center">
                <strong>{safePercentage}%</strong>
                <span>Safe</span>
              </div>
            </div>

            <div className="distribution-list">
              <div className="distribution-row">
                <span className="legend-dot safe"></span>
                <span>Safe</span>
                <strong>{threatData[0].value}</strong>
              </div>
              <div className="distribution-row">
                <span className="legend-dot dangerous"></span>
                <span>Risky</span>
                <strong>{threatData[1].value}</strong>
              </div>
              {stats.totalScans === 0 && (
                <div className="dashboard-empty-note">
                  Run a scan to populate this chart.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="card-title">Recent Activity</div>
              <p>Latest scanner events shown for dashboard context.</p>
            </div>
          </div>

          <table className="table dashboard-table">
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
    </div>
  );
}
