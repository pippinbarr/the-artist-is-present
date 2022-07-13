class Queuer extends Visitor {

  constructor(scene, x, y, checkpoints) {
    super(scene, x, y);

    this.scene = scene;
    this.name = "Queuer";

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.intent = `stop`;
    this.paused = false;
    this.blocker = null;
    this.blockCount = 0;
    this.shovedCount = 0;

    this.checkpoints = checkpoints;

    // We start at the first checkpoint
    let start = this.checkpoints.shift();
    this.x = start.x;
    this.y = start.y - (this.height / 2) * this.scaleY + 2 * 4;

    setInterval(() => {
      this.shovedCount = 0;
    }, 2000);
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
        this.scene.marinaQueue.remove(this);
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
    if (this.paused) {
      return;
    }

    // Don't be blocked while already blocked
    if (this.blocker) {
      return;
    }

    this.blocker = blocker;
    this.blockCount = 0;

    // Stop movement (and animation???)
    super.stop();
    this.paused = true;

    // Wait a bit, then try to keep going on your way
    setTimeout(() => {
      this.tryToMove(callback);
    }, 250);
  }

  tryToMove(callback) {
    if (this.scene.dialog.visible) {
      // If there's a dialog visible it may be ours, but regardless we don't
      // want to move so wait and try again
      setTimeout(() => {
        this.tryToMove(callback);
      }, 250);
      return;
    }

    // Check if we still overlap our blocker
    if (this.blocker && this.scene.physics.overlap(this.sensor, this.blocker.sensor)) {
      this.blockCount++;
      // Check if it's the player and we've been waiting too damn long
      if (this.blocker === this.scene.player && this.blockCount % 20 === 0) {
        if (this.scene.marinaQueue.contains(this.scene.player)) {
          // We've been waiting for the player in the queue
          // Check if they should have moved up (no overlap with next in queue)
          // console.log(`Waiting on the player. Who is waiting for ${this.scene.player.nextInQueue ? this.scene.player.nextInQueue.id : 'nobody'}.`);
          if (this.scene.player.nextInQueue && !this.scene.physics.overlap(this.scene.player.sensor, this.scene.player.nextInQueue.sensor)) {
            this.scene.player.obstructions++; // The player has been a dick in the queue
            // console.log("Obstructed in the queue.")
            if (this.scene.player.obstructions >= 3 && !this.scene.player.isNext) {
              this.scene.marinaQueue.remove(this.scene.player);
              this.scene.player.nextInQueue = null;
              this.scene.player.y += 50;
              this.scene.player.obstructions = 0;
              this.scene.player.debugText.text = NO_Q_SYMBOL;
              this.scene.dialog.showMessage(SLOW_QUEUEING_MESSAGE);
            }
          } else if (this.scene.player.nextInQueue) {
            // Reset the counter since they did move up
            this.scene.player.obstructions = 0;
            // console.log("Resetting obstructions because they are queueing right.")
          }
        } else if (this.scene.currentScene.name !== `moma-exterior`) {
          // If it's not the marina queue and we're in the museum then security
          // will handle it if the player takes too long
          this.scene.dialog.showMessage(EXCUSE_ME_MESSAGE);
          this.scene.player.obstructions++; // The player has been a dick in the museum
          if (this.scene.player.obstructions >= 5) {
            this.scene.ejectPlayer(OBSTRUCTION_MESSAGE);
          }
        } else {
          // Otherwise we're outside and a bit helpless.
          this.scene.dialog.showMessage(EXCUSE_ME_MESSAGE);
        }
      }
      setTimeout(() => {
        this.tryToMove(callback);
      }, 250);
    } else {
      // If not then we can resume moving
      this.paused = false;
      this.blocker = null;
      this.blockCount = 0;
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
    let dx = this.body.x - checkpoint.body.x;
    let dy = this.body.y - checkpoint.body.y;

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