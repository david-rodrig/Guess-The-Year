import { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import Auth from './Auth';
import Lobby from './Lobby';
import Game from './Game';
import './index.css';

const HEARTBEAT_MS = 5 * 60 * 1000; // 5 minutes

export default function App() {
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null); // { code, isHost, selectedDecades }
  const [loading, setLoading] = useState(true);
  const heartbeatRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setRoom(null);
        clearInterval(heartbeatRef.current);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Keep last_seen fresh while the user is active
  useEffect(() => {
    clearInterval(heartbeatRef.current);
    if (session) {
      const ping = () => { supabase.rpc('update_last_seen').then(() => {}, () => {}); };
      ping();
      heartbeatRef.current = setInterval(ping, HEARTBEAT_MS);
    }
    return () => clearInterval(heartbeatRef.current);
  }, [session?.user?.id]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app-container">
      <div className="synthwave-grid"></div>

      <header className="header" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="neon-text" style={{ fontSize: room ? 'clamp(0.8rem, 3vw, 1.5rem)' : 'clamp(1rem, 5vw, 2rem)' }}>
          GUESS THE YEAR
        </h1>
        <p className="sub-text" style={{ fontSize: room ? 'clamp(0.5rem, 1.5vw, 0.8rem)' : 'clamp(0.6rem, 2.5vw, 1.2rem)' }}>
          Multiplayer • 1970–2020
        </p>
      </header>

      <main className="main-content" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        {!session ? (
          <Auth onLogin={(user) => setSession({ user })} />
        ) : !room ? (
          <Lobby
            user={session.user}
            onRoomJoined={(code, isHost, selectedDecades, musicType) => setRoom({ code, isHost, selectedDecades, musicType })}
          />
        ) : (
          <Game
            user={session.user}
            roomCode={room.code}
            isHost={room.isHost}
            selectedDecades={room.selectedDecades}
            musicType={room.musicType || 'international'}
            onLeave={async () => {
              await supabase.auth.signOut();
              setSession(null);
              setRoom(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
