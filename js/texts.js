// STARTUP

const WAKEUP_MESSAGE = `Good morning, Marina. It's time to get up and go to the museum for your performance. Press ANY KEY to dismiss this dialog, then use the ARROW KEYS to move.`;
const WAKEUP_MESSAGE_MOBILE = `Good morning, Marina. It's time to get up and go to the museum for your performance. TAP dialogs to dismiss them, then TAP in the direction you want to walk.`;
const BACK_TO_BED_MESSAGE = `It's not bed time, it's time to go to work.`;

// DEPARTURE

const CAR_WAITING_MESSAGE = `Your driver is waiting to drive you to the museum. Approach the passenger side to get into the car.`;
let seenCarWaiting = false;
const CAR_STILL_WAITING_MESSAGE = `Your driver is still waiting. You should probably get moving.`;

const LEAVING_APARTMENT_ON_FOOT_MESSAGE = `The car is there to pick you up for a reason, no need to walk.`;

// MUSEUM MESSAGES

const MOMA_ARRIVAL_MESSAGE = `Here you finally are at the Museum of Modern Art in New York, ready to perform your work "The Artist Is Present".`;

let seenMOMAMessage = false;
const OUTSIDE_MOMA_MESSAGE = `Now is not the time for wandering outside. Get in there and start the performance!`;

const LEAVING_MOMA_ON_FOOT_MESSAGE = `There's nowhere you need to be except the museum right now.`;

const TICKETS_DESK_MESSAGE = "Hi Ms. Abramovic! I hope the performance goes well today.";
const TICKETS_GUARD_MESSAGE = "Good luck, Ms. Abramovic.";

// THE ARTWORKS

const STARRY_NIGHT = "Starry Night\nVincent Van Gogh\n1889\nOil on canvas";

const OLIVE_TREES = "The Olive Trees with the Alpilles in the Background\nVincent Van Gogh\n1889\nOil on canvas";

const SOUP_CANS = "Campbell's Soup Cans\nAndy Warhol\n1962\nSynthetic polymer paint on canvas";

const DANCERS = "The Dance I\nHenry Matisse\n1909\nOil on canvas";

// THE QUEUE

// What they say as you walk past
// Need a minimum of, let's say 12-15 to avoid repetition
const WHISPERS = [
  "It's her!",
  "She's here!",
  "It's Marina!",
  "Oh my god...",
  "I can't believe she's here...",
  "There she is!",
  "This is the best day of my life!",
  "Look! It's Marina!",
  "She's coming!",
  "The artist is present!",
  "Here comes Marina!",
  "It's about to start!",
  "This is amazing!",
  "It feels like a dream!",
  "Marina!",
];

// What they say if you directly approach them, need a minimum of 30
// to have one fresh one per queue member...
const QUEUE_TALK = [
  "It's you!",
  "Oh wow...",
  "I can't wait to sit with you!",
  "I can't believe I'm meeting you right now!",
  "Is this really happening?",
  "I feel like I'm dreaming!",
  "I've waited so long for a chance to meet you...",
  "I'm so excited!",
  "Is it really you?!",
  "Marina!",
  "Oh my god!",
  "It's such an honor!",
  "You're my hero!",
  "You're a genius, Marina!",
  "...",
  "This is unbelievable!",
  "I'm your biggest fan!",
  "I love what you do!",
  "I love you!",
  "This is so special!",
  "I'm so looking forward to this, Marina!",
  "This work is such a wonderful idea!",
  "I wish you were my mother!",
  "You're incredible!",
  "You inspire me so much!",
  "I can't believe you're really here!",
  "This is like a dream come true!",
  "Hello!",
  "I feel like I know you!",
  "I can't believe Marina Abramovic is standing in front of me!"
];

// This is what the atrium guards say
const GUARD_TALK = [
  "Good luck today. We're ready when you are.",
  "Please take your seat when you're ready.",
];

// THE PERFORMANCE SEQUENCE

const HEAD_DOWN_INSTRUCTIONS = `Press any key to lower your head and invite the next visitor to join you.`;
const HEAD_DOWN_INSTRUCTIONS_MOBILE = `TAP this dialog to lower your head and invite the next visitor to join you.`;

const HEAD_UP_INSTRUCTIONS = `Press any key to look up.`;
const HEAD_UP_INSTRUCTIONS_MOBILE = `TAP this dialog to look up.`;

const CLOSING_WARNING_MESSAGE = `"Attention all patrons, The Museum of Modern Art will be closing in fifteen minutes."`;
const CLOSED_MESSAGE = `"Attention all patrons, The Museum of Modern Art is now closed."`;

const GAMEOVER_TEXT =
  `Thank you for playing The Artist is Present 2!\n\n\nCome back again tomorrow and continue your work!`;