import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function Lobby({ user, onRoomJoined }) {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
    loadProfile();
  }, [user]);

  const generateCode = () => String(Math.floor(1000 + Math.random() * 9000));

  const handleCreateRoom = async () => {
    setError(null);
    setLoading(true);
    try {
      const code = generateCode();
      const { error: dbError } = await supabase.from('rooms').insert([
        { code, host_id: user.id, status: 'playing' }
      ]);
      if (dbError) throw dbError;
      onRoomJoined(code, true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode) return;
    setError(null);
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode)
        .single();
      if (dbError || !data) throw new Error('Room not found or invalid.');
      onRoomJoined(data.code, data.host_id === user.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="glass-card lobby-card fade-in">
      <div className="lobby-header">
        <h2 className="neon-text cyan" style={{ fontSize: 'clamp(0.75rem, 3vw, 1.1rem)', marginBottom: 0 }}>
          GUESS THE YEAR
        </h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {profile && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <img
            src={profile.avatar_url}
            alt="avatar"
            style={{ width: '70px', height: '70px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' }}
          />
          <h3 className="neon-text cyan" style={{ fontSize: 'clamp(0.7rem, 2.5vw, 1rem)' }}>
            WELCOME, {profile.full_name?.toUpperCase() || 'PLAYER'}
          </h3>
        </div>
      )}

      <div style={{ borderTop: '1px solid rgba(0, 255, 255, 0.3)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
        <button className="neon-btn full-width" onClick={handleCreateRoom} disabled={loading}>
          {loading ? 'WAIT...' : 'CREATE NEW HOST ROOM'}
        </button>
      </div>

      <div style={{ margin: '1.5rem 0', color: '#ff00ff', fontWeight: 'bold' }}>--- OR ---</div>

      <form onSubmit={handleJoinRoom} className="guess-form">
        <input
          type="text"
          placeholder="ENTER ROOM CODE"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="neon-input"
          maxLength={4}
          type="number"
        />
        <button
          type="submit"
          className="neon-btn"
          style={{ borderColor: '#ffff00', color: '#ffff00' }}
          disabled={loading || !roomCode}
        >
          JOIN ROOM
        </button>
        {error && <div className="feedback-message wrong">{error}</div>}
      </form>
    </div>
  );
}
