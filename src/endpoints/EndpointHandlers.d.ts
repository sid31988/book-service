import * as http from "http";
import { HttpMethods } from "./HttpMethods";

export type EndpointHandler = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;

export interface IRestCallable {
    [key in HttpMethods]: EndpointHandler
};
