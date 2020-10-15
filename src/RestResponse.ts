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
        let jsonStr = JSON.stringify(this.normalize(str));
        res.setHeader("Content-Type", "application/json");
        res.write(jsonStr);
        if (doEnd) res.end();
    }

    public normalize(str?: string | object): object {
        if (typeof str === "object")
            return str;
        if (str !== undefined) this.message = str;
        return this;
    }

    static BadRequest = RestResponse.create(400, "Bad Request");
    static ResourceNotFound = RestResponse.create(400, "Resource not found");
    static InternalServerError = RestResponse.create(500, "Internal Server Error");
    static Success = RestResponse.create(200, "");
}
