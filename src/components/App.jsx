import React, { useEffect, useRef, useState } from 'react';
import { createGame } from '../game.js';
import HUD from './HUD.jsx';

export default function App() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [screen, setScreen] = useState('title');
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 1, mode: 'vertical' });

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = createGame(containerRef.current, {
      onScreenChange: setScreen,
      onHudUpdate: (data) => setHud((prev) => ({ ...prev, ...data })),
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {screen === 'game' && <HUD score={hud.score} lives={hud.lives} wave={hud.wave} mode={hud.mode} />}
    </div>
  );
}
