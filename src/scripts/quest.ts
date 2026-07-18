// The Dark Beacons — quest engine.
// Generic interpreter for the scene graph in quest-data.ts: scenes, choices
// with requirements, item grants (3-slot pack with drop prompt), d20 checks,
// flags, endings. Runs inside the terminal's game mode (captures all input
// until an ending or quit). No content lives here; edit quest-data.ts instead.

import type { TerminalCtx } from './terminal';
import {
  type Action,
  type Req,
  type RollSpec,
  type Scene,
  ENDINGS,
  ENDINGS_KEY,
  EPILOGUE_TIEBACK,
  INTRO,
  INVENTORY_SIZE,
  ITEMS,
  SAVE_KEY,
  SCENES,
  START_SCENE,
  TITLE,
} from './quest-data';

const GREEN = 'text-terminal-green';
const ORANGE = 'text-terminal-orange';
const MUTED = 'text-terminal-muted';

interface SaveState {
  scene: string;
  inv: string[];
  flags: string[];
}

type Pending =
  | { type: 'roll'; spec: RollSpec }
  | { type: 'rolling' }
  | { type: 'drop'; itemId: string; then: Action }
  | { type: 'quit' }
  | null;

function loadSave(): SaveState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data.scene === 'string' && SCENES[data.scene]) {
      return { scene: data.scene, inv: data.inv ?? [], flags: data.flags ?? [] };
    }
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  return null;
}

function loadEndings(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ENDINGS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function resetQuest(ctx: TerminalCtx) {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* nothing to clear */
  }
  ctx.print("the story resets. type 'quest' to begin again.", MUTED);
}

export function startQuest(ctx: TerminalCtx) {
  new Game(ctx).begin();
}

class Game {
  private ctx: TerminalCtx;
  private state: SaveState;
  private pending: Pending = null;
  private resumed: boolean;

  constructor(ctx: TerminalCtx) {
    this.ctx = ctx;
    const save = loadSave();
    this.resumed = !!save;
    this.state = save ?? { scene: START_SCENE, inv: [], flags: [] };
  }

  begin() {
    this.ctx.enterMode({ name: 'quest', onInput: (raw) => this.onInput(raw) });
    this.ctx.printSegs([{ t: TITLE, c: ORANGE }]);
    for (const line of INTRO) this.ctx.print(line, MUTED);
    if (this.resumed) this.ctx.print('resuming where you left off...', MUTED);
    this.renderScene();
    this.save();
  }

  // ------------------------------------------------------------
  // State helpers
  // ------------------------------------------------------------

