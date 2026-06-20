// Spotify API Service
const DEFAULT_CLIENT_ID = 'd079944db72e44f884f33b1e3f8a48ef'; // Sandbox client ID
const SCOPES = [
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative'
];

export const spotify = {
  // Generate Spotify OAuth url
  getAuthUrl: (customClientId) => {
    const clientId = customClientId || localStorage.getItem('spotify_client_id') || DEFAULT_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/');
    const scope = encodeURIComponent(SCOPES.join(' '));
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&show_dialog=true`;
  },

  // Parse URL hash for access token
  parseTokenFromHash: () => {
    const hash = window.location.hash;
    if (!hash) return null;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      const expiryTime = Date.now() + Number(expiresIn) * 1000;
      localStorage.setItem('spotify_token', accessToken);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());
      // Clean URL hash
      window.history.replaceState(null, null, window.location.pathname + window.location.search);
      return accessToken;
    }
    return null;
  },

  // Retrieve stored token if valid
  getAccessToken: () => {
    const token = localStorage.getItem('spotify_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    if (!token || !expiry) return null;

    if (Date.now() > Number(expiry)) {
      // Token expired
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_expiry');
      return null;
    }
    return token;
  },

  disconnect: () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiry');
  },

  // Fetch Currently Playing Song
  fetchCurrentlyPlaying: async (token) => {
    if (!token) return null;
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 204) {
        return { is_playing: false, mock: true, item: null }; // nothing playing
      }
      if (response.status === 401) {
        // Token expired/invalid
        localStorage.removeItem('spotify_token');
        return null;
      }
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      return { ...data, mock: false };
    } catch (err) {
      console.warn('Spotify fetch error, falling back:', err.message);
      return null;
    }
  },

  // Fetch User's Spotify Playlists
  fetchPlaylists: async (token) => {
    if (!token) return [];
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=15', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 401) {
        localStorage.removeItem('spotify_token');
        return [];
      }
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      return data.items || [];
    } catch (err) {
      console.warn('Spotify fetch playlists error:', err.message);
      return [];
    }
  },

  // Recommendations generator
  getRecommendations: (mood) => {
    const recommendations = {
      focus: [
        { id: '1', title: 'Deep Focus Beats 🧠', duration: '2h 15m', tracksCount: 45, playlistId: '37i9dQZF1DWZeKFB6u1Z4J' },
        { id: '2', title: 'Intense Studying Lofi 📚', duration: '3h 40m', tracksCount: 80, playlistId: '37i9dQZF1DWWQRwui0EXPn' },
        { id: '3', title: 'Classical Concentration 🎹', duration: '4h 10m', tracksCount: 95, playlistId: '37i9dQZF1DWWEJl22ZqG0c' }
      ],
      night: [
        { id: '4', title: 'Night Study Ambient 🌙', duration: '2h 50m', tracksCount: 50, playlistId: '37i9dQZF1DX8UebhpvMOhw' },
        { id: '5', title: 'Late Night Jazz Lofi ☕', duration: '3h 15m', tracksCount: 65, playlistId: '37i9dQZF1DXc8fdoRFg97t' },
        { id: '6', title: 'Synthwave Night Ride 🚀', duration: '1h 45m', tracksCount: 30, playlistId: '37i9dQZF1DXdLTE75gdIaG' }
      ],
      morning: [
        { id: '7', title: 'Morning Acoustic Study ☕', duration: '2h 30m', tracksCount: 40, playlistId: '37i9dQZF1DWZIOxz5WLIQJ' },
        { id: '8', title: 'Chillin Room Beats 🍃', duration: '3h 0m', tracksCount: 60, playlistId: '37i9dQZF1DX4sWSpwq3LiO' }
      ],
      exams: [
        { id: '9', title: 'Exam Focus & Memory 🧠', duration: '4h 0m', tracksCount: 110, playlistId: '37i9dQZF1DX3PFzd2nsnLw' },
        { id: '10', title: 'Brain Food Beats 🥦', duration: '2h 45m', tracksCount: 55, playlistId: '37i9dQZF1DWXLeF644aa3S' }
      ]
    };
    return recommendations[mood] || recommendations.focus;
  }
};
