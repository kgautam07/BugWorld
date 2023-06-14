
export class BugBrain {
    constructor(instructions,pos) {
        this.instructions = instructions;
        this.instructionPointer = pos;
    }

    getNextInstruction() {
        // Very debatable whether the IP should be updated right here. We chose not to.
        return this.instructions[this.instructionPointer];
    }
}

