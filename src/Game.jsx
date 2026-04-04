import { useState, useEffect, useRef } from 'react';
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
  const [feedback, setFeedback] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hostSongs, setHostSongs] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(-1);

  const ytPlayerRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data));
  }, [user.id]);

  // Keep feedbackRef in sync so the YT callback always sees the latest value
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  // Create/recreate YT player when question changes
  useEffect(() => {
    if (!currentQuestion) return;

    const createPlayer = () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
        ytPlayerRef.current = null;
      }
      ytPlayerRef.current = new window.YT.Player('yt-player', {
        videoId: currentQuestion.youtubeId,
        playerVars: { autoplay: 1, controls: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED && !feedbackRef.current) {
              setFeedback({ message: `Time's up! The correct year was ${currentQuestion.year}.`, isCorrect: false });
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
        ytPlayerRef.current = null;
      }
    };
  }, [currentQuestion]);

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
        <button className="logout-btn" onClick={onLeave}>Leave</button>
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
              <div style={{ marginBottom: '1.25rem', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)', aspectRatio: '16/9', background: '#000' }}>
                <div id="yt-player" style={{ width: '100%', height: '100%' }} />
              </div>

              <div className="song-info">
                <h2 className="song-title">"{currentQuestion.title}"</h2>
                <h3 className="song-artist">by {currentQuestion.artist}</h3>
              </div>

              <form onSubmit={handleGuess} className="guess-form inline">
                <input
                  type="number"
                  min="1970" max="2024"
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
                  <p style={{ marginBottom: '0.5rem', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', color: '#aaa', letterSpacing: '2px' }}>
                    SHARE THIS CODE WITH PLAYERS
                  </p>
                  <div style={{
                    fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#ffff00',
                    textShadow: '0 0 20px #ffff00, 0 0 40px #ffff00',
                    letterSpacing: '0.2em',
                    margin: '0.5rem 0 1.5rem',
                  }}>
                    {roomCode}
                  </div>
                  <button className="neon-btn" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)', padding: '1rem 2.5rem' }} onClick={handleHostNextQuestion}>
                    START GAME
                  </button>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '0.5rem', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', color: '#aaa', letterSpacing: '2px' }}>
                    ROOM CODE
                  </p>
                  <div style={{
                    fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#0ff',
                    textShadow: '0 0 20px #0ff, 0 0 40px #0ff',
                    letterSpacing: '0.2em',
                    margin: '0.5rem 0 1.5rem',
                  }}>
                    {roomCode}
                  </div>
                  <h3 style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>Waiting for Host to start...</h3>
                </>
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
