class Living extends TAIPScene {

  constructor(config) {
    super({
      key: 'living'
    });
  }

  create() {
    super.create();

    // Room
    this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'living/living-bg.png').setScale(4);
    // Wall colliders
    createColliderRect(this, 0 * 4, 56 * 4, 200 * 4, 1 * 4, this.colliders);
    createColliderRect(this, 0 * 4, 99 * 4, 200 * 4, 1 * 4, this.colliders);

    // Bed thing
    this.bedThing = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'living/living-bed-thing.png').setScale(4);
    this.bedThing.body.setOffset(11, 45);
    this.bedThing.body.setSize(31, 39, false);
    this.bedThing.body.immovable = true;
    this.colliders.add(this.bedThing);

    // Purple sofa
    this.purpleSofa = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'living/living-purple-sofa.png').setScale(4);
    this.purpleSofa.body.setOffset(71, 59);
    this.purpleSofa.body.setSize(18, 30, false);
    this.purpleSofa.body.immovable = true;
    this.purpleSofa.depth = 80 * 4;
    this.colliders.add(this.purpleSofa);
    createColliderRect(this, 71 * 4, 80 * 4, 30 * 4, 9 * 4, this.colliders);

    // Beige sofa
    this.beigeSofa = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'living/living-beige-sofa.png').setScale(4);
    this.beigeSofa.body.setOffset(109, 50);
    this.beigeSofa.body.setSize(69, 19, false);
    this.beigeSofa.body.immovable = true;
    this.colliders.add(this.beigeSofa);

    // Coffee table
    this.table = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 'atlas', 'living/living-coffee-table.png').setScale(4);
    this.table.body.setOffset(107, 76);
    this.table.body.setSize(72, 7, false);
    this.table.body.immovable = true;
    this.table.depth = 76 * 4;
    this.colliders.add(this.table)

    let transitionData = [{
        key: 'kitchen',
        type: 'left',
        x: 4 * 4,
        y: 76 * 4,
        keepY: false,
      },
      {
        key: 'dining',
        type: 'right',
        x: 196 * 4,
        y: 72 * 4,
        keepY: true
      }
    ];
    this.addTransitions(transitionData);
    this.handleEntrances();
  }

  update(time, delta) {
    super.update(time, delta);

    this.marina.update(time, delta);
    this.physics.collide(this.marina, this.colliders, () => {
      this.marina.stop();
    });
    this.marina.depth = this.marina.body.y;
  }

}