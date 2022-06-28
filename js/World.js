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


    // Player
    this.player = new Player(this, 300, this.game.canvas.height + 300);
    this.player.joinScene(this);
    this.currentScene = this.scenes[`moma-exterior`];

    // Dialog
    this.dialog = new Dialog(this);

    this.cameras.main.setScroll(0, this.game.canvas.height);
  }

  update() {
    super.update();

    this.physics.collide(this.player, this.colliders, () => {
      this.player.stop();
    });
    this.player.depth = this.player.body.y;

    updateMOMAExterior
      .bind(this)();
    updateTicketHall
      .bind(this)();
    updateHallway1
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
}