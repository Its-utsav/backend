export class ApiResponse {
    constructor(statusCode, data, message = "Successfully complete operation") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
