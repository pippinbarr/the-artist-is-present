class GeneratedPerson extends Person {

  constructor(scene, x, y, palette) {

    const swapPalette = {
      shortHair: 0xFFFBEEBA,
      midHair: 0xFFA2F3B1,
      longHair: 0xFF58502C,
      neck: 0xFFA7B7F5,
      shirtHair: 0xFFF5F264,
      eyes: 0xFF000000,
      mouth: 0xFFFA2500,
      skin: 0xFF0000,
      shirt: 0xFF1E92EA,
      upperSleeve: 0xFF8AEF5F,
      lowerSleeve: 0xFF25A344,
      belt: 0xFF585858,
      shorts: 0xFFF7EA5D,
      pants: 0xFF3AEEA5,
      boots: 0xFFEDC4EB,
      shoes: 0xFF3CF8FB
    };
    const sheetData = {
      frameWidth: 14,
      frameHeight: 35,
    };

    const id = ++GeneratedPerson.nextId;

    const newPalette = generatePalette(palette);
    const texture = generateTexture(scene.game, swapPalette, newPalette, id, sheetData);
    generateAnimations(scene.game, texture, id);

    super(scene, x, y, texture, `-${id}`);

    this.id = id;
    this.palette = newPalette;
    this.setImmovable(true);
    // this.body.immovable = true; // This seems to cause wall problems
  }

  create() {

  }

  update() {

  }

}

GeneratedPerson.nextId = 0;