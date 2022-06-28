class Guard extends GeneratedPerson {

  constructor(scene, x, y, dialog) {
    const palette = {
      eyes: [0xff637c62, 0xff4e8b9a, 0xff403226, 0xff0e779e],
      mouth: [0xffc96c69, 0xffc96c69],
      hair: [0xFF000000, 0xff583b3b, 0xff9d9b67, 0xff9d9c9c, 0xff757060, 0xff5e4b11, 0xff5b1515],
      skin: [0xffc69a55, 0xffd2a7b6, 0xffd2a9cb, 0xff65331f, 0xff7e5f36],
      shirt: [0xFF222222],
      belt: [0xFF000000],
      pants: [0xFF111111],
      shoes: [0xFF000000, 0xff4b370c, 0xff474237]
    }
    super(scene, x, y, palette);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.dialog = dialog;
    this.left();
    this.stop();
  }

}