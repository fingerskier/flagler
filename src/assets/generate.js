/**
 * Procedurally generate all game sprites so we don't need external assets.
 */
export function generateAssets(scene) {
  // Player ship - sleek triangle
  const pg = scene.make.graphics({ add: false });
  pg.fillStyle(0x00ffff);
  pg.fillTriangle(16, 0, 0, 32, 32, 32);
  pg.fillStyle(0x0088ff);
  pg.fillRect(6, 20, 4, 12);
  pg.fillRect(22, 20, 4, 12);
  pg.generateTexture('player', 32, 32);
  pg.destroy();

  // Player bullet
  const bg = scene.make.graphics({ add: false });
  bg.fillStyle(0x00ffff);
  bg.fillRect(0, 0, 4, 12);
  bg.generateTexture('bullet', 4, 12);
  bg.destroy();

  // Enemy: grunt (invader style)
  const eg = scene.make.graphics({ add: false });
  eg.fillStyle(0xff4444);
  eg.fillRect(4, 0, 16, 4);
  eg.fillRect(0, 4, 24, 4);
  eg.fillRect(0, 8, 4, 4);
  eg.fillRect(8, 8, 8, 4);
  eg.fillRect(20, 8, 4, 4);
  eg.fillRect(4, 12, 4, 4);
  eg.fillRect(16, 12, 4, 4);
  eg.generateTexture('enemy_grunt', 24, 16);
  eg.destroy();

  // Enemy: swooper (galaga style)
  const sg = scene.make.graphics({ add: false });
  sg.fillStyle(0xff8800);
  sg.fillTriangle(12, 0, 0, 20, 24, 20);
  sg.fillStyle(0xffaa44);
  sg.fillRect(4, 12, 16, 8);
  sg.generateTexture('enemy_swooper', 24, 20);
  sg.destroy();

  // Enemy: heavy (big tank)
  const hg = scene.make.graphics({ add: false });
  hg.fillStyle(0xaa00ff);
  hg.fillRect(0, 4, 32, 24);
  hg.fillRect(4, 0, 24, 32);
  hg.fillStyle(0xcc44ff);
  hg.fillRect(8, 8, 16, 16);
  hg.generateTexture('enemy_heavy', 32, 32);
  hg.destroy();

  // Enemy bullet
  const ebg = scene.make.graphics({ add: false });
  ebg.fillStyle(0xff4444);
  ebg.fillRect(0, 0, 4, 8);
  ebg.generateTexture('enemy_bullet', 4, 8);
  ebg.destroy();

  // Explosion particle
  const xg = scene.make.graphics({ add: false });
  xg.fillStyle(0xffaa00);
  xg.fillCircle(4, 4, 4);
  xg.generateTexture('particle', 8, 8);
  xg.destroy();

  // Powerup
  const pug = scene.make.graphics({ add: false });
  pug.fillStyle(0x00ff88);
  pug.fillCircle(8, 8, 8);
  pug.fillStyle(0xffffff);
  pug.fillCircle(8, 8, 4);
  pug.generateTexture('powerup', 16, 16);
  pug.destroy();
}
