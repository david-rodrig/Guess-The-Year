import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './Auth';
import DecadeSelect from './DecadeSelect';
import Lobby from './Lobby';
import Game from './Game';
import './index.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [selectedDecades, setSelectedDecades] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) { setSelectedDecades(null); setRoom(null); }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  const inGame = !!room;

  return (
    <div className="app-container">
      <div className="synthwave-grid"></div>

      <header className="header" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="neon-text" style={{ fontSize: inGame ? 'clamp(0.8rem, 3vw, 1.5rem)' : 'clamp(1rem, 5vw, 2rem)' }}>
          GUESS THE YEAR
        </h1>
        <p className="sub-text" style={{ fontSize: inGame ? 'clamp(0.5rem, 1.5vw, 0.8rem)' : 'clamp(0.6rem, 2.5vw, 1.2rem)' }}>
          Multiplayer • 1970–2020
        </p>
      </header>

      <main className="main-content" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        {!session ? (
          <Auth onLogin={(user) => setSession({ user })} />
        ) : !selectedDecades ? (
          <DecadeSelect onConfirm={(decades) => setSelectedDecades(decades)} />
        ) : !room ? (
          <Lobby user={session.user} onRoomJoined={(code, isHost) => setRoom({ code, isHost })} />
        ) : (
          <Game
            user={session.user}
            roomCode={room.code}
            isHost={room.isHost}
            selectedDecades={selectedDecades}
            onLeave={async () => {
              await supabase.auth.signOut();
              setSession(null);
              setSelectedDecades(null);
              setRoom(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
