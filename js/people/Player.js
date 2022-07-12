class Player extends Visitor {

  constructor(scene, x, y) {
    super(scene, x, y);
    this.name = "player";
    this.inputEnabled = true;
    this.hasTicket = false;
    this.obstructions = 0; // How many times has the player just stood in the way of an NPC?
    this.suffix = `-${this.id}`;
    this.nextInQueue = null; // Who is the player waiting behind?
    this.previousInQueue = null;
    this.speed = 100; // 100
    this.setImmovable(false);
  }

  joinScene(scene) {
    scene.add.existing(this);
    // scene.physics.add.existing(this);

    this.cursors = scene.input.keyboard.createCursorKeys();

    if (!MOBILE) {
      scene.input.keyboard.on('keydown', () => {
        this.handleInput();
      });
    } else {
      scene.input.on('pointerdown', (pointer) => {
        this.handleTouchInput(pointer)
      });
    }
  }

  create() {
    super.create();
  }

  update() {
    super.update();
  }

  handleInput(e) {
    if (!this.inputEnabled || this.sitting) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      if (this.body.velocity.x < 0) {
        this.stop();
      } else {
        this.left();
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      if (this.body.velocity.x > 0) {
        this.stop();
      } else {
        this.right();
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      if (this.body.velocity.y < 0) {
        this.stop();
      } else {
        this.up();
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      if (this.body.velocity.y > 0) {
        this.stop();
      } else {
        this.down();
      }
    }
  }

  pause() {
    this.inputEnabled = false;
    this.pVelocity = {
      x: this.body.velocity.x,
      y: this.body.velocity.y
    };
    this.setVelocity(0, 0);
    this.active = false;
  }

  handleTouchInput(pointer) {
    if (!this.inputEnabled || this.sitting) return;

    let dx = pointer.x - this.x;
    let dy = pointer.y - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        if (this.body.velocity.x < 0) {
          this.stop();
        } else {
          this.left();
        }
      }
      if (dx > 0) {
        if (this.body.velocity.x > 0) {
          this.stop();
        } else {
          this.right();
        }
      }
    } else {
      if (dy < 0) {
        if (this.body.velocity.y < 0) {
          this.stop();
        } else {
          this.up();
        }
      }
      if (dy > 0) {
        if (this.body.velocity.y > 0) {
          this.stop();
        } else {
          this.down();
        }
      }
    }
  }

  pause() {
    this.inputEnabled = false;
    this.pVelocity = {
      x: this.body.velocity.x,
      y: this.body.velocity.y
    };
    this.setVelocity(0, 0);
    this.active = false;
  }

  unpause() {
    this.inputEnabled = true;
    this.setVelocity(this.pVelocity.x, this.pVelocity.y);
    this.active = true;
  }
}