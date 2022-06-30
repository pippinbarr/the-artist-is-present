class Person extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture, suffix) {
    super(scene, x, y, texture)
    this.setScale(4);
    scene.physics.world.enableBody(this);
    this.body.setOffset(1, this.height - 4);
    this.body.setSize(this.width - 2, 4, false);

    this.sensor = scene.physics.add.sprite(this.body.x, this.body.y, `atlas`, `red-pixel.png`);
    this.sensor.body.setSize(this.body.width * 1.25, this.body.height * 1.75, false);
    this.sensor.parent = this;
    scene.queuerSensors.add(this.sensor);

    this.speed = 100; //100;
    this.sitting = false;
    this.suffix = suffix;
    this.x = x;
    this.y = y;
    this.anims.play(`idle-h${this.suffix}`);
    this.setPushable(false);

    this.debugText = scene.add.text(this.x - this.displayWidth / 2, this.y - this.displayHeight / 1.5, "NOT IN QUEUE", {
        fontSize: 20,
        fontWeight: "bold",
        color: "red"
      })
      .setVisible(DEBUG);
  }

  create() {

  }

  update() {
    super.update();

    this.sensor.x = this.body.x - 5;
    this.sensor.y = this.body.y - 5;

    this.debugText.setPosition(this.x - this.displayWidth / 2, this.y - this.displayHeight / 1.5);
  }

  right() {
    this.flipX = false;
    this.setVelocity(this.speed, 0);
    this.anims.play('walking-h' + this.suffix);
  }

  left() {
    this.flipX = true;
    this.setVelocity(-this.speed, 0);
    this.anims.play('walking-h' + this.suffix);
  }

  up() {
    this.setVelocity(0, -this.speed);
    this.anims.play('walking-u' + this.suffix);
  }

  down() {
    this.setVelocity(0, this.speed);
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

  stand() {
    this.anims.play('idle-h' + this.suffix);
    this.setVelocity(0, 0);
    this.sitting = false;
    this.flipX = false;
  }

}