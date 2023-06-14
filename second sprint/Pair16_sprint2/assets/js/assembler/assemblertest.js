import { Instruction } from "./instruction.js";
import { ProgramParseError, MissingArgumentsError } from "../error/error.js";
import { Condition, SenseDirection, TurnDirection } from "./definitions.js";

export const assemblertest = function (code) {
  const lines = code.trim().split('\n');
  try {
    const program = lines
      .filter(line => line.trim().length > 0)
      .map(line => {
        const tokens = line.trim().split(/\s+/);
        const command = tokens[0].toLowerCase();
        const args = tokens.slice(1);
        parseLine(command, args);
      })     
      return program
  }   catch (err) { 
      if (err instanceof ProgramParseError) {
        return new ProgramParseError("Error parsing line " + err.message); 
      }
      return new Error("Unexpected error when parsing line " + err.message);
    }
  }

function parseLine(command, args) {
  const numArgs = args.length;
  let labThen, labElse = null;
  switch (command) {
    case 'sense':
      if (numArgs < 4) {
        throw new ProgramParseError(`Missing arguments for sense command`);
      }

      let direction = parseSenseDirection(args[0])
      labThen = parseNumOrError(args[1])
      labElse = parseNumOrError(args[2])
      let condition = parseCondition(args.slice(3))
      return new Instruction.Sense(direction, condition, labThen, labElse);

    case 'move':
      if (numArgs < 2) {
        throw new MissingArgumentsError("move", 2);
      }
      labThen = parseNumOrError(args[0])
      labElse = parseNumOrError(args[1])
      return new Instruction.Move(labThen, labElse);

    case 'pickup':
      if (numArgs < 2) {
        throw new MissingArgumentsError("pickup", 2);
      }
      labThen = parseNumOrError(args[0])
      labElse = parseNumOrError(args[1])
      return new Instruction.PickUp(labThen, labElse);

    case 'drop':
      if (numArgs < 1) {
        throw new MissingArgumentsError("drop", 1);
      }
      labThen = parseNumOrError(args[0])
      return new Instruction.Drop(labThen);

    case 'turn':
      if (numArgs < 2) {
        throw new MissingArgumentsError("turn", 2);
      }
      let turnDir = parseTurnDirection(args[0])
      labThen = parseNumOrError(args[1])
      return new Instruction.Turn(turnDir, labThen);

    case 'flip':
      if (numArgs < 3) {
        throw new MissingArgumentsError("flip", 3);
      }

      let p = parseNumOrError(args[0])
      labThen = parseNumOrError(args[1])
      labElse = parseNumOrError(args[2])
      return new Instruction.Flip(p, labThen, labElse);
  }
}

function parseSenseDirection(dir) {
  const lowerDir = capitalizeFirstLetter(dir.toLowerCase());
  if (!(lowerDir in SenseDirection)) {
    throw new ProgramParseError(`Invalid sense direction "${dir}"`)
  }
  return SenseDirection[lowerDir];
}

function parseTurnDirection(dir) {
  const lowerDir = capitalizeFirstLetter(dir.toLowerCase());
  if (!(lowerDir in TurnDirection)) {
    throw new ProgramParseError(`Invalid turn direction "${dir}"`)
  }
  return TurnDirection[lowerDir];
}

function parseNumOrError(n) {
  const nat = parseInt(n);
  if (isNaN(nat)) {
    throw new ProgramParseError(`Invalid number: "${n}"`);
  }
  return nat;
}

function parseCondition(args) {
  if (args.length < 1) {
    throw new ProgramParseError(`Condition expected but none found"`);
  }
  const cond = capitalizeFirstLetter(args[0].toLowerCase());
  if (!cond in Condition) {
    throw new ProgramParseError(`Invalid condition "${cond}"`);
  }

  if (cond === 'marker') {
    if (args.length < 2) {
      throw new ProgramParseError(`Missing marker number in marker condition"`);
    }
    const marker = parseInt(args[1]);
    if (isNaN(marker)) {
      throw new ProgramParseError(`Invalid marker number in marker condition"`);
    }
    return new Condition.Marker(marker);
  }

  return Condition[cond];
}

// Used to match field names in definitions.js
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}