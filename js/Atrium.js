const LEFT_TEAR_X = 320;
const LEFT_TEAR_Y = 192;
const RIGHT_TEAR_X = 448;
const RIGHT_TEAR_Y = LEFT_TEAR_Y;
const TEAR_COLOR = 0x666666FF;
const CHEEK_TEAR_INTERVAL = 400;
const FALL_TEAR_INTERVAL = 100;

const FIRST_PERSON_SCALE = 32;

class Atrium extends TAIPScene {
  constructor(config) {
    super({
      key: "atrium"
    });
  }

  create() {
    super.create();

    // Atrium BG
    this.add
      .sprite(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "atlas",
        "atrium/atrium-bg.png"
      )
      .setScale(4);

    // Table and chairs
    this.tableAndChairs = this.physics.add.sprite(130 * 4 + 30 * 4, 40 * 4 + 15 * 4, 'atlas', 'atrium/atrium-table-and-chairs.png')
      .setScale(4);
    this.tableAndChairs.body.setOffset(2, this.tableAndChairs.body.height - 8);
    this.tableAndChairs.body.setSize(this.tableAndChairs.width - 4, 4, false);
    this.tableAndChairs.body.immovable = true;
    this.tableAndChairs.setDepth(250);
    this.colliders.add(this.tableAndChairs);

    // This was for TAIP2
    // this.playerChairSensor = this.physics.add.sprite(730, 250, 'atlas', 'red-pixel.png')
    //   .setScale(10, 50);
    // this.playerChairSensor.visible = false;

    this.visitorChairSensor = this.physics.add.sprite(580, 250, 'atlas', 'red-pixel.png')
      .setScale(50, 60);
    this.visitorChairSensor.visible = false;

    this.tape = this.physics.add.group();
    // Back wall left
    createColliderRect(this, 0, 0, 312, 202, this.tape);
    // Back wall right
    createColliderRect(this, 312, 0, 490, 60, this.tape);
    // Bottom wall
    createColliderRect(this, 0, 392, 800, 8, this.tape);
    // Right wall
    createColliderRect(this, 799, 0, 2, 400, this.tape);
    // Tape left top
    createColliderLine(this, 380, 120, 80, 100, 1, 2, this.tape);
    // Tape left bottom
    createColliderLine(this, 456, 272, 80, 90, 1, 2, this.tape);
    // Tape top
    createColliderRect(this, 384, 120, 400, 4, this.tape);
    // Tape bottom
    createColliderRect(this, 508, 360, 300, 4, this.tape);


    this.addQueue(0);

    this.addGuards();

    this.addMarina();

    const transitionData = [{
      key: "hallway3",
      type: "left",
      x: 4 * 4,
      y: 60 * 4,
      keepY: true
    }, ];
    this.addTransitions(transitionData);

    this.handleEntrances();

    this.sitter = QUEUE[0];
  }

  addGuards() {
    // Add guards
    this.guards = this.add.group();
    this.guard1 = new Guard(this, 115 * 4, 39 * 4 + 2, this.dialog);
    this.guard2 = new Guard(this, 118 * 4, 50 * 4 + 2, this.dialog);
    this.guards.add(this.guard1, true);
    this.guards.add(this.guard2, true);
  }

  addMarina() {
    this.marina = this.add.sprite(695.5, 204, `marina-sitting`);
    this.marina.setScale(4, 4);
    this.marina.setDepth(250);
  }

  update(time, delta) {
    super.update();

    this.handleCollisions();
    // this.checkMarinaSitting();
    this.checkVisitorSitting();

    if (this.movingUp && this.movingUp.x >= QUEUE_X) {
      this.movingUp.stop();
      this.movingUp = undefined;
      for (let i = 1; i < QUEUE.length; i++) {
        setTimeout(() => {
          QUEUE[i].right();
        }, i * 300 + Math.random() * 250);
      }
    }

    this.setDepths();
  }

