import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './Auth';
import Lobby from './Lobby';
import Game from './Game';
import './index.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null); // { code, isHost, selectedDecades }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setRoom(null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
            onRoomJoined={(code, isHost, selectedDecades) => setRoom({ code, isHost, selectedDecades })}
          />
        ) : (
          <Game
            user={session.user}
            roomCode={room.code}
            isHost={room.isHost}
            selectedDecades={room.selectedDecades}
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
