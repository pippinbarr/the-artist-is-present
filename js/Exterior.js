class Exterior extends TAIPScene {
  constructor(config) {
    super({
      key: 'exterior'
    });
  }

  create() {
    console.log("Exterior.create()");

    super.create();

    // BG
    this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'exterior/exterior-bg.png').setScale(4);

    // FG
    let fg = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'exterior/exterior-fg.png').setScale(4);
    fg.depth = 50 * 4;

    // Main wall colliders
    createColliderRect(this, 0 * 4, 66 * 4, 28 * 4, 1 * 4, this.colliders);
    createColliderRect(this, 61 * 4, 66 * 4, 140 * 4, 1 * 4, this.colliders);
    createColliderRect(this, 29 * 4, 0 * 4, 4 * 4, 59 * 4, this.colliders);
    createColliderRect(this, 56 * 4, 0 * 4, 4 * 4, 59 * 4, this.colliders);
    createColliderRect(this, 28 * 4, 59 * 4, 1 * 4, 4 * 4, this.colliders);
    createColliderRect(this, 60 * 4, 59 * 4, 1 * 4, 4 * 4, this.colliders);
    createColliderRect(this, 0 * 4, 99 * 4, 200 * 4, 2 * 4, this.colliders);

    // Box thing
    this.boxThing = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'exterior/exterior-box.png').setScale(4);
    this.boxThing.body.setOffset(70, 43);
    this.boxThing.body.setSize(19, 28, false);
    this.boxThing.body.immovable = true;
    this.colliders.add(this.boxThing);

    // Hydrant
    this.hydrant = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'exterior/exterior-hydrant.png').setScale(4);
    this.hydrant.body.setOffset(8, 81);
    this.hydrant.body.setSize(9, 4, false);
    this.hydrant.body.immovable = true;
    this.hydrant.depth = 81 * 4;
    this.colliders.add(this.hydrant);

    // Cone
    this.cone = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'exterior/exterior-cone.png').setScale(4);
    this.cone.body.setOffset(157, 80);
    this.cone.body.setSize(9, 3, false);
    this.cone.body.immovable = true;
    this.cone.depth = 80 * 4;
    this.colliders.add(this.cone);

    // Car
    this.car = this.physics.add.sprite(140 * 4, 60 * 4, 'atlas', 'exterior/car.png').setScale(4);
    this.car.body.setOffset(28, 75);
    this.car.body.setSize(102, 20, false);
    this.car.body.immovable = true;
    this.car.depth = 10000 * 4;
    // this.car.setVisible(false);
    this.colliders.add(this.car);

    this.carSensor = this.physics.add.sprite(105 * 4, 85 * 4, 'atlas', 'red-pixel.png')
      .setScale(20, 20).setVisible(false).setDepth(100000);

    let transitionData = [{
      key: 'dining',
      type: 'up',
      x: 46 * 4,
      y: 6 * 4,
    }];
    this.addTransitions(transitionData);

    this.handleEntrances();

    setTimeout(() => {
      console.log("Car message timout")
      if (!seenCarWaiting) {
        this.dialog.showMessage(CAR_WAITING_MESSAGE);
        seenCarWaiting = true;
      }
      else {
        this.dialog.showMessage(CAR_STILL_WAITING_MESSAGE);
      }
    }, 1000);
  }

  update(time, delta) {
    super.update(time, delta);

    this.handleWrap();

    this.marina.update(time, delta);
    this.physics.collide(this.marina, this.colliders, () => {
      this.marina.stop();
    });
    this.marina.depth = this.marina.body.y;
    this.physics.overlap(this.marina, this.carSensor, () => {
      if (!this.marina.visible) return;
      this.marina.inputEnabled = false;
      this.marina.faceRight();
      this.marina.x = this.carSensor.x - 4 * 2;
      const marinaTweener = this.tweens.add({
        targets: this.marina,
        y: this.marina.y + 200,
        duration: 1000,
        repeat: 0,
        onComplete: () => {
          this.marina.visible = false;
          setTimeout(() => {
            const carTween = this.tweens.add({
              targets: this.car,
              x: this.game.canvas.width * 2,
              duration: 5000,
              repeat: 0,
              onComplete: () => {
                this.scene.start('car');
              }
            });
          }, 2000);
        }
      });

    });
  }

  handleWrap() {
    if (this.marina.x < 0 - this.marina.body.width) {
      this.dialog.showMessage(LEAVING_APARTMENT_ON_FOOT_MESSAGE, () => {
        this.marina.x = this.game.canvas.width + this.marina.body.width;
      });
    }
    else if (this.marina.x > this.game.canvas.width + this.marina.body.width) {
      this.dialog.showMessage(LEAVING_APARTMENT_ON_FOOT_MESSAGE, () => {
        this.marina.x = 0 - this.marina.body.width;
      });
    }
  }
}