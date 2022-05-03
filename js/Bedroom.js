class Bedroom extends TAIPScene {

  constructor(config) {
    super({
      key: 'bedroom'
    });
  }

  create() {
    super.create();

    // Room
    this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'bedroom/bedroom-bg.png').setScale(4);
    // Wall colliders
    createColliderRect(this, 57 * 4, 56 * 4, (140 - 57) * 4, 5, this.colliders);
    createColliderRect(this, 0 * 4, 92 * 4, 200 * 4, 5, this.colliders);
    createColliderRect(this, 151 * 4, 66 * 4, 200 * 4, 5, this.colliders);
    createColliderLine(this, 140 * 4, 56 * 4, 10 * 4, 11 * 4, 5, 5, this.colliders);
    createColliderLine(this, 164 * 4, 82 * 4, 10 * 4, 11 * 4, 5, 5, this.colliders);
    createColliderLine(this, 57 * 4, 57 * 4, 35 * 4, 35 * 4, -5, 5, this.colliders);

    // Bed
    this.bed = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'bedroom/bedroom-bed.png').setScale(4);
    // Bed colliders
    createColliderRect(this, 32 * 4, 68 * 4, 69 * 4, 5, this.colliders);
    createColliderRect(this, 31 * 4, 83 * 4, 55 * 4, 5, this.colliders);
    createColliderLine(this, 101 * 4, 69 * 4, 16 * 4, 16 * 4, -5, 5, this.colliders);

    // Bedside table
    this.sideTable = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'bedroom/bedroom-side-table.png').setScale(4);
    this.sideTable.body.setOffset(31, 76);
    this.sideTable.body.setSize(17, 13, false);
    this.sideTable.body.immovable = true;
    this.sideTable.depth = 76 * 4;
    this.colliders.add(this.sideTable);

    // Dresser
    this.dresser = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'bedroom/bedroom-dresser.png').setScale(4);
    createColliderRect(this, 122 * 4, 56 * 4, 23 * 4, 5 * 4, this.colliders);
    this.dresser.depth = 31 * 4;

    // Marina Abramovic horizontal
    this.marinaBed = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'bedroom/bedroom-marina.png').setScale(4);

    let transitionData = [{
      key: 'kitchen',
      type: 'right',
      x: 165 * 4,
      y: 56 * 4,
    }];
    this.addTransitions(transitionData);

    this.handleEntrances();

    // Handle the special case of Bed Marina!
    if (last.scene !== 'kitchen') {
      this.marina.x = 220;
      this.marina.y = 284;
      this.marina.setVisible(false);
      this.marinaBed.setVisible(true);
      this.marina.inputEnabled = false;
    }
    else {
      this.marina.setVisible(true);
      this.marinaBed.setVisible(false);
      setTimeout(() => {
        this.dialog.showMessage(BACK_TO_BED_MESSAGE, () => {});
      }, 1000);
    }

    let bedroomFG = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'bedroom/bedroom-fg.png').setScale(4);
    bedroomFG.depth = bedroomFG.y + bedroomFG.height + 4 * 4;

    if (last.scene !== 'kitchen') {
      setTimeout(() => {
        this.dialog.y = UPPER_DIALOG_Y;
        this.dialog.showMessage(MOBILE ? WAKEUP_MESSAGE_MOBILE : WAKEUP_MESSAGE, () => {
          this.handleWakeup();
        });
      }, 3000);
    }
  }

  update(time, delta) {
    super.update(time, delta);

    this.marina.update(time, delta);
    this.physics.collide(this.marina, this.colliders, () => {
      this.marina.stop();
    });
    this.marina.depth = this.marina.body.y;
  }

  handleWakeup() {
    this.marinaBed.setVisible(false);
    this.marina.setVisible(true);
    this.marina.inputEnabled = true;
    this.marina.stop();
  }
}