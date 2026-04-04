import { useState } from 'react';
import { supabase } from './lib/supabase';

const toEmail = (username) => `${username.toLowerCase().trim()}@guess-the-year.app`;

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = toEmail(username);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: username,
              avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`
            }
          }
        });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2 className="neon-text cyan" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: 'clamp(0.8rem, 3vw, 1.1rem)' }}>
        {isLogin ? 'LOGIN' : 'REGISTER'}
      </h2>

      <form onSubmit={handleSubmit} className="guess-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="neon-input"
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="neon-input"
          required
          autoComplete={isLogin ? 'current-password' : 'new-password'}
        />

        {error && <div className="feedback-message wrong" style={{ fontSize: '0.9rem' }}>{error}</div>}

        <button type="submit" className="neon-btn" disabled={loading}>
          {loading ? 'WAIT...' : (isLogin ? 'PLAY' : 'SIGN UP')}
        </button>
      </form>

      <div
        style={{ textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer', color: '#ccc', fontSize: '0.85rem' }}
        onClick={() => { setIsLogin(!isLogin); setError(null); }}
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </div>
    </div>
  );
}
