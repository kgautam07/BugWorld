import { World} from "../logic/world.js";
import {Bug} from "../logic/bug.js";
import {Engine} from "../engine/engine.js"
import {Tournament} from "../Tournament/tournament.js"

class SimulationSettings {
    setWorld(world) {
        this.world = world;
    }

    setRedProgram(redProgram) {
        this.redProgram = redProgram;
    }

    setBlackProgram(blackProgram) {
        this.blackProgram = blackProgram;
    }
}

export const simulationSettings = new SimulationSettings();

export class Simulation {
    constructor(simulationSettings) {
        if (simulationSettings.world == null) {
            throw new Error("World is null");
        }
        if (simulationSettings.redProgram == null) {
            throw new Error("Red program is null");
        }
        if (simulationSettings.blackProgram == null) {
            throw new Error("Black program is null");
        }

        this.world = simulationSettings.world;
        this.redProgram = simulationSettings.redProgram;
        this.blackProgram = simulationSettings.blackProgram;
        this.tournament = new Tournament(this.world, this.redProgram, this.blackProgram);
        this.engine = new Engine(this.world, this.redProgram, this.blackProgram, 1000);
    }

    static bugId = 0;
    genBugId() {
        return World.bugId++;
    }

    resetAntsAtNests() {
        for (position in this.world.redNestPositions()) {
            let bug = new Bug({
                id: this.genBugId(),
                world: this.world,
                cell: null,
                color: color.Red,
                brain: this.redProgram
            });
            this.world.setBugAt(position, bug);
        }
        for (position in this.world.blackNestPositions()) {
            let bug = new Bug({
                id: this.genBugId(),
                world: this.world,
                cell: null,
                color: color.Black,
                brain: this.blackProgram
            });
            this.world.setBugAt(position, bug);
        }
    }
    run() {
        const logger = new Logger();
        const result = this.engine.run(logger);
        return result;
      }
    
      getCurrentTournamentStatus() {
        const status = this.tournament.getCurrentTournamentStatus();
        return status;
      }
}
