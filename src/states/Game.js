/* globals __DEV__ */
import Phaser from 'phaser'
import Brick from '../prefabs/Brick'
import Paddle from '../prefabs/Paddle'
import Ball from '../prefabs/Ball'

export default class extends Phaser.State {
  constructor () {
    super()

    this.ballOnPaddle = true
  }

  init () {}
  preload () {}

  create () {
    this.game.physics.arcade.checkCollision.down = false

    this.setUpText()
    this.setUpBricks()
    this.setUpPaddle()
    this.setUpBall()

    this.game.input.onDown.add(this.releaseBall, this)
  }

  releaseBall () {
    if (!this.ballOnPaddle) {
      return
    }

    this.ballOnPaddle = false

    this.ball.body.velocity.y = -300
    this.ball.body.velocity.x = -5
  }

  setUpBricks () {
    this.bricks = this.game.add.group()
    this.generateBricks(this.bricks)
  }

  setUpPaddle () {
    this.paddle = new Paddle(
      this.game,
      this.game.world.centerX,
      this.game.world.height - 100
    )

    this.game.add.existing(this.paddle)
  }

  setUpBall () {
    this.ball = new Ball(this.game)
    this.game.add.existing(this.ball)

    this.ball.events.onOutOfBounds.add(this.ballLost, this)

    this.putBallOnPaddle()
  }

  ballLost () {
    --this.game.globals.lives

    if (this.game.globals.lives === 0) {
      this.endGame()
      return
    }

    this.livesText.text = `Lives: ${this.game.globals.lives}`

    this.putBallOnPaddle()
  }

  endGame () {
    this.game.state.start('GameOver')
  }

  putBallOnPaddle () {
    this.ballOnPaddle = true
    this.ball.reset(this.paddle.body.x, this.paddle.body.y - this.paddle.body.height)
  }

  generateBricks (bricksGroup) {
    const rows = 5
    const columns = 15
    const xOffset = 50
    const yOffset = 45
    let brick;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        brick = new Brick(this.game, x * xOffset, y * yOffset)

        bricksGroup.add(brick)
      }
    }

    const brickGroupWidth = ((xOffset * columns) - (xOffset - brick.width)) / 2

    bricksGroup.position.setTo(
      this.game.world.centerX - brickGroupWidth,
      this.game.world.centerY - 250
    )
  }

  setUpText() {
    const { score, lives, level } = this.game.globals

    this.scoreText = this.createText(20, 20, 'left', `Score: ${score}`)
    this.livesText = this.createText(0, 20, 'center', `Lives: ${lives}`)
    this.levelText = this.createText(-20, 20, 'right', `Level: ${level}`)
  }

  createText (xOffset, yOffset, align, text) {
    return this.game.add.text(
      xOffset,
      yOffset,
      text,
      {
        font: '18px Arial',
        fill: '#000',
        boundsAlignH: align,
      }
    ).setTextBounds(0, 0, this.game.world.width, 0)
  }

  update () {
    if (this.ballOnPaddle) {
      this.ball.body.x = this.paddle.x - (this.ball.width / 2)
    }

    this.game.physics.arcade.collide(
      this.ball,
      this.paddle,
      this.ballHitPaddle,
      null,
      this
    )

    this.game.physics.arcade.collide(
      this.ball,
      this.bricks,
      this.ballHitBrick,
      null,
      this
    )
  }

  ballHitPaddle (ball, paddle) {
    let diff = 0

    if (ball.x < paddle.x) {
      diff = paddle.x - ball.x
      ball.body.velocity.x = (-10 * diff)
      return
    }

    if (ball.x > paddle.x) {
      diff = ball.x - paddle.x
      ball.body.velocity.x = (10 * diff)
      return
    }
  }

  ballHitBrick (ball, brick) {
    brick.kill()

    this.game.globals.score += 10
    this.scoreText.text = `Score: ${this.game.globals.score}`

    if (this.bricks.countLiving() === 0) {
      this.game.globals.level += 1
      this.levelText.text = `Level: ${this.game.globals.level}`

      this.putBallOnPaddle()
      this.generateBricks(this.bricks)
    }
  }

  render () {

  }
}
