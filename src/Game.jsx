import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Helper to load songs
const songs = [
  { title: "Another One Bites the Dust", artist: "Queen", year: 1980, youtubeId: "rY0WxgPXvzc" },
  { title: "Don't You Want Me", artist: "The Human League", year: 1981, youtubeId: "uPudE8nDog0" },
  { title: "Thriller", artist: "Michael Jackson", year: 1982, youtubeId: "sOnqjkJTMaA" },
  { title: "Every Breath You Take", artist: "The Police", year: 1983, youtubeId: "OMOGaugKpzs" },
  { title: "When Doves Cry", artist: "Prince", year: 1984, youtubeId: "UG3VcCAlUgE" },
  { title: "Take On Me", artist: "a-ha", year: 1985, youtubeId: "djV11Xbc914" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", year: 1986, youtubeId: "lDK9QqIzhwk" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987, youtubeId: "1w7OgIMMRc4" },
  { title: "Where Is My Mind?", artist: "Pixies", year: 1988, youtubeId: "N3oCS85HvpY" },
  { title: "Like a Prayer", artist: "Madonna", year: 1989, youtubeId: "79fzeNUqQbO" },
  { title: "Billie Jean", artist: "Michael Jackson", year: 1983, youtubeId: "Zi_XLOBDo_Y" },
  { title: "Careless Whisper", artist: "George Michael", year: 1984, youtubeId: "izGwDsrQ1eQ" },
  { title: "Tainted Love", artist: "Soft Cell", year: 1981, youtubeId: "XZVnR3KpGvU" },
  { title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics", year: 1983, youtubeId: "qeMFqKcPYcg" },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", year: 1983, youtubeId: "PIb6AZdTr-A" }
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function Game({ user, roomCode, isHost }) {
  const [profile, setProfile] = useState(null);
  const [channel, setChannel] = useState(null);
  const [players, setPlayers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data));
  }, [user.id]);
  
  // Local Player State
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Host State
  const [hostSongs, setHostSongs] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(-1);

  // Init Realtime
  useEffect(() => {
    const ch = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: user.id } }
    });

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState();
      // limit visual list to 10 players
      const onlinePlayers = {};
      Object.keys(state).forEach(key => {
        onlinePlayers[key] = {
          info: state[key][0],
          score: 0 // Default, gets overwritten by broadcasts
        };
      });
      setPlayers(prev => {
        // preserve scores
        for (let k in onlinePlayers) {
          if (prev[k]) onlinePlayers[k].score = prev[k].score;
        }
        return onlinePlayers;
      });
    });

    ch.on('broadcast', { event: 'score_update' }, (payload) => {
      const { userId, newScore } = payload.payload;
      setPlayers(prev => ({
        ...prev,
        [userId]: { ...prev[userId], score: newScore }
      }));
    });

    ch.on('broadcast', { event: 'new_question' }, (payload) => {
      setCurrentQuestion(payload.payload.song);
      setFeedback(null);
      setGuess("");
      setElapsedTime(0);
    });

    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const userInfo = { name: profile?.full_name || 'Player', avatar: profile?.avatar_url };
        await ch.track(userInfo);
      }
    });

    setChannel(ch);
    return () => { ch.unsubscribe(); };
  }, [roomCode, user.id, profile]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (currentQuestion && feedback === null) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuestion, feedback]);

  // Host controls
  const handleHostNextQuestion = () => {
    let list = hostSongs;
    if (list.length === 0) {
      list = shuffleArray([...songs]).slice(0, 10);
      setHostSongs(list);
    }
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    
    if (nextIdx < list.length) {
      const song = list[nextIdx];
      channel.send({ type: 'broadcast', event: 'new_question', payload: { song } });
      // Host doesn't receive their own broadcast, so set locally too
      setCurrentQuestion(song);
      setFeedback(null);
      setGuess("");
      setElapsedTime(0);
    } else {
      // Game over logic (just local for simplicity)
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess) return;

    const guessedYear = parseInt(guess);
    let isCorrect = false;
    let message = "";

    if (guessedYear === currentQuestion.year) {
      isCorrect = true;
      message = `Correct! It was released in ${currentQuestion.year}.`;
      setScore(s => {
        const newer = s + 1;
        channel.send({ type: 'broadcast', event: 'score_update', payload: { userId: user.id, newScore: newer } });
        return newer;
      });
    } else {
      message = `Wrong! The correct year was ${currentQuestion.year}.`;
    }

    setFeedback({ message, isCorrect });
  };

  if (!channel) return <div className="loading">Connecting to Room...</div>;

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '800px', margin: 'auto', marginTop: '5vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid gray', paddingBottom: '10px' }}>
        <div>
          <h2 className="neon-text cyan">ROOM: {roomCode}</h2>
          <p>Online Players (Max 10): {Object.keys(players).length}</p>
        </div>
        {isHost && (
          <div>
            <button className="neon-btn" style={{ padding: '0.5rem 1rem' }} onClick={handleHostNextQuestion}>
              {questionIndex === -1 ? 'START GAME' : 'NEXT SONG'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Main Game Screen */}
        <div style={{ flex: 2 }}>
          {currentQuestion ? (
            <div className="question-card fade-in">
              <div className="video-container" style={{ marginBottom: '1.5rem', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}>
                <iframe 
                  key={currentQuestion.youtubeId}
                  width="100%" 
                  height="220" 
                  src={`https://www.youtube.com/embed/${currentQuestion.youtubeId}?autoplay=1&mute=0&controls=0&disablekb=1&showinfo=0`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>

              <div className="song-info">
                <h2 className="song-title">"{currentQuestion.title}"</h2>
                <h3 className="song-artist">by {currentQuestion.artist}</h3>
              </div>

              <form onSubmit={handleGuess} className="guess-form" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                <input 
                  type="number" 
                  min="1980" max="1989" 
                  placeholder="Year" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="neon-input"
                  style={{ width: '150px' }}
                  disabled={feedback !== null}
                />
                <span className="neon-text pink" style={{ fontSize: '1.2rem', margin: '0 10px' }}>{elapsedTime}s</span>
                <button type="submit" className="neon-btn submit-btn" disabled={feedback !== null || !guess}>
                  GUESS
                </button>
              </form>

              {feedback && (
                <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
                  {feedback.message}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#ccc' }}>
              {isHost ? (
                <>
                  <h3 style={{ marginBottom: '1.5rem' }}>Ready when you are!</h3>
                  <button className="neon-btn" style={{ fontSize: '1.4rem', padding: '1rem 2.5rem' }} onClick={handleHostNextQuestion}>
                    START GAME
                  </button>
                </>
              ) : (
                <h3>Waiting for Host to start...</h3>
              )}
            </div>
          )}
        </div>

        {/* Players Sidebar */}
        <div style={{ flex: 1, borderLeft: '1px solid gray', paddingLeft: '20px', maxHeight: '500px', overflowY: 'auto' }}>
          <h3 className="neon-text magenta" style={{ fontSize: '1rem' }}>LEADERBOARD</h3>
          {Object.entries(players).map(([playerId, p]) => (
            <div key={playerId} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0' }}>
              <img src={p.info.avatar} alt="avatar" style={{ width: '40px', borderRadius: '50%', border: playerId === user.id ? '2px solid lime' : '1px solid gray' }} />
              <div>
                <div style={{ fontWeight: 'bold' }}>{p.info.name} {isHost && playerId === user.id ? '(Host)' : ''}</div>
                <div className="neon-text cyan" style={{ fontSize: '0.8rem' }}>Score: {p.score || 0}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
