class Title extends Phaser.Scene {

  constructor(config) {
    super({
      key: `title`
    });
  }

  create() {
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.cameras.main.setBackgroundColor("#ffffff");
    this.marina = this.add.sprite(0, 0, `atlas`, `title/title.png`)
      .setScale(4)
    this.marina.setPosition(this.width / 2 - this.marina.displayWidth / 2, this.height / 2)
    this.marina.setVisible(false);

    this.displayQueue = [];

    this.displayQueue.push({
      element: this.marina,
      delay: 750
    });

    let titleStyle = {
      fontFamily: `Commodore`,
      fontSize: `48px`,
      color: `black`,
      align: `center`
    }
    let titleWords = [`THE`, `ARTIST`, `IS`, `PRESENT`];
    for (let i = 0; i < titleWords.length; i++) {
      let title = this.add.text(0, 0, titleWords[i], titleStyle)
        .setOrigin(0.5, 0);
      title.setPosition(3 * this.width / 4, i * 48);
      title.setVisible(false);
      this.displayQueue.push({
        element: title,
        delay: 1000
      });
    }

    let authorWords = [`MARINA ABRAMOVIC`, `(AND PIPPIN BARR)`];
    let authorStyle = {
      fontFamily: `Commodore`,
      fontSize: `24px`,
      color: `black`,
      align: `center`
    }
    for (let i = 0; i < authorWords.length; i++) {
      let author = this.add.text(0, 0, authorWords[i], authorStyle)
        .setOrigin(0.5, 0);
      author.setPosition(3 * this.width / 4, 230 + i * 40);
      author.setVisible(false);
      this.displayQueue.push({
        element: author,
        delay: 1500
      });
    }

    let clickStyle = {
      fontFamily: `Commodore`,
      fontSize: `22px`,
      color: `black`,
      align: `center`
    }
    this.click = this.add.text(0, 0, `- CLICK TO BEGIN -`, clickStyle)
      .setOrigin(0.5, 0.5);
    this.click.setPosition(3 * this.width / 4, this.height - this.click.displayHeight);
    this.click.setVisible(false);
    this.displayQueue.push({
      element: this.click,
      delay: 1500
    })

    let index = 0;
    setTimeout(() => {
      displayNext.bind(this)();
    }, this.displayQueue[0].delay);

    function displayNext() {
      this.displayQueue[index].element.setVisible(true);
      index++;
      if (index < this.displayQueue.length) {
        setTimeout(() => {
          displayNext.bind(this)();
        }, this.displayQueue[index].delay)
      }
      if (index === this.displayQueue.length) {
        this.input.once(`pointerdown`, () => {
          this.scene.start(`world`);
        });
      }
    }

  }

  update() {
    super.update();
  }
}