/*  testcases to check the correctness of the implemented classes and their methods
*  to run the tests, open the test.html file in the browser
*  the testcases are written using the mocha and chai libraries
*  to add a new testcase, add a new describe block with a name of the class you want to test
*
* Further explanations of testcases can be found in the website.
* The messages of the describe statements are self-explanatory.
*/

import Bug from '../logic/Bug.js';
import BugBrain from '../logic/BugBrain.js';
import { CellCondition } from '../logic/CellCondition.js';
import Color from '../logic/Color.js';
import Engine from '../logic/Engine.js';
import Position from '../logic/Position.js';
import World from '../logic/World.js';
import WorldCell from '../logic/WorldCell.js';
import {
  checkChars, checkWorld,
  neighbors,
} from '../logic/checks.js';
import {
  Direction, Drop, Flip, Mark, Move, PickUp, Sense,
  Turn, Unmark, parseProgram, reconstructInstruction,
} from '../logic/instructions.js';

const { chai } = window;
const { expect } = chai;
/* global describe, it */

describe('World checks tests', () => {
  const correct = `10
10
##########
##....---#
#......--#
#.......-#
#...99...#
#...99...#
#+.......#
#++......#
#+++....##
##########`;
  const illegalVal = `10
10
##########
#a9....33#
#9#.-----#
#.#------#
#..1-----#
#+++++5..#
#++++++#.#
#+++++.#9#
#33....09#
##########`;
  const noBorder = `10
10
##########
#99....33#
#9#.-----#
#.#------#
#..5-----#
#++++++..#
#++++++#.#
#+++++.#9#
#33....99.
##########`;
  const notConnected = `10
10
##########
##....---#
#......--#
#.......-#
#...99...#
#...99...#
#+.......#
#++......#
#+++....+#
##########`;
  const oneNestOnly = `10
10
##########
#99....33#
#9#......#
#.#......#
#..5.....#
#+++++5..#
#++++++#.#
#+++++.#9#
#33....99#
##########`;
  const tooManyLines = `10
11
##########
#99....33#
#9#......#
#.#......#
#..5.....#
#+++++5..#
#++++++#.#
#+++++.#9#
#33....99#
##########`;

  it('neighbors', () => {
    expect(neighbors(1, 1)).to.eql(['2,1', '0,1', '1,2', '1,0', '0,2', '0,0']);
  });

  it('checkChars', () => {
    const h = (s) => {
      const lines = s.split(/\r\n|\n/);
      const nCols = parseInt(lines[0], 10);
      const nRows = parseInt(lines[1], 10);
      return [lines, nCols, nRows];
    };
    expect(checkChars(...h(correct)).success).to.equal(true);
    expect(checkChars(...h(illegalVal)).message).to.equal('The world file contains invalid characters');
    expect(checkChars(...h(noBorder)).message).to.equal('The border in the world file is not closed');
    expect(checkChars(...h(notConnected)).message).to.equal('The nests are not connected');
    expect(checkChars(...h(oneNestOnly)).message).to.equal('The world file does not contain both nests');
  });

  it('checkWorld', () => {
    expect(checkWorld(correct).success).to.equal(true);
    expect(checkWorld(illegalVal).message).to.equal('The world file contains invalid characters');
    expect(checkWorld(noBorder).message).to.equal('The border in the world file is not closed');
    expect(checkWorld(notConnected).message).to.equal('The nests are not connected');
    expect(checkWorld(oneNestOnly).message).to.equal('The world file does not contain both nests');
    expect(checkWorld(tooManyLines).message).to.equal('The number of lines in the world file is incorrect');
  });
});

describe('Bug tests', () => {
  it('getPosition returns position of bug', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    expect(bug.getPosition()).to.equal(0);
  });
  it('toString returns string representation of bug', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    expect(bug.toString()).to.equal('id: 0 color: red state: 0 resting: 0 direction: 0 hasFood: false brain: ');
  });
  it('Rotates properly', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    expect(bug.direction).to.equal(0);
    bug.turnRight();
    expect(bug.direction).to.equal(1);
    bug.turnLeft();
    bug.turnLeft();
    expect(bug.direction).to.equal(5);
  });
});

