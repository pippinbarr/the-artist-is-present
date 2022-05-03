class Hallway1 extends TAIPScene {
  constructor(config) {
    super({
      key: "hallway1"
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
        "hallways/hallway1-bg.png"
      )
      .setScale(4);

    // Back wall
    createColliderRect(this, 200, 200, 600, 5, this.colliders);
    // Bottom wall
    createColliderRect(this, 0, 392, 800, 8, this.colliders);
    // Door top
    createColliderRect(this, 0, 268, 130, 8, this.colliders);
    // Door bottom
    createColliderRect(this, 0, 330, 72, 2, this.colliders);
    // Left wall diagonals
    // Upper
    createColliderLine(this, 130, 270, 75, 80, 5, -5, this.colliders);
    // Lower
    createColliderLine(this, 70, 330, 75, 80, -5, 5, this.colliders);

    this.add
      .sprite(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "atlas",
        "hallways/hallway1-fg.png"
      )
      .setScale(4)
      .setDepth(100000);

    this.starryNightSensor = this.physics.add.sprite(77 * 4, 52 * 4, 'atlas', 'red-pixel.png').setScale(4 * 4, 4 * 4).setVisible(false);
    this.starryNightSensor.text = STARRY_NIGHT;
    this.oliveTreesSensor = this.physics.add.sprite(137 * 4, 52 * 4, 'atlas', 'red-pixel.png').setScale(4 * 4, 4 * 4).setVisible(false);
    this.oliveTreesSensor.text = OLIVE_TREES;

    const transitionData = [{
        key: "tickets",
        type: "left",
        x: 10 * 4,
        y: 60 * 4
      },
      {
        key: "hallway2",
        type: "right",
        x: 196 * 4,
        y: 60 * 4,
        keepY: true
      }
    ];
    this.addTransitions(transitionData);

    this.handleEntrances();
  }

  update(time, delta) {
    super.update();

    this.marina.update(time, delta);
    this.physics.collide(this.marina, this.colliders, () => {
      this.marina.stop();
    });
    handleSensor(this, this.starryNightSensor);
    handleSensor(this, this.oliveTreesSensor);
    this.marina.depth = this.marina.body.y;
  }

}