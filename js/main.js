const DEBUG = false;
let MOBILE = false;

const START_SCENE = 'moma-exterior';
let QUEUE = [];
const QUEUE_LENGTH = 30;
const QUEUE_X = 440;
const QUEUE_Y = 182;
const QUEUE_SPACING = 56;

let PLAYER = undefined;

let lastScene = undefined;
let last = {
  scene: 'tickets',
  x: undefined,
  y: 80 * 4
}

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  scene: [
    Boot, Preloader, TAIPScene, Title, MOMAExterior, Tickets, Hallway1,
    Hallway2, Hallway3, Atrium, GameOver
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