export class ApiError extends Error {
    /**
     *
     * @param {number} statusCode - status code that send to the client
     * @param {*} message
     * @param {*} errors
     * @param {*} errorStack
     */
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        errorStack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (errorStack) {
            this.errorStack = errorStack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
