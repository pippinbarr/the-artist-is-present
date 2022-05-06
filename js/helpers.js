function createColliderRect(self, x, y, width, height, group) {
  let p = self.physics.add.sprite(x, y, 'atlas', 'red-pixel.png');
  p.setOrigin(0, 0);
  p.setVisible(false);
  p.setScale(width, height);
  group.add(p);
  p.setImmovable(true);
}

function createColliderLine(self, fromX, fromY, distX, distY, dX, dY, group) {
  // we need a diagonal, so we'll make it out of dots
  let x = 0;
  let y = 0;
  // let lineGroup = new Phaser.GameObjects.Group();
  while (Math.abs(x) <= distX && Math.abs(y) <= distY) {
    let p = self.physics.add.sprite(fromX + x, fromY + y, 'atlas', 'red-pixel.png');
    p.setOrigin(0, 0);
    p.setScale(1, 1);
    p.setVisible(false);
    // lineGroup.add(p);
    group.add(p);
    p.setImmovable(true);
    x += dX;
    y += dY;
  }
}

function handleSensor(scene, sensor) {
  if (scene.physics.overlap(scene.player, sensor)) {
    if (!sensor.overlap) {
      scene.player.up();
      scene.dialog.y = 100;
      scene.dialog.showMessage(sensor.text, () => {});
      sensor.overlap = true;
    }
  } else {
    sensor.overlap = false;
  }
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}