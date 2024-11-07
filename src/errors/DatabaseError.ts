export enum DatabaseErrorCodes {
    CONNECTION_ERROR = 'CONNECTION_ERROR',
    DISCONNECT_ERROR = 'DISCONNECT_ERROR'
}

export class DatabaseError extends Error {
    code: DatabaseErrorCodes;

    constructor(message: string, code: DatabaseErrorCodes) {
        super(message);
        this.name = 'ServerError';
        this.code = code;
    }
}