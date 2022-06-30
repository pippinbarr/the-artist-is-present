class MarinaFace extends Phaser.Scene {

  constructor(config) {
    super({
      key: `marina`
    });

    this.BLINK_MINIMUM = 5;
    this.BLINK_VARIANCE = 5;
  }

  create() {
    this.cameras.main.setBackgroundColor("#5F6061");

    this.marina = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, `marina-face`);
    this.marina.setScale(4, 4);
    this.blink();
  }

  update() {
    super.update();
  }

  blink() {
    this.marina.anims.play(`marina-blink`);
    let nextBlinkDelay = 1000 * Math.random() * this.BLINK_VARIANCE + this.BLINK_MINIMUM;
    setTimeout(() => {
      this.blink();
    }, nextBlinkDelay)
  }
}