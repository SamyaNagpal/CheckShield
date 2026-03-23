import { useState } from 'react';

export default function Settings() {
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@checkshield.com',
    password: '',
    sensitivity: 'medium',
    emailAlerts: true,
    pushNotifications: true,
    twoFactor: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your account and security preferences</p>

      {/* Account Settings */}
      <div className="card">
        <div className="card-title">Account Settings</div>
        
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="card-title">Security Settings</div>
        
        <div className="form-group">
          <label className="form-label">Change Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
            Leave blank to keep current password
          </p>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="twoFactor"
              checked={formData.twoFactor}
              onChange={handleChange}
            />
            <span>Enable Two-Factor Authentication</span>
          </label>
        </div>
      </div>

      {/* Detection Settings */}
      <div className="card">
        <div className="card-title">Threat Detection Sensitivity</div>
        
        <div className="form-group">
          <label className="form-label">Detection Sensitivity</label>
          <select
            name="sensitivity"
            value={formData.sensitivity}
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            <option value="low">Low (Fewer alerts)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="high">High (More alerts)</option>
          </select>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Adjust how sensitive threat detection should be
          </p>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="card-title">Notifications</div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="emailAlerts"
              checked={formData.emailAlerts}
              onChange={handleChange}
            />
            <span>Email Alerts for High Risk Threats</span>
          </label>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="pushNotifications"
              checked={formData.pushNotifications}
              onChange={handleChange}
            />
            <span>Push Notifications</span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: '#ef4444' }}>
        <div className="card-title" style={{ color: '#ef4444' }}>⚠️ Danger Zone</div>
        
        <button className="button-danger" style={{ marginRight: '10px' }}>
          Export Data
        </button>
        <button className="button-danger">
          Delete Account
        </button>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
        <button className="button-primary" onClick={handleSave}>
          Save Changes
        </button>
        <button className="button-secondary" style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
