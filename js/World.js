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
    addMOMAExterior
      .bind(this, 0, this.game.canvas.height)();
    addTicketHall
      .bind(this, 0, 0)();


    // Player
    this.player = new Player(this, 300, this.game.canvas.height + 300);
    this.player.joinScene(this);

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

    this.checkExits();
  }

  addTransitions(data) {
    data.forEach((transition) => {
      switch (transition.type) {
      case 'left':
        this.marks.create(transition.x, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x - TRANSITION_OFFSET, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x + TRANSITION_OFFSET, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.leftTransition = transition;
        break;

      case 'right':
        this.marks.create(transition.x, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x + TRANSITION_OFFSET, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x - TRANSITION_OFFSET, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.rightTransition = transition;
        break;

      case 'up':
        this.marks.create(transition.x, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x, transition.y - TRANSITION_OFFSET, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x, transition.y + TRANSITION_OFFSET, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.upTransition = transition;
        break;

      case 'down':
        this.marks.create(transition.x, transition.y, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x, transition.y + TRANSITION_OFFSET, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.marks.create(transition.x, transition.y - TRANSITION_OFFSET, 'atlas', 'red-pixel.png')
          .setScale(4)
          .setDepth(100000);
        this.downTransition = transition;
        break;
      }

    });

    // this.marks.toggleVisible();
  }

  checkExits() {
    let transition = '';
    if (this.leftTransition && this.player.x < this.leftTransition.x - TRANSITION_OFFSET) {
      transition = this.leftTransition.key;
    } else if (this.rightTransition && this.player.x > this.rightTransition.x + TRANSITION_OFFSET) {
      transition = this.rightTransition.key;
    } else if (this.upTransition && this.player.y < this.upTransition.y - TRANSITION_OFFSET) {
      transition = this.upTransition.key;
    } else if (this.downTransition && !this.downTransition.inactive && this.player.y > this.downTransition.y + TRANSITION_OFFSET) {
      transition = this.downTransition.key;
    }

    if (transition !== '') {
      // last.scene = this.scene.key;
      // last.x = this.player.x;
      // last.y = this.player.y;
      // this.scene.start(transition);
      // this.cameras.main.setPosition(0, 200);
      this.cameras.main.setScroll(0, 0);

    }
  }

}