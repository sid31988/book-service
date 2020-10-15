import * as http from "http";

export class RestResponse {
    code?: number;
    message?: string;
    constructor() {
        this.code = undefined;
        this.message = undefined;
    }
    public static create(code: number, message: string): RestResponse {
        let restResponse = new RestResponse();
        restResponse.code = code;
        restResponse.message = message;
        return restResponse
    }
    toString() {
        return JSON.stringify(this);
    }
    public apply(res: http.ServerResponse, str?: string | object, doEnd: boolean = true) {
        res.statusCode = this.code!;
        str = str || this;
        if (str && typeof str === "object")
            str = JSON.stringify(str);
        res.setHeader("Content-Type", "application/json");
        res.write(str);
        if (doEnd) res.end();
    }

    static BadRequest = RestResponse.create(400, "Bad Request");
    static ResourceNotFound = RestResponse.create(400, "Resource not found");
    static InternalServerError = RestResponse.create(500, "Internal Server Error");
    static Success = RestResponse.create(200, "");
}
