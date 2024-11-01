import { HttpStatusCode } from "axios";

export enum ServerErrorCodes {
    START_ERROR = 'START_ERROR',
    CONFIG_ERROR = 'CONFIG_ERROR',
    CONNECTION_CLOSE_ERROR = 'CONNECTION_CLOSE_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class ServerError extends Error {
    code : ServerErrorCodes;
    httpStatusCode : HttpStatusCode

    constructor(message: string, code: ServerErrorCodes, httpStatusCode : HttpStatusCode) {
        super(message);
        this.name = 'ServerError';
        this.code = code;
        this.httpStatusCode = httpStatusCode;
    }
}