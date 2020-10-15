import * as http from "http";
import { config, endpoints, RestResponse, HttpMethods } from "../src";

const server = http.createServer((req, res) => {
    console.log(`${req.method}: ${req.url}`);
    if (req.method === undefined || req.url === undefined || req.url.split("/")[1] !== "books") {
        RestResponse.BadRequest.apply(res);
        return;
    }

    let method = endpoints[req.method.toLowerCase() as HttpMethods];
    try {
        method(req, res);
    }
    catch (ex) {
        console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
        RestResponse.InternalServerError.apply(res);
    }
});

process.on("SIGINT", () => {
    console.info("Closing server.");
    server.close(err => {
        if (err)
            console.error("SERVERERR: Error while closing server");
        else
            console.info("Server closed.")
    });
});

server.listen(config.rest.port, () => {
    console.info(`Server listening on port ${config.rest.port}. \nPress Ctrl+C to stop the server.`);
});