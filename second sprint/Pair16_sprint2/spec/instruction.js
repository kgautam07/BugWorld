import { Instruction } from "../assets/js/assembler/Instruction.js";

describe('Instruction', () => {
    describe('Sense', () => {
      it('creates a Sense instruction with the correct properties', () => {
        const senseDir = 1;
        const condition = 2;
        const thenLab = 3;
        const elseLab = 4;
  
        const instruction = new Instruction.Sense(senseDir, condition, thenLab, elseLab);
  
        expect(instruction.senseDir).toBe(senseDir);
        expect(instruction.condition).toBe(condition);
        expect(instruction.thenLab).toBe(thenLab);
        expect(instruction.elseLab).toBe(elseLab);
      });
    });
  
    describe('Turn', () => {
      it('creates a Turn instruction with the correct properties', () => {
        const turnDir = 1;
        const value = 2;
  
        const instruction = new Instruction.Turn(turnDir, value);
  
        expect(instruction.turnDir).toBe(turnDir);
        expect(instruction.value).toBe(value);
      });
    });
  
    describe('Mark', () => {
      it('creates a Mark instruction with the correct properties', () => {
        const marker = 1;
        const thenLab = 2;
  
        const instruction = new Instruction.Mark(marker, thenLab);
  
        expect(instruction.marker).toBe(marker);
        expect(instruction.thenLab).toBe(thenLab);
      });
    });
  
    describe('Unmark', () => {
      it('creates an Unmark instruction with the correct properties', () => {
        const marker = 1;
        const thenLab = 2;
  
        const instruction = new Instruction.Unmark(marker, thenLab);
  
        expect(instruction.marker).toBe(marker);
        expect(instruction.thenLab).toBe(thenLab);
      });
    });
  
    describe('PickUp', () => {
      it('creates a PickUp instruction with the correct properties', () => {
        const thenLab = 1;
        const elseLab = 2;
  
        const instruction = new Instruction.PickUp(thenLab, elseLab);
  
        expect(instruction.thenLab).toBe(thenLab);
        expect(instruction.elseLab).toBe(elseLab);
      });
    });
  
    describe('Drop', () => {
      it('creates a Drop instruction with the correct properties', () => {
        const thenLab = 1;
  
        const instruction = new Instruction.Drop(thenLab);
  
        expect(instruction.thenLab).toBe(thenLab);
      });
    });
  
    describe('Flip', () => {
      it('creates a Flip instruction with the correct properties', () => {
        const range = 1;
        const thenLab = 2;
        const elseLab = 3;
  
        const instruction = new Instruction.Flip(range, thenLab, elseLab);
  
        expect(instruction.range).toBe(range);
        expect(instruction.thenLab).toBe(thenLab);
        expect(instruction.elseLab).toBe(elseLab);
      });
    });
  
    describe('Move', () => {
      it('creates a Move instruction with the correct properties', () => {
        const thenLab = 1;
        const elseLab = 2;
  
        const instruction = new Instruction.Move(thenLab, elseLab);
  
        expect(instruction.thenLab).toBe(thenLab);
        expect(instruction.elseLab).toBe(elseLab);
      });
    });
  });
  