import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ClipboardList, CheckCircle2, Clock, AlertTriangle, FileText, Download } from 'lucide-react';
import api from '../services/api';

const InquiryStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [inquiryId, setInquiryId] = useState(queryId);
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError('');
    setInquiry(null);

    try {
      const response = await api.get(`/inquiries/${idToFetch}/status`);
      if (response.data && response.data.success) {
        setInquiry(response.data.data.inquiry);
      } else {
        setError('Không tìm thấy yêu cầu mua nhạc với mã số này.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi truy vấn dữ liệu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      fetchStatus(queryId);
    }
  }, [queryId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inquiryId.trim()) return;
    setSearchParams({ id: inquiryId.trim() });
  };

  // Helper to determine status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'new':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', text: 'Chờ duyệt' };
      case 'reviewed':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', text: 'Đang xem xét' };
      case 'approved':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', text: 'Đã chấp thuận' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', text: 'Từ chối' };
      case 'contract_sent':
        return { bg: 'rgba(235, 0, 0, 0.15)', color: '#FF3B30', text: 'Đã gửi hợp đồng' };
      case 'paid':
        return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'Đã thanh toán' };
      case 'delivered':
        return { bg: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', text: 'Đã bàn giao nhạc' };
      case 'completed':
        return { bg: 'rgba(16, 185, 129, 0.25)', color: '#10b981', text: 'Hoàn tất' };
      case 'cancelled':
        return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280', text: 'Đã hủy' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', color: '#fff', text: status };
    }
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <h1 style={styles.pageTitle}>Tra Cứu Trạng Thái Yêu Cầu</h1>

      {/* Inquiry ID Search input */}
      <form onSubmit={handleSearchSubmit} className="glass-card" style={styles.searchCard}>
        <label className="form-label">Nhập mã yêu cầu hỏi mua của bạn</label>
        <div style={styles.searchRow}>
          <input 
            type="text" 
            placeholder="Ví dụ: 12" 
            value={inquiryId}
            onChange={(e) => setInquiryId(e.target.value)}
            className="form-control"
            style={styles.searchInput}
          />
          <button type="submit" className="btn btn-primary" style={styles.searchBtn}>
            <Search size={18} /> Tra cứu
          </button>
        </div>
      </form>

      {/* Loading state */}
      {loading && <div style={styles.centerText}>Đang tra cứu dữ liệu yêu cầu...</div>}

      {/* Error state */}
      {error && (
        <div style={styles.errorBox}>
          <AlertTriangle size={24} color="#ef4444" />
          <span>{error}</span>
        </div>
      )}

      {/* Inquiry details render */}
      {inquiry && (
        <div style={styles.resultContainer} className="animate-fade-in">
          <div className="glass-card" style={styles.mainCard}>
            <div style={styles.cardHeader}>
              <div style={styles.headerTitleGroup}>
                <ClipboardList size={24} color="#EB0000" />
                <h2>Chi Tiết Yêu Cầu #{inquiry.purchase_inquiry_id}</h2>
              </div>
              <span 
                style={{
                  ...styles.statusBadge, 
                  background: getStatusStyle(inquiry.status).bg, 
                  color: getStatusStyle(inquiry.status).color
                }}
              >
                {getStatusStyle(inquiry.status).text}
              </span>
            </div>

            <div style={styles.grid}>
              <div style={styles.infoCol}>
                <h3 style={styles.subTitle}>Thông tin khách hàng</h3>
                <div style={styles.infoList}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Khách hàng:</span>
                    <span style={styles.infoVal}>{inquiry.customer_name}</span>
                  </div>
                  {inquiry.customer_email && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Email:</span>
                      <span style={styles.infoVal}>{inquiry.customer_email}</span>
                    </div>
                  )}
                  {inquiry.customer_phone && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Điện thoại:</span>
                      <span style={styles.infoVal}>{inquiry.customer_phone}</span>
                    </div>
                  )}
                  {inquiry.company_name && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Công ty:</span>
                      <span style={styles.infoVal}>{inquiry.company_name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.infoCol}>
                <h3 style={styles.subTitle}>Thông tin bản quyền</h3>
                <div style={styles.infoList}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Bài nhạc:</span>
                    <span style={styles.infoVal}><strong>{inquiry.Track?.title || `ID: ${inquiry.track_id}`}</strong></span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Mục đích:</span>
                    <span style={styles.infoVal}>{inquiry.usage_purpose}</span>
                  </div>
                  {inquiry.budget && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Ngân sách đề xuất:</span>
                      <span style={styles.infoVal}>{inquiry.budget.toLocaleString()} {inquiry.currency}</span>
                    </div>
                  )}
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Ngày gửi:</span>
                    <span style={styles.infoVal}>{new Date(inquiry.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note from Producer/Admin */}
            {inquiry.note && (
              <div style={styles.noteSection}>
                <h4 style={styles.noteTitle}>Phản hồi từ Producer/Admin:</h4>
                <p style={styles.noteContent}>{inquiry.note}</p>
              </div>
            )}

            {/* Transaction delivery or downloads if completed */}
            {inquiry.status === 'completed' && inquiry.Purchases && inquiry.Purchases.length > 0 && (
              <div style={styles.downloadSection}>
                <h4 style={styles.downloadTitle}>Tải Xuống Tệp Tin & Hợp Đồng:</h4>
                {inquiry.Purchases.map(p => (
                  <div key={p.purchase_id} style={styles.downloadItem}>
                    <div style={styles.downloadInfo}>
                      <FileText size={20} color="#10b981" />
                      <div>
                        <strong>{p.license_type || 'Bản quyền nhạc'}</strong>
                        <span style={styles.fileHint}>Mã giao dịch: #{p.transaction_reference || 'N/A'}</span>
                      </div>
                    </div>
                    {p.download_url ? (
                      <a href={p.download_url} target="_blank" rel="noreferrer" className="btn btn-primary" style={styles.downloadBtn}>
                        <Download size={16} /> Tải file Master
                      </a>
                    ) : (
                      <span style={styles.noFileText}>Đang chuẩn bị file bàn giao...</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
  searchCard: {
    marginBottom: '30px',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  searchInput: {
    flex: 1,
    fontSize: '15px',
  },
  searchBtn: {
    padding: '0 24px',
  },
  centerText: {
    textAlign: 'center',
    padding: '40px',
    color: '#A2A2A2',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    color: '#ef4444',
    marginBottom: '30px',
  },
  resultContainer: {
    marginBottom: '40px',
  },
  mainCard: {
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(235, 0, 0, 0.15)',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginBottom: '24px',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  subTitle: {
    fontSize: '16px',
    color: '#fff',
    borderBottom: '2px solid rgba(235, 0, 0, 0.2)',
    paddingBottom: '8px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  infoLabel: {
    color: '#636366',
  },
  infoVal: {
    color: '#fff',
    textAlign: 'right',
  },
  noteSection: {
    background: 'rgba(235, 0, 0, 0.05)',
    border: '1px solid rgba(235, 0, 0, 0.15)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  noteTitle: {
    fontSize: '14px',
    color: '#FF3B30',
    marginBottom: '8px',
    fontWeight: '600',
  },
  noteContent: {
    fontSize: '14px',
    color: '#F3F1F8',
    lineHeight: '1.5',
  },
  downloadSection: {
    borderTop: '1px solid rgba(235, 0, 0, 0.15)',
    paddingTop: '20px',
  },
  downloadTitle: {
    fontSize: '15px',
    color: '#fff',
    marginBottom: '16px',
  },
  downloadItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '16px',
    borderRadius: '8px',
  },
  downloadInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  fileHint: {
    display: 'block',
    fontSize: '12px',
    color: '#636366',
    marginTop: '2px',
  },
  downloadBtn: {
    padding: '8px 16px',
    fontSize: '13px',
  },
  noFileText: {
    fontSize: '13px',
    color: '#636366',
    fontStyle: 'italic',
  },
};

export default InquiryStatus;
