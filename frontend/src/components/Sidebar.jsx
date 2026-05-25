export default function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'url-scanner', label: 'URL Scanner', icon: '🔗' },
    { id: 'email-scanner', label: 'Email Scanner', icon: '✉️' },
    { id: 'scan-history', label: 'Scan History', icon: '⏱️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        🛡️ CheckShield
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
              className={currentPage === item.id ? 'active' : ''}
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
