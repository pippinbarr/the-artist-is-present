class Tickets extends TAIPScene {
  constructor(config) {
    super({
      key: "tickets"
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
        "tickets/tickets-bg.png"
      )
      .setScale(4);

    this.barrier = this.physics.add
      .sprite(80 * 4, 49 * 4, "atlas", "tickets/tickets-barrier.png")
      .setScale(4);
    this.barrier.body.setOffset(6, 34);
    this.barrier.body.setSize(90, 3, false);
    this.barrier.body.immovable = true;
    this.barrier.depth = 60 * 4;
    this.colliders.add(this.barrier);

    createColliderRect(this, 0, 200, 600, 5, this.colliders);
    createColliderRect(this, 0, 392, 320, 8, this.colliders);
    createColliderRect(this, 480, 392, 320, 8, this.colliders);
    createColliderRect(this, 674, 268, 130, 8, this.colliders);
    createColliderRect(this, 734, 330, 100, 2, this.colliders);
    createColliderRect(this, 1, 200, 1, 200, this.colliders);
    createColliderLine(this, 600, 200, 75, 80, 5, 5, this.colliders);
    createColliderLine(this, 730, 330, 75, 80, 5, 5, this.colliders);

    this.guard = new Guard(this, 708, 276);
    // this.add.existing(this.guard);
    // this.physics.add.existing(this.guard);

    let ticketFG = this.add
      .sprite(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "atlas",
        "tickets/tickets-fg.png"
      )
      .setScale(4);
    ticketFG.depth = 100000;

    this.ticketSensor = this.physics.add.sprite(450, 160, 'atlas', 'red-pixel.png')
      .setScale(10, 100)
      .setVisible(false);

    const transitionData = [{
        key: "moma-exterior",
        type: "down",
        x: 100 * 4,
        y: 90 * 4
      },
      {
        key: "hallway1",
        type: "right",
        x: 190 * 4,
        y: 60 * 4
      }
    ];
    this.addTransitions(transitionData);

    this.handleEntrances();
  }

  update(time, delta) {
    super.update();

    this.player.update(time, delta);
    this.physics.collide(this.player, this.colliders, () => {
      this.player.stop();
    });
    this.physics.overlap(this.player, this.ticketSensor, () => {
      this.dialog.y = UPPER_DIALOG_Y;
      this.dialog.showMessage(TICKETS_DESK_MESSAGE, () => {});
      this.ticketSensor.body.checkCollision.none = true;
    });
    this.physics.collide(this.player, this.guard, () => {
      this.player.stop();
      if (!this.seenGuard) {
        this.dialog.y = UPPER_DIALOG_Y;
        this.dialog.showMessage(TICKETS_GUARD_MESSAGE, () => {});
        this.seenGuard = true;
      }
    });
    this.player.depth = this.player.body.y;
    this.guard.depth = this.guard.body.y;
  }
}