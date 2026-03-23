import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.speed = 200;
    this.fireRate = 180; // ms between shots
    this.lastFired = 0;
    this.powerLevel = 1; // 1 = single, 2 = double, 3 = triple
    this.invincible = false;

    // Thruster glow
    this.thruster = scene.add.circle(x, y + 18, 4, 0x00aaff, 0.6);
  }

  handleInput(cursors, wasd, fireKey, time) {
    const scene = this.scene;
    const mode = scene.travelMode;

    let vx = 0;
    let vy = 0;

    if (mode === 'vertical') {
      if (cursors.left.isDown || wasd.left.isDown) vx = -this.speed;
      if (cursors.right.isDown || wasd.right.isDown) vx = this.speed;
      if (cursors.up.isDown || wasd.up.isDown) vy = -this.speed * 0.6;
      if (cursors.down.isDown || wasd.down.isDown) vy = this.speed * 0.6;
    } else {
      // Horizontal mode
      if (cursors.left.isDown || wasd.left.isDown) vx = -this.speed;
      if (cursors.right.isDown || wasd.right.isDown) vx = this.speed;
      if (cursors.up.isDown || wasd.up.isDown) vy = -this.speed;
      if (cursors.down.isDown || wasd.down.isDown) vy = this.speed;
    }

    this.setVelocity(vx, vy);

    // Update thruster position
    if (mode === 'vertical') {
      this.thruster.setPosition(this.x, this.y + 18);
      this.setAngle(0);
    } else {
      this.thruster.setPosition(this.x - 18, this.y);
      this.setAngle(-90);
    }
    this.thruster.setAlpha(0.3 + Math.random() * 0.5);

    // Touch/pointer movement
    if (scene.input.activePointer.isDown) {
      const pointer = scene.input.activePointer;
      const dx = pointer.x - this.x;
      const dy = pointer.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 16) {
        this.setVelocity(
          (dx / dist) * this.speed,
          (dy / dist) * this.speed,
        );
      }
      // Auto-fire on touch
      this.fire(time);
    }

    if (fireKey.isDown || Phaser.Input.Keyboard.JustDown(fireKey)) {
      this.fire(time);
    }
  }

  fire(time) {
    if (time - this.lastFired < this.fireRate) return;
    this.lastFired = time;

    const scene = this.scene;
    const mode = scene.travelMode;

    if (this.powerLevel >= 1) {
      this.spawnBullet(this.x, this.y, mode);
    }
    if (this.powerLevel >= 2) {
      this.spawnBullet(this.x - 8, this.y, mode);
      this.spawnBullet(this.x + 8, this.y, mode);
    }
    if (this.powerLevel >= 3) {
      this.spawnBullet(this.x - 4, this.y, mode, -0.15);
      this.spawnBullet(this.x + 4, this.y, mode, 0.15);
    }
  }

  spawnBullet(x, y, mode, angleOffset = 0) {
    const bullet = this.scene.playerBullets.get(x, y, 'bullet');
    if (!bullet) return;
    bullet.setActive(true).setVisible(true);
    bullet.body.enable = true;

    const speed = 500;
    if (mode === 'vertical') {
      bullet.setAngle(0);
      bullet.setVelocity(speed * angleOffset, -speed);
    } else {
      bullet.setAngle(-90);
      bullet.setVelocity(speed, speed * angleOffset);
    }
  }

  hitEffect() {
    if (this.invincible) return false;
    this.invincible = true;

    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 8,
      onComplete: () => {
        this.alpha = 1;
        this.invincible = false;
      },
    });

    return true;
  }

  setPowerLevel(level) {
    this.powerLevel = Math.min(level, 3);
    if (this.powerLevel > 1) {
      this.fireRate = 150;
    }
  }

  destroy() {
    if (this.thruster) this.thruster.destroy();
    super.destroy();
  }
}
