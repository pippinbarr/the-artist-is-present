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

    // Car
    this.car = this.physics.add.sprite(-100 * 4, 70 * 4, 'atlas', 'exterior/car.png').setScale(4);
    this.car.body.setOffset(28, 75);
    this.car.body.setSize(102, 20, false);
    this.car.body.immovable = true;
    this.car.depth = 10000 * 4;
    this.colliders.add(this.car);


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
      },
      {
        key: "car",
        type: "down",
        x: 80 * 4,
        y: 77 * 4,
        stop: true,
        inactive: true
      }
    ];
    this.addTransitions(transitionData);

    this.handleEntrances();

  }

  update(time, delta) {
    super.update(time, delta);

    this.marina.update(time, delta);
    this.physics.collide(this.marina, this.colliders, () => {
      this.marina.stop();
    });
    this.handleWrap();
    this.handleSensor();
    this.marina.depth = this.marina.body.y;
  }

  handleWrap() {
    if (this.marina.x < 0 - this.marina.body.width) {
      this.dialog.showMessage(LEAVING_MOMA_ON_FOOT_MESSAGE, () => {
        this.marina.x = this.game.canvas.width + this.marina.body.width;
      });
    }
    else if (this.marina.x > this.game.canvas.width + this.marina.body.width) {
      this.dialog.showMessage(LEAVING_MOMA_ON_FOOT_MESSAGE, () => {
        this.marina.x = 0 - this.marina.body.width;
      });
    }
  }

  handleSensor() {
    if (this.physics.overlap(this.sensor, this.marina)) {
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
    }
    else if (this.sensor.activated && this.doorsOpen) {
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
      setTimeout(() => {
        this.dialog.y = UPPER_DIALOG_Y;
        this.dialog.showMessage(OUTSIDE_MOMA_MESSAGE, () => {});
      }, 1000);
    }
    else if (last.scene === 'car') {
      this.marina.visible = false;
      this.inputEnabled = false;
      const carTween = this.tweens.add({
        targets: this.car,
        x: 140 * 4,
        duration: 5000,
        repeat: 0,
        onComplete: () => {
          setTimeout(() => {
            this.marina.visible = true;
            this.marina.x = 100 * 4;
            this.marina.y = 100 * 4;
            this.marina.faceRight();
            const marinaTweener = this.tweens.add({
              targets: this.marina,
              y: 77 * 4,
              duration: 750,
              repeat: 0,
              onComplete: () => {
                this.marina.faceUp();
                this.marina.inputEnabled = true;
                this.dialog.y = UPPER_DIALOG_Y;
                this.dialog.showMessage(MOMA_ARRIVAL_MESSAGE, () => {});
              }
            });
          }, 3000);
        }
      });
    }
  }
}