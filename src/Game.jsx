import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

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
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hostSongs, setHostSongs] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(-1);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data));
  }, [user.id]);

  useEffect(() => {
    const ch = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: user.id } }
    });

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState();
      const onlinePlayers = {};
      Object.keys(state).forEach(key => {
        onlinePlayers[key] = { info: state[key][0], score: 0 };
      });
      setPlayers(prev => {
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
      setGuess('');
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

  useEffect(() => {
    let timer;
    if (currentQuestion && feedback === null) {
      timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuestion, feedback]);

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
      setCurrentQuestion(song);
      setFeedback(null);
      setGuess('');
      setElapsedTime(0);
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess) return;

    const guessedYear = parseInt(guess);
    let isCorrect = false;
    let message = '';

    if (guessedYear === currentQuestion.year) {
      isCorrect = true;
      message = `Correct! It was released in ${currentQuestion.year}.`;
      setScore(s => {
        const newer = s + 1;
        channel.send({ type: 'broadcast', event: 'score_update', payload: { userId: user.id, newScore: newer } });
        setPlayers(prev => ({
          ...prev,
          [user.id]: { ...prev[user.id], score: newer }
        }));
        return newer;
      });
    } else {
      message = `Wrong! The correct year was ${currentQuestion.year}.`;
    }

    setFeedback({ message, isCorrect });
  };

  if (!channel) return <div className="loading">Connecting to Room...</div>;

  return (
    <div className="glass-card game-card fade-in" style={{ margin: 'auto', marginTop: 'clamp(1rem, 4vh, 3rem)', marginBottom: '1rem' }}>
      {/* Header */}
      <div className="game-header">
        <div>
          <h2 className="neon-text cyan" style={{ fontSize: 'clamp(0.75rem, 3vw, 1.2rem)', marginBottom: '4px' }}>
            ROOM: {roomCode}
          </h2>
          <p style={{ color: '#aaa', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>
            Players: {Object.keys(players).length}/10
          </p>
        </div>
        {isHost && currentQuestion && (
          <button className="neon-btn" style={{ padding: '0.5rem 1rem', fontSize: 'clamp(0.65rem, 2vw, 0.9rem)' }} onClick={handleHostNextQuestion}>
            NEXT SONG
          </button>
        )}
      </div>

      {/* Body */}
      <div className="game-body">
        {/* Main game area */}
        <div className="game-main">
          {currentQuestion ? (
            <div className="fade-in">
              <div style={{ marginBottom: '1.25rem', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)', aspectRatio: '16/9' }}>
                <iframe
                  key={currentQuestion.youtubeId}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentQuestion.youtubeId}?autoplay=1&mute=0&controls=0&disablekb=1&showinfo=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display: 'block' }}
                />
              </div>

              <div className="song-info">
                <h2 className="song-title">"{currentQuestion.title}"</h2>
                <h3 className="song-artist">by {currentQuestion.artist}</h3>
              </div>

              <form onSubmit={handleGuess} className="guess-form inline">
                <input
                  type="number"
                  min="1980" max="1989"
                  placeholder="Year"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="neon-input year-input"
                  disabled={feedback !== null}
                />
                <span className="neon-text pink" style={{ fontSize: '1.1rem', margin: '0 6px' }}>{elapsedTime}s</span>
                <button type="submit" className="neon-btn" disabled={feedback !== null || !guess}>
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
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#ccc' }}>
              {isHost ? (
                <>
                  <h3 style={{ marginBottom: '1.5rem', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>Ready when you are!</h3>
                  <button className="neon-btn" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)', padding: '1rem 2.5rem' }} onClick={handleHostNextQuestion}>
                    START GAME
                  </button>
                </>
              ) : (
                <h3 style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>Waiting for Host to start...</h3>
              )}
            </div>
          )}
        </div>

        {/* Leaderboard sidebar */}
        <div className="game-sidebar">
          <h3 className="neon-text magenta" style={{ fontSize: 'clamp(0.65rem, 2vw, 1rem)', marginBottom: '0.5rem' }}>LEADERBOARD</h3>
          {Object.entries(players)
            .sort(([, a], [, b]) => (b.score || 0) - (a.score || 0))
            .map(([playerId, p]) => (
              <div key={playerId} className="player-row">
                <img
                  src={p.info?.avatar}
                  alt="avatar"
                  className="player-avatar"
                  style={{ border: playerId === user.id ? '2px solid lime' : '1px solid gray' }}
                />
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.info?.name} {isHost && playerId === user.id ? '👑' : ''}
                  </div>
                  <div className="neon-text cyan" style={{ fontSize: '0.75rem' }}>
                    Score: {p.score || 0}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
