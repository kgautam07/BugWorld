/* global chai */
const { expect, assert } = chai;

export default class BugBrain {
  /**
   * Defines class that stores all the instructions of the bug
   * @param {Instruction[]} instruction - all instructions of the bug
   * @param {int} position - index of current instruction
   */
  constructor(instruction, position = 0) {
    expect(instruction).to.be.an('array');
    this.instruction = instruction;
    this.position = position;
  }

  /**
   * Returns the next instruction
   * @returns {Instruction} instruction
   */
  getNextInstruction() {
    expect(this.instruction).to.be.an('array');
    expect(this.position).to.be.a('number');
    return this.instruction[this.position];
  }
}
