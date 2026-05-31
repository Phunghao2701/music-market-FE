import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, MessageSquare, ArrowLeft, Disc, Clock, Eye, Sparkles } from 'lucide-react';
import api from '../services/api';

const TrackDetails = () => {
  const { slug } = useParams();
  const [track, setTrack] = useState(null);
  const [relatedTracks, setRelatedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const fetchTrackDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/tracks/${slug}`);
        if (response.data && response.data.success) {
          const trackData = response.data.data;
          setTrack(trackData);
          
          // Fetch related tracks
          const relatedRes = await api.get(`/tracks/${trackData.track_id}/related`).catch(() => null);
          if (relatedRes && relatedRes.data && relatedRes.data.success) {
            setRelatedTracks(relatedRes.data.data.tracks || []);
          }
        } else {
          setError('Không tìm thấy bài hát.');
        }
      } catch (err) {
        setError('Không tìm thấy thông tin chi tiết bài hát.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrackDetails();
  }, [slug]);

  // Audio control
  const handlePlayPause = () => {
    if (!track || !track.preview_audio_url) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      if (audioElement) {
        audioElement.play();
        setIsPlaying(true);
      } else {
        const audio = new Audio(track.preview_audio_url);
        audio.play().then(() => {
          setAudioElement(audio);
          setIsPlaying(true);

          // Log play
          api.post(`/tracks/${track.track_id}/play`, { played_seconds: 30 })
            .catch(e => console.error(e));
        }).catch(err => {
          alert('Không thể phát file nhạc demo này.');
        });

        audio.onended = () => {
          setIsPlaying(false);
        };
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  if (loading) return <div style={styles.center}>Đang tải thông tin chi tiết...</div>;
  if (error) return <div style={styles.centerError}>{error}</div>;
  if (!track) return null;

  return (
    <div className="animate-fade-in" style={styles.container}>
      <Link to="/" style={styles.backLink}><ArrowLeft size={16} /> Quay lại trang chủ</Link>
      
      <div style={styles.layout}>
        {/* Left column: Cover Art */}
        <div style={styles.coverColumn}>
          <div style={styles.coverWrapper}>
            <img 
              src={track.cover_image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80'} 
              alt={track.title} 
              style={styles.cover}
            />
            <button onClick={handlePlayPause} style={styles.playBtn}>
              {isPlaying ? <Pause size={28} fill="#fff" /> : <Play size={28} fill="#fff" style={{marginLeft: 4}} />}
            </button>
          </div>
        </div>

        {/* Right column: Track details info */}
        <div className="glass-card" style={styles.infoColumn}>
          <div style={styles.badgeRow}>
            {track.is_featured && <span style={styles.featuredBadge}><Sparkles size={12} /> Nổi bật</span>}
            <span style={styles.viewBadge}><Eye size={12} /> {track.view_count || 0} lượt xem</span>
          </div>

          <h1 style={styles.title}>{track.title}</h1>
          <p style={styles.description}>{track.description || 'Không có mô tả cho beat nhạc này.'}</p>

          <hr style={styles.divider} />

          <div style={styles.detailsGrid}>
            <div style={styles.detailBox}>
              <span style={styles.detailLabel}>Tempo</span>
              <span style={styles.detailValue}><Disc size={18} color="#9d4edd" /> {track.bpm} BPM</span>
            </div>

            <div style={styles.detailBox}>
              <span style={styles.detailLabel}>Tông nhạc (Key)</span>
              <span style={styles.detailValue}>{track.musical_key || 'Chưa cập nhật'}</span>
            </div>

            <div style={styles.detailBox}>
              <span style={styles.detailLabel}>Thời lượng</span>
              <span style={styles.detailValue}><Clock size={18} color="#9d4edd" /> {track.duration_seconds} giây</span>
            </div>
          </div>

          <div style={styles.actionSection}>
            <Link 
              to={`/inquiry?trackId=${track.track_id}&trackTitle=${encodeURIComponent(track.title)}`} 
              className="btn btn-primary" 
              style={styles.actionBtn}
            >
              <MessageSquare size={20} />
              Gửi Yêu Cầu Hỏi Mua Bản Quyền
            </Link>
          </div>
        </div>
      </div>

      {/* Related tracks section */}
      {relatedTracks.length > 0 && (
        <section style={styles.relatedSection}>
          <h2 style={styles.relatedTitle}>Bài Nhạc Liên Quan</h2>
          <div style={styles.relatedGrid}>
            {relatedTracks.map(t => (
              <Link to={`/tracks/${t.slug}`} key={t.track_id} className="glass-card" style={styles.relatedCard}>
                <img 
                  src={t.cover_image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80'} 
                  alt={t.title} 
                  style={styles.relatedCover}
                />
                <div style={styles.relatedInfo}>
                  <h3 style={styles.relatedTrackTitle}>{t.title}</h3>
                  <span style={styles.relatedBpm}>{t.bpm} BPM</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9A95B0',
    marginBottom: '24px',
    fontSize: '15px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '40px',
    marginBottom: '60px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },
  coverColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  coverWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    background: '#1A1A1A',
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  playBtn: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#EB0000',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(235, 0, 0, 0.5)',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  badgeRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  featuredBadge: {
    background: 'rgba(235, 0, 0, 0.2)',
    color: '#FF3B30',
    border: '1px solid rgba(235, 0, 0, 0.4)',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  viewBadge: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#A2A2A2',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  title: {
    fontSize: '36px',
    marginBottom: '16px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#A2A2A2',
    marginBottom: '24px',
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid rgba(235, 0, 0, 0.15)',
    marginBottom: '24px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '40px',
  },
  detailBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(235, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#636366',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actionSection: {
    marginTop: 'auto',
  },
  actionBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
  },
  relatedSection: {
    marginTop: '40px',
  },
  relatedTitle: {
    fontSize: '22px',
    marginBottom: '20px',
    borderLeft: '4px solid #EB0000',
    paddingLeft: '12px',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  relatedCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
  },
  relatedCover: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  relatedInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  relatedTrackTitle: {
    fontSize: '15px',
    color: '#fff',
    fontWeight: '500',
  },
  relatedBpm: {
    fontSize: '12px',
    color: '#636366',
  },
  center: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#A2A2A2',
  },
  centerError: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#ef4444',
  },
};

export default TrackDetails;
