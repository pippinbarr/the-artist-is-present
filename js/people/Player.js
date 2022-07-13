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

    scene.input.keyboard.on('keydown', () => {
      this.handleInput();
    });

    if (TOUCH) {
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

    let left = false;
    let right = false;
    let up = false;
    let down = false;

    left = Phaser.Input.Keyboard.JustDown(this.cursors.left);
    right = Phaser.Input.Keyboard.JustDown(this.cursors.right);
    up = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    down = Phaser.Input.Keyboard.JustDown(this.cursors.down);

    if (left) {
      if (this.body.velocity.x < 0) {
        this.stop();
      } else {
        this.left();
      }
    }
    if (right) {
      if (this.body.velocity.x > 0) {
        this.stop();
      } else {
        this.right();
      }
    }
    if (up) {
      if (this.body.velocity.y < 0) {
        this.stop();
      } else {
        this.up();
      }
    }
    if (down) {
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

    console.log(pointer.worldX, pointer.worldY, this.body.center.x, this.body.center.y)

    let dx = pointer.worldX - this.body.center.x;
    let dy = pointer.worldY - this.body.center.y;

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