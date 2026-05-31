import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Search, SlidersHorizontal, MessageSquare, Clock, Disc } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [bpmMin, setBpmMin] = useState('');
  const [bpmMax, setBpmMax] = useState('');
  
  // Meta options from backend
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);

  // Audio player state
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  // Fetch initial metadata and tracks
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [genresRes, moodsRes] = await Promise.all([
          api.get('/genres').catch(() => ({ data: { data: { genres: [] } } })),
          api.get('/moods').catch(() => ({ data: { data: { moods: [] } } }))
        ]);
        setGenres(genresRes.data?.data?.genres || []);
        setMoods(moodsRes.data?.data?.moods || []);
      } catch (err) {
        console.error('Lỗi khi tải metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch tracks whenever filters change
  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          search: searchTerm || undefined,
          genre: selectedGenre || undefined,
          mood: selectedMood || undefined,
          bpm_min: bpmMin || undefined,
          bpm_max: bpmMax || undefined,
        };
        const response = await api.get('/tracks', { params });
        if (response.data && response.data.success) {
          setTracks(response.data.data.tracks || []);
        } else {
          setTracks([]);
        }
      } catch (err) {
        setError('Không thể kết nối đến server backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchTracks();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedGenre, selectedMood, bpmMin, bpmMax]);

  // Audio Play/Pause handler
  const handlePlayPause = async (track) => {
    if (playingTrackId === track.track_id) {
      audioElement.pause();
      setPlayingTrackId(null);
    } else {
      // If another track was playing, pause it
      if (audioElement) {
        audioElement.pause();
      }

      const audio = new Audio(track.preview_audio_url);
      audio.play().then(() => {
        setPlayingTrackId(track.track_id);
        setAudioElement(audio);

        // Call backend API to record the play event
        api.post(`/tracks/${track.track_id}/play`, { played_seconds: 30 })
          .catch(e => console.error('Lỗi khi gửi sự kiện nghe nhạc:', e));
      }).catch(err => {
        alert('Không thể phát file nhạc demo này.');
        console.error(err);
      });

      audio.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Khám phá và Mua bản quyền âm nhạc đỉnh cao</h1>
        <p style={styles.heroSubtitle}>Cổng chợ giao dịch beat nhạc và master track chất lượng cao cho các nghệ sĩ độc lập và thương hiệu</p>
      </header>

      {/* Filter panel */}
      <section className="glass-card" style={styles.filterSection}>
        <div style={styles.searchBarContainer}>
          <Search size={20} color="#9A95B0" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tiêu đề bài nhạc, thể loại..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filtersRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Thể loại</label>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)} 
              className="form-control"
              style={styles.select}
            >
              <option value="">Tất cả thể loại</option>
              {genres.map(g => (
                <option key={g.genre_id} value={g.slug}>{g.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Mood</label>
            <select 
              value={selectedMood} 
              onChange={(e) => setSelectedMood(e.target.value)} 
              className="form-control"
              style={styles.select}
            >
              <option value="">Tất cả mood</option>
              {moods.map(m => (
                <option key={m.mood_id} value={m.slug}>{m.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>BPM tối thiểu</label>
            <input 
              type="number" 
              placeholder="Min" 
              value={bpmMin} 
              onChange={(e) => setBpmMin(e.target.value)}
              className="form-control"
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>BPM tối đa</label>
            <input 
              type="number" 
              placeholder="Max" 
              value={bpmMax} 
              onChange={(e) => setBpmMax(e.target.value)}
              className="form-control"
              style={styles.input}
            />
          </div>
        </div>
      </section>

      {/* Track Catalog */}
      <h2 style={styles.sectionTitle}>Danh Sách Beat Nhạc</h2>
      {loading ? (
        <div style={styles.centerText}>Đang tải danh sách bài hát...</div>
      ) : error ? (
        <div style={styles.errorText}>{error}</div>
      ) : tracks.length === 0 ? (
        <div style={styles.centerText}>Không tìm thấy bài hát nào phù hợp bộ lọc.</div>
      ) : (
        <div style={styles.grid}>
          {tracks.map(track => (
            <div key={track.track_id} className="glass-card" style={styles.card}>
              <div style={styles.coverWrapper}>
                <img 
                  src={track.cover_image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'} 
                  alt={track.title} 
                  style={styles.cover}
                />
                <button 
                  onClick={() => handlePlayPause(track)} 
                  style={styles.playBtn}
                >
                  {playingTrackId === track.track_id ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" style={{marginLeft: 3}} />}
                </button>
              </div>

              <div style={styles.cardInfo}>
                <Link to={`/tracks/${track.slug}`} style={styles.trackTitle}>{track.title}</Link>
                
                <div style={styles.metaRow}>
                  <span style={styles.metaItem}><Clock size={14} /> {track.duration_seconds}s</span>
                  <span style={styles.metaItem}><Disc size={14} /> {track.bpm} BPM ({track.musical_key || 'Unknown Key'})</span>
                </div>

                <div style={styles.actionRow}>
                  <Link 
                    to={`/inquiry?trackId=${track.track_id}&trackTitle=${encodeURIComponent(track.title)}`} 
                    className="btn btn-primary" 
                    style={styles.buyBtn}
                  >
                    <MessageSquare size={16} />
                    Hỏi Mua
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  hero: {
    textAlign: 'center',
    padding: '40px 0',
    maxWidth: '800px',
    margin: '0 auto 30px auto',
  },
  heroTitle: {
    fontSize: '42px',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #fff 40%, #ff3b30 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#A2A2A2',
    lineHeight: '1.5',
  },
  filterSection: {
    marginBottom: '40px',
  },
  searchBarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(235, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    width: '100%',
    outline: 'none',
  },
  filtersRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#A2A2A2',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  select: {
    fontSize: '14px',
  },
  input: {
    fontSize: '14px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    borderLeft: '4px solid #EB0000',
    paddingLeft: '12px',
  },
  centerText: {
    textAlign: 'center',
    padding: '40px',
    color: '#A2A2A2',
    fontSize: '16px',
  },
  errorText: {
    textAlign: 'center',
    padding: '40px',
    color: '#ef4444',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '16px',
  },
  coverWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '16px',
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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(235, 0, 0, 0.95)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(235, 0, 0, 0.4)',
    transition: 'all 0.2s',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  trackTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#A2A2A2',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionRow: {
    marginTop: '8px',
  },
  buyBtn: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
  },
};

export default Home;
