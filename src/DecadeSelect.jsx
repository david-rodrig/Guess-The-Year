import { useState } from 'react';

export const DECADES = [
  { label: "70s", range: "1970–1979", start: 1970, end: 1979 },
  { label: "80s", range: "1980–1989", start: 1980, end: 1989 },
  { label: "90s", range: "1990–1999", start: 1990, end: 1999 },
  { label: "00s", range: "2000–2009", start: 2000, end: 2009 },
  { label: "10s", range: "2010–2019", start: 2010, end: 2019 },
  { label: "20s", range: "2020–2024", start: 2020, end: 2024 },
];

export default function DecadeSelect({ onConfirm }) {
  const [selected, setSelected] = useState(DECADES.map(d => d.label));

  const toggle = (label) => {
    setSelected(prev =>
      prev.includes(label)
        ? prev.length > 1 ? prev.filter(d => d !== label) : prev
        : [...prev, label]
    );
  };

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '480px', margin: 'auto', textAlign: 'center' }}>
      <h2 className="neon-text" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.4rem)', marginBottom: '0.5rem' }}>
        PICK YOUR DECADES
      </h2>
      <p style={{ color: '#aaa', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', marginBottom: '1.75rem', letterSpacing: '1px' }}>
        Select one or more to include in the game
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '2rem',
      }}>
        {DECADES.map(({ label, range }) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              style={{
                background: active ? 'rgba(0,255,255,0.15)' : 'transparent',
                border: `2px solid ${active ? '#0ff' : '#444'}`,
                borderRadius: '10px',
                padding: '0.9rem 0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: active ? '0 0 12px rgba(0,255,255,0.4)' : 'none',
              }}
            >
              <div style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
                color: active ? '#0ff' : '#555',
                textShadow: active ? '0 0 10px #0ff' : 'none',
                marginBottom: '4px',
              }}>
                {label}
              </div>
              <div style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', color: active ? '#aaa' : '#444' }}>
                {range}
              </div>
            </button>
          );
        })}
      </div>

      <button
        className="neon-btn full-width"
        style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', padding: '0.9rem' }}
        onClick={() => onConfirm(selected)}
      >
        LET'S PLAY →
      </button>
    </div>
  );
}
