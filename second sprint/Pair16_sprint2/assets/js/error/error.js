// todo: expand to more meaningful error types
export class WorldParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'WorldParseError';
    }
}

export class ProgramParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProgramParseError';
    }
}

export class MissingArgumentsError extends ProgramParseError {
    constructor(failedOperation, expectedArgs) {
        super("Missing arguments for " + failedOperation + ". Expected at least" + expectedArgs);
        this.name = 'MissingArgumentsError';
    }
}
