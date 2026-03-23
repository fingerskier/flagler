import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.wavesCleared = data.wave || 1;
  }

  create() {
    const { width, height } = this.scale;
    const cb = this.registry.get('callbacks');
    cb?.onScreenChange('gameover');

    // Save high score
    const prev = parseInt(localStorage.getItem('flagler_highscore') || '0', 10);
    const isNew = this.finalScore > prev;
    if (isNew) localStorage.setItem('flagler_highscore', String(this.finalScore));

    this.add
      .text(width / 2, height * 0.2, 'GAME OVER', {
        fontFamily: 'monospace',
        fontSize: '40px',
        color: '#f44',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.38, `SCORE: ${this.finalScore}`, {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#0ff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.46, `WAVES CLEARED: ${this.wavesCleared - 1}`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#88f',
      })
      .setOrigin(0.5);

    if (isNew) {
      const newText = this.add
        .text(width / 2, height * 0.54, 'NEW HIGH SCORE!', {
          fontFamily: 'monospace',
          fontSize: '20px',
          color: '#ff0',
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: newText,
        alpha: 0.2,
        duration: 400,
        yoyo: true,
        repeat: -1,
      });
    }

    const highText = this.add
      .text(width / 2, height * 0.62, `HIGH SCORE: ${Math.max(prev, this.finalScore)}`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#888',
      })
      .setOrigin(0.5);

    const restart = this.add
      .text(width / 2, height * 0.76, 'TAP OR PRESS ENTER TO RETRY', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#fff',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: restart,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    const menu = this.add
      .text(width / 2, height * 0.84, 'ESC - MAIN MENU', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#666',
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Game'));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Menu'));
    this.input.once('pointerdown', () => this.scene.start('Game'));
  }
}
