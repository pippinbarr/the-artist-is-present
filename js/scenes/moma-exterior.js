function addMOMAExterior(x, y) {
  // BG
  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "moma-exterior/moma-exterior-bg.png"
    )
    .setScale(4);

  // FG
  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "moma-exterior/moma-exterior-fg.png"
    )
    .setScale(4)
    .setDepth(10000);

  // Doors
  this.LEFT_DOOR_X = x + this.game.canvas.width / 2 - 10 * 4;
  this.RIGHT_DOOR_X = x + this.game.canvas.width / 2 + 10 * 4;
  this.DOOR_Y = y + this.game.canvas.height / 2 - 2.5 * 4;
  this.DOOR_OPEN_AMOUNT = 15 * 4;

  this.doorsOpen = false;
  this.leftDoor = this.physics.add
    .sprite(
      this.LEFT_DOOR_X,
      this.DOOR_Y,
      "atlas",
      "moma-exterior/moma-door-left.png"
    )
    .setScale(4, 4)
    .setDepth(-10)
    .setPushable(false)
  this.rightDoor = this.physics.add
    .sprite(
      this.RIGHT_DOOR_X,
      this.DOOR_Y,
      "atlas",
      "moma-exterior/moma-door-right.png"
    )
    .setScale(4, 4)
    .setDepth(-10)
    .setPushable(false)

  this.doors = this.physics.add.group();
  this.doors.add(this.leftDoor);
  this.doors.add(this.rightDoor);

  this.sensor = this.physics.add
    .sprite(x + this.game.canvas.width / 2, y + 50 * 4, "atlas", "red-pixel.png")
    .setScale(40 * 4, 60 * 4);
  this.sensor.visible = false;
  this.sensor.activated = false;
  // Building colliders
  // Either side of the door
  createColliderRect(this, x + 54 * 4, y + 0 * 4, 26 * 4, 65 * 4, this.colliders);
  createColliderRect(this, x + 120 * 4, y + 0 * 4, 26 * 4, 65 * 4, this.colliders);
  // Outside walls
  createColliderRect(this, x + 0 * 4, y + 0 * 4, 32 * 4, 85 * 4, this.colliders);
  createColliderRect(this, x + 168 * 4, y + 0 * 4, 32 * 4, 85 * 4, this.colliders);
  // Diagonal walls
  createColliderLine(
    this,
    x + 32 * 4,
    y + 84 * 4,
    20 * 4,
    20 * 4,
    5,
    -5,
    this.colliders
  );
  createColliderLine(
    this,
    x + 147 * 4,
    y + 64 * 4,
    20 * 4,
    20 * 4,
    5,
    5,
    this.colliders
  );
  // Bottom wall
  createColliderRect(this, x + 0 * 4, y + 98 * 4, 200 * 4, 200 * 4, this.colliders);

  const sceneData = {
    name: "moma-exterior",
    x: 0,
    y: 1,
    transitions: {
      up: {
        to: "ticket-hall",
        x: x + 100 * 4,
        y: y + 32 * 4,
        camOffset: {
          x: 0,
          y: -1
        }
      }
    }
  };
  this.addScene(sceneData);

  this.light = this.add.graphics(x + 0, y + 0);
  this.light.fillStyle(0x000000, 1.0);
  this.light.fillRect(x + 0, y + 0, this.game.canvas.width, this.game.canvas.height);
  this.light.depth = 1000000;

  this.exitBarriers = this.physics.add.group();
  let leftExitBarrier = this.physics.add.sprite(x, y + 368, `atlas`, `red-pixel.png`)
    .setScale(10, 58)
    .setPushable(false);
  let rightExitBarrier = this.physics.add.sprite(x + 798, y + 368, `atlas`, `red-pixel.png`)
    .setScale(10, 58)
    .setPushable(false);
  this.exitBarriers.add(leftExitBarrier);
  this.exitBarriers.add(rightExitBarrier);
  this.exitBarriers.setVisible(false);

  let fakeEntranceQueuers = 10;
  let fakeEntranceQueueInterval = setInterval(() => {
    let queuer = new Queuer(this, x - 100, y + 300, [...this.fromOutsideCheckpoints]);
    this.queuers.add(queuer);
    queuer.start();
    fakeEntranceQueuers--;
    if (fakeEntranceQueuers === 0) {
      clearInterval(fakeEntranceQueueInterval);
    }
  }, 1000);
}

function updateMOMAExterior() {
  if (this.currentScene.name === `moma-exterior`) {
    handleLeaving
      .bind(this)();
  }

  setLight
    .bind(this)();
  handleSensor
    .bind(this)();

}

function setLight() {
  let nyc = getNYCTime();
  let hour = nyc.getHours();
  let alpha = 0;
  if (hour > 7 && hour < 17) {
    alpha = 0;
  } else if (hour <= 4 || hour >= 23) {
    alpha = 0.8;
  } else if (hour <= 7) {
    alpha = (8 - hour) * 0.2;
  } else if (hour >= 17) {
    alpha = (hour + 2 - 17) * 0.1;
  }
  this.light.alpha = alpha;
}

function handleLeaving() {
  this.physics.collide(this.player, this.exitBarriers, (player, exit) => {
    if (museumIsOpen()) {
      this.player.stop();
      this.dialog.showMessage(LEAVING_MOMA_ON_FOOT_MESSAGE, () => {});
      return true;
    }
  });
}

function handleSensor() {
  // No sensor if the museum is closed right now
  if (!museumIsOpen()) {
    this.physics.collide(this.player, this.doors, (player, door) => {
      this.player.stop();
      this.dialog.showMessage(MOMA_CLOSED_MESSAGE, () => {});
    });
    return;
  }

  if (this.physics.overlap(this.sensor, this.player) || this.physics.overlap(this.sensor, this.queuers)) {
    if (!this.sensor.activated) {
      this.sensor.activated = true;
      const leftDoorTween = this.tweens.add({
        targets: this.leftDoor,
        x: this.LEFT_DOOR_X - this.DOOR_OPEN_AMOUNT,
        duration: 750,
        repeat: 0,
        onComplete: () => {}
      });
      const rightDoorTween = this.tweens.add({
        targets: this.rightDoor,
        x: this.RIGHT_DOOR_X + this.DOOR_OPEN_AMOUNT,
        duration: 750,
        repeat: 0,
        onComplete: () => {
          this.doorsOpen = true;
        }
      });
    }
  } else if (this.sensor.activated && this.doorsOpen) {
    this.sensor.activated = false;
    const leftDoorTween = this.tweens.add({
      targets: this.leftDoor,
      x: this.LEFT_DOOR_X,
      duration: 750,
      repeat: 0,
      onComplete: () => {}
    });
    const rightDoorTween = this.tweens.add({
      targets: this.rightDoor,
      x: this.RIGHT_DOOR_X,
      duration: 750,
      repeat: 0,
      onComplete: () => {
        this.doorsOpen = false;
      }
    });
  }
}