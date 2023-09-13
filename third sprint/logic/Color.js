/* global chai */
const { expect, assert } = chai;

// It should work as an enumeration
export default class Color {
  static Red = new Color('red');

  static Black = new Color('black');

  constructor(name) {
    this.name = name;
  }

  opposite() {
    if (this === Color.Red) {
      return Color.Black;
    }
    return Color.Red;
  }

  toString() {
    return this.name;
  }
}

Object.freeze(Color);