  private save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    } catch {
      /* storage unavailable: play on without saving */
    }
  }

  private scene(): Scene {
    return SCENES[this.state.scene];
  }

  private meets(req: Req | undefined): boolean {
    if (!req) return true;
    if (req.item && !this.state.inv.includes(req.item)) return false;
    if (req.flag && !this.state.flags.includes(req.flag)) return false;
    if (req.anyFood && !this.state.inv.some((id) => ITEMS[id]?.food)) return false;
    if (req.all && !req.all.every((r) => this.meets(r))) return false;
    if (req.any && !req.any.some((r) => this.meets(r))) return false;
    return true;
  }

  private visibleChoices() {
    return this.scene().choices.filter((c) => this.meets(c.requires));
  }

  private itemName(id: string) {
    return ITEMS[id]?.name ?? id;
  }

  // ------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------

  private renderScene() {
    const scene = this.scene();
    this.ctx.print(' ');
    // Scene text is hard-wrapped in quest-data for readability there;
    // join it so the terminal wraps at its own width instead.
    this.ctx.print(scene.text.join(' '));
    this.visibleChoices().forEach((choice, i) => {
      this.ctx.printSegs([{ t: `  ${i + 1}. `, c: GREEN }, { t: choice.label }]);
    });
  }

  private printBag() {
    if (this.state.inv.length === 0) {
      this.ctx.print('your pack is empty.', MUTED);
      return;
    }
    const names = this.state.inv.map((id) => this.itemName(id)).join(', ');
    this.ctx.print(`your pack (${this.state.inv.length}/${INVENTORY_SIZE}): ${names}`, MUTED);
  }

  private printGameHelp() {
    this.ctx.print('type the number of a choice.', MUTED);
    this.ctx.print("'bag' shows your pack, 'look' reprints the scene,", MUTED);
    this.ctx.print("'quit' leaves the quest (progress is saved).", MUTED);
  }

  // ------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------

  private apply(action: Action) {
    if (action.branch) {
      this.apply(this.meets(action.branch.if) ? action.branch.then : action.branch.else);
      return;
    }
    if (action.print) this.ctx.print(action.print.join(' '));
    if (action.setFlags) {
      for (const flag of action.setFlags) {
        if (!this.state.flags.includes(flag)) this.state.flags.push(flag);
      }
    }
    if (action.removeItems) {
      this.state.inv = this.state.inv.filter((id) => !action.removeItems!.includes(id));
    }
    if (action.removeAnyFood) {
      const idx = this.state.inv.findIndex((id) => ITEMS[id]?.food);
      if (idx >= 0) this.state.inv.splice(idx, 1);
    }
    if (action.addItems) {
      for (const itemId of action.addItems) {
        if (this.state.inv.length >= INVENTORY_SIZE) {
          // Pack is full: ask what to drop, then continue with the rest
          // of this action (goto/ending) once resolved.
          this.promptDrop(itemId, { goto: action.goto, ending: action.ending, roll: action.roll });
          this.save();
          return;
        }
        this.state.inv.push(itemId);
        this.ctx.print(`+ ${this.itemName(itemId)} (in your pack)`, ORANGE);
      }
    }
    this.finish(action);
  }

  /** The goto / ending / roll tail of an action. */
  private finish(action: Action) {
    if (action.roll) {
      this.pending = { type: 'roll', spec: action.roll };
      this.ctx.print("type 'roll' when you are ready.", MUTED);
      this.save();
      return;
    }
    if (action.ending) {
      this.endGame(action.ending);
      return;
    }
    if (action.goto) {
      this.enterScene(action.goto);
      return;
    }
    // No transition: reprint the current scene so the choices stay visible.
    this.renderScene();
    this.save();
  }

  private enterScene(id: string) {
    this.state.scene = id;
    const scene = SCENES[id];
    if (scene.enter) {
      if (scene.enter.loseRandomItem) this.loseRandomItem();
      // Enter effects run before the scene text; supports print/items/flags.
      const { loseRandomItem: _skip, goto: _g, ending: _e, roll: _r, ...rest } = scene.enter;
      if (rest.print) this.ctx.print(rest.print.join(' '));
      if (rest.setFlags) {
        for (const flag of rest.setFlags) {
          if (!this.state.flags.includes(flag)) this.state.flags.push(flag);
        }
      }
      if (rest.addItems) {
        for (const itemId of rest.addItems) {
          if (this.state.inv.length >= INVENTORY_SIZE) {
            this.promptDrop(itemId, {});
            this.save();
            return;
          }
          this.state.inv.push(itemId);
          this.ctx.print(`+ ${this.itemName(itemId)} (in your pack)`, ORANGE);
        }
      }
    }
    this.renderScene();
    this.save();
  }

  private loseRandomItem() {
    if (this.state.inv.length === 0) {
      this.ctx.print('The wolves went through your pack and found nothing worth taking.');
      this.ctx.print('Insulting, but convenient.');
      return;
    }
    const idx = Math.floor(Math.random() * this.state.inv.length);
    const [lost] = this.state.inv.splice(idx, 1);
    this.ctx.print(`The wolves went through your pack. The ${this.itemName(lost)} is gone.`);
  }

  private promptDrop(itemId: string, then: Action) {
    this.pending = { type: 'drop', itemId, then };
    this.ctx.print(`your pack is full. drop something to take the ${this.itemName(itemId)}?`, MUTED);
    this.state.inv.forEach((id, i) => {
      this.ctx.printSegs([{ t: `  ${i + 1}. `, c: GREEN }, { t: `drop the ${this.itemName(id)}` }]);
    });
    this.ctx.printSegs([
      { t: `  ${this.state.inv.length + 1}. `, c: GREEN },
      { t: `leave the ${this.itemName(itemId)} behind` },
    ]);
  }

  // ------------------------------------------------------------
  // Dice
  // ------------------------------------------------------------

  private rollDie(spec: RollSpec) {
    const n = 1 + Math.floor(Math.random() * 20);
    const outcome = () => {
      this.pending = null;
      this.apply(n >= spec.threshold ? spec.success : spec.fail);
      this.save();
    };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.ctx.printSegs([{ t: `[d20] -> ${n}`, c: ORANGE }]);
      outcome();
    } else {
      this.pending = { type: 'rolling' };
      this.ctx.print('rolling...', MUTED);
      window.setTimeout(() => {
        this.ctx.printSegs([{ t: `[d20] -> ${n}`, c: ORANGE }]);
        outcome();
      }, 700);
    }
  }

  // ------------------------------------------------------------
  // Endings
  // ------------------------------------------------------------

  private endGame(endingId: string) {
    const ending = ENDINGS[endingId];
    this.ctx.print(' ');
    this.ctx.print(ending.text.join(' '));
    let found = loadEndings();
    if (!found.includes(endingId)) found = [...found, endingId];
    try {
      localStorage.setItem(ENDINGS_KEY, JSON.stringify(found));
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* storage unavailable */
    }
    this.ctx.print(`quest complete. endings found: ${found.length}/${Object.keys(ENDINGS).length}.`, MUTED);
    this.ctx.print(EPILOGUE_TIEBACK, MUTED);
    this.ctx.exitMode();
  }

  // ------------------------------------------------------------
  // Input
  // ------------------------------------------------------------

  private onInput(raw: string) {
    const input = raw.trim().toLowerCase();
    if (!input) return;

    // Pending sub-states first
    if (this.pending?.type === 'rolling') {
      this.ctx.print('the die is still tumbling.', MUTED);
      return;
    }
    if (this.pending?.type === 'quit') {
      if (input === 'y' || input === 'yes') {
        this.pending = null;
        this.save();
        this.ctx.print("the mountains will wait. type 'quest' to pick up where you left off.", MUTED);
        this.ctx.exitMode();
      } else {
        this.pending = null;
        this.ctx.print('onward, then.', MUTED);
        this.renderScene();
      }
      return;
    }
    if (this.pending?.type === 'drop') {
      const { itemId, then } = this.pending;
      const n = parseInt(input, 10);
      if (input === 'bag') {
        this.printBag();
        return;
      }
      if (!Number.isFinite(n) || n < 1 || n > this.state.inv.length + 1) {
        this.ctx.print(`type a number from 1 to ${this.state.inv.length + 1}.`, MUTED);
        return;
      }
      this.pending = null;
      if (n === this.state.inv.length + 1) {
        this.ctx.print(`you leave the ${this.itemName(itemId)} where it lies.`, MUTED);
      } else {
        const [dropped] = this.state.inv.splice(n - 1, 1);
        this.state.inv.push(itemId);
        this.ctx.print(`you set down the ${this.itemName(dropped)}.`, MUTED);
        this.ctx.print(`+ ${this.itemName(itemId)} (in your pack)`, ORANGE);
      }
      this.finish(then);
      return;
    }
    if (this.pending?.type === 'roll') {
      if (input === 'roll') {
        this.rollDie(this.pending.spec);
      } else if (input === 'bag') {
        this.printBag();
      } else if (input === 'quit') {
        this.pending = { type: 'quit' };
        this.ctx.print('quit the quest? progress is saved. (y/n)', MUTED);
      } else {
        this.ctx.print("now is not the time. type 'roll'.", MUTED);
      }
      return;
    }

    // Game commands
    if (input === 'bag' || input === 'inventory') {
      this.printBag();
      return;
    }
    if (input === 'look') {
      this.renderScene();
      return;
    }
    if (input === 'help') {
      this.printGameHelp();
      return;
    }
    if (input === 'quit' || input === 'exit') {
      this.pending = { type: 'quit' };
      this.ctx.print('quit the quest? progress is saved. (y/n)', MUTED);
      return;
    }

    // Numbered choice
    const n = parseInt(input, 10);
    const choices = this.visibleChoices();
    if (Number.isFinite(n) && n >= 1 && n <= choices.length) {
      this.apply(choices[n - 1].action);
      this.save();
      return;
    }
    this.ctx.print(`type a number from 1 to ${choices.length}, or 'help'.`, MUTED);
  }
}
