import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;
    const cb = this.registry.get('callbacks');
    cb?.onScreenChange('title');

    // Starfield background
    this.stars = [];
    for (let i = 0; i < 100; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Math.random() * 0.8 + 0.2,
      );
      this.stars.push({ obj: star, speed: Phaser.Math.Between(20, 80) });
    }

    // Title
    this.add
      .text(width / 2, height * 0.25, 'FLAGLER', {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#0ff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setShadow(0, 0, '#0ff', 8);

    // Subtitle
    this.add
      .text(width / 2, height * 0.35, 'SPACE SHOOTER', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#88f',
      })
      .setOrigin(0.5);

    // Start prompt
    const startText = this.add
      .text(width / 2, height * 0.6, 'TAP OR PRESS ENTER TO START', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#fff',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Controls info
    const controls = [
      'ARROWS / WASD - Move',
      'SPACE / TAP - Shoot',
      'SHIFT - Switch Mode',
    ];
    controls.forEach((line, i) => {
      this.add
        .text(width / 2, height * 0.72 + i * 24, line, {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#888',
        })
        .setOrigin(0.5);
    });

    // Input
    this.input.keyboard.once('keydown-ENTER', () => this.startGame());
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.once('pointerdown', () => this.startGame());
  }

  startGame() {
    this.scene.start('Game');
  }

  update(_time, delta) {
    const dt = delta / 1000;
    const h = this.scale.height;
    for (const star of this.stars) {
      star.obj.y += star.speed * dt;
      if (star.obj.y > h) {
        star.obj.y = 0;
        star.obj.x = Phaser.Math.Between(0, this.scale.width);
      }
    }
  }
}
