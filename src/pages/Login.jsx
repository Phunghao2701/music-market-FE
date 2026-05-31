import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, AlertCircle, Music } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { token, user } = response.data.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to admin portal or home based on role
        if (user.role === 'admin' || user.role === 'producer') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(response.data?.message || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Địa chỉ email hoặc mật khẩu không chính xác.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div className="glass-card" style={styles.card}>
        <div style={styles.brandHeader}>
          <div style={styles.logoCircle}>
            <Music size={32} color="#EB0000" />
          </div>
          <h1 style={styles.title}>Cổng Quản Trị</h1>
          <p style={styles.subtitle}>Đăng nhập dành cho Producer & Administrator</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={20} color="#ef4444" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email quản trị</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#636366" style={styles.inputIcon} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="admin@musicmarket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} color="#636366" style={styles.inputIcon} />
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={styles.footerLink}>
          <Link to="/" style={styles.backLink}>Quay lại Cổng mua nhạc công khai</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '460px',
    margin: '60px auto',
  },
  card: {
    padding: '40px 30px',
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(235, 0, 0, 0.1)',
    border: '1px solid rgba(235, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '26px',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#A2A2A2',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ef4444',
    fontSize: '14px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
  },
  inputWithIcon: {
    paddingLeft: '44px',
    width: '100%',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    marginTop: '8px',
  },
  footerLink: {
    textAlign: 'center',
    marginTop: '24px',
  },
  backLink: {
    fontSize: '14px',
    color: '#636366',
  },
};

export default Login;
