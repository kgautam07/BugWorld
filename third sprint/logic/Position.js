/* global chai */
const { expect, assert } = chai;

export default class Position {
  /**
   * Defines the position of the bug
   * @param {int} x - x coordinate
   * @param {int} y - y coordinate
   */
  constructor(x, y) {
    expect(x).to.be.a('number');
    expect(y).to.be.a('number');
    this.x = x;
    this.y = y;
  }
}
