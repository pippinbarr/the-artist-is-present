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

    // Transitions
    this.marks = this.add.group();

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

    this.currentScene = this.scenes[`atrium`];

    // Player
    this.player = new Player(this, 300 + this.currentScene.x * this.game.canvas.width, 176 + this.currentScene.y * this.game.canvas.height);
    this.player.joinScene(this);

    // Dialog
    this.dialog = new Dialog(this);

    this.cameras.main.setScroll(this.currentScene.x * this.game.canvas.width, this.currentScene.y * this.game.canvas.height);
  }

  update() {
    super.update();

    this.physics.collide(this.player, this.colliders, () => {
      this.player.stop();
    });

    if (!this.player.sitting) {
      // Cheap hack to not reset depth when sitting so you don't go behind the chair
      this.player.depth = this.player.body.y;
    }

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