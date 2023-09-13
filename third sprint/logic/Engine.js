import World from './World.js';
import Bug from './Bug.js';
import Position from './Position.js';
import {
  Sense, Mark, Unmark, PickUp, Drop, Turn, Move, Flip, Direction,
} from './instructions.js';

/* global chai */
const { expect, assert } = chai;

export default class Engine {
  /**
   * Handles the updates to world state on each iteration.
   * @param {World} world - World object with map and bugs.
   * @param {int} cycles - Number of iterations elapsed since the start.
   */
  constructor(world, cycles = 0) {
    this.world = world;
    this.cycles = cycles;
  }

  /**
   * Run one step of simulation for one bug.
   * @param {Position} pos - cell with the bug
   */
  updatePos(pos) {
    const cell = this.world.cellAt(pos);
    const bug = cell.getBug();
    const { brain } = bug;
    const code = brain.instruction;
    let ptr = brain.position;
    expect(ptr).to.be.within(0, code.length - 1);
    const command = code[ptr];
    console.log(`Update ${bug.id} at ${pos.x} ${pos.y}, heading to ${bug.direction}, command ${ptr}: ${command.name}`);
    if (command instanceof Move) {
      const newCell = this.world.adjacent(pos, bug.direction);
      if (!newCell.isObstructed() && !newCell.isOccupied()) {
        cell.removeBug();
        newCell.setBug(bug);
        ptr = command.s1;
      } else {
        ptr = command.s2;
      }
    } else if (command instanceof Drop) {
      if (bug.hasFood) {
        bug.hasFood = false;
        cell.food += 1;
      }
      ptr = command.s;
    } else if (command instanceof PickUp) {
      if (!bug.hasFood && cell.food > 0) {
        cell.food -= 1;
        bug.hasFood = true;
        ptr = command.s1;
      } else {
        ptr = command.s2;
      }
    } else if (command instanceof Sense) {
      const dir = (bug.direction + command.senseDir + 6) % 6;
      const objCell = this.world.adjacent(pos, dir);
      if (objCell.cellMatches(command.condition, bug.color)) {
        ptr = command.s1;
      } else {
        ptr = command.s2;
      }
    } else if (command instanceof Mark) {
      cell.setMarker(bug.color, command.markerPos);
      ptr = command.s;
    } else if (command instanceof Unmark) {
      cell.removeMarker(bug.color, command.markerPos);
      ptr = command.s;
    } else if (command instanceof Turn) {
      if (command.dir > 0) {
        bug.turnRight();
      } else {
        bug.turnLeft();
      }
      ptr = command.s;
    } else if (command instanceof Flip) {
      const result = Math.random() * command.p < 1;
      if (result) {
        ptr = command.s1;
      } else {
        ptr = command.s2;
      }
    } else if (command instanceof Direction) {
      if (command.d === bug.direction) {
        ptr = command.s1;
      } else {
        ptr = command.s2;
      }
    } else {
      assert.fail(`Unknown command ${command.prototype.name}`);
    }
    brain.position = ptr;
  }

  /**
   * Run one iteration of the game.
   */
  update() {
    this.cycles += 1;
    const { nCols, nRows } = this.world;
    const occupiedCells = [];
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        const pos = new Position(col, row);
        const cell = this.world.cellAt(pos);
        if (cell.isOccupied()) {
          occupiedCells.push(pos);
        }
      }
    }
    occupiedCells.sort((x, y) => this.world.getBugAt(x).id - this.world.getBugAt(y).id);
    occupiedCells.forEach((pos) => this.updatePos(pos));
  }
}
