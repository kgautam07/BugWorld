export const Condition = {
    Friend: 'friend',
    Foe: 'foe',
    FriendWithFood: 'friendwithfood',
    FoeWithFood: 'foewithfood',
    Food: 'food',
    Rock: 'rock',
    Marker: class {
        constructor(value) {
            if (value < 0 || value > 5) throw new Error('Marker value must be between 0 and 5');
            this.value = value
        }
    },
    FoeMarker: 'foemarker',
    Home: 'home',
    FoeHome: 'foehome',
};

export const TurnDirection = Object.freeze({
    Left: 'left',
    Right: 'right',
});

export const SenseDirection = Object.freeze({
    Here: 'here',
    LeftAhead: 'leftahead',
    RightAhead: 'rightahead',
    Ahead: 'ahead',
});

export class Direction {
    constructor(direction) {
        this.direction = direction % 6;
    }

    static default() {
        return new Direction(0);
    }

    turnedBy(turnDirection, value) {
        if (turnDirection == TurnDirection.Right) {
            this.direction = (this.direction + value) % 6;
        }
        else {
            this.direction = (this.direction - value + 6) % 6;
        }
    }

    turnedOnce(turnDirection) {
        this.turn(turnDirection, 1);
    }
}

export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    nextInDirection(direction) {
        if (direction.direction == 0) return new Position(x + 1, y);
        if (direction.direction == 1) return new Position(x + (1 ^ x % 2), y + 1);
        if (direction.direction == 2) return new Position(x - (1 ^ x % 2), y + 1);
        if (direction.direction == 3) return new Position(x - 1, y);
        if (direction.direction == 4) return new Position(x - (1 ^ x % 2), y - 1);
        if (direction.direction == 5) return new Position(x + (1 ^ x % 2), y - 1);
        throw new Error('Direction invariant violated');
    }

    nextInSenseDirection(viewDirection, senseDirection) {
        if (senseDirection == SenseDirection.Here) return this;
        if (senseDirection == SenseDirection.Ahead) return this.nextInDirection(viewDirection);
        if (senseDirection == SenseDirection.LeftAhead) return this.nextInDirection(viewDirection.turnedOnce(TurnDirection.Left));
        if (senseDirection == SenseDirection.RightAhead) return this.nextInDirection(viewDirection.turnedOnce(TurnDirection.Right));
    }
}


export const Color = Object.freeze({
    Red: 'Red',
    Black: 'Black',
});