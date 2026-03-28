import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { spawnEnemy, updateEnemy } from '../entities/enemies.js';
import { WAVE_DEFS, generateWave } from '../entities/waves.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const { width, height } = this.scale;
    const cb = this.registry.get('callbacks');
    cb?.onScreenChange('game');

    // State
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.travelMode = 'vertical'; // 'vertical' or 'horizontal'
    this.waveActive = false;
    this.waveSpawnsRemaining = 0;
    this.waveSpawnQueue = [];
    this.waveTimer = 0;
    this.transitioning = false;

    // Starfield
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Math.random() * 0.6 + 0.1,
      );
      this.stars.push({ obj: star, speed: Phaser.Math.Between(30, 100) });
    }

    // Groups
    this.playerBullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 40,
      runChildUpdate: false,
    });

    this.enemyBullets = this.physics.add.group({
      defaultKey: 'enemy_bullet',
      maxSize: 60,
      runChildUpdate: false,
    });

    this.enemies = this.physics.add.group({
      maxSize: 30,
      runChildUpdate: false,
    });

    this.powerups = this.physics.add.group({
      defaultKey: 'powerup',
      maxSize: 5,
    });

    // Player
    this.player = new Player(this, width / 2, height - 60);

    // Collisions
    this.physics.add.overlap(this.playerBullets, this.enemies, this.onBulletHitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.onPlayerHitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.onPlayerHitBullet, null, this);
    this.physics.add.overlap(this.player, this.powerups, this.onPlayerGetPowerup, null, this);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey('W'),
      down: this.input.keyboard.addKey('S'),
      left: this.input.keyboard.addKey('A'),
      right: this.input.keyboard.addKey('D'),
    };
    this.fireKey = this.input.keyboard.addKey('SPACE');
    this.shiftKey = this.input.keyboard.addKey('SHIFT');

    // Mode switch
    this.input.keyboard.on('keydown-SHIFT', () => {
      if (!this.transitioning) this.toggleMode();
    });

    // HUD update
    this.updateHUD();

    // Start first wave
    this.time.delayedCall(1000, () => this.startWave());
  }

  updateHUD() {
    const cb = this.registry.get('callbacks');
    cb?.onHudUpdate({
      score: this.score,
      lives: this.lives,
      wave: this.wave,
      mode: this.travelMode,
    });
  }

  startWave() {
    const waveDef = this.wave <= WAVE_DEFS.length
      ? WAVE_DEFS[this.wave - 1]
      : generateWave(this.wave, this.scale.width, this.scale.height);

    // Transition mode if wave requires it
    if (waveDef.mode !== this.travelMode && !this.transitioning) {
      this.transitioning = true;
      this.doModeTransition(waveDef.mode, () => {
        this.transitioning = false;
        this.spawnWave(waveDef);
      });
    } else {
      this.spawnWave(waveDef);
    }
  }

  spawnWave(waveDef) {
    this.waveActive = true;
    this.waveSpawnsRemaining = waveDef.spawns.length;
    const { width, height } = this.scale;

    // Show wave text
    const waveText = this.add
      .text(width / 2, height / 2, `WAVE ${this.wave}`, {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#0ff',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: waveText,
      alpha: 1,
      duration: 400,
      yoyo: true,
      hold: 600,
      onComplete: () => waveText.destroy(),
    });

    // Schedule spawns
    for (const spawn of waveDef.spawns) {
      this.time.delayedCall(spawn.delay + 800, () => {
        if (!this.scene.isActive()) return;
        const x = spawn.x * width;
        const y = spawn.y * height;
        spawnEnemy(this, spawn.type, x, y);
        this.waveSpawnsRemaining--;
      });
    }
  }

  toggleMode() {
    const newMode = this.travelMode === 'vertical' ? 'horizontal' : 'vertical';
    this.transitioning = true;
    this.doModeTransition(newMode, () => {
      this.transitioning = false;
    });
  }

  doModeTransition(newMode, onComplete) {
    const { width, height } = this.scale;

    // Flash effect
    const flash = this.add.rectangle(width / 2, height / 2, width, height, 0x0044ff, 0.3);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500,
      onComplete: () => flash.destroy(),
    });

    // Mode label
    const label = this.add
      .text(width / 2, height / 2, newMode === 'vertical' ? 'VERTICAL MODE' : 'HORIZONTAL MODE', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ff0',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: label,
      alpha: 0,
      duration: 800,
      delay: 400,
      onComplete: () => label.destroy(),
    });

    this.travelMode = newMode;

    // Reposition player for new mode
    if (newMode === 'vertical') {
      this.tweens.add({
        targets: this.player,
        x: width / 2,
        y: height - 60,
        duration: 400,
        onComplete,
      });
    } else {
      this.tweens.add({
        targets: this.player,
        x: 60,
        y: height / 2,
        duration: 400,
        onComplete,
      });
    }

    this.updateHUD();
  }

  onBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;

    bullet.setActive(false).setVisible(false);
    bullet.body.enable = false;

    enemy.hp--;
    if (enemy.hp <= 0) {
      this.score += enemy.score;
      this.spawnExplosion(enemy.x, enemy.y);

      // Chance to drop powerup
      if (Math.random() < 0.12) {
        this.spawnPowerup(enemy.x, enemy.y);
      }

      enemy.setActive(false).setVisible(false);
      enemy.body.enable = false;
    } else {
      // Hit flash
      enemy.setTint(0xffffff);
      this.time.delayedCall(80, () => {
        if (enemy.active) enemy.clearTint();
      });
    }

    this.updateHUD();
  }

  onPlayerHitEnemy(player, enemy) {
    if (!enemy.active || player.invincible) return;

    this.spawnExplosion(enemy.x, enemy.y);
    enemy.setActive(false).setVisible(false);
    enemy.body.enable = false;

    this.loseLife();
  }

  onPlayerHitBullet(player, bullet) {
    if (!bullet.active || player.invincible) return;

    bullet.setActive(false).setVisible(false);
    bullet.body.enable = false;

    this.loseLife();
  }

  onPlayerGetPowerup(player, powerup) {
    if (!powerup.active) return;
    powerup.setActive(false).setVisible(false);
    powerup.body.enable = false;

    this.player.setPowerLevel(this.player.powerLevel + 1);
    this.score += 50;

    // Visual feedback
    const txt = this.add
      .text(player.x, player.y - 20, 'POWER UP!', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#0f8',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: txt,
      y: player.y - 60,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy(),
    });

    this.updateHUD();
  }

  loseLife() {
    if (!this.player.hitEffect()) return;

    this.lives--;
    this.player.setPowerLevel(1);
    this.updateHUD();

    // Camera shake
    this.cameras.main.shake(200, 0.01);

    if (this.lives <= 0) {
      this.player.setActive(false).setVisible(false);
      this.time.delayedCall(1000, () => {
        this.scene.start('GameOver', { score: this.score, wave: this.wave });
      });
    }
  }

  spawnExplosion(x, y) {
    const particles = this.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 200 },
      scale: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 12,
      emitting: false,
    });
    particles.explode();
    this.time.delayedCall(500, () => particles.destroy());
  }

  spawnPowerup(x, y) {
    const pu = this.powerups.get(x, y, 'powerup');
    if (!pu) return;
    pu.setActive(true).setVisible(true);
    pu.body.enable = true;

    if (this.travelMode === 'vertical') {
      pu.setVelocity(0, 60);
    } else {
      pu.setVelocity(-60, 0);
    }

    // Destroy after 6 seconds if not collected
    this.time.delayedCall(6000, () => {
      if (pu.active) {
        pu.setActive(false).setVisible(false);
        pu.body.enable = false;
      }
    });
  }

  update(time, delta) {
    if (!this.player.active) return;

    // Player input
    this.player.handleInput(this.cursors, this.wasd, this.fireKey, time);

    // Update enemies
    this.enemies.children.each((enemy) => {
      if (enemy.active) {
        updateEnemy(this, enemy, time, delta);
      }
    });

    // Clean up off-screen bullets
    this.cleanBullets(this.playerBullets);
    this.cleanBullets(this.enemyBullets);

    // Scrolling starfield
    this.updateStars(delta);

    // Check wave completion - only after all enemies have spawned
    if (this.waveActive && this.waveSpawnsRemaining <= 0) {
      const activeEnemies = this.enemies.countActive();
      if (activeEnemies === 0) {
        this.waveActive = false;
        this.wave++;
        this.updateHUD();
        this.time.delayedCall(2000, () => this.startWave());
      }
    }
  }

  cleanBullets(group) {
    const { width, height } = this.scale;
    group.children.each((b) => {
      if (b.active && (b.y < -20 || b.y > height + 20 || b.x < -20 || b.x > width + 20)) {
        b.setActive(false).setVisible(false);
        b.body.enable = false;
      }
    });
  }

  updateStars(delta) {
    const dt = delta / 1000;
    const { width, height } = this.scale;
    for (const star of this.stars) {
      if (this.travelMode === 'vertical') {
        star.obj.y += star.speed * dt;
        if (star.obj.y > height) {
          star.obj.y = 0;
          star.obj.x = Phaser.Math.Between(0, width);
        }
      } else {
        star.obj.x -= star.speed * dt;
        if (star.obj.x < 0) {
          star.obj.x = width;
          star.obj.y = Phaser.Math.Between(0, height);
        }
      }
    }
  }
}
