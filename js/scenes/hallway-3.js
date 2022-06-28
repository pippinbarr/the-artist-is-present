function addHallway3(x, y) {
  // Ticket area BG
  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "hallways/hallway3-bg.png"
    )
    .setScale(4);

  // Back wall
  createColliderRect(this, x + 0, y + 200, 800, 5, this.colliders);
  // Bottom wall
  createColliderRect(this, x + 0, y + 392, 800, 8, this.colliders);

  const sceneData = {
    name: "hallway-3",
    x: 3,
    y: 0,
    transitions: {
      left: {
        to: "hallway-2",
        x: x + 4 * 4,
        y: y + 60 * 4,
        camOffset: {
          x: -1,
          y: 0
        }
      },
      right: {
        to: "atrium",
        x: x + 196 * 4,
        y: y + 60 * 4,
        camOffset: {
          x: 1,
          y: 0
        }
      }
    },
  };
  this.addScene(sceneData);

  this.dancersSensor = this.physics.add.sprite(x + 59 * 4, y + 52 * 4, 'atlas', 'red-pixel.png')
    .setScale(4 * 4, 4 * 4)
    .setVisible(false);
  this.dancersSensor.text = DANCERS;
}

function updateHallway3() {
  handleArtSensor(this, this.dancersSensor);
}