class Hallway3 extends TAIPScene {
  constructor(config) {
    super({
      key: "hallway3"
    });
  }

  create() {
    super.create();

    // Ticket area BG
    this.add
      .sprite(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "atlas",
        "hallways/hallway3-bg.png"
      )
      .setScale(4);

    // Back wall
    createColliderRect(this, 0, 200, 800, 5, this.colliders);
    // Bottom wall
    createColliderRect(this, 0, 392, 800, 8, this.colliders);

    const transitionData = [{
        key: "hallway2",
        type: "left",
        x: 4 * 4,
        y: 60 * 4,
        keepY: true
      },
      {
        key: "atrium",
        type: "right",
        x: 196 * 4,
        y: 60 * 4,
        keepY: true
      }
    ];
    this.addTransitions(transitionData);

    this.dancersSensor = this.physics.add.sprite(59 * 4, 52 * 4, 'atlas', 'red-pixel.png')
      .setScale(4 * 4, 4 * 4)
      .setVisible(false);
    this.dancersSensor.text = DANCERS;

    this.addQueue(this.game.canvas.width);
    this.handleEntrances();
  }

  update(time, delta) {
    super.update();

    this.physics.collide(this.player, this.colliders, () => {
      this.player.stop();
    });

    handleSensor(this, this.dancersSensor);

    this.player.depth = this.player.body.y;
  }
}