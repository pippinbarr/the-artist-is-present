class Person extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture, suffix) {
    super(scene, x, y, texture)
    this.setScale(4);
    scene.physics.world.enableBody(this);
    this.body.setOffset(1, this.height - 4);
    this.body.setSize(this.width - 2, 4, false);
    this.speed = 100;
    this.sitting = false;
    this.suffix = suffix;
    this.x = x;
    this.y = y;
    this.anims.play(`idle-h${this.suffix}`);
  }

  create() {

  }

  update() {

  }

  right() {
    this.flipX = false;
    this.setVelocityX(this.speed);
    this.setVelocityY(0);
    this.anims.play('walking-h' + this.suffix);
  }

  left() {
    this.flipX = true;
    this.setVelocityX(-this.speed);
    this.setVelocityY(0);
    this.anims.play('walking-h' + this.suffix);
  }

  up() {
    this.setVelocityX(0);
    this.setVelocityY(-this.speed);
    this.anims.play('walking-u' + this.suffix);
  }

  down() {
    this.setVelocityX(0);
    this.setVelocityY(this.speed);
    this.anims.play('walking-d' + this.suffix);
  }

  stop() {
    if (this.sitting) return;

    let key = this.anims.currentAnim.key;
    key = key.replace('walking', 'idle');
    this.anims.play(key);
    this.setVelocity(0, 0);
  }

  faceDown() {
    this.anims.play(`idle-d${this.suffix}`);
  }

  faceUp() {
    this.anims.play(`idle-u${this.suffix}`);
  }

  faceRight() {
    this.flipX = false;
    this.anims.play(`idle-h${this.suffix}`);
  }

  faceLeft() {
    this.flipX = true;
    this.anims.play(`idle-h${this.suffix}`);
  }

  sit() {
    this.anims.play('sitting' + this.suffix);
    this.setVelocity(0, 0);
    this.sitting = true;
    this.flipX = false;
  }

}