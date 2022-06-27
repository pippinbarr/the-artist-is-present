function addMOMAExterior(x, y) {
  // BG
  console.log(this);
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
    .setDepth(-10);
  this.rightDoor = this.physics.add
    .sprite(
      this.RIGHT_DOOR_X,
      this.DOOR_Y,
      "atlas",
      "moma-exterior/moma-door-right.png"
    )
    .setScale(4, 4)
    .setDepth(-10);
  this.leftDoor.body.immovable = true;
  this.rightDoor.body.immovable = true;
  this.colliders.add(this.leftDoor);
  this.colliders.add(this.rightDoor);
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
  createColliderRect(this, x + 0 * 4, y + 98 * 4, 200 * 4, 2 * 4, this.colliders);

  const transitionData = [{
    key: "tickets",
    type: "up",
    x: x + 100 * 4,
    y: y + 32 * 4
  }];

  // WILL NEED TO THINK ABOUT THIS
  this.addTransitions(transitionData);

  this.light = this.add.graphics(x + 0, y + 0);
  this.light.fillStyle(0x000000, 1.0);
  this.light.fillRect(x + 0, y + 0, this.game.canvas.width, this.game.canvas.height);
  this.light.depth = 1000000;

  // this.handleEntrances();
}

function updateMOMAExterior() {
  setLight
    .bind(this)();
  handleWrap
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

function handleWrap() {
  if (this.player.x < 0 - this.player.body.width) {
    this.dialog.showMessage(LEAVING_MOMA_ON_FOOT_MESSAGE, () => {
      this.player.x = this.game.canvas.width + this.player.body.width;
    });
  } else if (this.player.x > this.game.canvas.width + this.player.body.width) {
    this.dialog.showMessage(LEAVING_MOMA_ON_FOOT_MESSAGE, () => {
      this.player.x = 0 - this.player.body.width;
    });
  }
}

function handleSensor() {
  if (this.physics.overlap(this.sensor, this.player)) {
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