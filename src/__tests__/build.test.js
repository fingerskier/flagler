import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { existsSync } from 'fs';

describe('project setup', () => {
  it('should have required entry files', () => {
    expect(existsSync(resolve(__dirname, '..', 'game.js'))).toBe(true);
    expect(existsSync(resolve(__dirname, '..', 'main.jsx'))).toBe(true);
  });

  it('should have scene files', () => {
    const scenesDir = resolve(__dirname, '..', 'scenes');
    expect(existsSync(scenesDir)).toBe(true);
  });
});
