const DEBUG = false;
let MOBILE = false;

const START_SCENE = `world`;

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  // scene: [
  //   Boot, Preloader, TAIPScene, Title, MOMAExterior, Tickets, Hallway1,
  //   Hallway2, Hallway3, Atrium, GameOver, World
  // ],
  scene: [
    Boot, Preloader, Title, World, Debug
  ],
  pixelArt: true,
  antialias: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG
    }
  },
  scale: {
    // parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.BOTH,
    width: 800,
    height: 400
  }
};

let game = new Phaser.Game(config);