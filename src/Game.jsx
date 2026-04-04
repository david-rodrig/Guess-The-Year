import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { DECADES } from './DecadeSelect';

const ALL_SONGS = [
  // 70s
  { title: "Bohemian Rhapsody", artist: "Queen", year: 1975, youtubeId: "fJ9rUzIMcZQ" },
  { title: "Dancing Queen", artist: "ABBA", year: 1976, youtubeId: "xFrGuyw1V8s" },
  { title: "Hotel California", artist: "Eagles", year: 1977, youtubeId: "BciS5krYL80" },
  { title: "Stayin' Alive", artist: "Bee Gees", year: 1977, youtubeId: "I_izvAbhExY" },
  { title: "September", artist: "Earth, Wind & Fire", year: 1978, youtubeId: "Gs069dndIYk" },
  { title: "Don't Stop Me Now", artist: "Queen", year: 1978, youtubeId: "HgzGwKwLmgM" },
  { title: "Ring My Bell", artist: "Anita Ward", year: 1979, youtubeId: "M-WJEEEAcjA" },
  { title: "Heart of Glass", artist: "Blondie", year: 1979, youtubeId: "WGU_4-5RaxU" },
  // 80s
  { title: "Another One Bites the Dust", artist: "Queen", year: 1980, youtubeId: "rY0WxgPXvzc" },
  { title: "Don't You Want Me", artist: "The Human League", year: 1981, youtubeId: "uPudE8nDog0" },
  { title: "Tainted Love", artist: "Soft Cell", year: 1981, youtubeId: "XZVnR3KpGvU" },
  { title: "Thriller", artist: "Michael Jackson", year: 1982, youtubeId: "sOnqjkJTMaA" },
  { title: "Every Breath You Take", artist: "The Police", year: 1983, youtubeId: "OMOGaugKpzs" },
  { title: "Billie Jean", artist: "Michael Jackson", year: 1983, youtubeId: "Zi_XLOBDo_Y" },
  { title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics", year: 1983, youtubeId: "qeMFqKcPYcg" },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", year: 1983, youtubeId: "PIb6AZdTr-A" },
  { title: "When Doves Cry", artist: "Prince", year: 1984, youtubeId: "UG3VcCAlUgE" },
  { title: "Careless Whisper", artist: "George Michael", year: 1984, youtubeId: "izGwDsrQ1eQ" },
  { title: "Take On Me", artist: "a-ha", year: 1985, youtubeId: "djV11Xbc914" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", year: 1986, youtubeId: "lDK9QqIzhwk" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987, youtubeId: "1w7OgIMMRc4" },
  { title: "Like a Prayer", artist: "Madonna", year: 1989, youtubeId: "79fzeNUqQbO" },
  // 90s
  { title: "Smells Like Teen Spirit", artist: "Nirvana", year: 1991, youtubeId: "hTWKbfoikeg" },
  { title: "Losing My Religion", artist: "R.E.M.", year: 1991, youtubeId: "xwtdhWltSIg" },
  { title: "Creep", artist: "Radiohead", year: 1992, youtubeId: "XFkzRNplNtw" },
  { title: "Waterfalls", artist: "TLC", year: 1995, youtubeId: "8WEtxJ4-sh4" },
  { title: "Wonderwall", artist: "Oasis", year: 1995, youtubeId: "bx1Bh8ZvH84" },
  { title: "MMMBop", artist: "Hanson", year: 1997, youtubeId: "NHozn0YXAeE" },
  { title: "...Baby One More Time", artist: "Britney Spears", year: 1998, youtubeId: "C-u5WLJ9Yk4" },
  { title: "Livin' la Vida Loca", artist: "Ricky Martin", year: 1999, youtubeId: "p47fEXGabaY" },
  // 2000s
  { title: "Crazy in Love", artist: "Beyoncé", year: 2003, youtubeId: "ViwtNLUqkMY" },
  { title: "Hey Ya!", artist: "OutKast", year: 2003, youtubeId: "PWgvGjAhvIw" },
  { title: "Yeah!", artist: "Usher", year: 2004, youtubeId: "GxBSyx85Kp8" },
  { title: "Since U Been Gone", artist: "Kelly Clarkson", year: 2004, youtubeId: "R7_UDen97cQ" },
  { title: "Crazy", artist: "Gnarls Barkley", year: 2006, youtubeId: "md4-SSEOFRQ" },
  { title: "Umbrella", artist: "Rihanna", year: 2007, youtubeId: "CvBfHwUxHIk" },
  { title: "Single Ladies", artist: "Beyoncé", year: 2008, youtubeId: "4m1EFMoRFvY" },
  { title: "Poker Face", artist: "Lady Gaga", year: 2008, youtubeId: "bESGLojNYSo" },
  // 2010s
  { title: "Rolling in the Deep", artist: "Adele", year: 2010, youtubeId: "rYEDA3JcQqw" },
  { title: "Call Me Maybe", artist: "Carly Rae Jepsen", year: 2011, youtubeId: "fWNaR-rxAic" },
  { title: "Royals", artist: "Lorde", year: 2013, youtubeId: "nlcIKh6sBtc" },
  { title: "Happy", artist: "Pharrell Williams", year: 2013, youtubeId: "ZbZSe6N_BXs" },
  { title: "Uptown Funk", artist: "Bruno Mars", year: 2014, youtubeId: "OPf0YbXqDm0" },
  { title: "Shape of You", artist: "Ed Sheeran", year: 2017, youtubeId: "JGwWNGJdvx8" },
  { title: "Bad Guy", artist: "Billie Eilish", year: 2019, youtubeId: "DyDfgMOUjCI" },
  { title: "Old Town Road", artist: "Lil Nas X", year: 2019, youtubeId: "w2Ov5jzm3j8" },
  // 2020s
  { title: "drivers license", artist: "Olivia Rodrigo", year: 2021, youtubeId: "ZmDBbnmKpqQ" },
  { title: "Levitating", artist: "Dua Lipa", year: 2020, youtubeId: "TUVcZfQe-Kw" },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", year: 2021, youtubeId: "kTJczUoc26U" },
  { title: "As It Was", artist: "Harry Styles", year: 2022, youtubeId: "H5v3kku4y6Q" },
  { title: "Flowers", artist: "Miley Cyrus", year: 2023, youtubeId: "G7KNmW9a75Y" },
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function Game({ user, roomCode, isHost, selectedDecades, onLeave }) {
  const [profile, setProfile] = useState(null);
  const [channel, setChannel] = useState(null);
  const [players, setPlayers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [submittedGuess, setSubmittedGuess] = useState(null); // stored after submit, shown only at reveal
  const [feedback, setFeedback] = useState(null);             // set at reveal time
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hostSongs, setHostSongs] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [guessedCount, setGuessedCount] = useState(0);        // how many players have submitted
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Refs for use inside callbacks / YT event handlers
  const ytPlayerRef = useRef(null);
  const revealedRef = useRef(false);
  const submittedGuessRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const channelRef = useRef(null);
  const playersRef = useRef({});
  const guessedIdsRef = useRef(new Set());
  const scoreRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { currentQuestionRef.current = currentQuestion; }, [currentQuestion]);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data));
  }, [user.id]);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  // ── Reveal answer ──────────────────────────────────────────────
  const revealAnswer = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;

    const q = currentQuestionRef.current;
    if (!q) return;

    const guessed = submittedGuessRef.current;
    if (guessed === null) {
      setFeedback({ message: `Time's up! The correct year was ${q.year}.`, isCorrect: false });
    } else {
      const isCorrect = guessed === q.year;
      if (isCorrect) {
        setScore(s => {
          const newer = s + 1;
          channelRef.current?.send({ type: 'broadcast', event: 'score_update', payload: { userId: user.id, newScore: newer } });
          setPlayers(prev => ({ ...prev, [user.id]: { ...prev[user.id], score: newer } }));
          return newer;
        });
      }
      setFeedback({ message: isCorrect ? `Correct! It was released in ${q.year}.` : `Wrong! The correct year was ${q.year}.`, isCorrect });
    }

    // Show full leaderboard 1s after reveal
    setTimeout(() => setShowLeaderboard(true), 1000);
  }, [user.id]);

  // Check if all players have submitted → reveal
  const checkAllGuessed = useCallback((newCount) => {
    const total = Object.keys(playersRef.current).length;
    if (total > 0 && newCount >= total) {
      revealAnswer();
    }
  }, [revealAnswer]);

  // Create/recreate YT player when question changes
  useEffect(() => {
    if (!currentQuestion) return;

    const createPlayer = () => {
      if (ytPlayerRef.current) { ytPlayerRef.current.destroy(); ytPlayerRef.current = null; }
      ytPlayerRef.current = new window.YT.Player('yt-player', {
        videoId: currentQuestion.youtubeId,
        playerVars: { autoplay: 1, controls: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) revealAnswer();
          }
        }
      });
    };

    if (window.YT && window.YT.Player) createPlayer();
    else window.onYouTubeIframeAPIReady = createPlayer;

    return () => { if (ytPlayerRef.current) { ytPlayerRef.current.destroy(); ytPlayerRef.current = null; } };
  }, [currentQuestion, revealAnswer]);

  // Realtime channel
  useEffect(() => {
    const ch = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: user.id } }
    });
    channelRef.current = ch;

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

    ch.on('broadcast', { event: 'score_update' }, ({ payload }) => {
      setPlayers(prev => ({
        ...prev,
        [payload.userId]: { ...prev[payload.userId], score: payload.newScore }
      }));
    });

    ch.on('broadcast', { event: 'new_question' }, ({ payload }) => {
      resetQuestion(payload.song);
    });

    ch.on('broadcast', { event: 'player_guessed' }, ({ payload }) => {
      if (!guessedIdsRef.current.has(payload.userId)) {
        guessedIdsRef.current.add(payload.userId);
        setGuessedCount(prev => {
          const next = prev + 1;
          checkAllGuessed(next);
          return next;
        });
      }
    });

    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const userInfo = { name: profile?.full_name || 'Player', avatar: profile?.avatar_url };
        await ch.track(userInfo);
      }
    });

    setChannel(ch);
    return () => { ch.unsubscribe(); channelRef.current = null; };
  }, [roomCode, user.id, profile, checkAllGuessed]);

  // Timer — stops when feedback is shown (revealed)
  useEffect(() => {
    let timer;
    if (currentQuestion && feedback === null) {
      timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuestion, feedback]);

  // ── Helpers ────────────────────────────────────────────────────
  const resetQuestion = (song) => {
    revealedRef.current = false;
    submittedGuessRef.current = null;
    guessedIdsRef.current = new Set();
    setCurrentQuestion(song);
    setFeedback(null);
    setSubmittedGuess(null);
    setGuess('');
    setElapsedTime(0);
    setGuessedCount(0);
    setShowLeaderboard(false);
  };

  const handleHostNextQuestion = () => {
    let list = hostSongs;
    if (list.length === 0) {
      const allowed = DECADES
        .filter(d => selectedDecades.includes(d.label))
        .flatMap(d => ALL_SONGS.filter(s => s.year >= d.start && s.year <= d.end));
      list = shuffleArray([...allowed]).slice(0, 10);
      setHostSongs(list);
    }
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);

    if (nextIdx < list.length) {
      const song = list[nextIdx];
      channel.send({ type: 'broadcast', event: 'new_question', payload: { song } });
      resetQuestion(song);
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess || submittedGuess !== null) return;

    const guessedYear = parseInt(guess);
    submittedGuessRef.current = guessedYear;
    setSubmittedGuess(guessedYear);

    // Broadcast that this player submitted (not the guess value)
    channel.send({ type: 'broadcast', event: 'player_guessed', payload: { userId: user.id } });

    // Count self (own broadcast not received)
    guessedIdsRef.current.add(user.id);
    const next = guessedIdsRef.current.size;
    setGuessedCount(next);
    checkAllGuessed(next);
  };

  if (!channel) return <div className="loading">Connecting to Room...</div>;

  const playerCount = Object.keys(players).length;

  return (
    <div className="glass-card game-card fade-in" style={{ margin: 'auto', marginTop: 'clamp(1rem, 4vh, 3rem)', marginBottom: '1rem', position: 'relative' }}>
      {/* Header */}
      <div className="game-header">
        <div>
          <h2 className="neon-text cyan" style={{ fontSize: 'clamp(0.75rem, 3vw, 1.2rem)', marginBottom: '4px' }}>
            ROOM: {roomCode}
          </h2>
          <p style={{ color: '#aaa', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>
            Players: {playerCount}/10
          </p>
        </div>
        <button className="logout-btn" onClick={onLeave}>Leave</button>
        {isHost && currentQuestion && (
          <button className="neon-btn" style={{ padding: '0.5rem 1rem', fontSize: 'clamp(0.65rem, 2vw, 0.9rem)' }} onClick={handleHostNextQuestion}>
            NEXT SONG
          </button>
        )}
      </div>

      {/* Body */}
      <div className="game-body">
        <div className="game-main">
          {currentQuestion ? (
            <div className="fade-in">
              <div style={{ marginBottom: '1.25rem', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)', aspectRatio: '16/9', background: '#000' }}>
                <div id="yt-player" style={{ width: '100%', height: '100%' }} />
              </div>

              <div className="song-info">
                <h2 className="song-title">"{currentQuestion.title}"</h2>
                <h3 className="song-artist">by {currentQuestion.artist}</h3>
              </div>

              {!feedback ? (
                <>
                  {submittedGuess === null ? (
                    <form onSubmit={handleGuess} className="guess-form inline">
                      <input
                        type="number"
                        min="1970" max="2024"
                        placeholder="Year"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        className="neon-input year-input"
                      />
                      <span className="neon-text pink" style={{ fontSize: '1.1rem', margin: '0 6px' }}>{elapsedTime}s</span>
                      <button type="submit" className="neon-btn" disabled={!guess}>
                        GUESS
                      </button>
                    </form>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#0ff' }}>
                      <p style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', letterSpacing: '1px' }}>
                        ✓ You guessed <strong>{submittedGuess}</strong> — waiting for others...
                      </p>
                      <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', color: '#aaa', marginTop: '0.5rem' }}>
                        {guessedCount}/{playerCount} submitted
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
                  {feedback.message}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#ccc' }}>
              {isHost ? (
                <>
                  <p style={{ marginBottom: '0.5rem', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', color: '#aaa', letterSpacing: '2px' }}>
                    SHARE THIS CODE WITH PLAYERS
                  </p>
                  <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontFamily: "'Press Start 2P', cursive", color: '#ffff00', textShadow: '0 0 20px #ffff00, 0 0 40px #ffff00', letterSpacing: '0.2em', margin: '0.5rem 0 1.5rem' }}>
                    {roomCode}
                  </div>
                  <button className="neon-btn" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)', padding: '1rem 2.5rem' }} onClick={handleHostNextQuestion}>
                    START GAME
                  </button>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '0.5rem', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', color: '#aaa', letterSpacing: '2px' }}>ROOM CODE</p>
                  <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontFamily: "'Press Start 2P', cursive", color: '#0ff', textShadow: '0 0 20px #0ff, 0 0 40px #0ff', letterSpacing: '0.2em', margin: '0.5rem 0 1.5rem' }}>
                    {roomCode}
                  </div>
                  <h3 style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>Waiting for Host to start...</h3>
                </>
              )}
            </div>
          )}
        </div>

        {/* Full leaderboard overlay after reveal */}
        {showLeaderboard && (
          <div className="leaderboard-overlay fade-in">
            {currentQuestion && (
              <div style={{ textAlign: 'center', marginBottom: '1.25rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,255,0.2)' }}>
                <p style={{ color: '#aaa', fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', letterSpacing: '2px', marginBottom: '0.3rem' }}>THE ANSWER WAS</p>
                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#ffff00', textShadow: '0 0 15px #ffff00' }}>{currentQuestion.year}</p>
                <p style={{ color: '#ccc', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', marginTop: '0.3rem' }}>"{currentQuestion.title}" — {currentQuestion.artist}</p>
              </div>
            )}
            <h2 className="neon-text cyan" style={{ fontSize: 'clamp(0.9rem, 3vw, 1.3rem)', marginBottom: '1.25rem' }}>
              LEADERBOARD
            </h2>
            {Object.entries(players)
              .sort(([, a], [, b]) => (b.score || 0) - (a.score || 0))
              .map(([playerId, p], i) => (
                <div key={playerId} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.75rem 1rem', marginBottom: '0.5rem',
                  borderRadius: '10px',
                  background: playerId === user.id ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${playerId === user.id ? '#0ff' : '#333'}`,
                }}>
                  <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', color: i === 0 ? '#ffff00' : i === 1 ? '#aaa' : i === 2 ? '#cd7f32' : '#555', minWidth: '1.5rem' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <img src={p.info?.avatar} alt="avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #444' }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}>
                      {p.info?.name}{playerId === user.id ? ' (you)' : ''}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', color: '#0ff', textShadow: '0 0 8px #0ff' }}>
                    {p.score || 0} pts
                  </div>
                </div>
              ))}
            {isHost && (
              <button className="neon-btn full-width" style={{ marginTop: '1.25rem' }} onClick={handleHostNextQuestion}>
                NEXT SONG →
              </button>
            )}
          </div>
        )}

        {/* Sidebar leaderboard */}
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
                  style={{ border: playerId === user.id ? '2px solid lime' : '1px solid gray', opacity: guessedIdsRef.current.has(playerId) && !feedback ? 0.5 : 1 }}
                />
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.info?.name} {isHost && playerId === user.id ? '👑' : ''}
                    {guessedIdsRef.current.has(playerId) && !feedback ? ' ✓' : ''}
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
