import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${fullName}`
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
    <div className="glass-card fade-in" style={{ maxWidth: '400px', margin: 'auto', marginTop: '10vh' }}>
      <h2 className="neon-text cyan" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isLogin ? 'LOGIN' : 'REGISTER'}
      </h2>
      
      <form onSubmit={handleSubmit} className="guess-form">
        {!isLogin && (
          <input
            type="text"
            placeholder="Username / Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="neon-input"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="neon-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="neon-input"
          required
        />
        
        {error && <div className="feedback-message wrong" style={{ fontSize: '1rem' }}>{error}</div>}
        
        <button type="submit" className="neon-btn" disabled={loading}>
          {loading ? 'WAIT...' : (isLogin ? 'PLAY' : 'SIGN UP')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', cursor: 'pointer', color: '#ccc' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </div>
    </div>
  );
}