describe('WorldCell tests', () => {
  it('isObstructed returns true/false if cell is obstructed/free', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    const testInst = new WorldCell(true, bug, 0, Color.Red);
    const testInst2 = new WorldCell(false, bug, 0, Color.Red);
    expect(testInst.isObstructed()).to.equal(true);
    expect(testInst2.isObstructed()).to.equal(false);
  });

  it('isOccupied returns true/false if cell is occupied/free', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    const testInst = new WorldCell(false, bug, 0, Color.Red);
    const testInst2 = new WorldCell(false, null, 0, Color.Red);
    expect(testInst.isOccupied()).to.equal(true);
    expect(testInst2.isOccupied()).to.equal(false);
  });

  it('setBug sets bug of cell if it is not occupied', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    const testInst = new WorldCell(false, null, 0, Color.Red);
    const testInst2 = new WorldCell(false, bug, 0, Color.Red);
    expect(testInst.setBug(bug)).to.equal(true);
    expect(testInst2.setBug(bug)).to.equal(false);
  });

  it('getBug returns bug of cell', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    const testInst = new WorldCell(false, bug, 0, Color.Red);
    expect(testInst.getBug()).to.be.an.instanceof(Bug);
  });

  it('setfood sets food of cell', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    testInst.setFood(5);
    expect(testInst.food).to.equal(5);
  });

  it('isFriendlyBase returns true/false if cell is friendly base', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    const testInst2 = new WorldCell(false, null, 0, Color.Black);
    expect(testInst.isFriendlyBase(Color.Red)).to.equal(true);
    expect(testInst2.isFriendlyBase(Color.Red)).to.equal(false);
  });

  it('isEnemyBase returns true/false if cell is enemy base', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    const testInst2 = new WorldCell(false, null, 0, Color.Black);
    expect(testInst.isEnemyBase(Color.Black)).to.equal(true);
    expect(testInst2.isEnemyBase(Color.Black)).to.equal(false);
  });

  it('setMarker sets marker of cell', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    testInst.setMarker(Color.Red, 0);
    expect(testInst.isFriendlyMarker(Color.Red, 0)).to.equal(true);
  });

  it('clearMarker clears marker of cell', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    testInst.setMarker(Color.Red, 0);
    testInst.clearMarker(Color.Red, 0);
    expect(testInst.isFriendlyMarker(Color.Red, 0)).to.equal(false);
  });

  it('isFriendlyMarker returns false if cell has no friendly marker', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    testInst.setMarker(Color.Red, 0);
    expect(testInst.isFriendlyMarker(Color.Black, 0)).to.equal(false);
  });

  it('isEnemyMarker returns true/false if cell has enemy marker', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    testInst.setMarker(Color.Red, 0);
    expect(testInst.isEnemyMarker(Color.Black)).to.equal(true);
    expect(testInst.isEnemyMarker(Color.Red)).to.equal(false);
  });

  it('toString returns string representation of cell', () => {
    const testInst = new WorldCell(false, null, 0, Color.Red);
    expect(testInst.toString()).to.equal('obstructed: false bug: null food: 0 redMarkers: 000000 blackMarkers: 000000 base: red');
  });

  it('sets markers on world cells', () => {
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    const cell = new WorldCell(false, bug, 1, null);
    cell.setMarker(Color.Black, 0);
    expect(cell.isFriendlyMarker(Color.Black, 0)).to.equal(true);
    expect(cell.isFriendlyMarker(Color.Red, 1)).to.equal(false);
    expect(() => { cell.isFriendlyMarker(Color.Red, -1); }).to.throw();
    expect(() => { cell.isFriendlyMarker(Color.Red, 6); }).to.throw();
  });

  it('sets bug to a world cell', () => {
    const cell = new WorldCell(false, null, 1, null);
    const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    bug.hasFood = true;
    expect(cell.setBug(bug)).to.equal(true);
    expect(cell.getBug()).to.equal(bug);
  });

  describe('cellMatches', () => {
    it('checks Friend condition', () => {
      const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
      const cell = new WorldCell(false, bug, 1, null);

      const friendCondition = new CellCondition('Friend');
      expect(cell.cellMatches(friendCondition, bug.color)).to.equal(true);
      expect(cell.cellMatches(friendCondition, bug.color.opposite())).to.equal(false);
    });

    it('checks Foe condition', () => {
      const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
      const cell = new WorldCell(false, bug, 1, null);

      const foeCondition = new CellCondition('Foe');
      expect(cell.cellMatches(foeCondition, bug.color)).to.equal(false);
      expect(cell.cellMatches(foeCondition, bug.color.opposite())).to.equal(true);
    });

    it('checks FriendWithFood condition', () => {
      const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
      const cell = new WorldCell(false, bug, 1, null);
      bug.hasFood = true;
      cell.setBug(bug);

      const condition = new CellCondition('FriendWithFood');
      expect(cell.cellMatches(condition, bug.color)).to.equal(true);
      expect(cell.cellMatches(condition, bug.color.opposite())).to.equal(false);
    });

    it('checks Food condition', () => {
      const cell = new WorldCell(false, 0, null);
      cell.setFood(1);

      const condition = new CellCondition('Food');

      expect(cell.cellMatches(condition, Color.Red)).to.equal(true);

      cell.setFood(0);
      expect(cell.cellMatches(condition, Color.Red)).to.equal(false);
    });

    it('checks Rock condition', () => {
      const rockCell = new WorldCell(true, 0, null);

      const condition = new CellCondition('Rock');

      expect(rockCell.cellMatches(condition, Color.Red)).to.equal(true);

      const cell = new WorldCell(false);
      expect(cell.cellMatches(condition, Color.Red)).to.equal(false);
    });

    it('checks Home condition', () => {
      const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
      const cell = new WorldCell(false, bug, 1, Color.Red);
      const condition = new CellCondition('Home');

      expect(cell.cellMatches(condition, Color.Red)).to.equal(true);
      expect(cell.cellMatches(condition, Color.Red.opposite())).to.equal(false);
    });

    it('checks FoeHome condition', () => {
      const bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
      const cell = new WorldCell(false, bug, 1, Color.Red);
      const condition = new CellCondition('FoeHome');

      expect(cell.cellMatches(condition, Color.Red)).to.equal(false);
      expect(cell.cellMatches(condition, Color.Red.opposite())).to.equal(true);
    });

    it('checks Marker condition', () => {
      const cell = new WorldCell(false, 0, Color.Red);
      cell.setMarker(Color.Red, 0);

      const condition = new CellCondition('Marker', 0);

      expect(cell.cellMatches(condition, Color.Red)).to.equal(true);
      expect(cell.cellMatches(condition, Color.Red.opposite())).to.equal(false);

      const falseCondition = new CellCondition('Marker', 1);

      expect(cell.cellMatches(falseCondition, Color.Red)).to.equal(false);
    });

    it('checks FoeMarker condition', () => {
      const cell = new WorldCell(false, 0, Color.Red);
      cell.setMarker(Color.Red.opposite(), 0);

      const condition = new CellCondition('FoeMarker');

      expect(cell.cellMatches(condition, Color.Red)).to.equal(true);
      expect(cell.cellMatches(condition, Color.Red.opposite())).to.equal(false);
    });

    it('checks Unknown Condition', () => {
      expect(() => { const _ = new CellCondition('???'); }).to.throw();
      const condition = new CellCondition('Food');
    });

    describe('type safety', () => {
      it('checks argument order for setMarker', () => {
        const cell = new WorldCell(false, 0, Color.Red);
        expect(() => { cell.setMarker(0, Color.Red); }).to.throw();
      });

      it('checks number of arguments for setMarker', () => {
        const cell = new WorldCell(false, 0, Color.Red);
        expect(() => { cell.setMarker(Color.Red); }).to.throw();
      });

      it('checks color argument for cellMatches', () => {
        const cell = new WorldCell(false, 0, Color.Red);
        const condition = new CellCondition('Marker', 0);
        expect(() => { cell.cellMatches(condition, true); }).to.throw();
      });

      it('checks number of arguments for cellMatches', () => {
        const cell = new WorldCell(false, 0, Color.Red);
        expect(() => { cell.cellMatches(); }).to.throw();
      });
    });
  });
});

