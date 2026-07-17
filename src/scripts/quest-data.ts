// The Dark Beacons — quest content (scenes, items, endings).
// Spec: docs/quest-spec.md. This file is pure data: Stuart can add scenes,
// items, and endings here without touching the engine (quest.ts).
//
// Voice rules: fantasy plays it straight, humor is dry and infrequent,
// no em dashes, the dragon never speaks.

// ---------------------------------------------------------------
// Types (the contract the engine in quest.ts interprets)
// ---------------------------------------------------------------

/** Requirement. Multiple keys on one object are ANDed. */
export interface Req {
  item?: string;
  flag?: string;
  anyFood?: boolean;
  all?: Req[];
  any?: Req[];
}

export interface RollSpec {
  threshold: number; // d20 result needed (>=)
  success: Action;
  fail: Action;
}

export interface Action {
  print?: string[];
  addItems?: string[];
  removeItems?: string[];
  removeAnyFood?: boolean;
  setFlags?: string[];
  goto?: string;
  ending?: string;
  roll?: RollSpec;
  branch?: { if: Req; then: Action; else: Action };
}

export interface Choice {
  label: string;
  requires?: Req; // choice is hidden when unmet
  action: Action;
}

export interface Scene {
  id: string;
  text: string[];
  /** Applied once when arriving via an action (not on look/resume). */
  enter?: Action & { loseRandomItem?: boolean };
  choices: Choice[];
}

export interface Ending {
  id: string;
  text: string[];
}

// ---------------------------------------------------------------
// Config
// ---------------------------------------------------------------

export const INVENTORY_SIZE = 3;
export const START_SCENE = 'village-night';
export const SAVE_KEY = 'quest-save';
export const ENDINGS_KEY = 'quest-endings';

export const TITLE = 'THE DARK BEACONS';
export const INTRO = [
  'a very small adventure. maybe five minutes.',
  "type the number of a choice. 'bag', 'look', 'help' and 'quit' also work.",
];

export const ITEMS: Record<string, { name: string; food?: boolean }> = {
  rope: { name: 'coil of rope' },
  lantern: { name: 'old lantern' },
  bread: { name: 'loaf of bread', food: true },
  map: { name: 'hot-springs map' },
  feather: { name: "raven's feather" },
  meat: { name: 'dried meat', food: true },
  stone: { name: 'smooth river stone' },
};

// Condition for knowing how to befriend the dragon (used at the summit)
const CAN_BEFRIEND: Req = {
  all: [{ flag: 'knows_name' }, { any: [{ flag: 'fed_someone' }, { anyFood: true }] }],
};

// ---------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------

