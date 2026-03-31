import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './Auth';
import Lobby from './Lobby';
import Game from './Game';
import './index.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null); // { code: string, isHost: boolean }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="loading" style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Loading...</div>;

  return (
    <div className="app-container">
      {/* Background aesthetics persist */}
      <div className="synthwave-grid"></div>
      <div className="sun"></div>
      
      <header className="header" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="neon-text" style={{ fontSize: room ? '1.5rem' : '2rem' }}>GUESS THE YEAR</h1>
        <p className="sub-text" style={{ fontSize: room ? '0.8rem' : '1.2rem' }}>80s Edition • Multiplayer</p>
      </header>

      <main className="main-content" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        {!session ? (
          <Auth onLogin={(user) => setSession({ user })} />
        ) : !room ? (
          <Lobby user={session.user} onRoomJoined={(code, isHost) => setRoom({ code, isHost })} />
        ) : (
          <Game user={session.user} roomCode={room.code} isHost={room.isHost} />
        )}
      </main>
    </div>
  );
}