describe('World tests', () => {
  it('Constructor returns instance of World', () => {
    const testInst = new World(10, 10);
    expect(testInst).to.be.an.instanceof(World);
  });

  it('cellAt returns cell at given position', () => {
    const testInst = new World(10, 10);
    expect(testInst.cellAt(new Position(0, 0))).to.be.an.instanceof(WorldCell);
  });

  it('adjacent returns cell in direction', () => {
    const testInst = new World(10, 10);
    const pos = new Position(0, 0);
    const oth = new Position(0, 1);
    expect(testInst.adjacent(pos, 1)).to.be.equal(testInst.cellAt(oth));
  });

  it('isObstructedAt returns true/false if cell is obstructed/free', () => {
    const testInst = new World(10, 10);
    const testInst2 = new World(10, 10);
    testInst2.cellAt(new Position(0, 0)).obstructed = true;
    expect(testInst2.isObstructedAt(new Position(0, 0))).to.equal(true);
    expect(testInst.isObstructedAt(new Position(0, 0))).to.equal(false);
  });

  it('isOccupiedAt returns true/false if cell is occupied/free', () => {
    const testInst = new World(10, 10);
    const testInst2 = new World(10, 10);
    testInst2.cellAt(new Position(0, 0)).bug = new Bug(0, Color.Red, 0, 0, new BugBrain([]));
    expect(testInst2.isOccupiedAt(new Position(0, 0))).to.equal(true);
    expect(testInst.isOccupiedAt(new Position(0, 0))).to.equal(false);
  });

  it('setFoodAt and getFoodAt set/get food of cell', () => {
    const testInst = new World(10, 10);
    testInst.setFoodAt(new Position(0, 0), 5);
    expect(testInst.getFoodAt(new Position(0, 0))).to.equal(5);
  });

  it('isFriendlyBaseAt returns true/false if cell is friendly base', () => {
    const testInst = new World(10, 10);
    testInst.worldCell[0][0].base = Color.Red;
    const testInst2 = new World(10, 10);
    expect(testInst.isFriendlyBaseAt(new Position(0, 0), Color.Red)).to.equal(true);
    expect(testInst2.isFriendlyBaseAt(new Position(0, 0), Color.Red)).to.equal(false);
  });

  it('isEnemyBaseAt returns true/false if cell is enemy base', () => {
    const testInst = new World(10, 10);
    testInst.worldCell[0][0].base = Color.Red;
    const testInst2 = new World(10, 10);
    expect(testInst.isEnemyBaseAt(new Position(0, 0), Color.Black)).to.equal(true);
    expect(testInst2.isEnemyBaseAt(new Position(0, 0), Color.Black)).to.equal(false);
  });

  it('setMarkerAt and clearMarkerAt set/get marker of cell', () => {
    const testInst = new World(10, 10);
    testInst.setMarkerAt(new Position(0, 0), Color.Red, 0);
    expect(testInst.cellAt(new Position(0, 0)).isFriendlyMarker(Color.Red, 0)).to.equal(true);
    testInst.clearMarkerAt(new Position(0, 0), Color.Red, 0);
    expect(testInst.cellAt(new Position(0, 0)).isFriendlyMarker(Color.Red, 0)).to.equal(false);
  });

  it('isFriendlyMarkerAt returns true/false if cell has friendly marker', () => {
    const testInst = new World(10, 10);
    testInst.setMarkerAt(new Position(0, 0), Color.Red, 0);
    expect(testInst.isFriendlyMarkerAt(new Position(0, 0), Color.Red, 0)).to.equal(true);
    expect(testInst.isFriendlyMarkerAt(new Position(0, 0), Color.Black, 0)).to.equal(false);
  });

  it('isEnemyMarkerAt returns true/false if cell has enemy marker', () => {
    const testInst = new World(10, 10);
    testInst.setMarkerAt(new Position(0, 0), Color.Red, 0);
    expect(testInst.isEnemyMarkerAt(new Position(0, 0), Color.Black)).to.equal(true);
    expect(testInst.isEnemyMarkerAt(new Position(0, 0), Color.Red)).to.equal(false);
  });

  it('Serialization works for instructions', () => {
    const instruction = new Sense(0, 2, 1, new CellCondition('Food'));
    const repr = JSON.stringify(instruction);
    const recovered = reconstructInstruction(JSON.parse(repr));
    expect(recovered).eql(instruction);
  });

  it('Serialization and deserialization are inverse of each other', () => {
    const correct = '10\n10\n##########\n##....---#\n#......--#\n#.......-#\n#...99...#\n#...99...#\n#+.......#\n#++......#\n#+++....##\n##########';
    const redBrain = new BugBrain([new Move(0, 1)]);
    const blackBrain = new BugBrain([new Sense(0, 2, 1, new CellCondition('Food'))]);
    const world = World.fromString(correct, redBrain, blackBrain);
    const repr = world.serialize();
    const recovered = World.deserialize(repr);
    expect(recovered).to.eql(world);
  });
});