  // checkMarinaSitting() {
  //   if (!this.player.sitting) {
  //     this.physics.overlap(this.player, this.playerChairSensor, () => {
  //       this.player.sit();
  //       this.player.x = 695.5;
  //       this.player.y = 210;
  //
  //       // Start timers to handle the museum closing
  //       setTimeout(() => {
  //         this.showMuseumClosingWarningMessage();
  //       }, TIME_TO_MUSEUM_CLOSING_WARNING);
  //
  //       setTimeout(() => {
  //         this.closeMuseum();
  //       }, TIME_TO_MUSEUM_CLOSED);
  //
  //       setTimeout(() => {
  //         this.startHeadDownSequence();
  //       }, 1000);
  //     });
  //   }
  // }

  showMuseumClosingWarningMessage() {
    if (this.dialog.visible) {
      setTimeout(() => {
        this.showMuseumClosingWarningMessage();
      }, 1000);
    } else {
      this.dialog.showMessage(CLOSING_WARNING_MESSAGE);
    }
  }

  closeMuseum() {

    if (this.dialog.visible) {
      setTimeout(() => {
        this.closeMuseum();
      }, 2000);
    } else {
      this.dialog.showMessage(CLOSED_MESSAGE, () => {
        this.scene.switch('gameover');
      })
    }
  }

  startHeadDownSequence() {
    // this.dialog.y = UPPER_DIALOG_Y;
    // this.dialog.showMessage(MOBILE ? HEAD_DOWN_INSTRUCTIONS_MOBILE : HEAD_DOWN_INSTRUCTIONS, () => {
    setTimeout(() => {
      this.player.lookDown(() => {
        setTimeout(() => {
          this.nextSitter();
        }, 1000);
      }, this);
    }, 1000);
    // });
  }

  checkVisitorSitting() {
    if (this.sitter && !this.sitter.sitting) {
      this.physics.overlap(this.sitter, this.visitorChairSensor, () => {
        this.sitter.stop();
        console.log(this.sitter.x, this.sitter.y);
        this.sitter.sit();
        this.sitter.x = 560;
        this.sitter.y = 190;

        setTimeout(() => {
          this.startHeadUpSequence();
        }, 1000);

        this.movingUp = QUEUE[0];
        this.movingUp.right(); // Make the front person walk
      });
    }
  }

  startHeadUpSequence() {
    // this.dialog.y = UPPER_DIALOG_Y;
    // this.dialog.showMessage(MOBILE ? HEAD_UP_INSTRUCTIONS_MOBILE : HEAD_UP_INSTRUCTIONS, () => {
    setTimeout(() => {
      this.player.lookUp(() => {
        setTimeout(() => {
          const SIT_TIME = SIT_TIMES[Math.floor(Math.random() * SIT_TIMES.length)];
          setTimeout(() => {
            this.sitterFinished()
          }, SIT_TIME * 60 * 1000);
          // this.showSitter();
        }, 1000);
      }, this);
    }, 1000);
    // }, true);
  }

  // showSitter() {
  //   this.faceBG.setVisible(true);
  //   this.face = this.add.sprite(0, 0, `person-spritesheet${this.sitter.suffix}`, 14);
  //   this.face.x = this.game.canvas.width / 2;
  //   this.face.y = this.game.canvas.height / 2 + 280;
  //   this.face.setScale(FIRST_PERSON_SCALE);
  //   this.face.setDepth(10000);
  //
  //
  //   this.tryCrying();
  //   this.startBlinking();
  // }

  // tryCrying() {
  //   if (Math.random() < this.sitter.cryProbability) {
  //     this.cryTimeout = setTimeout(() => {
  //       this.startCrying();
  //       this.cryTimeout = setTimeout(() => {
  //         this.stopCrying();
  //         this.tryCrying();
  //       }, CRY_TIME_MIN + Math.random() * CRY_TIME_RANGE);
  //     }, CRY_DELAY_MIN + Math.random() * CRY_DELAY_RANGE);
  //   }
  // }

  hideFace() {
    this.faceBG.setVisible(false);
    this.face.setVisible(false);
    this.face.destroy();

    this.stopCrying();
    this.stopBlinking();
  }

  startCrying() {
    this.leftTear.setVisible(false);
    this.rightTear.setVisible(false);
    this.crying = true;
    this.startTear(this.leftTear);
    setTimeout(() => {
      this.startTear(this.rightTear);
    }, 1234);
  }

