function addAtrium(x, y) {
  // Atrium BG
  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "atrium/atrium-bg.png"
    )
    .setScale(4);

  // Table and chairs
  this.tableAndChairs = this.physics.add.sprite(x + 130 * 4 + 30 * 4, y + 40 * 4 + 15 * 4, 'atlas', 'atrium/atrium-table-and-chairs.png')
    .setScale(4);
  this.tableAndChairs.body.setOffset(2, this.tableAndChairs.body.height - 8);
  this.tableAndChairs.body.setSize(this.tableAndChairs.width - 4, 4, false);
  this.tableAndChairs.setPushable(false);
  this.tableAndChairs.setDepth(250);
  this.colliders.add(this.tableAndChairs);

  // This was for TAIP2
  // this.playerChairSensor = this.physics.add.sprite(730, 250, 'atlas', 'red-pixel.png')
  //   .setScale(10, 50);
  // this.playerChairSensor.visible = false;

  this.visitorChairSensor = this.physics.add.sprite(x + 580, y + 250, 'atlas', 'red-pixel.png')
    .setScale(50, 60);
  this.visitorChairSensor.visible = false;
  this.atriumRightWallGroup = this.physics.add.group();

  this.tape = this.physics.add.group();
  // Back wall left
  createColliderRect(this, x + 0, y + 0, 312, 202, this.colliders);
  // Back wall right
  createColliderRect(this, x + 312, y + 0, 490, 60, this.colliders);
  // Bottom wall
  createColliderRect(this, x + 0, y + 392, 800, 8, this.colliders);
  // Right wall
  createColliderRect(this, x + 799, y + 0, 2, 400, this.atriumRightWallGroup);
  // Tape left top
  createColliderLine(this, x + 380, y + 120, 80, 100, 1, 2, this.tape);
  // Tape left bottom
  createColliderLine(this, x + 456, y + 272, 80, 90, 1, 2, this.tape);
  // Tape top
  createColliderRect(this, x + 384, y + 120, 400, 4, this.tape);
  // Tape bottom
  createColliderRect(this, x + 508, y + 360, 300, 4, this.tape);

  // this.addQueue(0);

  // Add guards
  this.guards = this.add.group();
  this.guard1 = new Guard(this, x + 115 * 4, y + 39 * 4 + 2, this.dialog);
  this.guard2 = new Guard(this, x + 118 * 4, y + 50 * 4 + 2, this.dialog);
  this.guards.add(this.guard1, true);
  this.guards.add(this.guard2, true);

  // marina
  this.marina = this.add.sprite(x + 695.5, y + 204, `marina-sitting`);
  this.marina.setScale(4, 4);
  this.marina.setDepth(250);

  const sceneData = {
    name: "atrium",
    x: 4,
    y: 0,
    transitions: {
      left: {
        to: "hallway-3",
        x: x + 4 * 4,
        y: y + 60 * 4,
        camOffset: {
          x: -1,
          y: 0
        }
      },
    },
  };
  this.addScene(sceneData);

  let fakeQueuers = 20;
  let fakeQueueInterval = setInterval(() => {
    let queuer = new Queuer(this, this.scenes[`atrium`].x * this.game.canvas.width, this.scenes[`atrium`].y * this.game.canvas.height + 228, [this.checkpoints[this.checkpoints.length - 2], this.checkpoints[this.checkpoints.length - 1]]);
    this.queuers.add(queuer);
    queuer.start();
    fakeQueuers--;
    if (fakeQueuers === 0) {
      clearInterval(fakeQueueInterval);
    }
  }, 1000);
}

function updateAtrium() {
  // Specialist collisions

  // Tape
  this.physics.collide(this.player, this.tape, () => {
    this.player.stop();
    this.dialog.showMessage(TAPE_MESSAGE);
  });

  // Guards
  this.physics.collide(this.player, this.guards, (marina, guard) => {
    this.player.stop();
    // this.personSay(guard, GUARD_INSTRUCTIONS);
  });

  // Queuers onto the chair
  // Player onto the chair
  this.physics.overlap(this.queuers, this.visitorChairSensor, (sensor, q) => {
    this.sit(q);
  });

  // Player onto the chair
  this.physics.overlap(this.player, this.visitorChairSensor, (player, sensor) => {
    this.sit(this.player);
  });

  //this.handleCollisions();
  //this.checkMarinaSitting();
  //this.checkVisitorSitting();

  // if (this.movingUp && this.movingUp.x >= QUEUE_X) {
  //   this.movingUp.stop();
  //   this.movingUp = undefined;
  //   for (let i = 1; i < QUEUE.length; i++) {
  //     setTimeout(() => {
  //       QUEUE[i].right();
  //     }, i * 300 + Math.random() * 250);
  //   }
  // }

  // this.setDepths();
}