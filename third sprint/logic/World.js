import WorldCell from './WorldCell.js';
import Position from './Position.js';
import Bug from './Bug.js';
import Color from './Color.js';
import BugBrain from './BugBrain.js';
import { reconstructInstruction } from './instructions.js';

/* global chai */
const { expect, assert } = chai;

export default class World {
  /**
   * Defines the world that the bugs are in
   * @member {int} nCols - number of columns in the map
   * @member {int} nRows - number of rows in the map
   * @member {array} worldCell - the cell at the given coordinates
   * @todo implement methods : turn, sensedCell , toString
   */
  constructor(nCols, nRows) {
    this.nCols = nCols;
    this.nRows = nRows;
    this.worldCell = new Array(nCols);
    for (let col = 0; col < nCols; col++) {
      this.worldCell[col] = new Array(nRows);
      for (let row = 0; row < nRows; row++) {
        this.worldCell[col][row] = new WorldCell(false, null, 0, null);
      }
    }
  }

  /**
   * Creates a new World instance from an array of strings representing the world
   * @param {string} map - array of strings representing the world
   * @param {BugBrain} redBrain - the red team's brain
   * @param {BugBrain} blackBrain - the black team's brain
   * @returns {World} - new World instance
   */
  static fromString(map, redBrain, blackBrain) {
    const lines = map.split(/\r\n|\n/);
    expect(lines).to.be.an('array');
    expect(redBrain).to.be.an.instanceOf(BugBrain);
    expect(blackBrain).to.be.an.instanceOf(BugBrain);
    const nCols = parseInt(lines[0], 10);
    const nRows = parseInt(lines[1], 10);
    expect(Number.isNaN(nRows)).to.equal(false);
    expect(Number.isNaN(nCols)).to.equal(false);
    const world = new World(nCols, nRows);
    let id = 0;
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        const char = lines[2 + row][col];
        const position = new Position(col, row);
        if (!Number.isNaN(parseInt(char, 10))) {
          world.setFoodAt(position, parseInt(char, 10));
        } else {
          switch (char) {
            case '.':
              break;
            case '#':
              world.cellAt(position).obstructed = true;
              break;
            case '+':
              world.cellAt(position).base = Color.Red;
              world.cellAt(position).setBug(new Bug(id++, Color.Red, 0, 0, redBrain));
              break;
            case '-':
              world.cellAt(position).base = Color.Black;
              world.cellAt(position).setBug(new Bug(id++, Color.Black, 0, 0, blackBrain));
              break;
            default:
              assert.fail(`Invalid character ${char}`);
          }
        }
      }
    }
    return world;
  }

  /**
   * Puts the important information into a readable string representation for debug purposes.
   * @returns {string}
   */
  debugRepr() {
    function cellRepr(cell) {
      const { bug } = cell;
      if (cell.obstructed) {
        return '[# _ _ _]';
      }
      if (bug == null) {
        return `[${cell.food} _ _ _]`;
      }
      return `[${cell.food} ${bug.id} ${bug.direction} ${Number(bug.hasFood)}]`;
    }
    let result = '';
    for (let row = 0; row < this.nRows; row++) {
      for (let col = 0; col < this.nCols; col++) {
        result += cellRepr(this.worldCell[col][row]);
        result += ' ';
      }
      result += '\n';
    }
    return result;
  }

  /**
   * return the cell at the given position
   * @param {Position} position
   * @param {cell} cell
   */
  cellAt(position) {
    expect(position).to.be.an.instanceOf(Position);
    return this.worldCell[position.x][position.y];
  }

  /**
   * return cell at the given position in the given direction(0-5)
   * there is a different shift for odd and even rows
   * @param {position} position
   * @param {int} direction
   * @returns {WorldCell?} - requested cell or null if it is out of bounds
   */
  adjacent(position, direction) {
    expect(position).to.be.an.instanceOf(Position);
    expect(direction).to.be.a('number');
    expect(direction).to.be.within(0, 5);
    const { x } = position;
    const { y } = position;
    const shift = y % 2 === 0 ? 0 : 1;
    const { worldCell, nCols, nRows } = this;

    function tryAt(col, row) {
      if (col >= 0 && col < nCols && row >= 0 && row < nRows) {
        return worldCell[col][row];
      }
      return null;
    }

    switch (direction) {
      case 0:
        return tryAt(x + 1, y);
      case 1:
        return tryAt(x + shift, y + 1);
      case 2:
        return tryAt(x - 1 + shift, y + 1);
      case 3:
        return tryAt(x - 1, y);
      case 4:
        return tryAt(x - 1 + shift, y - 1);
      case 5:
        return tryAt(x + shift, y - 1);
      default:
        assert.fail(`Invalid direction ${direction}`);
        return null;
    }
  }

  /**
   * return true if the cell at the given position is obstructed
   * @param {position} position
   * @param {bool} isObstructed
   */
  isObstructedAt(position) {
    expect(position).to.be.an.instanceOf(Position);
    return this.cellAt(position).isObstructed();
  }

  /**
   * return true if the cell at the given position is occupied
   * @param {position} position
   * @param {bool} isOccupied
   */
  isOccupiedAt(position) {
    expect(position).to.be.an.instanceOf(Position);
    return this.cellAt(position).isOccupied();
  }

  /**
   * set the bug in the cell at the given position
   * @param {position} position
   */
  setBugAt(position, bug) {
    expect(position).to.be.an.instanceOf(Position);
    expect(bug).to.be.an.instanceOf(Bug);
    return this.cellAt(position).setBug(bug);
  }

  /**
   * return the bug in the cell at the given position
   * @param {position} position
   */
  getBugAt(position) {
    expect(position).to.be.an.instanceOf(Position);
    return this.cellAt(position).getBug();
  }

  /**
   * remove the bug in the cell at the given position
   * @param {position} position
   */
  removeBugAt(position) {
    expect(position).to.be.an.instanceOf(Position);
    this.cellAt(position).removeBug();
  }

  /**
   * set the food in the cell at the given position
   * @param {position} position
   */
  setFoodAt(position, food) {
    expect(position).to.be.an.instanceOf(Position);
    expect(food).to.be.a('number');
    this.cellAt(position).setFood(food);
  }

  /**
   * return the food in the cell at the given position
   * @param {position} position
   */
  getFoodAt(position) {
    expect(position).to.be.an.instanceOf(Position);
    return this.cellAt(position).food;
  }

  /**
   * return true if the cell at the given position is a friendly base
   * @param {position} position
   * @param {color} color
   */
  isFriendlyBaseAt(position, color) {
    expect(position).to.be.an.instanceOf(Position);
    expect(color).to.be.an.instanceof(Color);
    return this.cellAt(position).isFriendlyBase(color);
  }

  /**
   * return true if the cell at the given position is an enemy base
   * @param {position} position
   * @param {color} color
   */
  isEnemyBaseAt(position, color) {
    expect(position).to.be.an.instanceOf(Position);
    expect(color).to.be.an.instanceof(Color);
    return this.cellAt(position).isEnemyBase(color);
  }

  /**
   * set the marker in the cell at the given position
   * @param {position} position
   * @param {Color} color
   * @param {number} markerPos
   */
  setMarkerAt(position, color, markerPos) {
    expect(position).to.be.an.instanceOf(Position);
    expect(color).to.be.an.instanceof(Color);
    expect(markerPos).to.be.a('number');
    this.cellAt(position).setMarker(color, markerPos);
  }

  /**
   * clear the marker in the cell at the given position
   * @param {position} position
   * @param {Color} color
   * @param {number} markerPos
   */
  clearMarkerAt(position, color, markerPos) {
    expect(position).to.be.an.instanceOf(Position);
    expect(color).to.be.an.instanceof(Color);
    expect(markerPos).to.be.a('number');
    this.cellAt(position).clearMarker(color, markerPos);
  }

  /**
   * return true if the cell at the given position is a friendly marker
   * @param {position} position
   * @param {color} color
   * @param {number} markerPos
   */
  isFriendlyMarkerAt(position, color, markerPos) {
    expect(position).to.be.an.instanceOf(Position);
    expect(color).to.be.an.instanceof(Color);
    expect(markerPos).to.be.a('number');
    return this.cellAt(position).isFriendlyMarker(color, markerPos);
  }

  /**
   * return true if the cell at the given position is an enemy marker
   * @param {position} position
   * @param {color} color
   */
  isEnemyMarkerAt(position, color) {
    expect(position).to.be.an.instanceOf(Position);
    expect(color).to.be.an.instanceof(Color);
    return this.cellAt(position).isEnemyMarker(color);
  }

  /**
   * Serialize the world
   * @returns {string} serialized world
   */
  serialize() {
    function jsonifyBugBrain(bugBrain) {
      return {
        instruction: bugBrain.instruction,
        position: bugBrain.position,
      };
    }

    function jsonifyBug(bug) {
      return {
        id: bug.id,
        color: bug.color,
        direction: bug.direction,
        state: bug.state,
        resting: bug.resting,
        hasFood: bug.hasFood,
        brain: jsonifyBugBrain(bug.brain),
      };
    }

    function jsonifyWorldCell(worldCell) {
      return {
        obstructed: worldCell.obstructed,
        base: worldCell.base,
        bug: worldCell.bug ? jsonifyBug(worldCell.bug) : null,
        food: worldCell.food,
        redMarkers: worldCell.redMarkers,
        blackMarkers: worldCell.blackMarkers,
      };
    }

    // Serialize the World class
    return JSON.stringify({
      nCols: this.nCols,
      nRows: this.nRows,
      worldCell: this.worldCell.map((col) => col.map((cell) => jsonifyWorldCell(cell))),
    });
  }

  /**
   * Deserialize the world
   * @param {string} s - serialized world
   */
  static deserialize(s) {
    const worldObj = JSON.parse(s);
    const world = new World(worldObj.nCols, worldObj.nRows);
    world.worldCell = worldObj.worldCell.map((row) => row.map((cell) => {
      const bugObj = cell.bug;
      let bug = null;
      if (bugObj) {
        const brain = new BugBrain(
          bugObj.brain.instruction.map(reconstructInstruction),
          bugObj.brain.position,
        );
        bug = new Bug(
          bugObj.id,
          bugObj.color.name === 'red' ? Color.Red : Color.Black,
          bugObj.state,
          bugObj.direction,
          brain,
        );
        bug.resting = bugObj.resting;
        bug.hasFood = bugObj.hasFood;
      }
      let base = null;
      if (cell.base != null) {
        base = cell.base.name === 'red' ? Color.Red : Color.Black;
      }
      const result = new WorldCell(cell.obstructed, bug, cell.food, base);
      result.redMarkers = cell.redMarkers;
      result.blackMarkers = cell.blackMarkers;
      return result;
    }));
    return world;
  }
}
