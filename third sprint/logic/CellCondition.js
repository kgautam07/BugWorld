/* global chai */
const { expect, assert } = chai;

/**
 * Enumeration of cell conditions
 * @param {string} name - color of the marker
 * @param {number?} pos - position used for this condition, optional
 *   It is not null only for "Marker"
 */
export const CONDITIONS = Object.freeze(['Friend', 'Foe', 'FriendWithFood', 'FoeWithFood', 'Food', 'Rock', 'Marker', 'FoeMarker', 'Home', 'FoeHome']);
export class CellCondition {
  constructor(name, pos) {
    expect(CONDITIONS).to.be.an('array').that.includes(name, 'cell condition name error');
    this.name = name;
    if (name === 'Marker') {
      expect([0, 1, 2, 3, 4, 5]).to.include(pos, 'marker is not in 0..5 range');
      this.pos = pos;
    } else {
      expect(pos).to.equal(undefined, 'pos should be undefined');
    }
  }
}
