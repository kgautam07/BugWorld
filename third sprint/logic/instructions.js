import { CONDITIONS, CellCondition } from './CellCondition.js';

/* global chai */
const { expect, assert } = chai;

export class Sense {
  /**
   * @param {int} senseDir - 0 for ahead, 1 for right and -1 for left
   * @param {int} s1 - next state for successful check
   * @param {int} s2 - next state for failed check
   * @param {CellCondition} condition - what to check
   */
  constructor(senseDir, s1, s2, condition) {
    this.name = 'sense';
    this.senseDir = senseDir;
    this.s1 = s1;
    this.s2 = s2;
    this.condition = condition;
  }
}

export class Mark {
  constructor(markerPos, s) {
    this.name = 'mark';
    this.markerPos = markerPos;
    this.s = s;
  }
}

export class Unmark {
  constructor(markerPos, s) {
    this.name = 'unmark';
    this.markerPos = markerPos;
    this.s = s;
  }
}

export class PickUp {
  constructor(s1, s2) {
    this.name = 'pickup';
    this.s1 = s1;
    this.s2 = s2;
  }
}

export class Drop {
  constructor(s) {
    this.name = 'drop';
    this.s = s;
  }
}

export class Turn {
  /**
   * @param {int} dir - 1 for right, -1 for left
   * @param {int} s - next state
   */
  constructor(dir, s) {
    this.name = 'turn';
    this.dir = dir;
    this.s = s;
  }
}

export class Move {
  constructor(s1, s2) {
    this.name = 'move';
    this.s1 = s1;
    this.s2 = s2;
  }
}

export class Flip {
  constructor(p, s1, s2) {
    this.name = 'flip';
    this.p = p;
    this.s1 = s1;
    this.s2 = s2;
  }
}

export class Direction {
  constructor(d, s1, s2) {
    this.name = 'direction';
    this.d = d;
    this.s1 = s1;
    this.s2 = s2;
  }
}

export function reconstructInstruction(obj) {
  if (obj.name === 'sense') {
    return new Sense(obj.senseDir, obj.s1, obj.s2, new CellCondition(obj.condition.name));
  } if (obj.name === 'mark') {
    return new Mark(obj.markerPpos, obj.s);
  } if (obj.name === 'unmark') {
    return new Unmark(obj.markerPos, obj.s);
  } if (obj.name === 'pickup') {
    return new PickUp(obj.s1, obj.s2);
  } if (obj.name === 'drop') {
    return new Drop(obj.s);
  } if (obj.name === 'turn') {
    return new Turn(obj.dir, obj.s);
  } if (obj.name === 'move') {
    return new Move(obj.s1, obj.s2);
  } if (obj.name === 'flip') {
    return new Flip(obj.p, obj.s1, obj.s2);
  } if (obj.name === 'direction') {
    return new Direction(obj.d, obj.s1, obj.s2);
  }
  assert.fail(`Unknown name ${obj.name}`);
  return null;
}

export function parseProgram(program) {
  const instructions = [];
  const conditionMap = new Map();
  CONDITIONS.forEach((s) => conditionMap.set(s.toLowerCase(), s));

  program.trim().split('\n').filter((line) => line.length > 0).forEach((line) => {
    const [instructionName, ...args] = line.trim().split(' ');

    switch (instructionName) {
      case 'sense': {
        const [senseDirStr, s1Str, s2Str, conditionName] = args;
        const cond = new CellCondition(conditionMap.get(conditionName));
        const senseDir = parseInt(senseDirStr, 10);
        const s1 = parseInt(s1Str, 10);
        const s2 = parseInt(s2Str, 10);
        instructions.push(new Sense(senseDir, s1, s2, cond));
        break;
      }
      case 'mark': {
        const [markerPos, s] = args;
        instructions.push(new Mark(parseInt(markerPos, 10), parseInt(s, 10)));
        break;
      }
      case 'unmark': {
        const [markerPos, s] = args;
        instructions.push(new Unmark(parseInt(markerPos, 10), parseInt(s, 10)));
        break;
      }
      case 'pickup': {
        const [s1, s2] = args;
        instructions.push(new PickUp(parseInt(s1, 10), parseInt(s2, 10)));
        break;
      }
      case 'drop': {
        const [s] = args;
        instructions.push(new Drop(parseInt(s, 10)));
        break;
      }
      case 'turn': {
        const [dir, s] = args;
        instructions.push(new Turn(parseInt(dir, 10), parseInt(s, 10)));
        break;
      }
      case 'move': {
        const [s1, s2] = args;
        instructions.push(new Move(parseInt(s1, 10), parseInt(s2, 10)));
        break;
      }
      case 'flip': {
        const [p, s1, s2] = args;
        instructions.push(new Flip(parseInt(p, 10), parseInt(s1, 10), parseInt(s2, 10)));
        break;
      }
      case 'direction': {
        const [d, s1, s2] = args;
        instructions.push(new Direction(parseInt(d, 10), parseInt(s1, 10), parseInt(s2, 10)));
        break;
      }
      default:
        throw new Error(`Unknown instruction ${instructionName}`);
    }
  });

  return instructions;
}
