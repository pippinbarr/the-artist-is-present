// Queue stuff
let QUEUE = [];
const QUEUE_LENGTH = 30;
const QUEUE_X = 440;
const QUEUE_Y = 239;
const QUEUE_SPACING = 56;

const MARINA_HEAD_DELAY = 3000;

// const TRANSITION_OFFSET = 7 * 4;

class World extends Phaser.Scene {

  constructor(config) {
    super({
      key: `world`
    });
  }

  create() {
    // Camera
    this.cameras.main.setBackgroundColor("#5F6061");
    // this.cameras.main.setBounds(0, 0, this.game.canvas.width * 6, this.game.canvas.height * 3);
    this.cameras.main.removeBounds();

    // Dialog
    this.dialog = new Dialog(this);

    // Collisions
    this.colliders = this.physics.add.group();

    // Sensors
    this.queuerSensors = this.physics.add.group();

    // Transitions
    this.marks = this.add.group();

    // Visitors (not including the player)
    this.queuers = this.physics.add.group();

    // Who is sitting with Marina? Nobody at the start...
    this.sitter = null;

    this.createCheckpoints();

    this.createScenes();

    this.currentScene = this.scenes[`moma-exterior`];

    // Player
    this.player = new Player(this, 350 + this.currentScene.x * this.game.canvas.width, 270 + this.currentScene.y * this.game.canvas.height);
    this.player.joinScene(this);

    // Point the camera at the current scene
    this.cameras.main.setScroll(this.currentScene.x * this.game.canvas.width, this.currentScene.y * this.game.canvas.height);


    this.marinaFace = this.add.sprite(this.scenes[`atrium`].x * this.game.canvas.width + this.game.canvas.width / 2, this.scenes[`atrium`].y * this.game.canvas.height + this.game.canvas.height / 2, `marina-face`)
      .setScale(4)
      .setDepth(10000001)
      .setVisible(false);
    this.BLINK_MINIMUM = 5;
    this.BLINK_VARIANCE = 5;
    this.marinaBlink();

    // Set up the intro message
    let introMessage = [...INTRO_MESSAGE];
    let now = getNYCTime();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let nowString = `${hour <= 12 ? hour : hour - 12}:${minutes.toString().padStart(2, `0`)}${hour > 11 ? "pm" : "am"}`
    introMessage.push(`It's ${nowString}.`);
    setTimeout(() => {
      this.dialog.showMessage(introMessage);
    }, 1000);
  }

  marinaBlink() {
    this.marinaFace.anims.play(`marina-blink`);
    let nextBlinkDelay = 1000 * Math.random() * this.BLINK_VARIANCE + this.BLINK_MINIMUM;
    setTimeout(() => {
      this.marinaBlink();
    }, nextBlinkDelay)
  }

  createCheckpoints() {
    // Queue checkpoints that all queuers who start outside walk along
    this.fromOutsideCheckpointData = [
      new Phaser.Geom.Point(-100, 400 + 350), // Start (should be -100?)
      new Phaser.Geom.Point(400, 400 + 350), // To door X
      new Phaser.Geom.Point(400, 260), // Through doors to ticket barrier
      new Phaser.Geom.Point(50, 260), // To left of ticket barrier
      new Phaser.Geom.Point(50, 205), // Up to wall
      new Phaser.Geom.Point(560, 205), // Across and past the window
      new Phaser.Geom.Point(560, 300), // Down to the door level
      new Phaser.Geom.Point(560 + 600, 300), // Through the door into the first hall
      new Phaser.Geom.Point(560 + 600, 229), // Up to the queue level
      new Phaser.Geom.Point(560 + 600 + 800 * 5, 229), // Off the screen (the queue barrier will sort them out)
    ];

    // Queue checkpoints that all queuers who start inside walk along
    this.prequeueCheckpointData = [
      new Phaser.Geom.Point(560 + 600, QUEUE_Y), // Up to the queue level
      new Phaser.Geom.Point(560 + 600 + 800 * 5, QUEUE_Y), // Off the screen (the queue barrier will sort them out)
    ];

    // Add visuals of the checkpoints
    this.checkpointsGroup = this.physics.add.group();

    this.fromOutsideCheckpoints = [];
    this.fromOutsideCheckpointData.forEach((coordinate) => {
      let checkpoint = this.checkpointsGroup.create(coordinate.x, coordinate.y, 'atlas', 'red-pixel.png')
        .setScale(8)
        .setDepth(100000)
        .setAlpha(0.5)
        .setVisible(DEBUG)
      this.fromOutsideCheckpoints.push(checkpoint);
    });

    this.prequeueCheckpoints = [];
    this.prequeueCheckpointData.forEach((coordinate) => {
      let checkpoint = this.checkpointsGroup.create(coordinate.x, coordinate.y, 'atlas', 'red-pixel.png')
        .setScale(8)
        .setDepth(100000)
        .setAlpha(0.5)
        .setVisible(DEBUG)
      this.prequeueCheckpoints.push(checkpoint);
    });
  }

