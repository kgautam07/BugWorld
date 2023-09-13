import BugBrain from './BugBrain.js';
import Color from './Color.js';
import { reconstructInstruction } from './instructions.js';

/* global chai */
const { expect, assert } = chai;

export default class Bug {
  /**
   * Defines class that stores all the information of one bug
   * @param {int} id - id of the bug
   * @param {Color} color - color of the bug
   * @param {int} state - state of the bug
   * @param {int} resting - temaining resting time of the bug
   * @param {int} direction - direction of the bug
   * @param {bool} hasFood - whether the bug has food
   * @param {BugBrain} brain - brain of the bug
   *
   * @todo: implement the functions: kill, toString
   */
  constructor(id, color, state, direction, brain) {
    expect(id).to.be.a('number');
    expect(color).to.be.an.instanceof(Color);
    expect(state).to.be.a('number');
    expect(direction).to.be.a('number');
    expect(brain).to.be.an.instanceof(BugBrain);
    this.id = id;
    this.color = color;
    this.state = state;
    this.resting = 0;
    this.direction = direction;
    this.hasFood = false;
    // Copy the brain, so that updates to one bug don't affect others
    const brainObj = JSON.parse(JSON.stringify(brain));
    this.brain = new BugBrain(brainObj.instruction.map(reconstructInstruction), brainObj.position);
  }

  /**
   * kill the bug
   * @todo: kill the bug
   */
  kill() { }

  /**
   * return the position of the bug
   */
  getPosition() {
    return this.brain.position;
  }

  /**
   * turn the bug counterclockwise
   */
  turnLeft() {
    this.direction += 5;
    this.direction %= 6;
  }

  /**
   * turn the bug clockwise
   */
  turnRight() {
    this.direction += 1;
    this.direction %= 6;
  }

  /**
   * return the string representation of the bug
   */
  toString() {
    return `id: ${this.id} color: ${this.color} state: ${this.state} resting: ${this.resting} direction: ${this.direction} hasFood: ${this.hasFood} brain: ${this.brain.instruction}`;
  }
}
