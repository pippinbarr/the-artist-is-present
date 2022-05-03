class Kitchen extends TAIPScene {

  constructor(config) {
    super({
      key: 'kitchen'
    });
  }

  create() {
    super.create();

    // Room
    this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'kitchen/kitchen-bg.png').setScale(4);
    // Wall colliders
    createColliderRect(this, 0 * 4, 92 * 4, 200 * 4, 1 * 4, this.colliders);
    createColliderRect(this, 0 * 4, 63 * 4, 200 * 4, 1 * 4, this.colliders);

    // Kitchen Unit BG
    this.unitBG = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'kitchen/kitchen-unit-bg.png').setScale(4);

    // Kitchen Unit FG
    let unitFG = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'kitchen/kitchen-unit-fg.png').setScale(4);
    unitFG.depth = 100000;

    let doors = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'kitchen/kitchen-doors.png').setScale(4);
    doors.depth = 100000;

    this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'kitchen/kitchen-fg.png').setScale(4);

    this.leftScene = 'bedroom';
    this.rightScene = 'living';

    let transitionData = [{
        key: 'bedroom',
        type: 'left',
        x: 46 * 4,
        y: 56 * 4,
      },
      {
        key: 'living',
        type: 'right',
        x: 150 * 4,
        y: 56 * 4,
      }
    ];
    this.addTransitions(transitionData);

    this.handleEntrances();

    this.cursors = this.input.keyboard.createCursorKeys();

    let kitchenFG = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'kitchen/kitchen-fg.png').setScale(4);
    kitchenFG.depth = 10000;
  }

  update(time, delta) {
    this.marina.update(time, delta);
    this.physics.collide(this.marina, this.colliders, () => {
      this.marina.stop();
    });
    this.marina.depth = this.marina.body.y;

    this.checkExits();
  }
}