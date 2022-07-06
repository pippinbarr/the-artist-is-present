const TIME_TO_SIT = 15 * 1000;

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
  this.tableAndChairs = this.physics.add.sprite(x + 130 * 4 + 30 * 4, y + 40 * 4 + 15 * 4 + 2, 'atlas', 'atrium/atrium-table-and-chairs.png')
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
  createColliderLine(this, x + 380, y + 120, 80 + 4, 120 - 10, 1, 2, this.tape);
  // Tape left bottom
  createColliderLine(this, x + 456 - 8, y + 272 - 14, 80 + 8, 102, 1, 2, this.tape);
  // Tape top
  createColliderRect(this, x + 384, y + 120, 400, 4, this.tape);
  // Tape bottom
  createColliderRect(this, x + 508, y + 360, 300, 4, this.tape);

  // this.addQueue(0);

  // Add guards
  this.guards = this.add.group();
  this.guard1 = new Guard(this, x + 115 * 4, y + 39 * 4 + 2, this.dialog);
  this.guard2 = new Guard(this, x + 121 * 4, y + 52 * 4 + 2, this.dialog);
  this.guards.add(this.guard1, true);
  this.guards.add(this.guard2, true);

  // marina
  this.marina = this.add.sprite(x + 695.5, y + 204 + 2, `marina-sitting`)
    .setScale(4, 4)
    .setDepth(1000);

  this.marina.anims.play(`marina-looks-down`);

  // Marina queue
  this.marinaQueue = this.physics.add.group();

  this.marinaBarrier = this.physics.add.sprite(x + 464, y + 243, 'atlas', 'red-pixel.png')
    .setScale(20, 20)
    .setVisible(false)
    .setPushable(false);

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

  setupInitialQueue.bind(this)();
}

function setupInitialQueue() {
  let queueLength = 0;
  if (museumIsOpen()) {
    let time = getNYCTime();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    if (hours === 10 && minutes <= 45) {
      queueLength = (minutes - 30) * 1 + 2;
    } else if (hours < 17 || (hours === 17 && minutes < 15)) {
      queueLength = Math.floor(Math.random() * 10) + 20;
    } else {
      queueLength = 10;
    }

    for (let i = 0; i < queueLength; i++) {
      let queuer = new Queuer(this, 0, 0, [...this.prequeueCheckpoints]);
      let x = this.marinaBarrier.x - 100 - i * 100;
      let y = this.prequeueCheckpoints[0].y - (queuer.height / 2) * queuer.scaleY + 2 * 4;
      queuer.setPosition(x, y);
      queuer.body.updateFromGameObject();
      this.queuers.add(queuer);
      queuer.start();
    }

    // addAtriumQueuer.bind(this)(queueLength);
  }
}

function addAtriumQueuer(leftToAdd) {
  if (this.dialog.inProgress) {
    setTimeout(() => {
      addAtriumQueuer.bind(this)(leftToAdd);
    }, 250);
  } else {
    let queuer = new Queuer(this, 0, 0, [...this.prequeueCheckpoints]);
    this.queuers.add(queuer);
    queuer.start();
    leftToAdd--;
    if (leftToAdd > 0) {
      setTimeout(() => {
        addAtriumQueuer.bind(this)(leftToAdd);
      }, 1500);
    }
  }
}

function updateAtrium() {
  // Specialist collisions

  // Tape
  this.physics.collide(this.player, this.tape, () => {
    this.player.stop();
    this.dialog.showMessage(TAPE_MESSAGE);
  });
  this.physics.collide(this.queuers, this.tape, (q, t) => {
    q.stop();
  });

  // Guards
  this.physics.collide(this.player, this.guards, (p, guard) => {
    this.player.stop();
  });
  this.physics.collide(this.queuers, this.guards, (q, guard) => {
    q.stop();
  });

  // Marina barrier for CPU
  this.physics.overlap(this.queuers, this.marinaBarrier, (barrier, q) => {
    if (q.isNext) {
      return;
    }

    // If this person isn't already in the queue then they should join it
    // (This would be if they're the first one in line)
    if (!this.marinaQueue.contains(q)) {
      this.marinaQueue.add(q);
    }

    q.isNext = true;
    q.tryToSit();
    q.debugText.text = MARINA_Q_SYMBOL;
  });

  this.physics.collide(this.player, this.marinaBarrier, null, () => {
    if (!this.player.isNext) {
      this.player.stop();
      if (!this.marinaQueue.contains(this.player)) {
        this.marinaQueue.add(this.player);
      }
      this.player.isNext = true;
      if (!this.sitter) {
        this.dialog.showMessage(GUARD_INSTRUCTIONS, () => {
          // Now the player is allowed through
          this.player.seenInstructions = true;
          // Start a time to sit timer!
          setTimeout(() => {
            if (this.sitter !== this.player) {
              // If we get here and they're not sitting down yet then
              // they screwed it up.
              // Eject them.
              this.ejectPlayer(SIT_FAIL);
            }
          }, TIME_TO_SIT);
        });
      }
      return true;
    } else if (!this.sitter && this.player.seenInstructions) {
      return false;
    } else if (this.marinaQueue.contains(this.player)) {
      this.player.stop();
      this.dialog.showMessage(PLEASE_WAIT, () => {});
    }
  });

  // Queuers onto the chair
  this.physics.overlap(this.queuers, this.visitorChairSensor, (sensor, q) => {
    this.marinaQueue.remove(q);
    this.sit(q);
  });

  // Player onto the chair
  this.physics.overlap(this.player, this.visitorChairSensor, (player, sensor) => {
    this.marinaQueue.remove(this.player);
    this.sit(this.player);
  });

  this.physics.collide(this.player, this.atriumRightWallGroup, (player, wall) => {
    this.player.stop();
    this.dialog.showMessage(LEAVE_MARINA_AREA, () => {});
  });
}