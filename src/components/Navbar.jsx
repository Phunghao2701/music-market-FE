import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Music, LayoutDashboard, LogOut, LogIn, Search, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read user session from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Brand logo */}
        <Link to="/" style={styles.brand}>
          <Music size={24} color="#EB0000" />
          <span style={styles.brandText}>Music Market</span>
        </Link>

        {/* Nav Links */}
        <div style={styles.links}>
          <Link 
            to="/" 
            style={{
              ...styles.link, 
              color: location.pathname === '/' ? '#fff' : '#A2A2A2'
            }}
          >
            <Search size={18} />
            Duyệt Nhạc
          </Link>
          <Link 
            to="/inquiry-status" 
            style={{
              ...styles.link, 
              color: location.pathname.startsWith('/inquiry-status') ? '#fff' : '#A2A2A2'
            }}
          >
            <ClipboardList size={18} />
            Tra Cứu Đơn
          </Link>
          
          {user && (user.role === 'admin' || user.role === 'producer') && (
            <Link 
              to="/admin" 
              style={{
                ...styles.link, 
                color: location.pathname.startsWith('/admin') ? '#fff' : '#A2A2A2'
              }}
            >
              <LayoutDashboard size={18} />
              Quản Trị
            </Link>
          )}
        </div>

        {/* User Account / Login Button */}
        <div>
          {user ? (
            <div style={styles.userContainer}>
              <div style={styles.userInfo}>
                <span style={styles.username}>{user.username}</span>
                <span style={styles.role}>{user.role.toUpperCase()}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn} title="Đăng xuất">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={styles.loginBtn}>
              <LogIn size={18} />
              Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(235, 0, 0, 0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
  },
  navContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '700',
    fontSize: '20px',
    color: '#fff',
    letterSpacing: '-0.03em',
  },
  brandText: {
    background: 'linear-gradient(135deg, #fff 40%, #ff3b30 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    fontSize: '15px',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    padding: '6px 6px 6px 16px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  username: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  role: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#EB0000',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    color: '#ef4444',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loginBtn: {
    padding: '8px 16px',
    fontSize: '14px',
  },
};

export default Navbar;
