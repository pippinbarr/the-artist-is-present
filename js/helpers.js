function getNYCTime() {
  // Get the time now
  let now = new Date();
  // Offset the time now (millis) back to UTC millis using the offset
  let offset = now.getTime() + (now.getTimezoneOffset() * 60000);
  // Get the UTC time
  let utc = new Date(offset);
  // Get the NYC time by adding the DST offset to the UTC time
  // DST because when the show was on back in 2010 is was DST
  let nycOffset = utc.getTime() - (4 * 60 * 60000);
  let nyc = new Date(nycOffset);
  // Send it back
  return nyc;
}

function museumIsOpen() {
  let time = getNYCTime();

  let day = time.getDay();
  let date = time.getDate();
  let month = time.getMonth();

  if (!openingHours(time)) {
    return false;
  }

  // Closed Tuesday
  if (day === 2) {
    return false;
  }

  // Closed Christmas
  if (date === 25 && month === 11) {
    return false;
  }

  // Closed Thanksgiving
  if (day === 4 && month === 10) {
    let temp = new Date(time);
    let fourThursdaysAgo = temp.setDate(temp.getDate() - 28);
    if (fourThursdaysAgo.getMonth() === 9) {
      // It's thanksgiving because we're on the fourth thursday
      return false;
    }
  }

  // If we're all the way down here it's open
  return true;
}

function openingHours(time) {
  let hour = time.getHours();
  let minute = time.getMinutes();

  return ((hour === 10 && minute >= 30) ||
    (hour >= 11 && hour < 17) ||
    (hour === 17 && minute < 30));
}

function museumClosingInFifteenMinutes() {
  let time = getNYCTime();
  return (time.getHours() === 17 && time.getMinutes() === 30);
}

function createColliderRect(self, x, y, width, height, group) {
  let p = self.physics.add.sprite(x, y, 'atlas', 'red-pixel.png');
  p.setOrigin(0, 0);
  p.setVisible(false);
  p.setScale(width, height);
  group.add(p);
  // p.setImmovable(true);
  p.setPushable(false);
  return p;
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
    // p.setImmovable(true);
    p.setPushable(false);
    x += dX;
    y += dY;
  }
}

function handleArtSensor(scene, sensor) {
  if (scene.physics.overlap(scene.player, sensor)) {
    if (!sensor.overlap) {
      scene.player.up();
      scene.player.stop();
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