const MUSIC_TYPES = [
  {
    id: 'international',
    label: 'International Hits',
    emoji: '🌍',
    desc: 'English hits from the 70s–20s',
  },
  {
    id: 'hebrew',
    label: 'Hebrew Hits',
    emoji: '🇮🇱',
    desc: 'Israeli hits from the 70s–20s',
  },
  {
    id: 'mix',
    label: 'Mix',
    emoji: '🎵',
    desc: 'International & Hebrew together',
  },
];

export default function MusicTypeSelect({ onConfirm }) {
  return (
    <div className="glass-card fade-in" style={{ maxWidth: '480px', margin: 'auto', textAlign: 'center' }}>
      <h2 className="neon-text" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.4rem)', marginBottom: '0.5rem' }}>
        PICK YOUR MUSIC
      </h2>
      <p style={{ color: '#aaa', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', marginBottom: '1.75rem', letterSpacing: '1px' }}>
        Choose which songs to play
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        {MUSIC_TYPES.map(({ id, label, emoji, desc }) => (
          <button
            key={id}
            onClick={() => onConfirm(id)}
            style={{
              background: 'transparent',
              border: '2px solid #444',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0ff';
              e.currentTarget.style.background = 'rgba(0,255,255,0.08)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0,255,255,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#444';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>{emoji}</span>
            <div>
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
                color: '#0ff',
                textShadow: '0 0 8px #0ff',
                marginBottom: '4px',
              }}>
                {label}
              </div>
              <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', color: '#888', letterSpacing: '1px' }}>
                {desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
