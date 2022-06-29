function addTicketHall(x, y) {
  // Ticket area BG
  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "tickets/tickets-bg.png"
    )
    .setScale(4);

  this.barrier = this.physics.add
    .sprite(x + 80 * 4, y + 49 * 4, "atlas", "tickets/tickets-barrier.png")
    .setScale(4);
  this.barrier.body.setOffset(6, 34);
  this.barrier.body.setSize(90, 3, false);
  this.barrier.setPushable(false);
  this.barrier.depth = 60 * 4;
  this.colliders.add(this.barrier);

  createColliderRect(this, x + 0, y + 200, 600, 5, this.colliders);
  createColliderRect(this, x + 0, y + 392, 320, 8, this.colliders);
  createColliderRect(this, x + 480, y + 392, 320, 8, this.colliders);
  createColliderRect(this, x + 674, y + 268, 130, 8, this.colliders);
  createColliderRect(this, x + 734, y + 330, 100, 2, this.colliders);
  createColliderRect(this, x + 1, y + 200, 1, 200, this.colliders);
  createColliderLine(this, x + 600, y + 200, 75, 80, 5, 5, this.colliders);
  createColliderLine(this, x + 730, y + 330, 75, 80, 5, 5, this.colliders);

  this.guard = new Guard(this, x + 708, y + 276);
  this.colliders.add(this.guard);
  // this.add.existing(this.guard);
  // this.physics.add.existing(this.guard);

  let ticketFG = this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "tickets/tickets-fg.png"
    )
    .setScale(4);
  ticketFG.depth = 100000;

  this.ticketSensor = this.physics.add.sprite(x + 450, y + 160, 'atlas', 'red-pixel.png')
    .setScale(10, 100)
    .setVisible(false);

  this.ticketBarrier = this.physics.add.sprite(x + 4 * 181 + 10, y + 4 * 61 + 40, `atlas`, `red-pixel.png`)
    .setScale(4 * 5, 4 * 20)
    .setVisible(false)
    .setPushable(false)

  const sceneData = {
    name: "ticket-hall",
    x: 0,
    y: 0,
    transitions: {
      down: {
        to: "moma-exterior",
        x: x + 100 * 4,
        y: y + 90 * 4,
        camOffset: {
          x: 0,
          y: 1
        }
      },
      right: {
        to: "hallway-1",
        x: x + 190 * 4,
        y: y + 60 * 4,
        camOffset: {
          x: 1,
          y: 0
        }
      }
    }
  };
  this.addScene(sceneData);

  // this.handleEntrances();
}

function updateTicketHall() {
  this.physics.overlap(this.player, this.ticketSensor, () => {
    this.player.up();
    this.player.stop();
    this.dialog.y = UPPER_DIALOG_Y;
    this.dialog.showMessage(BUY_TICKET_MESSAGE, () => {});
    this.player.hasTicket = true;
    this.ticketSensor.body.checkCollision.none = true;
  });

  // The ticket hall guard checks your ticket...
  this.physics.collide(this.player, this.ticketBarrier, () => {
    this.player.stop();
    if (!this.player.hasTicket) {
      this.dialog.y = UPPER_DIALOG_Y;
      this.dialog.showMessage(TICKETS_GUARD_NO_TICKET_MESSAGE, () => {});
    } else if (!this.player.showedTicket) {
      this.dialog.y = UPPER_DIALOG_Y;
      this.dialog.showMessage(TICKETS_GUARD_WELCOME_MESSAGE, () => {});
      this.player.showedTicket = true;
      this.ticketBarrier.body.checkCollision.none = true;
    }
  });
  // this.player.depth = this.player.body.y;
  this.guard.depth = this.guard.body.y;


}