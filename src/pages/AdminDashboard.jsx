import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Music, ShoppingCart, DollarSign, ClipboardCheck, Play, ArrowRight, Eye } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Dashboard Stats state
  const [stats, setStats] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Session authorization check
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!savedUser || !token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role !== 'admin' && parsedUser.role !== 'producer') {
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } catch (e) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, topTracksRes, revenueRes] = await Promise.all([
          api.get('/admin/dashboard/summary'),
          api.get('/admin/dashboard/top-tracks'),
          api.get('/admin/dashboard/revenue')
        ]);

        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (topTracksRes.data && topTracksRes.data.success) {
          setTopTracks(topTracksRes.data.data || []);
        }
        if (revenueRes.data && revenueRes.data.success) {
          setRevenueData(revenueRes.data.data || []);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu quản trị. Vui lòng kiểm tra quyền truy cập hoặc kết nối server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <div style={styles.center}>Đang tải dữ liệu dashboard...</div>;
  if (error) return <div style={styles.centerError}>{error}</div>;

  // Render SVG Revenue Chart dynamically
  const renderRevenueChart = () => {
    if (revenueData.length === 0) {
      return <div style={styles.noData}>Chưa có dữ liệu doanh thu thời gian này.</div>;
    }

    const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1000000);
    const width = 600;
    const height = 200;
    const padding = 40;

    // Calculate coordinates
    const points = revenueData.map((d, index) => {
      const x = padding + (index * (width - 2 * padding)) / (revenueData.length - 1 || 1);
      const y = height - padding - (d.revenue * (height - 2 * padding)) / maxRevenue;
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <div style={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} style={styles.chartSvg}>
          {/* Y-axis gridlines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = padding + ratio * (height - 2 * padding);
            const val = ((1 - ratio) * maxRevenue).toLocaleString();
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                <text x={padding - 10} y={y + 4} fill="#636366" fontSize="10" textAnchor="end">{val}đ</text>
              </g>
            );
          })}

          {/* Sparkline Path */}
          {points.length > 1 && (
            <path d={pathD} fill="none" stroke="url(#chartGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Dots & Labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="#EB0000" stroke="#fff" strokeWidth="1.5" />
              <text x={p.x} y={height - 10} fill="#A2A2A2" fontSize="10" textAnchor="middle">
                {new Date(p.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
              </text>
            </g>
          ))}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EB0000" />
              <stop offset="100%" stopColor="#FF3B30" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTitleGroup}>
          <LayoutDashboard size={28} color="#EB0000" />
          <h1>Hệ Thống Quản Trị</h1>
        </div>
        <p style={styles.welcomeText}>Xin chào, <strong>{user?.username}</strong> ({user?.role.toUpperCase()})</p>
      </header>

      {/* Stats row */}
      {stats && (
        <section style={styles.statsRow}>
          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.iconCircle, background: 'rgba(235, 0, 0, 0.1)' }}>
              <Music size={24} color="#EB0000" />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Tổng Beat Nhạc</span>
              <strong style={styles.statValue}>{stats.tracks_count}</strong>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.iconCircle, background: 'rgba(59, 130, 246, 0.1)' }}>
              <ClipboardCheck size={24} color="#3b82f6" />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Yêu Cầu Mua Nhạc</span>
              <strong style={styles.statValue}>{stats.inquiries_count}</strong>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)' }}>
              <ShoppingCart size={24} color="#10b981" />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Giao Dịch Thành Công</span>
              <strong style={styles.statValue}>{stats.purchases_count}</strong>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)' }}>
              <DollarSign size={24} color="#f59e0b" />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Tổng Doanh Thu</span>
              <strong style={{ ...styles.statValue, color: '#f59e0b' }}>
                {stats.total_revenue.toLocaleString('vi-VN')}đ
              </strong>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid layout */}
      <div style={styles.mainLayout}>
        {/* Left Col: Revenue chart */}
        <section className="glass-card" style={styles.chartSection}>
          <h2 style={styles.sectionTitle}>Xu hướng doanh thu</h2>
          {renderRevenueChart()}
        </section>

        {/* Right Col: Top interactive tracks */}
        <section className="glass-card" style={styles.topTracksSection}>
          <h2 style={styles.sectionTitle}>Top Beat nhạc nổi bật</h2>
          {topTracks.length === 0 ? (
            <div style={styles.noData}>Chưa ghi nhận tương tác phát nhạc.</div>
          ) : (
            <div style={styles.topTracksList}>
              {topTracks.map((track, i) => (
                <div key={track.track_id} style={styles.topTrackItem}>
                  <div style={styles.trackRank}>#{i + 1}</div>
                  <div style={styles.trackDetails}>
                    <strong style={styles.topTrackTitle}>{track.title}</strong>
                    <div style={styles.topTrackStats}>
                      <span style={styles.topTrackStatItem}><Play size={12} /> {track.play_count} lượt nghe</span>
                      <span style={styles.topTrackStatItem}><ShoppingCart size={12} /> {track.inquiry_count} hỏi mua</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(235, 0, 0, 0.15)',
    paddingBottom: '20px',
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  welcomeText: {
    fontSize: '15px',
    color: '#A2A2A2',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '13px',
    color: '#636366',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '22px',
    color: '#fff',
    fontWeight: '700',
    marginTop: '4px',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '30px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    }
  },
  chartSection: {
    padding: '24px',
  },
  topTracksSection: {
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '20px',
    borderLeft: '4px solid #EB0000',
    paddingLeft: '12px',
  },
  chartWrapper: {
    width: '100%',
    padding: '10px 0',
  },
  chartSvg: {
    width: '100%',
    height: 'auto',
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#636366',
    fontStyle: 'italic',
  },
  topTracksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  topTrackItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '12px 16px',
    borderRadius: '8px',
  },
  trackRank: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#EB0000',
    width: '32px',
  },
  trackDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  topTrackTitle: {
    fontSize: '15px',
    color: '#fff',
  },
  topTrackStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#636366',
  },
  topTrackStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  center: {
    textAlign: 'center',
    padding: '100px 20px',
    color: '#A2A2A2',
  },
  centerError: {
    textAlign: 'center',
    padding: '100px 20px',
    color: '#ef4444',
  },
};

export default AdminDashboard;
