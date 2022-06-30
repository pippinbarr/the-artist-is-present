class Marina extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, `marina-sitting`)
    this.setScale(4);
    this.anims.play(`marina-looking`);
  }

  create() {

  }

  update() {
    super.update();

    // this.sensor.x = this.body.x - 5;
    // this.sensor.y = this.body.y - 5;

    // this.debugText.setPosition(this.x - this.displayWidth / 2, this.y - this.displayHeight / 1.5);
  }

  lookUp() {
    this.anims.play(`
        marina - looks - up`);
  }

  lookDown() {
    this.anims.play(`
        marina - looks - down`);
  }
}