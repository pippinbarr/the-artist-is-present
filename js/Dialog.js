const DIALOG_TEXT_WIDTH = 640;
const DIALOG_PADDING = 16;
const DIALOG_BORDER_WIDTH = 8;
const DIALOG_FONT_SIZE = 20;
const UPPER_DIALOG_Y = -120;

class Dialog extends Phaser.GameObjects.Container {

  constructor(scene) {
    super(scene);

    this.scene = scene;

    this.whiteBorder = this.makeBox(100, 100, 0xffffff);
    this.redBorder = this.makeBox(96, 96, 0xcc0000);
    this.whiteBackground = this.makeBox(92, 92, 0xffffff);

    this.text = new Phaser.GameObjects.Text(
      this.scene,
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2,
      '<DIALOG TEXT>', {
        fontFamily: 'Commodore',
        fontSize: `${DIALOG_FONT_SIZE}px`,
        fill: '#000000',
        wordWrap: true
      }
    );
    this.text.setWordWrapWidth(DIALOG_TEXT_WIDTH, true);

    this.add(this.whiteBorder);
    this.add(this.redBorder);
    this.add(this.whiteBackground);
    this.add(this.text);

    this.scene.add.existing(this);

    this.setDepth(100000000);
    this.setVisible(false);
  }

  makeBox(w, h, color) {
    let box = new Phaser.GameObjects.Sprite(
      this.scene,
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2,
      'atlas',
      'white-pixel.png');
    box.setScale(w, h);
    box.tint = color;
    return box;
  }

  update() {
    super.update();
  }

  showMessage(messages, callback, noPause) {
    if (!this.scene) return;
    if (!noPause) this.scene.scene.pause(this.scene.key);

    let index = 0;
    this.showMultiMessage(messages, index, callback, noPause);
  }

  showMultiMessage(messages, index, callback, noPause) {
    this.showDialog(messages[index], () => {
      index++;
      if (index < messages.length) {
        setTimeout(() => {
          this.showMultiMessage(messages, index, callback, noPause);
        }, 1000);
      } else {
        this.scene.scene.resume(this.scene.key);
        callback();
      }
    });
  }

  showDialog(text, callback, noPause) {
    // Will have to think about this question of what to do if they somehow
    // leave a scene with a message still showing? I think they all freeze you?
    // But there's that "noPause" idea I see...
    if (!this.scene) return;

    if (!noPause) this.scene.scene.pause(this.scene.key);

    // Reset the dialog position to match the current scene's location.
    this.x = this.scene.currentScene.x * this.scene.game.canvas.width;
    this.y = this.scene.currentScene.y * this.scene.game.canvas.height;

    this.text.text = text;

    this.whiteBorder.setScale(
      DIALOG_TEXT_WIDTH + DIALOG_PADDING + DIALOG_BORDER_WIDTH * 2,
      this.text.height + DIALOG_PADDING + DIALOG_BORDER_WIDTH * 2
    );
    this.redBorder.setScale(
      DIALOG_TEXT_WIDTH + DIALOG_PADDING + DIALOG_BORDER_WIDTH,
      this.text.height + DIALOG_PADDING + DIALOG_BORDER_WIDTH,
    );
    this.whiteBackground.setScale(
      DIALOG_TEXT_WIDTH + DIALOG_PADDING,
      this.text.height + DIALOG_PADDING
    );

    this.text.x = this.whiteBackground.x - this.whiteBackground.displayWidth / 2 + DIALOG_PADDING;
    this.text.y = this.scene.game.canvas.height / 2 + 2;

    this.text.setOrigin(0, 0.5);

    this.setVisible(true);

    // this.y = this.whiteBorder.y - this.whiteBorder.height / 2;

    let dialogEventName = MOBILE ? 'touchstart' : 'keydown';
    document.addEventListener(dialogEventName, () => {
      this.setVisible(false);

      if (callback) callback();
    }, {
      once: true
    });
  }
}