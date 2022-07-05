class Debug extends Phaser.Scene {

  constructor(config) {
    super({
      key: `debug`
    });
  }

  create() {
    // Camera
    this.cameras.main.setBackgroundColor("#5F6061");
    this.queuerSensors = this.physics.add.group();
    for (let x = 0; x < 10 * 80; x += 80) {
      for (let y = 0; y < 5 * 120; y += 120) {
        let player = new Visitor(this, x, y);
        this.add.existing(player);
        // player.joinScene(this);
        let moves = [
          player.faceLeft,
          player.faceRight,
          player.faceUp,
          player.faceDown
        ];
        let index = 0;
        setInterval(() => {
          moves[index].bind(player)();
          index = (index + 1) % moves.length;
        }, 2000)
      }
    }
  }

}