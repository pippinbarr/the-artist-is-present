let Preloader = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function Preloader() {
    Phaser.Scene.call(this, {
      key: 'preloader'
    });
  },

  preload: function () {
    this.load.multiatlas('atlas', 'assets/atlas/atlas.json', 'assets/atlas');
    this.load.spritesheet('marina', 'assets/spritesheets/marina-dress-spritesheet.png', {
      frameWidth: 14,
      frameHeight: 35,
      endFrame: 25
    });
    this.load.spritesheet('marina-sitting', 'assets/spritesheets/marina-sitting-spritesheet.png', {
      frameWidth: 20,
      frameHeight: 30,
      endFrame: 4
    });
    this.load.spritesheet('person-spritesheet', 'assets/spritesheets/person-spritesheet2.png', {
      frameWidth: 14,
      frameHeight: 35,
      endFrame: 25
    });
  },

  create: function () {
    this.createSpritesheetAnimation('person-spritesheet', 'idle-h-player', 23, 23, 10, 0);
    this.createSpritesheetAnimation('person-spritesheet', 'walking-h-player', 1, 8, 10, -1);
    this.createSpritesheetAnimation('person-spritesheet', 'idle-u-player', 22, 22, 10, 0);
    this.createSpritesheetAnimation('person-spritesheet', 'walking-u-player', 16, 21, 10, -1);
    this.createSpritesheetAnimation('person-spritesheet', 'idle-d-player', 15, 15, 10, 0);
    this.createSpritesheetAnimation('person-spritesheet', 'walking-d-player', 9, 14, 10, -1);

    this.createSpritesheetAnimation('person-spritesheet-sitting', 'sitting-player', 1, 1, 3, -1);
    // this.createSpritesheetAnimation('marina-sitting', 'look-down-marina', 1, 4, 3, 0);
    // this.createSpritesheetAnimation('marina-sitting', 'look-up-marina', 4, 1, 3, 0);

    // Absolutely hideous hack to avoid this font-loading problem: display invisible text in preloader for
    // a tiny amount of time before going to the menu, which seems to fix it.
    let titleStyle = {
      fontFamily: 'Commodore',
      fontSize: '38px',
      fill: '#000',
      wordWrap: true,
      align: 'center'
    };
    let title = this.add.text(this.game.canvas.width / 2, 100, "LET'S PLAY:\nANCIENT GREEK PUNISHMENT:\nINVERSION EDITION", titleStyle);

    this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'clown_logo');

    // Create the queue of people!
    for (let i = 0; i < QUEUE_LENGTH; i++) {
      let person = new Visitor(this, QUEUE_X - i * QUEUE_SPACING, QUEUE_Y);
      person.ignoreDestroy = true;
      QUEUE.push(person);
    }

    PLAYER = new Player(this, this.game.canvas.width / 2, this.game.canvas.height / 2);
    PLAYER.ignoreDestroy = true;

    setTimeout(() => {
      this.scene.start(START_SCENE);
    }, 500);
  },

  createSpritesheetAnimation: function (parent, name, start, end, framerate, repeat) {
    if (this.anims.get(name) !== undefined) return;

    let frames = this.anims.generateFrameNames(parent, {
      start: start - 1,
      end: end - 1,
    });

    let config = {
      key: name,
      frames: frames,
      frameRate: framerate,
      repeat: repeat,
    };
    this.anims.create(config);
  }
});