  createScenes() {
    // Scenes
    this.scenes = {};

    // Scenes
    addMOMAExterior
      .bind(this, 0, this.game.canvas.height)();
    addTicketHall
      .bind(this, 0, 0)();
    addHallway1
      .bind(this, this.game.canvas.width, 0)();
    addHallway2
      .bind(this, this.game.canvas.width * 2, 0)();
    addHallway3
      .bind(this, this.game.canvas.width * 3, 0)();
    addAtrium
      .bind(this, this.game.canvas.width * 4, 0)();
  }

  update() {
    super.update();

    // Standard updates
    this.player.update();
    this.queuers.children.each(q => q.update());

    // Player stops on collision
    this.physics.collide(this.player, this.colliders, () => this.player.stop());

    this.handleQueuerPlayerCollisions();

    this.handleQueuerCollisions();

    this.handleQueueLeaving();

    // Just that they do collide (I think this can't actually happen because
    // of the sensor-based overlap)
    this.physics.collide(this.queuers, this.queuers);

    // This one stops them walking through anything solid, though if the simulation
    // is working they shouldn't actually try
    this.physics.collide(this.queuers, this.colliders, null, (q, c) => {
      q.pause();
      return true;
    });

    this.setDepths();

    this.updateScenes();

    this.handleClosing();

    this.checkExits();
  }

  handleClosing() {
    // Only worry about closing stuff if the player's in the museum
    if (this.currentScene.name !== `moma-exterior`) {
      if (museumClosingInFifteenMinutes()) {
        if (!this.seenFifteenMinuteWarning) {
          this.seenFifteenMinuteWarning = true;
          this.dialog.showMessage(MUSEUM_CLOSING);
        }
      } else if (!museumIsOpen()) {
        // The museum has closed with the player inside it
        this.ejectPlayer(MUSEUM_CLOSED);
      }
    }
  }

  handleQueueLeaving() {
    if (this.marinaQueue.contains(this.player)) {
      if (this.player.body.y > QUEUE_Y + 2 * this.player.body.height ||
        this.player.body.y < QUEUE_Y - 2 * this.player.body.height) {
        this.marinaQueue.remove(this.player);
      }
    }
  }

  handleQueuerPlayerCollisions() {
    // When queuers and player collide we handle basic stopping/pausing
    // as well as queueing changes
    this.physics.collide(this.queuers, this.player, null, (p, q) => {
      q.pause(this.player);
      p.stop();

      // Handle shoving by player (we can rely on it being the player who shoved
      // because the other queuers use their sensors to stop colliding)
      q.shovedCount++;
      if (q.shovedCount > 5) {
        this.ejectPlayer(SHOVING_MESSAGE);
        return;
      }

      if (!this.player.hasTicket && !this.ticketQueue.contains(this.player) && this.ticketQueue.contains(q)) {
        // We bumped into someone who is in the queue, so we're in the queue
        // We only join the queue if the player is to the left of the person
        let dx = this.player.body.x - q.body.x;
        let dy = this.player.body.y - q.body.y;
        if (dx < 0 && Math.abs(dy) < this.player.body.height) {
          this.ticketQueue.add(this.player);
          this.dialog.showMessage(JOIN_TICKET_QUEUE_MESSAGE, () => {})
          this.player.debugText.text = TICKET_Q_SYMBOL;
        }
      } else if (!this.marinaQueue.contains(this.player) && this.marinaQueue.contains(q)) {
        // We only join the queue if the player is to the left of the person
        let dx = this.player.body.x - q.body.x;
        let dy = this.player.body.y - q.body.y;
        if (dx < 0 && Math.abs(dy) < this.player.body.height) {
          this.marinaQueue.add(this.player);
          this.player.nextInQueue = q;
          this.dialog.showMessage(JOIN_MARINA_QUEUE_MESSAGE, () => {})
          this.player.debugText.text = MARINA_Q_SYMBOL;
        }
      }
      // return true;
    });
  }

