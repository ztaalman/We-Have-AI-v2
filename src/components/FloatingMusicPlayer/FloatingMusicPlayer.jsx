import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';
import './FloatingMusicPlayer.css';
import { MusicPlayerContext } from './MusicPlayerContext';

const DEFAULT_VIDEO = {
  title: 'Sea Shanty 2',
  artist: 'Old School RuneScape',
  youtubeId: '0jXTBAGv9ZQ',
  thumbnail: 'https://img.youtube.com/vi/0jXTBAGv9ZQ/hqdefault.jpg',
};

const searchCache = {};

const FloatingMusicPlayer = () => {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(DEFAULT_VIDEO);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const playerRef = useRef(null);
  const ytPlayer = useRef(null);
  const [pendingSearch, setPendingSearch] = useState('');
  const { karaokePlayRequest } = useContext(MusicPlayerContext);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    } else {
      window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady();
    }
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      if (!ytPlayer.current && playerRef.current) {
        ytPlayer.current = new window.YT.Player(playerRef.current, {
          videoId: currentVideo.youtubeId,
          playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1 },
          events: {
            onReady: (event) => {
              if (playing) event.target.playVideo();
              // Try to get title from player if available initially
              if (event.target.getVideoData) {
                const data = event.target.getVideoData();
                if (data && data.title) {
                  setCurrentVideo(prev => ({
                    ...prev,
                    title: data.title,
                    artist: data.author || prev.artist
                  }));
                }
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PAUSED) setPlaying(false);
              if (event.data === window.YT.PlayerState.PLAYING) {
                setPlaying(true);
                // Fetch details when video starts playing to ensure title is correct
                // especially for autoplayed next videos
                if (event.target.getVideoData) {
                  const data = event.target.getVideoData();
                  if (data && data.video_id) {
                    // Check if we need to update info
                    if (data.title && data.title !== currentVideo.title) {
                      setCurrentVideo(prev => ({
                        ...prev,
                        youtubeId: data.video_id,
                        title: data.title,
                        artist: data.author || prev.artist
                      }));
                    } else if (data.video_id !== currentVideo.youtubeId) {
                      // Video ID changed (e.g. autoplay), fetch properly
                      // We can also use the API search function if we had a direct lookup by ID
                      // For now, trust the player's data or trigger a re-render
                      setCurrentVideo(prev => ({
                        ...prev,
                        youtubeId: data.video_id,
                        title: data.title || 'Loading...',
                        artist: data.author || 'YouTube'
                      }));
                    }
                  }
                }
              }
            },
          },
        });
      }
    };
    if (window.YT && window.YT.Player && playerRef.current && !ytPlayer.current) {
      window.onYouTubeIframeAPIReady();
    }

    const handleInteraction = () => {
      if (playerRef.current && ytPlayer.current) {
        if (playing) { // ONLY if we intend to be playing
          const state = ytPlayer.current.getPlayerState();
          // If unstarted (-1) or paused (2) or cued (5), try to play
          if (state === -1 || state === 2 || state === 5) {
            ytPlayer.current.playVideo();
          }
        }
      }
      // Remove listeners once we've interacted
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      // Clean up
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Play/pause logic
  useEffect(() => {
    if (ytPlayer.current) {
      if (playing) {
        ytPlayer.current.playVideo();
      } else {
        ytPlayer.current.pauseVideo();
      }
    }
  }, [playing]);

  // Change video logic
  useEffect(() => {
    if (ytPlayer.current && currentVideo.youtubeId) {
      ytPlayer.current.loadVideoById(currentVideo.youtubeId);
    }
  }, [currentVideo.youtubeId]);

  // Search YouTube
  const doSearch = useCallback(async (query) => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    if (searchCache[query]) {
      setResults(searchCache[query]);
      return;
    }
    setLoading(true);
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!API_KEY) {
      setApiKeyMissing(true);
      setResults([]);
      setLoading(false);
      return;
    }
    setApiKeyMissing(false);
    const q = encodeURIComponent(query);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${q}&key=${API_KEY}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const processedResults = (data.items || []).map((item) => ({
        youtubeId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      }));
      searchCache[query] = processedResults;
      setResults(processedResults);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    setPendingSearch(e.target.value);
  };

  const handleSearchTrigger = (e) => {
    if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
      setSearch(pendingSearch);
      doSearch(pendingSearch);
    }
  };

  const handleSelect = (video) => {
    setCurrentVideo(video);
    setExpanded(true);
    setPlaying(true);
    setSearch('');
    setResults([]);
    setPendingSearch('');
  };

  useEffect(() => {
    if (!currentVideo || !currentVideo.youtubeId) {
      setCurrentVideo(DEFAULT_VIDEO);
    }
  }, [currentVideo]);

  // Listen for karaoke play requests
  useEffect(() => {
    if (karaokePlayRequest) {
      doSearch(`${karaokePlayRequest.artist} ${karaokePlayRequest.track}`);
    }
  }, [karaokePlayRequest, doSearch]);

  return (
    <div className={`fmp-root${expanded ? ' expanded' : ''}`}>
      {/* Circular button with medieval styling */}
      <div className="fmp-circle-tab" onClick={() => setExpanded(e => !e)}>
        <img
          src={currentVideo.thumbnail}
          alt={currentVideo.title}
          className="fmp-circle-thumb"
        />
        <button
          className="fmp-circle-playpause"
          onClick={e => { e.stopPropagation(); setPlaying(p => !p); }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="#1a0a00" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="#1a0a00" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24">
              <polygon points="6,4 20,12 6,20" fill="#1a0a00" />
            </svg>
          )}
        </button>
      </div>

      {/* Expanded flyout panel */}
      <div className={`fmp-flyout${expanded ? ' show' : ''}`}>
        <div className="fmp-flyout-content">
          {/* Current song info */}
          <div className="fmp-flyout-info">
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className="fmp-flyout-thumb"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fmp-flyout-title">{currentVideo.title}</div>
              <div className="fmp-flyout-artist">{currentVideo.artist}</div>
            </div>
          </div>

          {/* Video player */}
          <div className="fmp-flyout-video">
            <div style={{
              width: '100%',
              maxWidth: 320,
              aspectRatio: '16/9',
              background: '#000',
              borderRadius: 8,
              overflow: 'hidden'
            }}>
              <div ref={playerRef} id="ytplayer" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', width: '100%', gap: 8, marginBottom: 8 }}>
            <input
              className="fmp-search"
              type="text"
              placeholder="Search for music..."
              value={pendingSearch}
              onChange={handleInputChange}
              onKeyDown={handleSearchTrigger}
            />
            <button
              className="fmp-search-button"
              onClick={handleSearchTrigger}
            >
              Search
            </button>
          </div>

          {/* API key warning */}
          {apiKeyMissing && (
            <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 8, textAlign: 'center' }}>
              YouTube API key missing. Add VITE_YOUTUBE_API_KEY to .env
            </div>
          )}

          {/* Loading */}
          {loading && <div style={{ color: '#d4af37', fontSize: 14 }}>Searching...</div>}

          {/* Search results */}
          <div className="fmp-search-results">
            {results.map((video) => (
              <div
                key={video.youtubeId}
                className="fmp-search-result"
                onClick={() => handleSelect(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{ width: 48, height: 36, objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fmp-search-title">{video.title}</div>
                  <div className="fmp-search-artist">{video.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingMusicPlayer;