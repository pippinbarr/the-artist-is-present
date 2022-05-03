class Title extends Phaser.Scene {
  constructor(config) {
    super({
      key: "title"
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#fff');
    this.add.sprite(0, 0, 'atlas', 'title/title.png').setOrigin(0, 0).setScale(4);

    this.textData = [{
        text: 'THE',
        size: 48,
        yOffset: 0,
        delay: 500,
      },
      {
        text: 'ARTIST',
        size: 48,
        yOffset: 50,
        delay: 500,
      },
      {
        text: 'IS',
        size: 48,
        yOffset: 100,
        delay: 500,
      },
      {
        text: 'PRESENT',
        size: 48,
        yOffset: 150,
        delay: 1500,
      },
      {
        text: '- 2 -',
        size: 64,
        yOffset: 200,
        delay: 1500,
      },
      {
        text: 'PIPPIN BARR',
        size: 20,
        yOffset: 280,
        delay: 500,
      },
      {
        text: '(AND MARINA ABRAMOVIC)',
        size: 20,
        yOffset: 305,
        delay: 1000,
      },
      {
        text: 'CLICK/TOUCH TO PLAY',
        size: 24,
        yOffset: 360,
        delay: 0,
      },
    ];

    this.texts = [];

    for (let i = 0; i < this.textData.length; i++) {
      let text = this.add.text(
        3 * this.game.canvas.width / 4,
        0 + this.textData[i].yOffset,
        this.textData[i].text, {
          fontFamily: 'Commodore',
          fontSize: `${this.textData[i].size}px`,
          fill: '#000',
          wordWrap: true,
          width: this.game.canvas.width / 2
        }).setOrigin(0.5, 0).setVisible(false);
      text.delay = this.textData[i].delay;
      this.texts.push(text);
    }

    setTimeout(() => {
      this.startTitleSequence();
    }, 1000);
  }

  startTitleSequence() {
    this.currentTextIndex = 0;
    this.showNextText();
  }

  showNextText() {
    this.currentText = this.texts[this.currentTextIndex];
    this.currentText.setVisible(true);
    setTimeout(() => {
      this.currentTextIndex++;
      if (this.currentTextIndex < this.texts.length) {
        this.showNextText();
      }
      else {
        document.addEventListener('click', () => {
          console.log("Desktop");
          this.scene.switch('bedroom');
        }, {
          once: true
        });
        document.addEventListener('touchstart', () => {
          MOBILE = true;
          console.log("Mobile");
          this.scene.switch('bedroom');
        }, {
          once: true
        });

      }
    }, this.currentText.delay);
  }

  update(time, delta) {

  }

}