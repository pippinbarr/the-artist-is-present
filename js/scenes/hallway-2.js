function addHallway2(x, y) {
  // Ticket area BG
  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "hallways/hallway2-bg.png"
    )
    .setScale(4);

  // Back wall
  createColliderRect(this, x + 0, y + 200, 800, 5, this.colliders);
  // Bottom wall
  createColliderRect(this, x + 0, y + 392, 800, 8, this.colliders);

  const sceneData = {
    name: "hallway-2",
    x: 2,
    y: 0,
    transitions: {
      left: {
        to: "hallway-1",
        x: x + 4 * 4,
        y: y + 60 * 4,
        camOffset: {
          x: -1,
          y: 0
        }
      },
      right: {
        to: "hallway-3",
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

  this.soupCansSensor = this.physics.add.sprite(x + 57 * 4, y + 52 * 4, 'atlas', 'red-pixel.png')
    .setScale(4 * 4, 4 * 4)
    .setVisible(false);
  this.soupCansSensor.text = SOUP_CANS;
}

function updateHallway2() {
  handleArtSensor(this, this.soupCansSensor);
}