  stopCrying() {
    this.leftTear.setVisible(false);
    this.rightTear.setVisible(false);
    this.crying = false;
  }

  startTear(tear) {
    if (!this.crying) return;

    tear.x = Math.random() < 0.5 ? tear.startX : tear.startX + FIRST_PERSON_SCALE;
    tear.y = LEFT_TEAR_Y;
    tear.setVisible(true);
    let interval = setInterval(() => {
      tear.y += FIRST_PERSON_SCALE;
      if (tear.y >= LEFT_TEAR_Y + 3 * FIRST_PERSON_SCALE) {
        clearInterval(interval);
        interval = setInterval(() => {
          tear.y += FIRST_PERSON_SCALE;
          if (tear.y >= this.game.canvas.height) {
            clearInterval(interval);
            setTimeout(() => {
              this.startTear(tear);
            }, 500 + Math.random() * 5000);
          }
        }, FALL_TEAR_INTERVAL);
      }
    }, CHEEK_TEAR_INTERVAL);

  }

  startBlinking() {
    const skin = this.sitter.palette.skin.darken(5);
    this.leftEyelid.tint = Phaser.Display.Color.GetColor32(skin.r, skin.g, skin.b, 255);
    this.rightEyelid.tint = Phaser.Display.Color.GetColor32(skin.r, skin.g, skin.b, 255);
    this.leftEyelid.setVisible(false);
    this.rightEyelid.setVisible(false);
    this.blinkTimer = setTimeout(() => {
      this.blink();
    }, 3000 + Math.random() * 10000);
  }

  stopBlinking() {
    if (this.blinkTimer) clearTimeout(this.blinkTimer);
    this.leftEyelid.setVisible(false);
    this.rightEyelid.setVisible(false);
  }

  blink() {
    this.leftEyelid.setVisible(true);
    this.rightEyelid.setVisible(true);
    setTimeout(() => {
      this.leftEyelid.setVisible(false);
      this.rightEyelid.setVisible(false);
      setTimeout(() => {
        this.blink();
      }, 3000 + Math.random() * 10000);
    }, 150 + Math.random() * 150);
  }

  sitterFinished() {
    this.hideFace();

    this.sitter.body.y = 180;
    // this.sitter.setDepth(1);
    this.sitter.right();
    setTimeout(() => {
      this.startHeadDownSequence();
    }, 2000);
  }

  handleCollisions() {
    this.physics.collide(this.player, this.colliders, () => {
      this.player.stop();
    });

    this.physics.collide(this.player, this.tape, () => {
      this.player.stop();
      // Check if outside/not turn and give message if so
      this.dialog.showMessage(TAPE_MESSAGE);
    });

    this.physics.collide(this.player, this.guards, (marina, guard) => {
      this.player.stop();
      let message = GUARD_TALK.pop();
      if (message) this.personSay(guard, message);
    });

    this.physics.collide(this.queue, this.queue, (person1, person2) => {
      person1.stop();
      person2.stop();
    });
  }

  setDepths() {
    this.player.depth = this.player.body.y;
    this.queue.getChildren()
      .forEach((visitor) => {
        visitor.depth = visitor.body.y;
      });
    this.guards.getChildren()
      .forEach((guard) => {
        guard.depth = guard.body.y;
      });
    if (this.sitter) {
      this.sitter.depth = this.sitter.sitting ? this.sitter.body.y + 100 : this.sitter.body.y;
    }
  }

  nextSitter() {
    if (this.sitter) {
      this.sitter.sitting = false;
      this.sitter.depth = this.sitter.body.y;
      this.sitter.right();
    }

    // Make the next person in the queue the sitter and make them walk to the chair
    this.sitter = QUEUE.shift();
    this.queue.remove(this.sitter);
    this.sitter.right();

    // Add a new person to the back of the queue
    let last = new Visitor(this, QUEUE[QUEUE.length - 1].x - QUEUE_SPACING, QUEUE[QUEUE.length - 1].y);
    last.ignoreDestroy = true;
    last.scene = this;
    this.physics.add.existing(last);
    this.queue.add(last, true);
    QUEUE.push(last);
  }

  advanceQueue() {

  }
}