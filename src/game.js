import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

export function createGame(parent, callbacks) {
  const config = {
    type: Phaser.AUTO,
    parent,
    width: 480,
    height: 720,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#000011',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
  };

  const game = new Phaser.Game(config);
  game.registry.set('callbacks', callbacks);
  return game;
}
