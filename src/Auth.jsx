import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError('Username must be 2–20 characters.');
      setLoading(false);
      return;
    }

    try {
      // Sign in anonymously to get a real auth.uid()
      const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) throw signInError;

      // Try to claim the username
      const { data: result, error: rpcError } = await supabase.rpc('claim_username', { p_username: trimmed });
      if (rpcError) throw rpcError;

      if (result === 'taken') {
        // Release the anonymous user we just created
        await supabase.auth.signOut();
        setError('Username already in use. Please choose another.');
        setLoading(false);
        return;
      }

      if (result === 'invalid') {
        await supabase.auth.signOut();
        setError('Username must be 2–20 characters.');
        setLoading(false);
        return;
      }

      onLogin(signInData.user);
    } catch (err) {
      await supabase.auth.signOut().catch(() => {});
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2 className="neon-text cyan" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: 'clamp(0.8rem, 3vw, 1.1rem)' }}>
        ENTER USERNAME
      </h2>

      <form onSubmit={handleSubmit} className="guess-form">
        <input
          type="text"
          placeholder="Pick a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="neon-input"
          required
          minLength={2}
          maxLength={20}
          autoComplete="off"
          autoFocus
        />

        {error && <div className="feedback-message wrong" style={{ fontSize: '0.9rem' }}>{error}</div>}

        <button type="submit" className="neon-btn" disabled={loading}>
          {loading ? 'WAIT...' : 'PLAY'}
        </button>
      </form>
    </div>
  );
}
