// Queue stuff
let QUEUE = [];
const QUEUE_LENGTH = 30;
const QUEUE_X = 440;
const QUEUE_Y = 182;
const QUEUE_SPACING = 56;

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

    // Collisions
    this.colliders = this.physics.add.group();

    // Sensors
    this.queuerSensors = this.physics.add.group();

    // Transitions
    this.marks = this.add.group();

    // Visitors (not including the player)
    this.queuers = this.physics.add.group();

    // Queue checkpoints that all queuers who start outside walk along
    this.checkpointData = [
      new Phaser.Geom.Point(-100, 400 + 360), // Start
      new Phaser.Geom.Point(430, 400 + 360), // To door X
      new Phaser.Geom.Point(430, 260), // Through doors to ticket barrier
      new Phaser.Geom.Point(50, 260), // To left of ticket barrier
      new Phaser.Geom.Point(50, 205), // Up to wall
      new Phaser.Geom.Point(560, 205), // Across and past the window
      new Phaser.Geom.Point(560, 300), // Down to the door level
      new Phaser.Geom.Point(560 + 600, 300), // Through the door into the first hall
      new Phaser.Geom.Point(560 + 600, 228), // Up to the queue level
      new Phaser.Geom.Point(560 + 600 + 800 * 5, 228), // All the way (including bumping into the queue and sitting)
    ];
    // Add visuals of the checkpoints
    this.checkpointsGroup = this.physics.add.group();
    this.checkpoints = [];
    this.checkpointData.forEach((coordinate) => {
      let checkpoint = this.checkpointsGroup.create(coordinate.x, coordinate.y, 'atlas', 'red-pixel.png')
        .setScale(8)
        .setDepth(100000)
        .setAlpha(0.5);
      this.checkpoints.push(checkpoint);
    });

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

    this.currentScene = this.scenes[`moma-exterior`];

    // Player
    this.player = new Player(this, 400 + this.currentScene.x * this.game.canvas.width, 320 + this.currentScene.y * this.game.canvas.height);
    this.player.joinScene(this);

    // Dialog
    this.dialog = new Dialog(this);

    this.cameras.main.setScroll(this.currentScene.x * this.game.canvas.width, this.currentScene.y * this.game.canvas.height);
  }

  update() {
    super.update();

    this.player.update();
    this.queuers.children.each((q) => {
      q.update();
    });

    this.physics.collide(this.player, this.colliders, () => {
      this.player.stop();
    });

    // this.physics.overlap(this.queuers, this.player, )

    this.physics.collide(this.queuers, this.player, (p, q) => {
      q.pause();
      p.stop();

      if (!this.ticketQueue.contains(this.player) && this.ticketQueue.contains(q)) {
        // We bumped into someone who is in the queue, so we're in the queue
        this.ticketQueue.add(this.player);
        console.log("Player joins the queue")
        this.player.debugText.text = "IN TICKET QUEUE";
      }
      // return true;
    });

    // HOW DO YOU STOP THEM SHOVING EACH OTHER???
    this.physics.overlap(this.queuerSensors, this.queuerSensors, (q1s, q2s) => {
      let q1 = q1s.parent;
      let q2 = q2s.parent;

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
        // console.log("Pausing because I'm behind someone to their left")
      } else if (dirQ1.x < 0 && q1.x > q2.x) {
        bumped = true;
        // console.log("Pausing because I'm behind someone to their right")
      } else if (dirQ1.y > 0 && q1.y < q2.y) {
        bumped = true;
        // console.log("Pausing because I'm behind someone to their below")
      } else if (dirQ1.y < 0 && q1.y > q2.y) {
        bumped = true;
        // console.log("Pausing because I'm behind someone to their above")
      }
      //else if (dirQ2.x === 0 && dirQ2.y === 0) {
      // Will this case accidentally make people be blocked
      // by the person behind them though?
      // q1.pause(q2);

      if (bumped) {
        q1.pause(q2);
        if (this.ticketQueue.contains(q2) && !this.ticketQueue.contains(q1)) {
          this.ticketQueue.add(q1);
          q1.debugText.text = "IN TICKET QUEUE";
          console.log(`${q1.id} joins the queue`)
          // We bumped into someone who is in the queue, so we're in the queue
          // console.log("Someone joined the queue.")
        }
      }
    });

    this.physics.collide(this.queuers, this.queuers, (q1, q2) => {
      // return true;
    });

    this.physics.collide(this.queuers, this.colliders, null, (q, c) => {
      q.pause();
      return true;
    });

    // Depth
    if (!this.player.sitting) {
      // Cheap hack to not reset depth when sitting so you don't go behind the chair
      this.player.depth = this.player.body.y;
    }
    this.queuers.children.each((q) => {
      if (!q.sitting) {
        q.setDepth(q.body.y);
      }
    });

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

    this.checkExits();
  }

  addScene(data) {
    this.scenes[data.name] = data;

    let keys = Object.keys(data.transitions);
    keys.forEach((key) => {
      this.marks.create(data.transitions[key].x, data.transitions[key].y, 'atlas', 'red-pixel.png')
        .setScale(4)
        .setDepth(100000);
    });

    // this.marks.toggleVisible();
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

}