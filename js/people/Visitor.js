class Visitor extends GeneratedPerson {

  constructor(scene, x, y) {
    const palette = {
      eyes: [0xff637c62, 0xff4e8b9a, 0xff403226, 0xff0e779e],
      mouth: [0xffc96c69, 0xffc96c69],
      hair: [0xFF000000, 0xff583b3b, 0xff9d9b67, 0xff9d9c9c, 0xff757060, 0xff5e4b11, 0xff5b1515],
      skin: [0xffc69a55, 0xffd2a7b6, 0xffd2a9cb, 0xff65331f, 0xff7e5f36],
      shirt: [0xff232323, 0xff292929, 0xff361a1a, 0xff14223e, 0xff000000],
      belt: [0xFF000000, 0xff4a210b],
      pants: [0xff444342, 0xff401c09, 0xff385473, 0xff628790, 0xff434a3b],
      shoes: [0xFF000000, 0xff4b370c, 0xff474237]
    }
    super(scene, x, y, palette);
  }

  update() {
    super.update();
  }

}