  handleQueuerCollisions() {
    // Handle queuers getting close to each other
    // (pause the one "behind" or initiating the collision)
    this.physics.overlap(this.queuerSensors, this.queuerSensors, (q1s, q2s) => {
      let q1 = q1s.parent;
      let q2 = q2s.parent;

      // Don't handle this if it's the player...???
      if (q1 === this.player || q2 === this.player) return;

      let dirQ1 = new Phaser.Math.Vector2(q1.body.velocity.x, q1.body.velocity.y);
      dirQ1.normalize();
      let dirQ2 = new Phaser.Math.Vector2(q2.body.velocity.x, q2.body.velocity.y);
      dirQ2.normalize();

      // Check if we're the one walking into the other person
      // and if so consider them as blocking us
      let bumped = false;
      if (dirQ1.x > 0 && q1.x < q2.x) {
        bumped = true;
      } else if (dirQ1.x < 0 && q1.x > q2.x) {
        bumped = true;
      } else if (dirQ1.y > 0 && q1.y < q2.y) {
        bumped = true;
      } else if (dirQ1.y < 0 && q1.y > q2.y) {
        bumped = true;
      }

      if (bumped) {
        // q1 stops moving
        q1.pause(q2);
        // Handle the situation where this causes us to have joined a queue
        if (this.ticketQueue.contains(q2) && !this.ticketQueue.contains(q1)) {
          this.ticketQueue.add(q1);
          q1.debugText.text = TICKET_Q_SYMBOL;
          // We bumped into someone who is in the queue, so we're in the queue
        } else if (this.marinaQueue.contains(q2) && !this.marinaQueue.contains(q1)) {
          this.marinaQueue.add(q1);
          q1.debugText.text = MARINA_Q_SYMBOL;
          // We bumped into someone who is in the queue, so we're in the queue
        }
      }
    });
  }

  setDepths() {
    // Set depth
    if (!this.player.sitting) {
      // Cheap hack to not reset depth when sitting so you don't go behind the chair
      this.player.depth = this.player.body.y;
    }
    this.queuers.children.each((q) => {
      if (!q.sitting) {
        q.setDepth(q.body.y);
      }
    });
    this.guards.children.each((g) => {
      if (!g.sitting) {
        g.setDepth(g.body.y);
      }
    });
  }

  updateScenes() {
    updateMOMAExterior
      .bind(this)();
    updateTicketHall
      .bind(this)();
    updateHallway1
      .bind(this)();
    updateHallway2
      .bind(this)();
    updateHallway3
      .bind(this)();
    updateAtrium
      .bind(this)();
  }

  addScene(data) {
    this.scenes[data.name] = data;

    let keys = Object.keys(data.transitions);
    keys.forEach((key) => {
      this.marks.create(data.transitions[key].x, data.transitions[key].y, 'atlas', 'red-pixel.png')
        .setScale(4)
        .setDepth(100000);
    });

    this.marks.setVisible(DEBUG);
  }

