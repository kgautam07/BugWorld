export const Instruction = {
    Sense: class {
        constructor(senseDir, condition, thenLab, elseLab) {
            this.senseDir = senseDir;
            this.condition = condition;
            this.thenLab = thenLab;
            this.elseLab = elseLab;
        }
    },

    Turn: class {
        constructor(turnDir, value) {
            this.turnDir = turnDir;
            this.value = value;
        }
    },

    Mark: class {
        constructor(marker, thenLab) {
            this.marker = marker;
            this.thenLab = thenLab;
        }
    },

    Unmark: class {
        constructor(marker, thenLab) {
            this.marker = marker;
            this.thenLab = thenLab;
        }
    },

    PickUp: class {
        constructor(thenLab, elseLab) {
            this.thenLab = thenLab;
            this.elseLab = elseLab;
        }
    },

    Drop: class {
        constructor(thenLab) {
            this.thenLab = thenLab;
        }
    },

    Flip: class {
        constructor(range, thenLab, elseLab) {
            this.range = range
            this.thenLab = thenLab;
            this.elseLab = elseLab;
        }
    },

    Move: class {
        constructor(thenLab, elseLab) {
            this.thenLab = thenLab;
            this.elseLab = elseLab;
        }
    }
}