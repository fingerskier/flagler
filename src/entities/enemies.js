import Phaser from 'phaser';

/**
 * Enemy behavior definitions.
 */
export const ENEMY_TYPES = {
  grunt: {
    texture: 'enemy_grunt',
    hp: 1,
    score: 100,
    speed: 60,
    fireRate: 2500,
    behavior: 'grid',
  },
  swooper: {
    texture: 'enemy_swooper',
    hp: 1,
    score: 200,
    speed: 120,
    fireRate: 1800,
    behavior: 'swoop',
  },
  heavy: {
    texture: 'enemy_heavy',
    hp: 4,
    score: 500,
    speed: 40,
    fireRate: 1200,
    behavior: 'grid',
  },
};

export function spawnEnemy(scene, type, x, y) {
  const def = ENEMY_TYPES[type];
  const enemy = scene.enemies.get(x, y, def.texture);
  if (!enemy) return null;

  enemy.setActive(true).setVisible(true);
  enemy.body.enable = true;
  enemy.hp = def.hp;
  enemy.score = def.score;
  enemy.enemyType = type;
  enemy.speed = def.speed;
  enemy.fireRate = def.fireRate;
  enemy.lastFired = 0;
  enemy.behavior = def.behavior;
  enemy.spawnX = x;
  enemy.spawnY = y;
  enemy.elapsed = 0;

  return enemy;
}

export function updateEnemy(scene, enemy, time, delta) {
  const mode = scene.travelMode;
  const dt = delta / 1000;
  enemy.elapsed += dt;

  if (enemy.behavior === 'grid') {
    updateGrid(scene, enemy, mode, time);
  } else if (enemy.behavior === 'swoop') {
    updateSwoop(scene, enemy, mode, time);
  }

  // Shooting
  if (time - enemy.lastFired > enemy.fireRate && enemy.active) {
    enemy.lastFired = time + Phaser.Math.Between(0, 500);
    fireEnemyBullet(scene, enemy, mode);
  }

  // Remove if off screen (grace period lets enemies enter from off-screen spawn points)
  if (enemy.elapsed > 3) {
    const { width, height } = scene.scale;
    if (enemy.y > height + 50 || enemy.y < -50 || enemy.x > width + 50 || enemy.x < -50) {
      enemy.setActive(false).setVisible(false);
      enemy.body.enable = false;
    }
  }
}

function updateGrid(scene, enemy, mode, time) {
  if (mode === 'vertical') {
    // Side-to-side movement while drifting down
    enemy.x = enemy.spawnX + Math.sin(enemy.elapsed * 1.5) * 40;
    enemy.y += enemy.speed * (1 / 60);
  } else {
    // Horizontal: drift left-to-right
    enemy.x -= enemy.speed * (1 / 60);
    enemy.y = enemy.spawnY + Math.sin(enemy.elapsed * 1.5) * 40;
  }
}

function updateSwoop(scene, enemy, mode, time) {
  if (mode === 'vertical') {
    const t = enemy.elapsed;
    enemy.x = enemy.spawnX + Math.sin(t * 2.5) * 80;
    enemy.y = enemy.spawnY + t * enemy.speed;
  } else {
    const t = enemy.elapsed;
    enemy.x = enemy.spawnX - t * enemy.speed;
    enemy.y = enemy.spawnY + Math.sin(t * 2.5) * 80;
  }
}

function fireEnemyBullet(scene, enemy, mode) {
  const bullet = scene.enemyBullets.get(enemy.x, enemy.y, 'enemy_bullet');
  if (!bullet) return;
  bullet.setActive(true).setVisible(true);
  bullet.body.enable = true;

  const speed = 200;
  if (mode === 'vertical') {
    bullet.setVelocity(Phaser.Math.Between(-30, 30), speed);
  } else {
    bullet.setVelocity(-speed, Phaser.Math.Between(-30, 30));
  }
}
