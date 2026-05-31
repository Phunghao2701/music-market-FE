import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <p style={styles.footerText}>&copy; 2026 Music Market. Developed by Phunghao2701.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  footer: {
    borderTop: '1px solid rgba(157, 78, 221, 0.1)',
    padding: '24px 0',
    marginTop: '40px',
    background: '#07050d',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#645F7A',
  },
};

export default Layout;
