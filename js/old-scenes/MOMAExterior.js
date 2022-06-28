class MOMAExterior extends TAIPScene {
  constructor(config) {
    super({
      key: "moma-exterior"
    });
  }

  create() {
    super.create();
    this.cameras.main.setBackgroundColor("#5F6061");

    // BG
    this.add
      .sprite(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "atlas",
        "moma-exterior/moma-exterior-bg.png"
      )
      .setScale(4);

    // FG
    this.add
      .sprite(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "atlas",
        "moma-exterior/moma-exterior-fg.png"
      )
      .setScale(4)
      .setDepth(10000);

    // Doors
    this.LEFT_DOOR_X = this.game.canvas.width / 2 - 10 * 4;
    this.RIGHT_DOOR_X = this.game.canvas.width / 2 + 10 * 4;
    this.DOOR_OPEN_AMOUNT = 15 * 4;

    this.doorsOpen = false;
    this.leftDoor = this.physics.add
      .sprite(
        this.LEFT_DOOR_X,
        this.game.canvas.height / 2 - 2.5 * 4,
        "atlas",
        "moma-exterior/moma-door-left.png"
      )
      .setScale(4, 4)
      .setDepth(-10);
    this.rightDoor = this.physics.add
      .sprite(
        this.RIGHT_DOOR_X,
        this.game.canvas.height / 2 - 2.5 * 4,
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
      .sprite(this.game.canvas.width / 2, 50 * 4, "atlas", "red-pixel.png")
      .setScale(40 * 4, 60 * 4);
    this.sensor.visible = false;
    this.sensor.activated = false;
    // Building colliders
    // Either side of the door
    createColliderRect(this, 54 * 4, 0 * 4, 26 * 4, 65 * 4, this.colliders);
    createColliderRect(this, 120 * 4, 0 * 4, 26 * 4, 65 * 4, this.colliders);
    // Outside walls
    createColliderRect(this, 0 * 4, 0 * 4, 32 * 4, 85 * 4, this.colliders);
    createColliderRect(this, 168 * 4, 0 * 4, 32 * 4, 85 * 4, this.colliders);
    // Diagonal walls
    createColliderLine(
      this,
      32 * 4,
      84 * 4,
      20 * 4,
      20 * 4,
      5,
      -5,
      this.colliders
    );
    createColliderLine(
      this,
      147 * 4,
      64 * 4,
      20 * 4,
      20 * 4,
      5,
      5,
      this.colliders
    );
    // Bottom wall
    createColliderRect(this, 0 * 4, 98 * 4, 200 * 4, 2 * 4, this.colliders);

    const transitionData = [{
      key: "tickets",
      type: "up",
      x: 100 * 4,
      y: 32 * 4
    }];
    this.addTransitions(transitionData);

    this.light = this.add.graphics(0, 0);
    this.light.fillStyle(0x000000, 1.0);
    this.light.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    this.light.depth = 1000000;

    this.handleEntrances();
  }

  update(time, delta) {
    super.update(time, delta);

    this.setLight();

    this.player.update(time, delta);
    this.physics.collide(this.player, this.colliders, () => {
      this.player.stop();
    });
    this.handleWrap();
    this.handleSensor();
    this.player.depth = this.player.body.y;
  }

  setLight() {
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

  handleWrap() {
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

  handleSensor() {
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

  handleEntrances() {
    super.handleEntrances();

    if (last.scene === "tickets") {
      this.leftDoor.x -= this.DOOR_OPEN_AMOUNT;
      this.rightDoor.x += this.DOOR_OPEN_AMOUNT;
      this.doorsOpen = true;
    } else if (last.scene === undefined) {
      this.player.x = 100 * 4;
      this.player.y = 75 * 4;
      this.player.up();
      this.player.stop();
      setTimeout(() => {
        let time = getNYCTime();
        let hour = time.getHours();
        let displayHour = '';
        let minute = (`` + time.getMinutes())
          .padStart(2, `0`);
        this.dialog.showMessages([
          MOMA_ARRIVAL_MESSAGE_1,
          MOMA_ARRIVAL_MESSAGE_2,
          `It's ${hour > 12 ? (hour - 12) : hour}:${minute}${hour >= 12 ? 'pm' : 'am'}.`
        ]);
      }, 1000);
    }
  }
}