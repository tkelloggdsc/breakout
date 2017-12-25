import Phaser from 'phaser'

export default class Brick extends Phaser.Sprite {
  constructor (game, x, y) {
    // setup where the thing starts
    super(game, x, y, 'brick')

    // setup physics
    this.game.physics.arcade.enableBody(this)

    this.body.immovable = true
  }
}