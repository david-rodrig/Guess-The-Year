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

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateRoom = async () => {
    setError(null);
    setLoading(true);
    try {
      const code = generateCode();
      const { error: dbError } = await supabase.from('rooms').insert([
        { code, host_id: user.id, status: 'playing' }
      ]);
      if (dbError) throw dbError;
      onRoomJoined(code, true); // true = isHost
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
        .eq('code', roomCode.toUpperCase())
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
    <div className="glass-card fade-in" style={{ maxWidth: '400px', margin: 'auto', marginTop: '10vh', textAlign: 'center' }}>
      <button onClick={handleLogout} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: '1px solid gray', color: 'gray', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
        Logout
      </button>

      {profile && (
        <div style={{ marginBottom: '2rem' }}>
          <img src={profile.avatar_url} alt="avatar" style={{ width: '80px', borderRadius: '50%', marginBottom: '10px' }} />
          <h3 className="neon-text cyan" style={{ fontSize: '1.2rem' }}>WELCOME, {profile.full_name?.toUpperCase() || 'PLAYER'}</h3>
        </div>
      )}

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(0, 255, 255, 0.3)', marginTop: '20px' }}>
        <button className="neon-btn" style={{ width: '100%' }} onClick={handleCreateRoom} disabled={loading}>
          {loading ? 'WAIT...' : 'CREATE NEW HOST ROOM'}
        </button>
      </div>

      <div style={{ margin: '2rem 0', color: '#ff00ff', fontWeight: 'bold' }}>--- OR ---</div>

      <form onSubmit={handleJoinRoom} className="guess-form">
        <input
          type="text"
          placeholder="ENTER ROOM CODE"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="neon-input"
          maxLength={6}
          style={{ textTransform: 'uppercase' }}
        />
        <button type="submit" className="neon-btn" style={{ color: '#neo-yellow', borderColor: '#ffff00' }} disabled={loading || !roomCode}>
          JOIN ROOM
        </button>
        {error && <div className="feedback-message wrong" style={{ fontSize: '1rem' }}>{error}</div>}
      </form>
    </div>
  );
}
