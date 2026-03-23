import Phaser from 'phaser';
import { generateAssets } from '../assets/generate.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    generateAssets(this);
    this.scene.start('Menu');
  }
}
