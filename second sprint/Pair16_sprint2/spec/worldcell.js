import { WorldCell } from "../assets/js/logic/worldcell.js";
import { Color } from "../assets/js/assembler/definitions.js";

describe('WorldCell', () => {
  let cell;

  beforeEach(() => {
    cell = new WorldCell(false, 0, null);
  });

  it('should be created with correct properties', () => {
    expect(cell.obstructed).toBe(false);
    expect(cell.bug).toBe(null);
    expect(cell.food).toBe(0);
    expect(cell.base).toBe(null);
  });

  it('should correctly identify if it is obstructed and set obstructed', () => {
    expect(cell.isObstructed()).toBe(0);
    cell.obstructed = true;
    expect(cell.isObstructed()).toBe(1);
  });

  it('should correctly identify if it has food and set food', () => {
    expect(cell.isfood()).toBe(0);
    cell.food = 5;
    expect(cell.isfood()).toBe(1);
  });

  it('should correctly identify if it has a bug and set bug', () => {
    expect(cell.isOccupied()).toBe(0);
    cell.bug = {};
    expect(cell.isOccupied()).toBe(1);
  });


});
