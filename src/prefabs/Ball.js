import Phaser from 'phaser'

export default class Ball extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'ball')

    this.game.physics.arcade.enableBody(this)

    this.checkWorldBounds = true

    this.body.collideWorldBounds = true

    this.body.bounce.set(1)
  }
}