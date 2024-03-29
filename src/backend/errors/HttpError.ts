class HttpError extends Error {
    private _statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this._statusCode = statusCode;
        this.name = "HttpError";
    }

    get statusCode() {
        return this._statusCode;
    }

    static StatusCode = {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        TESTING: 418,
    };
}


export default HttpError;