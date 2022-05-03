class GameOver extends Phaser.Scene {
  constructor(config) {
    super({
      key: "gameover"
    });
  }

  create() {
    this.dialog = new Dialog(this);
    setTimeout(() => {
      this.dialog.showMessage(GAMEOVER_TEXT, () => {
        this.gameOverText.setVisible(true);
      });
    }, 1000);

    this.gameOverText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, "GAME OVER", {
      fontFamily: 'Commodore',
      fontSize: `24px`,
      fill: '#FFFFFF',
      wordWrap: true
    }).setOrigin(0.5, 0.5).setVisible(false);
  }

  update(time, delta) {

  }

}