  // NOTE TO SELF!!!
  // The way this currently works an exit keeps applying infinitely "above"
  // an up exit for example. Need to prevent it from triggering again.
  // And to do that I need a simple little "scene system" that tells me which
  // transitions are actually applicable right now. OKAY?
  checkExits() {
    let transitions = this.currentScene.transitions;
    let transition = undefined;

    if (transitions.left && this.player.x < transitions.left.x && this.player.body.velocity.x < 0) {
      transition = transitions.left;
    } else if (transitions.right && this.player.x > transitions.right.x && this.player.body.velocity.x > 0) {
      transition = transitions.right;
    } else if (transitions.up && this.player.y < transitions.up.y && this.player.body.velocity.y < 0) {
      transition = transitions.up;
    } else if (transitions.down && this.player.y > transitions.down.y && this.player.body.velocity.y > 0) {
      transition = transitions.down;
    }

    if (transition !== undefined) {
      let x = this.cameras.main.scrollX + this.game.canvas.width * transition.camOffset.x;
      let y = this.cameras.main.scrollY + this.game.canvas.height * transition.camOffset.y;
      this.cameras.main.setScroll(x, y);
      this.currentScene = this.scenes[transition.to];
      this.player.obstructions = 0;
    }
  }

  sit(sitter) {
    if (sitter.sitting || sitter.sat) {
      return;
    }

    sitter.sitting = true;
    sitter.sat = true;
    this.sitter = sitter;

    // Switch to sitting animation and fix positioning
    sitter.sit();
    sitter.x = 561 + this.scenes[`atrium`].x * this.game.canvas.width;
    sitter.y = 194 + this.scenes[`atrium`].y * this.game.canvas.height;
    sitter.setDepth(10000000);

    if (sitter !== this.player) {
      let sitTime = 1000 * SIT_TIMES[Math.floor(Math.random(0 * SIT_TIMES.length))];
      setTimeout(() => {
        this.marina.anims.play(`marina-looks-up`);
      }, MARINA_HEAD_DELAY);
      sitter.wait(sitTime, () => {
        this.sitter = null;
        sitter.y -= 30;
        sitter.stand();
        sitter.right();
        this.marina.anims.play(`marina-looks-down`);
        if (this.player.isNext && !this.player.seenInstructions) {
          this.dialog.showMessage(GUARD_INSTRUCTIONS, () => {
            // Now the player is allowed through
            this.player.seenInstructions = true
          });
        }
      });
    } else {
      setTimeout(() => {
        this.marina.anims.play(`marina-looks-up`);
        // Now show the marina face
        setTimeout(() => {
          this.marinaFace.setVisible(true);
        }, 3000);
      }, MARINA_HEAD_DELAY);
    }
  }

  /**
  personSay

  Causes the person to turn toward the player, displays the message
  in a dialog, and then has them turn back again.
  */
  personSay(person, message) {
    if (this.dialog.visible) return;
    if (person.revertTimer) {
      clearTimeout(person.revertTimer);
    }

    if (person.x - this.player.x > 10 * 4) {
      person.faceLeft();
    } else if (person.x - this.player.x < -10 * 4) {
      person.faceRight();
    } else if (this.player.y > person.y) {
      person.faceDown();
    } else {
      person.faceUp();
    }

    setTimeout(() => {
      this.dialog.y = -150;
      this.dialog.showMessage(message, () => {
        person.revertTimer = setTimeout(() => {
          if (person instanceof Guard) {
            person.faceLeft();
          } else {
            person.faceRight();
          }
        }, 1000);
      });
    }, 250 + Math.random() * 250);
  }

  ejectPlayer(message) {
    this.currentScene = this.scenes[`moma-exterior`];
    this.marinaFace.setVisible(false);
    this.ticketQueue.remove(this.player);
    this.marinaQueue.remove(this.player);
    this.player.debugText.text = NO_Q_SYMBOL;
    this.player.obstructions = 0;
    this.player.x = 140 + this.currentScene.x * this.game.canvas.width + this.game.canvas.width / 2;
    this.player.y = this.currentScene.y * this.game.canvas.height + 300;
    this.player.setVelocity(0, 0);
    this.player.faceDown();
    // Point the camera at the current scene
    this.cameras.main.setScroll(this.currentScene.x * this.game.canvas.width, this.currentScene.y * this.game.canvas.height);
    this.dialog.cancel();
    setTimeout(() => {
      this.dialog.showMessage(message);
    }, 1000);
  }

}