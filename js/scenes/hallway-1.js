function addHallway1(x, y) {
  // Ticket area BG
  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "hallways/hallway1-bg.png"
    )
    .setScale(4);

  // Back wall
  createColliderRect(this, x + 200, y + 200, 600, 5, this.colliders);
  // Bottom wall
  createColliderRect(this, x + 0, y + 392, 800, 8, this.colliders);
  // Door top
  createColliderRect(this, x + 0, y + 268, 130, 8, this.colliders);
  // Door bottom
  createColliderRect(this, x + 0, y + 330, 72, 2, this.colliders);
  // Left wall diagonals
  // Upper
  createColliderLine(this, x + 130, y + 270, 75, 80, 5, -5, this.colliders);
  // Lower
  createColliderLine(this, x + 70, y + 330, 75, 80, -5, 5, this.colliders);

  this.add
    .sprite(
      x + this.game.canvas.width / 2,
      y + this.game.canvas.height / 2,
      "atlas",
      "hallways/hallway1-fg.png"
    )
    .setScale(4)
    .setDepth(100000);

  this.starryNightSensor = this.physics.add.sprite(x + 77 * 4, y + 52 * 4, 'atlas', 'red-pixel.png')
    .setScale(4 * 4, 4 * 4)
    .setVisible(false);
  this.starryNightSensor.text = STARRY_NIGHT;

  this.oliveTreesSensor = this.physics.add.sprite(x + 137 * 4, y + 52 * 4, 'atlas', 'red-pixel.png')
    .setScale(4 * 4, 4 * 4)
    .setVisible(false);
  this.oliveTreesSensor.text = OLIVE_TREES;

  const sceneData = {
    name: "hallway-1",
    x: 1,
    y: 0,
    transitions: {
      left: {
        to: "ticket-hall",
        x: x + 10 * 4,
        y: y + 60 * 4,
        camOffset: {
          x: -1,
          y: 0
        }
      },
      right: {
        to: "hallway-2",
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
}

function updateHallway1() {
  handleArtSensor(this, this.starryNightSensor);
  handleArtSensor(this, this.oliveTreesSensor);
}