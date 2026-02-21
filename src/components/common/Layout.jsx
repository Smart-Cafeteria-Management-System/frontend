import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function Layout({ children }) {
    const { user, logout, isAdmin, isStaff, isStudent } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /* =========================
       ROLE-BASED NAVIGATION
    ========================= */

    let navLinks = [];

    // ADMIN NAV
    if (isAdmin) {
        navLinks = [
            { path: '/admin', label: 'Dashboard' },
            { path: '/admin/slots', label: 'Slots' },
            { path: '/queue', label: 'Queue' },
            { path: '/menu', label: 'Menu' },
            { path: '/forecast', label: 'Forecast' },
            { path: '/analytics', label: 'Analytics' },
            { path: '/admin/incentives', label: 'Incentives' },
            { path: '/admin/audit-logs', label: 'Audit Logs' },
            { path: '/security', label: 'Security' },
            { path: '/ethics', label: 'Ethics & Rules' },
            { path: '/admin/users', label: 'Users' }
        ];
    }

    // STAFF NAV
    else if (isStaff) {
        navLinks = [
            { path: '/staff', label: 'Dashboard' },
            { path: '/queue', label: 'Queue' },
            { path: '/menu', label: 'Menu' },
            { path: '/staff/forecast', label: 'Forecast' },
            { path: '/security', label: 'Security' },
            { path: '/ethics', label: 'Ethics & Rules' }
        ];
    }

    // STUDENT NAV
    else if (isStudent) {
        navLinks = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/booking', label: 'Book Meal' },
            { path: '/queue', label: 'Queue Status' },
            { path: '/menu', label: 'Menu' },
            { path: '/incentives', label: 'Rewards' },
            { path: '/addons', label: 'Free Add-ons' },
            { path: '/security', label: 'Security' },
            { path: '/ethics', label: 'Ethics & Rules' }
        ];
    }

    return (
        <div className="app-container">
            <header className="header">
                <div className="header-logo">
                    Smart Cafeteria
                </div>

                <nav className="header-nav">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="header-user">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <div className="header-user-info">
                        <div className="header-user-name">{user?.name}</div>
                        <div className="header-user-role">
                            {user?.role?.toUpperCase()}
                        </div>
                    </div>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default Layout;
