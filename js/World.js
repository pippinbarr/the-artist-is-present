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
    TOUCH = this.sys.game.device.input.touch;

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
    console.log(TOUCH)
    let introMessage = [...INTRO_MESSAGE, TOUCH ? INPUT_MESSAGE.touch : INPUT_MESSAGE.keyboard];
    let now = getNYCTime();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let nowString = `${hour <= 12 ? hour : hour - 12}:${minutes.toString().padStart(2, `0`)}${hour > 11 ? "pm" : "am"}`
    introMessage.push(`It's ${nowString}.`);
    setTimeout(() => {
      if (!DEBUG) this.dialog.showMessage(introMessage);
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
      new Phaser.Geom.Point(560 + 600, 228.2), // Up to the queue level
      new Phaser.Geom.Point(560 + 600 + 800 * 5, 228.2), // Off the screen (the queue barrier will sort them out)
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
    // if (DEBUG) console.log(`super update.`)
    super.update();

    // Standard updates
    // if (DEBUG) console.log(`Update player.`)
    this.player.update();
    // if (DEBUG) console.log(`Update queuers`)
    this.queuers.children.each(q => q.update());
    // if (DEBUG) console.log(`Basic player collision`)
    // Player stops on collision
    this.physics.collide(this.player, this.colliders, () => this.player.stop());

    // if (DEBUG) console.log(`handleQueuerPlayerCollisions`);
    this.handleQueuerPlayerCollisions();
    // if (DEBUG) console.log(`handleQueuerCollisions`);
    this.handleQueuerCollisions();
    // if (DEBUG) console.log(`handleQueueLeaving`);
    this.handleQueueLeaving();

    // Just that they do collide (I think this can't actually happen because
    // of the sensor-based overlap)
    // if (DEBUG) console.log(`handle basic queuer Collisions (unreal?)`);
    this.physics.collide(this.queuers, this.queuers);

    // This one stops them walking through anything solid, though if the simulation
    // is working they shouldn't actually try
    // if (DEBUG) console.log(`handle Queuer Collider collisions`);
    this.physics.collide(this.queuers, this.colliders, null, (q, c) => {
      q.pause();
      return true;
    });

    // if (DEBUG) console.log(`setDepths`);
    this.setDepths();
    // if (DEBUG) console.log(`updateScenes`);
    this.updateScenes();
    // if (DEBUG) console.log(`handleClosing`);
    this.handleClosing();
    // if (DEBUG) console.log(`checkExits`);
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
    let leftQueue = false;

    if (this.marinaQueue.contains(this.player)) {
      if (this.player.nextInQueue) {
        // Leaving the queue vertically
        if (this.player.body.velocity.y !== 0 && (this.player.body.y > this.player.nextInQueue.body.y + this.player.body.height ||
            this.player.body.y < this.player.nextInQueue.body.y - this.player.body.height)) {
          //         console.log(`py: ${this.player.body.y}
          // ny: ${this.player.nextInQueue.body.y}
          // bh: ${this.player.body.height}`);
          leftQueue = true;
        }
      }
      // Was playing with ideas of the player leaving the queue when they're next, but screw it?
      else if (this.player.isNext) {
        if (this.player.body.x < this.marinaBarrier.x - this.player.body.width) {
          // Leaving the queue vertically when next if you're to the left of the barrier
          if (this.player.body.velocity.y !== 0 && (this.player.body.y <= this.guard1.body.y ||
              this.player.body.y >= this.guard2.body.y - 15)) {
            clearTimeout(this.sitFailTimer);
            leftQueue = true;
          }
          // Leaving the queue horizontally by walking away
          // while still to the left
          else if (this.player.body.velocity.x < 0 && this.marinaBarrier.body.x - this.player.body.x > 100) {
            clearTimeout(this.sitFailTimer);
            leftQueue = true;
          }
        }
      }
    }

    if (leftQueue) {
      this.marinaQueue.remove(this.player);
      this.player.nextInQueue = null;
      this.player.debugText.text = NO_Q_SYMBOL;
      this.dialog.showMessage(LEAVE_MARINA_QUEUE_MESSAGE);
    }
  }

  handleQueuerPlayerCollisions() {
    // When queuers and player collide we handle basic stopping/pausing
    // as well as queueing changes
    this.physics.collide(this.queuers, this.player, null, (p, q) => {
      console.log("Queuer and Player bumped.")

      let addToTicket = null;
      let addToMarina = null;

      let pvx = this.player.body.velocity.x;
      let pvy = this.player.body.velocity.y;
      let qvx = q.body.velocity.x;
      let qvy = q.body.velocity.y;
      let dx = this.player.body.x - q.body.x;
      let dy = this.player.body.y - q.body.y;

      // Handle shoving by player (we can rely on it being the player who shoved
      // because the other queuers use their sensors to stop colliding)
      q.shovedCount++;
      if (q.shovedCount > 5) {
        console.log("Ejected for pushing.")
        this.ejectPlayer(SHOVING_MESSAGE);
        return;
      }

      if (!this.player.hasTicket && !this.ticketQueue.contains(this.player) && this.ticketQueue.contains(q)) {
        // We bumped into someone who is in the queue, so we're in the queue
        // We only join the queue if the player is to the left of the person
        // and are moving to the right
        if (dx < 0 && pvx > 0) {
          console.log("Player will join TQ via queuer")
          addToTicket = this.player;
        }
      } else if (!this.marinaQueue.contains(this.player) && this.marinaQueue.contains(q)) {
        // We only join the queue if the player is to the left of the person
        // and is moving to the right
        if (dx < 0 && pvx > 0) {
          addToMarina = this.player;
          this.player.nextInQueue = q;
          console.log("Player will join MQ via queuer")
        }
        // A queuer joins the queue if they bump into the back of the player
        // while heading right
      } else if (this.marinaQueue.contains(this.player) && !this.marinaQueue.contains(q)) {
        if (dx > 0 && qvx > 0) {
          // In here we end up zeroing velocity!
          console.log("Qer will join MQ via player.")
          addToMarina = q;
        }
      }

      // A queuer should only bother about the player bumping them if they're
      // walking straight into them.
      //       console.log(`queuer vel: ${q.body.velocity.x}, ${q.body.velocity.y}
      // player vel: ${this.player.body.velocity.x}, ${this.player.body.velocity.y}`);
      // if (q.body.velocity.x > 0 && this.player.body.velocity.x < 0 ||
      //   q.body.velocity.x < 0 && this.player.body.velocity.x > 0 ||
      //   q.body.velocity.y > 0 && this.player.body.velocity.y < 0 ||
      //   q.body.velocity.y < 0 && this.player.body.velocity.y > 0) {
      //   console.log("Qer pausing because player rammed them.");
      //   q.pause(this.player);
      //   // Of if the queuer is walking directly into a stationary player
      // } else if ((q.body.velocity.x !== 0 || q.body.velocity.y !== 0) && this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      //   console.log("Qer pausing because they rammed stationary player")
      //   q.pause(this.player);
      // }
      // // Or if the player is directly in front of where the queuer is going
      //
      // if ((q.body.velocity.x > 0 && this.player.body.velocity.x <= 0) ||
      //   (q.body.velocity.x < 0 && this.player.body.velocity.x >= 0) ||
      //   (q.body.velocity.y > 0 && this.player.body.velocity.y <= 0) ||
      //   (q.body.velocity.y < 0 && this.player.body.velocity.y >= 0)) {
      //   q.pause(this.player);
      // }

      // When should a collision with the player stop a qer?

      // 1. If the player isn't moving and the qer is.
      // 2. If the player is moving in a direction directly opposite
      // 3. If they are both moving and the qer couldn't continue...
      //    - If the player is to the left and the qer is moving left etc.
      //    - But need to be cautious about this over-extending

      if (pvx === 0 && pvy === 0) {
        // 1. PLAYER ISN'T MOVING
        q.pause(this.player);
      } else if ((qvx > 0 && pvx < 0) ||
        (qvx < 0 && pvx > 0) ||
        (qvy > 0 && pvy < 0) ||
        (qvy < 0 && pvy > 0)) {
        // 2. DIRECTLY OPPOSED CONFRONTATION WHILE MOVING
        q.pause(this.player);
        this.player.stop();
        this.player.body.updateFromGameObject();
      } else if ((qvx > 0 && dx > 0) ||
        (qvx < 0 && dx < 0) ||
        (qvy > 0 && dy > 0) ||
        (qvy < 0 && dy < 0)) {
        // 3. PERPENDICULAR MOVEMENT COLLISION
        q.pause(this.player);
        // Player keeps going
      } else {
        this.player.stop();
        this.player.body.updateFromGameObject();
      }


      if (addToTicket) {
        this.ticketQueue.add(addToTicket);
        addToTicket.debugText.text = TICKET_Q_SYMBOL;
        if (addToTicket === this.player) {
          this.dialog.showMessage(JOIN_TICKET_QUEUE_MESSAGE, () => {})
        }
      }

      if (addToMarina) {
        this.marinaQueue.add(addToMarina);
        addToMarina.debugText.text = MARINA_Q_SYMBOL;
        if (addToMarina === this.player) {
          this.dialog.showMessage(JOIN_MARINA_QUEUE_MESSAGE)
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
          q1.y = q2.y;
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
    // if (DEBUG) console.log(`updateMOMAExterior`);
    updateMOMAExterior
      .bind(this)();
    // if (DEBUG) console.log(`updateTicketHall`);
    updateTicketHall
      .bind(this)();
    // if (DEBUG) console.log(`updateHallway1`);
    updateHallway1
      .bind(this)();
    // if (DEBUG) console.log(`updateHallway2`);
    updateHallway2
      .bind(this)();
    // if (DEBUG) console.log(`updateHallway3`);
    updateHallway3
      .bind(this)();
    // if (DEBUG) console.log(`updateAtrium`);
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
    // if (DEBUG) console.log(`checkExits: Finding transitions.`)
    let transitions = this.currentScene.transitions;
    let transition = undefined;

    // if (DEBUG) console.log(`checkExits: Comparing transitions.`)
    if (transitions.left && this.player.x < transitions.left.x && this.player.body.velocity.x < 0) {
      transition = transitions.left;
    } else if (transitions.right && this.player.x > transitions.right.x && this.player.body.velocity.x > 0) {
      transition = transitions.right;
    } else if (transitions.up && this.player.y < transitions.up.y && this.player.body.velocity.y < 0) {
      transition = transitions.up;
    } else if (transitions.down && this.player.y > transitions.down.y && this.player.body.velocity.y > 0) {
      transition = transitions.down;
    }

    // if (DEBUG) console.log(`checkExits: ${transition}`)
    if (transition !== undefined) {
      let x = this.cameras.main.scrollX + this.game.canvas.width * transition.camOffset.x;
      let y = this.cameras.main.scrollY + this.game.canvas.height * transition.camOffset.y;
      // if (DEBUG) console.log(`checkExits: ${transition.x}, ${transition.y}, ${transition.to}`)
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
      let sitTime = 60 * 1000 * SIT_TIMES[Math.floor(Math.random(0 * SIT_TIMES.length))];
      setTimeout(() => {
        this.marina.anims.play(`marina-looks-up`);
      }, MARINA_HEAD_DELAY);
      sitter.wait(sitTime, () => {
        // AFTER THEY FINISH SITTING GET UP AND LEAVE
        this.sitter = null;
        sitter.y -= 30;
        sitter.stand();
        sitter.right();
        // MARINA LOOKS DOWN
        this.marina.anims.play(`marina-looks-down`);
        // IF THE PLAYER IS NEXT THEN OFF THEY GO!
        if (this.player.isNext) {
          startPlayerSitting.bind(this)();
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
    this.player.body.updateFromGameObject();
    this.currentScene = this.scenes[`moma-exterior`];
    this.marinaFace.setVisible(false);
    this.ticketQueue.remove(this.player);
    this.marinaQueue.remove(this.player);
    if (this.sitter === this.player) {
      this.sitter = null;
    }
    this.player.debugText.text = NO_Q_SYMBOL;
    this.player.isNext = false;
    this.player.sitting = false;
    this.player.sat = false;
    this.player.obstructions = 0;
    this.player.x = 140 + this.currentScene.x * this.game.canvas.width + this.game.canvas.width / 2;
    this.player.y = this.currentScene.y * this.game.canvas.height + 300;
    this.player.stop();
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