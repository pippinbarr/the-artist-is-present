class Queuer extends Visitor {

  constructor(scene, x, y, checkpoints) {
    super(scene, x, y);

    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.intent = `stop`;
    this.paused = false;
    this.blocker = null;

    this.checkpoints = checkpoints;

    // We start at the first checkpoint
    let start = this.checkpoints.shift();
    this.x = start.x;
    this.y = start.y - (this.height / 2) * this.scaleY + 2 * 4;

    // console.log(this.sensor.body.width, this.sensor.body.height);
  }

  start() {
    // Then we move to the next one
    this.checkpoint = this.checkpoints.shift();
    this.checkpoint.setTint(0xff000000);
    this.moveTo(this.checkpoint);
  }

  update() {
    super.update();

    if (this.scene.physics.overlap(this, this.checkpoint)) {
      this.checkpoint.setTint(0xFFFFFFFF);
      this.checkpoint = this.checkpoints.shift();

      if (this.checkpoint) {
        this.moveTo(this.checkpoint);
      } else {
        // There are no new checkpoints so we're at the head of the queue!
        this.tryToSit();
      }
    }
  }

  tryToSit() {
    this.stop();
    this.wait(3000, () => {
      if (this.scene.sitter) {
        // Someone is sitting so let's wait and try again
        this.tryToSit();
      } else {
        // We can sit!
        this.scene.sitter = this;
        // Move right and we'll sit using the sensor
        this.right();
      }
    });
  }

  wait(delay, callback) {
    if (this.paused) return;
    super.stop();
    this.paused = true;
    setTimeout(() => {
      this.tryToMove(callback);
    }, delay);
  }

  pause(blocker, callback) {
    // Don't pause while paused, y'know?
    if (this.paused) return;
    if (this.blocker) return;

    // if (blocker) {
    //   console.log(`${this.id} pausing, blocked by ${blocker.id}`);
    // }

    this.blocker = blocker;

    // Stop movement (and animation???)
    super.stop();
    this.paused = true;

    // Wait a bit, then try to keep going on your way
    setTimeout(() => {
      this.tryToMove(callback);
    }, 2500);
  }

  tryToMove(callback) {
    // Check if we still overlap our blocker
    if (this.blocker && this.scene.physics.overlap(this.sensor, this.blocker.sensor)) {
      // If yes, then try to move a little later
      setTimeout(() => {
        this.tryToMove(callback);
      }, 500);
    } else {
      // If not then we can resume moving
      this.paused = false;
      this.blocker = null;
      switch (this.intent) {
      case `up`:
        this.up();
        break;
      case `down`:
        this.down();
        break;
      case `left`:
        this.left();
        break;
      case `right`:
        this.right();
        break;
      case `stop`:
        stop();
        break;
      }
      if (callback) {
        callback();
      }
    }
  }

  moveTo(checkpoint) {
    let dx = this.body.x - checkpoint.x;
    let dy = this.body.y - checkpoint.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) this.right();
      else if (dx > 0) this.left();
    } else {
      if (dy > 0) this.up();
      else if (dy < 0) this.down();
    }
  }

  stop() {
    super.stop();
    this.intent = `stop`;
  }

  up() {
    super.up();
    this.intent = `up`;
  }

  down() {
    super.down();
    this.intent = `down`;
  }

  left() {
    super.left();
    this.intent = `left`;
  }

  right() {
    super.right();
    this.intent = `right`;
  }
}