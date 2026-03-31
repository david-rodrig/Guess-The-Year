import { useState, useEffect } from 'react';
import './index.css';

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

function App() {
  const [gameSongs, setGameSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState(null); // { message: string, isCorrect: boolean }
  const [isGameOver, setIsGameOver] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (gameSongs.length > 0 && !isGameOver && feedback === null) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameSongs, isGameOver, feedback]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setGameSongs(shuffleArray([...songs]).slice(0, 10)); // Play with 10 random songs
    setCurrentIndex(0);
    setScore(0);
    setGuess("");
    setFeedback(null);
    setIsGameOver(false);
    setElapsedTime(0);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess) return;

    const currentSong = gameSongs[currentIndex];
    const guessedYear = parseInt(guess);

    let isCorrect = false;
    let message = "";

    if (guessedYear === currentSong.year) {
      isCorrect = true;
      message = `Correct! It was released in ${currentSong.year}.`;
      setScore(score + 1);
    } else {
      message = `Wrong! The correct year was ${currentSong.year}.`;
    }

    setFeedback({ message, isCorrect });

    setTimeout(() => {
      setFeedback(null);
      setGuess("");
      setElapsedTime(0);
      if (currentIndex + 1 < gameSongs.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsGameOver(true);
      }
    }, 2000); // Wait 2 seconds before moving to next question
  };

  if (gameSongs.length === 0) return <div className="loading">Loading Synthwave...</div>;

  return (
    <div className="app-container">
      {/* Background elements */}
      <div className="synthwave-grid"></div>
      <div className="sun"></div>
      
      <header className="header">
        <h1 className="neon-text">GUESS THE YEAR</h1>
        <p className="sub-text">80s Edition</p>
      </header>

      <main className="main-content">
        {isGameOver ? (
          <div className="glass-card game-over-card fade-in">
            <h2 className="neon-text pink">GAME OVER</h2>
            <p className="score-text">You scored: {score} / {gameSongs.length}</p>
            <button className="neon-btn" onClick={startNewGame}>PLAY AGAIN</button>
          </div>
        ) : (
          <div className="glass-card question-card fade-in">
            <div className="score-board">
              Question: {currentIndex + 1} / {gameSongs.length} <br />
              Score: <span className="neon-text cyan">{score}</span> <br />
              Time: <span className="neon-text pink" style={{ fontSize: '1.2rem' }}>{elapsedTime}s</span>
            </div>
            
            <div className="video-container" style={{ marginBottom: '1.5rem', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}>
              <iframe 
                key={gameSongs[currentIndex].youtubeId}
                width="100%" 
                height="220" 
                src={`https://www.youtube.com/embed/${gameSongs[currentIndex].youtubeId}?autoplay=1&mute=0&controls=0&disablekb=1&showinfo=0`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>

            <div className="song-info">
              <h2 className="song-title">"{gameSongs[currentIndex].title}"</h2>
              <h3 className="song-artist">by {gameSongs[currentIndex].artist}</h3>
            </div>

            <form onSubmit={handleGuess} className="guess-form">
              <input 
                type="number" 
                min="1980" 
                max="1989" 
                placeholder="Year (1980-1989)" 
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                className="neon-input"
                disabled={feedback !== null}
                autoFocus
              />
              <button 
                type="submit" 
                className="neon-btn submit-btn"
                disabled={feedback !== null || !guess}
              >
                GUESS
              </button>
            </form>

            {feedback && (
              <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
