export default function Navbar({ user, onLogout, currentPage, onNavigate }) {
  const navItems = [
    { id: 'community', label: 'Community' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'url-scanner', label: 'URL Scanner' },
    { id: 'email-scanner', label: 'Email Scanner' },
    { id: 'qr-scanner', label: 'QR Scanner' }
  ];

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-icon">🛡️</span>
        <span>CheckShield</span>
      </div>
      
      <div className="navbar-menu" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '30px' }}>
        {navItems.map(item => (
          <a 
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
            className={currentPage === item.id ? 'active' : ''}
          >
            {item.label}
          </a>
        ))}
      </div>
      
      <div className="navbar-right">
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          👤 {user?.name || 'User'}
        </span>
        <button 
          className="button-secondary"
          onClick={onLogout}
          style={{ padding: '6px 14px', fontSize: '13px' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
