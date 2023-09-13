import Bug from './Bug.js';
import Color from './Color.js';
import { CellCondition } from './CellCondition.js';

/* global chai */
const { expect, assert } = chai;

export default class WorldCell {
  /**
   * Defines Class that stores information about one cell in the world
   * @param {bool} obstructed - whether the cell is obstructed
   * @param {Bug} bug - the bug in the cell (if any)
   * @param {int} food - the food in the cell
   * @param {Color} base - color of the base (if any)
   */
  constructor(obstructed, bug, food, base) {
    this.obstructed = obstructed;
    this.bug = bug;
    this.food = food;
    this.base = base;
    this.redMarkers = [false, false, false, false, false, false];
    this.blackMarkers = [false, false, false, false, false, false];

    Object.seal(this);
  }

  /**
   * return whether the cell is obstructed
   */
  isObstructed() {
    return this.obstructed;
  }

  /**
   * return whether the cell is occupied
   */
  isOccupied() {
    return this.bug != null;
  }

  /**
   * set the bug in the cell
   * @param {Bug} bug
   */
  setBug(bug) {
    if (!this.isOccupied()) {
      expect(bug).to.be.an.instanceof(Bug);
      this.bug = bug;
      return true;
    }
    return false;
  }

  /**
   * return the bug in the cell
   * @param {Bug} bug
   */
  getBug() {
    return this.bug;
  }

  /**
   * invoke kill function and remove the bug in the cell
   */
  removeBug() {
    expect(this.bug).to.be.an.instanceof(Bug);
    if (this.isOccupied()) {
      this.bug.kill();
    }
    this.bug = null;
  }

  /**
   * set the food in the cell
   * @param {int} int
   */
  setFood(int) {
    expect(int).to.be.a('number');
    this.food = int;
  }

  /**
   * return whether the cell is friendly base
   * @param {color} color
   */
  isFriendlyBase(color) {
    expect(color).to.be.an.instanceof(Color);
    return this.base === color;
  }

  /**
   * return whether the cell is enemy base
   * @param {color} color
   */
  isEnemyBase(color) {
    if (this.base == null) {
      return false;
    }
    expect(color).to.be.an.instanceof(Color);
    return this.base !== color;
  }

  /**
   * set the marker in the cell
   * @param {Color} color
   * @param {int} markerPos
   */
  setMarker(color, markerPos) {
    expect(color).to.be.an.instanceof(Color, 'setMarker: First argument must be Color');
    expect(typeof markerPos).to.equal('number', 'setMarker: Second argument must be Number');
    expect(markerPos).to.be.within(0, 5, 'setMarker: Marker position not in 0..5');
    if (color === Color.Red) {
      this.redMarkers[markerPos] = true;
    }
    if (color === Color.Black) {
      this.blackMarkers[markerPos] = true;
    }
  }

  /**
   * remove the marker in the cell
   * @param {Color} color
   * @param {int} markerPos
   */
  clearMarker(color, markerPos) {
    expect(color).to.be.an.instanceof(Color, 'clearMarker: First argument must be Color');
    expect(typeof markerPos).to.equal('number', 'clearMarker: Second argument must be Number');
    expect(markerPos).to.be.within(0, 5, 'clearMarker: Marker position not in 0..5');
    if (color === Color.Red) {
      this.redMarkers[markerPos] = false;
    }
    if (color === Color.Black) {
      this.blackMarkers[markerPos] = false;
    }
  }

  /**
   * check friendly marker in the cell
   * @param {Color} color
   * @param {int} markerPos
   */
  isFriendlyMarker(color, markerPos) {
    expect(color).to.be.an.instanceof(Color, 'isFriendlyMarker: First argument must be Color');
    expect(typeof markerPos).to.equal('number', 'isFriendlyMarker: Second argument must be Number');
    expect(markerPos).to.be.within(0, 5, 'isFriendlyMarker: Marker position not in 0..5');
    if (color === Color.Red) {
      return this.redMarkers[markerPos];
    }
    return this.blackMarkers[markerPos];
  }

  /**
   * check enemy marker in the cell
   * @param {Color} color
   */
  isEnemyMarker(color) {
    expect(color).to.be.an.instanceof(Color, 'isEnemyMarker: First argument must be Color');
    if (color === Color.Black) {
      return this.redMarkers.some((x) => x === true);
    }
    return this.blackMarkers.some((x) => x === true);
  }

  /**
   * check if the cell matches the given condition
   * @param {CellCondition} cellCondition - the condition to be checked
   * @param {Color} color - the color of the bug
   * @returns {boolean} - true if the cell matches the condition, false otherwise
   */
  cellMatches(cellCondition, color) {
    expect(cellCondition).to.be.an.instanceof(CellCondition);
    expect(color).to.be.an.instanceof(Color);
    switch (cellCondition.name) {
      case 'Friend':
        return this.isOccupied() && this.getBug().color === color;
      case 'Foe':
        return this.isOccupied() && this.getBug().color === color.opposite();
      case 'FriendWithFood':
        return this.isOccupied() && this.getBug().color === color && this.bug.hasFood;
      case 'Food':
        return this.food !== 0;
      case 'Rock':
        return this.isObstructed();
      case 'Marker':
        return this.isFriendlyMarker(color, cellCondition.pos);
      case 'FoeMarker':
        return this.isEnemyMarker(color);
      case 'Home':
        return this.base === color;
      default:
        expect(cellCondition.name).to.equal('FoeHome', `Unknown condition ${cellCondition.name}`);
        return this.base === color.opposite();
    }
  }

  /**
   * return the string representation of the cell
   */
  toString() {
    function markersToString(markers) {
      return markers.map((marker) => (marker ? '1' : '0')).join('');
    }
    const redMarkers = markersToString(this.redMarkers);
    const blackMarkers = markersToString(this.blackMarkers);

    return `obstructed: ${this.obstructed} bug: ${this.bug} food: ${this.food} redMarkers: ${redMarkers} blackMarkers: ${blackMarkers} base: ${this.base}`;
  }
}