describe('Color tests', () => {
  it('Is enum', () => {
    expect(Object.keys(Color).length).to.equal(2);
  });

  it('opposite works', () => {
    expect(Color.Red.opposite()).to.equal(Color.Black);
    expect(Color.Black.opposite()).to.not.equal(Color.Black);
  });
});

describe('Engine tests', () => {
  it('update works for Move', () => {
    const map = '5\n5\n#####\n##--#\n#####\n#+.9#\n#####';
    const insntructionsExample = [new Move(1, 0)];
    const redBrain = new BugBrain(insntructionsExample);
    const blackBrain = new BugBrain(insntructionsExample);
    const world = World.fromString(map, redBrain, blackBrain);
    const engine = new Engine(world, 0);
    expect(engine.world.debugRepr().trim()).to.equal(`
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [0 0 0 0] [0 1 0 0] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [0 2 0 0] [0 _ _ _] [9 _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _]`.trim());
    engine.update();
    expect(engine.world.debugRepr().trim()).to.equal(`
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [0 0 0 0] [0 1 0 0] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [0 _ _ _] [0 2 0 0] [9 _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _]`.trim());
    expect(engine.cycles).to.equal(1);
  });
  it('update works for Turn', () => {
    const map = '5\n5\n#####\n##--#\n#####\n#+.9#\n#####';
    const redBrain = new BugBrain([new Turn(1, 0)]);
    const blackBrain = new BugBrain([new Turn(-1, 0)]);
    const world = World.fromString(map, redBrain, blackBrain);
    const engine = new Engine(world, 0);
    expect(engine.world.debugRepr().trim()).to.equal(`
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [0 0 0 0] [0 1 0 0] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [0 2 0 0] [0 _ _ _] [9 _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _]`.trim());
    engine.update();
    expect(engine.world.debugRepr().trim()).to.equal(`
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [0 0 5 0] [0 1 5 0] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] 
[# _ _ _] [0 2 1 0] [0 _ _ _] [9 _ _ _] [# _ _ _] 
[# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _] [# _ _ _]`.trim());
    engine.update();
    expect(world.getBugAt(new Position(2, 1)).direction).to.equal(4);
    expect(world.getBugAt(new Position(1, 3)).direction).to.equal(2);
    engine.update();
    expect(world.getBugAt(new Position(2, 1)).direction).to.equal(3);
    expect(world.getBugAt(new Position(1, 3)).direction).to.equal(3);
    engine.update();
    expect(world.getBugAt(new Position(2, 1)).direction).to.equal(2);
    expect(world.getBugAt(new Position(1, 3)).direction).to.equal(4);
    engine.update();
    expect(world.getBugAt(new Position(2, 1)).direction).to.equal(1);
    expect(world.getBugAt(new Position(1, 3)).direction).to.equal(5);
    engine.update();
    expect(world.getBugAt(new Position(2, 1)).direction).to.equal(0);
    expect(world.getBugAt(new Position(1, 3)).direction).to.equal(0);
  });
});

describe('parseProgram', () => {
  it('should generate the correct instructions from the program', () => {
    const program = `
      sense 0 1 2 friend
      mark 3 4
      unmark 5 6
      pickup 7 8
      drop 9
      turn 10 11
      move 12 13
      flip 2 14 15
      direction 16 17 18
    `;

    const expectedOutput = [
      new Sense(0, 1, 2, new CellCondition('Friend')),
      new Mark(3, 4),
      new Unmark(5, 6),
      new PickUp(7, 8),
      new Drop(9),
      new Turn(10, 11),
      new Move(12, 13),
      new Flip(2, 14, 15),
      new Direction(16, 17, 18),
    ];

    const actualOutput = parseProgram(program);
    expect(JSON.stringify(actualOutput)).to.equal(JSON.stringify(expectedOutput));
  });

  it('should return an empty array ', () => {
    const program = '';
    const expectedOutput = [];
    const actualOutput = parseProgram(program);
    expect(actualOutput).to.eql(expectedOutput);
  });

  it('should throw an error  with an unknown instruction', () => {
    const program = 'foo 1 2 3';
    expect(() => parseProgram(program)).to.throw('Unknown instruction foo');
  });
});
