const TRANSITION_OFFSET = 7 * 4;


class TAIPScene extends Phaser.Scene {

  constructor(config) {
    super(config);
  }

  create() {
    this.cameras.main.setBackgroundColor('#fff');
    this.colliders = this.add.group();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.marks = this.add.group();

    // Player
    this.player = new Player(this, this.game.canvas.width / 2, this.game.canvas.height / 2, 'player');
    this.player.anims.play('idle-d-player');

    this.dialog = new Dialog(this, this.player);
  }

  update(time, delta) {
    this.checkExits();
    if (this.queue) {
      this.physics.collide(this.player, this.queue, (player, visitor) => {
        this.player.stop();
        if (!visitor.spoken) {
          this.personSay(visitor, QUEUE_TALK.pop());
          visitor.spoken = true;
        } else {
          // this.personSay(visitor, "...");
        }
      });
    }
  }

  handleEntrances() {
    if (this.leftTransition && this.leftTransition.key === last.scene) {
      this.handleEntrance(this.leftTransition, 1, 0);
    } else if (this.rightTransition && this.rightTransition.key === last.scene) {
      this.handleEntrance(this.rightTransition, -1, 0);
    } else if (this.upTransition && this.upTransition.key === last.scene) {
      this.handleEntrance(this.upTransition, 0, 1);
    } else if (this.downTransition && this.downTransition.key === last.scene) {
      this.handleEntrance(this.downTransition, 0, -1);
    }
  }

  handleEntrance(transition, xDir, yDir) {
    this.player.x = transition.x - xDir * TRANSITION_OFFSET;
    this.player.y = transition.keepY ? last.y : transition.y - yDir * TRANSITION_OFFSET;

    if (xDir > 0) this.player.right();
    if (xDir < 0) this.player.left();
    if (yDir > 0) this.player.down();
    if (yDir < 0) this.player.up();
    if (transition.stop === true) this.player.stop();

    let targetX = transition.x + xDir * TRANSITION_OFFSET;
    let targetY = transition.keepY ? last.y : transition.y + yDir * TRANSITION_OFFSET;
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
      last.scene = this.scene.key;
      last.x = this.player.x;
      last.y = this.player.y;
      this.scene.start(transition);
    }
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

    this.marks.toggleVisible();
  }

  addQueue(xOffset) {
    this.queue = this.add.group();

    // Add queue
    for (let i = 0; i < QUEUE.length; i++) {
      QUEUE[i].x = QUEUE_X - i * QUEUE_SPACING + xOffset
      QUEUE[i].y = QUEUE_Y;
      this.add.existing(QUEUE[i]);
      this.physics.add.existing(QUEUE[i]);
      this.queue.add(QUEUE[i]);
    }
  }

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