export const SCENES: Record<string, Scene> = {
  'village-night': {
    id: 'village-night',
    text: [
      'Night. Rain on the shutters. The old beacon-keeper stands at your door,',
      'soaked through and furious at the weather. The mountain beacons have gone',
      'dark one by one, and no message has crossed the range in nine days.',
      '"My knees are done," he says. "Yours are not. Fetch your coat."',
    ],
    choices: [
      { label: 'accept, and go pack', action: { goto: 'packing' } },
      {
        label: 'ask about the beacons first',
        action: {
          print: [
            'He snorts. "Nine days of silence and suddenly everyone remembers the',
            'beacons exist. They carry every word that crosses these mountains.',
            'Carried," he corrects himself, and looks old while he does it.',
          ],
          goto: 'packing',
        },
      },
    ],
  },

  packing: {
    id: 'packing',
    text: [
      'Your shed, by candlelight. Boots, coat, flint. Room in the pack for one',
      'thing more.',
    ],
    choices: [
      {
        label: 'a good coil of rope',
        action: {
          print: ['The rope has never once let you down. It comes along.'],
          addItems: ['rope'],
          goto: 'thornwood-gate',
        },
      },
      {
        label: "your father's old lantern",
        action: {
          print: ['It flickers twice, then steadies. Mostly it is sentimental. It comes along.'],
          addItems: ['lantern'],
          goto: 'thornwood-gate',
        },
      },
      {
        label: 'a loaf of bread for the road',
        action: {
          print: ['Still warm from the evening bake. It comes along.'],
          addItems: ['bread'],
          goto: 'thornwood-gate',
        },
      },
    ],
  },

  'thornwood-gate': {
    id: 'thornwood-gate',
    text: [
      'The Thornwood stands between the village and the climb. Three ways through:',
    ],
    choices: [
      { label: 'the main path, wide and worn', action: { goto: 'thornwood-path' } },
      { label: 'the dry riverbed, quiet and out of the wind', action: { goto: 'thornwood-riverbed' } },
      {
        label: 'toward the raven calling from the fence post, like it means something',
        action: { goto: 'thornwood-raven' },
      },
    ],
  },

  'thornwood-path': {
    id: 'thornwood-path',
    text: [
      'Wolf tracks cross the path, fresh, headed uphill. Halfway through the wood',
      "you find a keeper's satchel, torn open and empty, its strap bitten clean",
      'through. You walk faster.',
    ],
    choices: [{ label: 'keep moving', action: { goto: 'first-beacon' } }],
  },

  'thornwood-riverbed': {
    id: 'thornwood-riverbed',
    text: [
      'The riverbed is smooth stones and silence. Warm mist rises from a side',
      "gully. In a ranger's cairn, stacked with care by someone long past caring,",
      'you find a waxed map of the mountain hot springs.',
    ],
    enter: {
      addItems: ['map'],
      print: ['You take the map and re-stack the stones properly.'],
    },
    choices: [
      {
        label: 'pocket one of the smooth stones as well',
        action: {
          print: ['Round, grey, perfectly smooth. Impossible to leave behind.'],
          addItems: ['stone'],
          goto: 'first-beacon',
        },
      },
      { label: 'walk on', action: { goto: 'first-beacon' } },
    ],
  },

  'thornwood-raven': {
    id: 'thornwood-raven',
    text: [
      'The raven waits on a low branch. It looks at your pack, then at you,',
      'then at the pack again.',
      '"Say the thing," it croaks. "Travelers never say the thing."',
    ],
    choices: [
      {
        label: 'share your food with the raven',
        requires: { anyFood: true },
        action: {
          print: [
            'It eats with terrible dignity, then drops a black feather at your feet.',
            '"For the cold one," it says. Then, once and clearly: "The name is Sereth.',
            'You will not hear it twice."',
          ],
          removeAnyFood: true,
          addItems: ['feather'],
          setFlags: ['raven_favor', 'fed_someone', 'knows_name'],
          goto: 'first-beacon',
        },
      },
      {
        label: 'ask it to show you the way, roughly',
        action: {
          print: [
            'The raven fixes you with one eye. "Ask exactly," it says. "I do not',
            'repeat myself, and neither should you." It waits. It can wait all night.',
          ],
        },
      },
      {
        label: 'press on into the wood',
        action: {
          print: ['The raven watches you go with an air of low expectations.'],
          goto: 'first-beacon',
        },
      },
    ],
  },

  'first-beacon': {
    id: 'first-beacon',
    text: [
      'The first beacon tower, abandoned mid-meal. A cup still on the table,',
      "the fire pit cold under last night's frost. The logbook's final entry",
      'reads: "fire low. will fix tomorrow."',
    ],
    choices: [
      {
        label: 'search the tower',
        action: {
          print: ['A rack of dried meat hangs in the store room, forgotten. You take some.'],
          addItems: ['meat'],
          goto: 'high-pass',
        },
      },
      {
        label: 'read the whole logbook',
        action: {
          print: [
            'Weeks of entries, all alike. "All quiet." "All quiet." "Wind." Then:',
            '"fire low. will fix tomorrow." You decide to be somebody who fixes it today.',
          ],
          goto: 'high-pass',
        },
      },
      { label: 'press on up the mountain', action: { goto: 'high-pass' } },
    ],
  },

  'high-pass': {
    id: 'high-pass',
    text: [
      'Wolves on the scree. Three of them, spread out the way wolves do when',
      'they have already decided. The pass is narrow and the light is going.',
    ],
    choices: [
      {
        label: 'stand and swing',
        action: {
          roll: {
            threshold: 10,
            success: {
              print: [
                'You catch the leader across the muzzle with your stick and shout',
                'yourself hoarse. The pack thinks better of it and melts into the rocks.',
              ],
              goto: 'summit-approach',
            },
            fail: { goto: 'defeat-tumble' },
          },
        },
      },
      {
        label: 'throw the dried meat',
        requires: { item: 'meat' },
        action: {
          print: ['You throw the meat wide. The wolves choose the easier dinner and let you pass.'],
          removeItems: ['meat'],
          setFlags: ['fed_someone'],
          goto: 'summit-approach',
        },
      },
      {
        label: 'climb the scree wall',
        action: {
          branch: {
            if: { item: 'rope' },
            then: {
              print: [
                'You loop the rope over a dead pine above the scree and haul yourself',
                'up past the whole argument.',
              ],
              goto: 'summit-approach',
            },
            else: {
              roll: {
                threshold: 14,
                success: {
                  print: [
                    'Loose rock and bad handholds, but you make the top with your boots',
                    'full of gravel and your heart in your ears.',
                  ],
                  goto: 'summit-approach',
                },
                fail: { goto: 'defeat-tumble' },
              },
            },
          },
        },
      },
    ],
  },

  'defeat-tumble': {
    id: 'defeat-tumble',
    text: [
      'You wake at the foot of the first beacon, bruised in every place you own.',
      'The pass is still up there. So, unfortunately, are the wolves.',
    ],
    enter: { loseRandomItem: true },
    choices: [{ label: 'climb back to the pass', action: { goto: 'high-pass' } }],
  },

  'summit-approach': {
    id: 'summit-approach',
    text: [
      'The last tower stands above the snow line. No smoke. But through the',
      'arrow slits comes a deep, slow glow where the firewood should be stacked.',
      'It brightens and dims. Brightens, and dims. Like breathing.',
    ],
    choices: [{ label: 'go in', action: { goto: 'summit-reveal' } }],
  },

  'summit-reveal': {
    id: 'summit-reveal',
    text: [
      'A young dragon is curled in the beacon basin, wings wrapped tight around',
      'itself, scales dull with cold. Char and ash all around: it has been eating',
      'the signal fires to stay warm. It does not attack. It watches you. It shivers.',
    ],
    choices: [
      {
        label: 'drive it off',
        action: {
          roll: {
            threshold: 12,
            success: { ending: 'drove' },
            fail: {
              print: [
                'A wall of wing knocks you back through the gates and into the snow.',
                'It could have done far worse and you both know it. When you look up,',
                'the dragon has turned away, and something in its shoulders looks sorry.',
              ],
              goto: 'summit-approach',
            },
          },
        },
      },
      {
        label: 'offer the hot-springs map',
        requires: { item: 'map' },
        action: { ending: 'relocate' },
      },
      {
        label: 'speak its name and share what food you carry',
        requires: CAN_BEFRIEND,
        action: { ending: 'befriend' },
      },
      {
        label: 'back away and think',
        action: {
          branch: {
            if: { any: [{ item: 'map' }, CAN_BEFRIEND] },
            then: { print: ['You step back into the doorway. The dragon watches you think.'] },
            else: {
              print: [
                'You step back into the doorway. In the keeper\'s notes nailed by the',
                'door, one line is underlined twice: "a fed dragon is a listening dragon."',
              ],
            },
          },
        },
      },
    ],
  },
};

