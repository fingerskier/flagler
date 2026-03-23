import React from 'react';

const style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  color: '#0ff',
  fontFamily: 'monospace',
  fontSize: '16px',
  pointerEvents: 'none',
  textShadow: '0 0 6px #0ff',
  zIndex: 10,
};

export default function HUD({ score, lives, wave, mode }) {
  return (
    <div style={style}>
      <span>SCORE {String(score).padStart(8, '0')}</span>
      <span>WAVE {wave}</span>
      <span>{mode === 'vertical' ? 'VERT' : 'HORIZ'}</span>
      <span>{'<3 '.repeat(lives).trim()}</span>
    </div>
  );
}
