import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Music, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Inquiry = () => {
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId') || '';
  const trackTitle = searchParams.get('trackTitle') || '';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('personal_demo');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !trackId) {
      setError('Vui lòng điền tên của bạn và chọn bài nhạc hợp lệ.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        customer_name: name,
        customer_email: email || undefined,
        customer_phone: phone || undefined,
        company_name: company || undefined,
        track_id: parseInt(trackId, 10),
        usage_purpose: purpose,
        usage_description: description || undefined,
        budget: budget ? parseFloat(budget) : undefined,
        currency: currency,
        note: note || undefined,
        message: message || undefined,
      };

      const response = await api.post('/inquiries', payload);
      if (response.data && response.data.success) {
        setSuccessData(response.data.data.inquiry);
      } else {
        setError(response.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể kết nối đến server backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="animate-fade-in" style={styles.successContainer}>
        <div className="glass-card" style={styles.successCard}>
          <CheckCircle size={64} color="#10b981" style={{ marginBottom: '20px' }} />
          <h2 style={styles.successTitle}>Gửi Yêu Cầu Thành Công!</h2>
          <p style={styles.successMessage}>
            Yêu cầu hỏi mua bản quyền bài hát <strong>"{trackTitle || `ID: ${trackId}`}"</strong> đã được chuyển tới quản trị viên.
          </p>
          
          <div style={styles.infoBox}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Mã yêu cầu (Inquiry ID):</span>
              <strong style={styles.infoValue}>#{successData.purchase_inquiry_id}</strong>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Trạng thái:</span>
              <span style={styles.statusBadge}>{successData.status.toUpperCase()}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Tên khách hàng:</span>
              <span style={styles.infoValue}>{successData.customer_name}</span>
            </div>
          </div>

          <p style={styles.hint}>
            Vui lòng lưu lại mã này để tra cứu tiến độ xử lý và phản hồi từ phía Admin.
          </p>

          <div style={styles.successActions}>
            <Link to={`/inquiry-status?id=${successData.purchase_inquiry_id}`} className="btn btn-primary">
              Tra Cứu Trạng Thái Ngay <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn btn-secondary">Quay lại Trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <h1 style={styles.pageTitle}>Gửi Yêu Cầu Mua Bản Quyền</h1>
      
      {trackTitle && (
        <div style={styles.trackBanner}>
          <Music size={20} color="#EB0000" />
          <span>Bạn đang hỏi mua bản quyền bài nhạc: <strong>"{trackTitle}"</strong> (ID: #{trackId})</span>
        </div>
      )}

      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={20} color="#ef4444" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card" style={styles.form}>
        <div style={styles.formRow}>
          <div className="form-group" style={styles.halfWidth}>
            <label className="form-label">Tên của bạn *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={styles.halfWidth}>
            <label className="form-label">Địa chỉ Email</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="nva@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div className="form-group" style={styles.halfWidth}>
            <label className="form-label">Số điện thoại</label>
            <input 
              type="tel" 
              className="form-control" 
              placeholder="0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={styles.halfWidth}>
            <label className="form-label">Tên công ty / Tổ chức</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Công ty Giải Trí ABC"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.formRow}>
          <div className="form-group" style={styles.halfWidth}>
            <label className="form-label">Mục đích sử dụng bản quyền *</label>
            <select 
              value={purpose} 
              onChange={(e) => setPurpose(e.target.value)} 
              className="form-control"
            >
              <option value="personal_demo">Demo cá nhân (Personal Demo)</option>
              <option value="commercial_release">Phát hành thương mại (Commercial Release)</option>
              <option value="youtube_tiktok">Video Youtube, TikTok, Mạng xã hội</option>
              <option value="advertising">Quảng cáo truyền thông (Advertising)</option>
              <option value="film_game">Phim ảnh, Game, TV Show</option>
              <option value="live_performance">Biểu diễn trực tiếp (Live Performance)</option>
              <option value="brand_campaign">Chiến dịch thương hiệu (Brand Campaign)</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group" style={styles.halfWidth}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Ngân sách mong muốn</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="5000000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div style={{ width: '80px' }}>
                <label className="form-label">Đơn vị</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)} 
                  className="form-control"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả chi tiết cách sử dụng bài nhạc</label>
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Ví dụ: Dùng làm nhạc nền cho phim ngắn thời lượng 15 phút phát hành phi lợi nhuận trên Youtube..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Lời nhắn thêm cho Producer / Quản trị viên</label>
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Ví dụ: Tôi cần liên hệ gấp qua Zalo/Điện thoại trong ngày..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <div style={styles.formActions}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px' }} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}
          </button>
          <Link to="/" className="btn btn-secondary">Hủy bỏ</Link>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '32px',
    marginBottom: '24px',
  },
  trackBanner: {
    background: 'rgba(235, 0, 0, 0.1)',
    border: '1px solid rgba(235, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    fontSize: '15px',
    color: '#fff',
  },
  errorBanner: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    fontSize: '15px',
    color: '#ef4444',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  halfWidth: {
    flex: '1 1 350px',
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid rgba(235, 0, 0, 0.15)',
    margin: '10px 0',
  },
  formActions: {
    display: 'flex',
    gap: '16px',
    marginTop: '20px',
  },
  successContainer: {
    maxWidth: '600px',
    margin: '40px auto',
  },
  successCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 30px',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px',
  },
  successMessage: {
    fontSize: '16px',
    color: '#A2A2A2',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  infoBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(235, 0, 0, 0.15)',
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
  },
  infoLabel: {
    color: '#636366',
  },
  infoValue: {
    color: '#fff',
    fontWeight: '600',
  },
  statusBadge: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  hint: {
    fontSize: '13px',
    color: '#636366',
    marginBottom: '30px',
  },
  successActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
};

export default Inquiry;
