class Queuer extends Visitor {

  constructor(scene, x, y, checkpoints) {
    super(scene, x, y);

    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.intent = `stop`;
    this.paused = false;

    this.checkpoints = checkpoints;

    // We start at the first checkpoint
    let start = this.checkpoints.shift();
    this.x = start.x;
    this.y = start.y - (this.height / 2) * this.scaleY + 2 * 4;

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
      this.moveTo(this.checkpoint);
    }
  }

  pause(delay = 500, callback) {
    // Don't pause while paused, y'know?
    if (this.paused) return;

    // Stop movement (and animation???)
    super.stop();
    this.paused = true;

    // Wait a bit, then try to keep going on your way
    setTimeout(() => {
      this.paused = false;
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
    }, delay);
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