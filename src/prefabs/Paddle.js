import Phaser from 'phaser'

export default class Paddle extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'paddle')

    this.anchor.setTo(0.5, 0.5)

    this.game.physics.arcade.enableBody(this)

    this.body.immovable = true
  }

  update () {
    if (this.game.input.x === 0) {
      return
    }
    this.x = this.game.input.x

    if (this.x < this.width / 2) {
      return this.x = this.width / 2
    }

    if (this.x > this.game.width - this.width / 2) {
      return this.x = this.game.width - this.width / 2
    }
  }
}