// ---------------------------------------------------------------
// Endings
// ---------------------------------------------------------------

export const ENDINGS: Record<string, Ending> = {
  drove: {
    id: 'drove',
    text: [
      'You shout and swing and make yourself enormous, and the dragon, young and',
      'tired, believes you. It clears the tower in one cold rush of wings.',
      'You relight the beacon. Within the hour an answering light shows in the',
      'east, and the realm\'s messages fly again.',
      'You watch the dark shape glide north and wonder where it will keep warm.',
    ],
  },
  relocate: {
    id: 'relocate',
    text: [
      'You unfold the map slowly and lay it on the stones. The dragon studies it',
      'a long time: hot springs, two valleys south, warm water all winter.',
      'It chirps once, the only sound you ever hear it make, and by morning it',
      'is gone. You relight the beacon, and the mountains speak again.',
    ],
  },
  befriend: {
    id: 'befriend',
    text: [
      '"Sereth," you say, and the dragon goes very still.',
      'You turn out your pack and offer everything left worth eating, which is',
      'not much, and somehow enough. It eats with terrible dignity.',
      'When the keeper finally makes the climb, he finds the beacon burning',
      'steady, a dragon curled around the basin, and its breath keeping the',
      'flame through any storm. He makes it official: the beacon has a new keeper.',
      'The fire never goes cold again.',
    ],
  },
};

export const EPILOGUE_TIEBACK =
  "(You seem good at fixing things nobody else could reach. run 'open contact' if you know someone hiring.)";
