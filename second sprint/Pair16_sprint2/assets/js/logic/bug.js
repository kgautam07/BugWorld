import { BugBrain } from "./bugBrain.js";
// const Position = require('./position');
// const WorldCell = require('./worldcell');
import { Direction } from "../assembler/definitions.js";


export class Bug {
	constructor(id, cell, color, program){
		this.id = id;
		this.color = color;
		//this.state = state;
		//this.resting = 1;
		this.cell = cell;
		this.hasFood = false;
		this.direction = new Direction.default();
        this.hasFood = false;
        this.brain = new BugBrain(program,0);
	}

	/**Kill bug at position pos and remove it from the corresponding cell
	 * 
	 * @param {Position} Pos Position of target bug
	 */
	kill(pos){
		this.state = dead;
		this.removeBug(pos);
	}

	/**Return position of bug b
	 * 
	 * @param {Bug} b Selected Bug
	 * @return {Position}
	 */
	getPosition(b){
		return this.getPosition(b);
	}
	/**
	 * @return {String}
	 */
	toString(){}

	doAction() {
        let instruction = this.brain.getNextInstruction();
        if (instruction instanceof Instruction.Sense) {
            this.world.checkCondition(instruction);
            let cell = this.world.sensedCell(this.position, instruction.sensedDir);
            if (cell.matches(instruction.condition)) {
                this.brain.instructionPointer = instruction.thenLab;
                return;
            }
            this.brain.instructionPointer = instruction.elseLab;
        }
        else if (instruction instanceof Instruction.Turn) {
            this.direction = this.direction.turnedBy(instruction.turnDir, instruction.value); 
            this.brain.instructionPointer = instruction.thenLab;
        }
        else if (instruction instanceof Instruction.Mark) {
            this.cell.setMarker(this.color, instruction.marker);
            this.brain.instruction = instruction.thenLab;
        }
        else if (instruction instanceof Instruction.Unmark) {
            this.cell.clearMarker(this.color, instruction.marker);
        }
        else if (instruction instanceof Instruction.PickUp) {
            if (!this.hasFood && this.cell.tryTakeFood()) {
                this.hasFood = true;
                this.brain.instructionPointer = instruction.thenLab;
                return;
            }
                this.brain.instructionPointer = instruction.elseLab;
        }
        else if (instruction instanceof Instruction.Drop) {
            if (this.hasFood) {
                this.cell.returnFood();
                this.hasFood = false;
            }
            this.brain.instructionPointer = instruction.thenLab;
        }
        else if (instruction instanceof Instruction.Flip) {
            if (Math.random() * instruction.range == 0) {
                this.brain.instructionPointer = instruction.thenLab;
                return;
            }
            this.brain.instructionPointer = instruction.elseLab;
        }
        else if (instruction instanceof Instruction.Move) {
            let nextCell = this.world.adjacent(this.position, this.direction);
            if (this.world.tryMoveBug(this, this.cell, nextCell)) {
                this.brain.instructionPointer = instruction.thenLab;
                return;
            }
            this.brain.instructionPointer = instruction.elseLab;
        }
    }
}
