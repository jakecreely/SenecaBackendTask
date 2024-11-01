export enum ServerErrorCodes {
    START_ERROR = 'START_ERROR',
    CONFIG_ERROR = 'CONFIG_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    CONNECTION_CLOSE_ERROR = 'CONNECTION_CLOSE_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class ServerError extends Error {
    code : ServerErrorCodes;

    constructor(message: string, code: ServerErrorCodes) {
        super(message);
        this.name = 'ServerError';
        this.code = code;
    }
}