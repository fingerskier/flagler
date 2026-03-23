/**
 * Wave definitions - each wave specifies enemy formations.
 * After defined waves, procedural generation kicks in.
 */

export const WAVE_DEFS = [
  // Wave 1: Simple grunts
  {
    mode: 'vertical',
    spawns: [
      { type: 'grunt', x: 0.2, y: -0.1, delay: 0 },
      { type: 'grunt', x: 0.4, y: -0.1, delay: 200 },
      { type: 'grunt', x: 0.6, y: -0.1, delay: 400 },
      { type: 'grunt', x: 0.8, y: -0.1, delay: 600 },
      { type: 'grunt', x: 0.3, y: -0.2, delay: 1200 },
      { type: 'grunt', x: 0.5, y: -0.2, delay: 1400 },
      { type: 'grunt', x: 0.7, y: -0.2, delay: 1600 },
    ],
  },
  // Wave 2: Grunts + first swooper
  {
    mode: 'vertical',
    spawns: [
      { type: 'grunt', x: 0.15, y: -0.1, delay: 0 },
      { type: 'grunt', x: 0.35, y: -0.1, delay: 100 },
      { type: 'grunt', x: 0.55, y: -0.1, delay: 200 },
      { type: 'grunt', x: 0.75, y: -0.1, delay: 300 },
      { type: 'grunt', x: 0.85, y: -0.1, delay: 400 },
      { type: 'swooper', x: 0.5, y: -0.15, delay: 1500 },
      { type: 'swooper', x: 0.3, y: -0.15, delay: 2000 },
    ],
  },
  // Wave 3: First horizontal wave
  {
    mode: 'horizontal',
    spawns: [
      { type: 'grunt', x: 1.1, y: 0.2, delay: 0 },
      { type: 'grunt', x: 1.1, y: 0.4, delay: 200 },
      { type: 'grunt', x: 1.1, y: 0.6, delay: 400 },
      { type: 'grunt', x: 1.1, y: 0.8, delay: 600 },
      { type: 'swooper', x: 1.2, y: 0.5, delay: 1500 },
      { type: 'swooper', x: 1.2, y: 0.3, delay: 2000 },
    ],
  },
  // Wave 4: Mixed with a heavy
  {
    mode: 'vertical',
    spawns: [
      { type: 'heavy', x: 0.5, y: -0.2, delay: 0 },
      { type: 'grunt', x: 0.2, y: -0.1, delay: 500 },
      { type: 'grunt', x: 0.8, y: -0.1, delay: 500 },
      { type: 'swooper', x: 0.3, y: -0.15, delay: 1500 },
      { type: 'swooper', x: 0.7, y: -0.15, delay: 1800 },
      { type: 'grunt', x: 0.15, y: -0.1, delay: 2500 },
      { type: 'grunt', x: 0.5, y: -0.1, delay: 2500 },
      { type: 'grunt', x: 0.85, y: -0.1, delay: 2500 },
    ],
  },
  // Wave 5: Horizontal heavy assault
  {
    mode: 'horizontal',
    spawns: [
      { type: 'heavy', x: 1.2, y: 0.5, delay: 0 },
      { type: 'swooper', x: 1.1, y: 0.2, delay: 300 },
      { type: 'swooper', x: 1.1, y: 0.8, delay: 300 },
      { type: 'grunt', x: 1.1, y: 0.3, delay: 1000 },
      { type: 'grunt', x: 1.1, y: 0.4, delay: 1200 },
      { type: 'grunt', x: 1.1, y: 0.6, delay: 1400 },
      { type: 'grunt', x: 1.1, y: 0.7, delay: 1600 },
      { type: 'heavy', x: 1.3, y: 0.5, delay: 2500 },
    ],
  },
];

/**
 * Generate a procedural wave for waves beyond the defined set.
 */
export function generateWave(waveNum, width, height) {
  const enemyCount = 6 + Math.floor(waveNum * 1.5);
  const mode = waveNum % 2 === 0 ? 'vertical' : 'horizontal';
  const types = ['grunt', 'grunt', 'swooper'];
  if (waveNum > 4) types.push('heavy');
  if (waveNum > 7) types.push('heavy', 'swooper');

  const spawns = [];
  for (let i = 0; i < enemyCount; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    if (mode === 'vertical') {
      spawns.push({
        type,
        x: 0.1 + Math.random() * 0.8,
        y: -0.1 - Math.random() * 0.3,
        delay: i * 300 + Math.random() * 200,
      });
    } else {
      spawns.push({
        type,
        x: 1.1 + Math.random() * 0.3,
        y: 0.1 + Math.random() * 0.8,
        delay: i * 300 + Math.random() * 200,
      });
    }
  }

  return { mode, spawns };
}
