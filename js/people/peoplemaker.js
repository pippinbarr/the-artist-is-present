function generatePalette(from) {
  let palette = {};

  palette.eyes = Phaser.Display.Color.IntegerToColor(getRandom(from.eyes));
  palette.mouth = Phaser.Display.Color.IntegerToColor(getRandom(from.mouth));
  palette.skin = Phaser.Display.Color.IntegerToColor(getRandom(from.skin));

  // THE SHIRT

  let shirtColor = Phaser.Display.Color.IntegerToColor(getRandom(from.shirt));
  let sleeveColor = shirtColor.clone()
    .brighten(10);

  let shirtRandom = Math.random();

  palette.shirt = shirtColor;
  palette.upperSleeve = sleeveColor;
  palette.lowerSleeve = sleeveColor;

  if (shirtRandom < 0.4) {
    palette.lowerSleeve = palette.skin;
  } else if (shirtRandom < 0.6) {
    palette.upperSleeve = palette.skin;
    palette.lowerSleeve = palette.skin;
  }

  // The hair
  const TRANSPARENT = Phaser.Display.Color.IntegerToColor(0x00000000)
    .transparent();

  // Default: short hair
  const HAIR = Phaser.Display.Color.IntegerToColor(getRandom(from.hair));
  palette.shortHair = HAIR;
  palette.midHair = TRANSPARENT;
  palette.longHair = TRANSPARENT;
  palette.shirtHair = palette.shirt;
  palette.neck = palette.skin;

  let hairRandom = Math.random();
  if (hairRandom < 0.3) {
    // Medium hair
    palette.midHair = HAIR;
  } else if (hairRandom < 0.6) {
    // Long hair
    palette.midHair = HAIR;
    palette.longHair = HAIR;
    palette.neck = HAIR;
    palette.shirtHair = HAIR;
  }

  // Belt
  let beltRandom = Math.random();

  palette.belt = Phaser.Display.Color.IntegerToColor(getRandom(from.belt));

  // 70% change of no belt
  if (beltRandom < 0.7) {
    palette.belt = palette.shirt;
  }

  // Everyone wears pants in this world
  palette.pants = Phaser.Display.Color.IntegerToColor(getRandom(from.pants));
  palette.shorts = palette.pants;

  // Shoes/boots

  let shoeRandom = Math.random();

  palette.shoes = Phaser.Display.Color.IntegerToColor(getRandom(from.shoes));
  palette.boots = palette.shoes;

  if (shoeRandom < 0.3) {
    palette.boots = palette.pants;
  }

  return palette;
}

function generateTexture(game, swapPalette, newPalette, id, sheetData) {

  // Create sheets and animations from base sheet.
  let sheet = game.textures.get('person-spritesheet')
    .getSourceImage();
  // let atlasKey, anim, animKey;
  // let canvasTexture, canvas, context, imageData, pixelArray;

  let textureKey = `person-spritesheet-${id}`;

  // Create a canvas to draw new image data onto.
  let canvasTexture = game.textures.createCanvas('person-spritesheet-temp', sheet.width, sheet.height);
  let canvas = canvasTexture.getSourceImage();
  let context = canvas.getContext('2d');

  // Copy the sheet.
  context.drawImage(sheet, 0, 0);

  // Get image data from the new sheet.
  let imageData = context.getImageData(0, 0, sheet.width, sheet.height);
  let pixelArray = imageData.data;

  // Iterate through every pixel in the image.
  for (var p = 0; p < pixelArray.length / 4; p++) {
    var index = 4 * p;

    var r = pixelArray[index];
    var g = pixelArray[++index];
    var b = pixelArray[++index];
    var alpha = pixelArray[++index];

    // If this is a transparent pixel, ignore, move on.
    if (alpha === 0) {
      continue;
    }

    // Iterate through the colors in the palette.
    let swapKeys = Object.keys(swapPalette);
    for (let keyIndex = 0; keyIndex < swapKeys.length; keyIndex++) {
      let oldColor = Phaser.Display.Color.IntegerToColor(swapPalette[swapKeys[keyIndex]]);
      let newColor = newPalette[swapKeys[keyIndex]];

      // console.log(r, g, b);

      // pixelArray[index] = 255; //newColor.a;
      // pixelArray[--index] = 0; //newColor.b;
      // pixelArray[--index] = 0; //newColor.g;
      // if (r === 255 && g === 255 && b === 255) {
      //   pixelArray[--index] = 0; //newColor.r;
      // }
      // else {
      //   pixelArray[--index] = 255; //newColor.r;
      // }

      // If the color matches, replace the color.
      if (r === oldColor.r && g === oldColor.g && b === oldColor.b && alpha === 255) {
        pixelArray[index] = newColor.a;
        pixelArray[--index] = newColor.b;
        pixelArray[--index] = newColor.g;
        pixelArray[--index] = newColor.r;
      }
    }
  }

  // Put our modified pixel data back into the context.
  context.putImageData(imageData, 0, 0);

  // Add the canvas as a sprite sheet to the game.
  game.textures.addSpriteSheet(textureKey, canvasTexture.getSourceImage(), sheetData);

  // Destroy temp texture.
  game.textures.get('person-spritesheet-temp')
    .destroy();

  return textureKey;

  // Destroy textures that are not longer needed.
  // NOTE: This doesn't remove the textures from TextureManager.list.
  //       However, it does destroy source image data.
  // game.textures.get('person-spritesheet').destroy();
}

function generateAnimations(game, texture, id) {
  // Create animations
  generateAnimation(game, texture, 'idle-h', id, 23, 23, 10, 0);
  generateAnimation(game, texture, 'walking-h', id, 1, 8, 10, -1);
  generateAnimation(game, texture, 'idle-u', id, 22, 22, 10, 0);
  generateAnimation(game, texture, 'walking-u', id, 16, 21, 10, -1);
  generateAnimation(game, texture, 'idle-d', id, 15, 15, 10, 0);
  generateAnimation(game, texture, 'walking-d', id, 9, 14, 10, -1);
  generateAnimation(game, texture, 'sitting', id, 24, 24, 10, 0);
}

function generateAnimation(game, sheet, name, id, start, end, framerate, repeat) {

  // console.log(`Creating animation: ${name}-${id}`);

  if (game.anims.get(`${name}-${id}`) !== undefined) return;

  let frames = game.anims.generateFrameNames(sheet, {
    start: start - 1,
    end: end - 1,
  });

  let config = {
    key: `${name}-${id}`,
    frames: frames,
    frameRate: framerate,
    repeat: repeat,
  };

  game.anims.create(config);
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}