import * as http from "http";
import { IRestCallable } from "./EndpointHandlers";
import { ServiceResult } from "../ServiceResult";
import { ValidationType } from "../validator";
import { bookService } from "../bookService";
import { RestResponse } from "../RestResponse";
import { BookDto } from "../model";
export * from "./HttpMethods";

class BookEndpoints implements IRestCallable {
    public async delete(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            let isbn: string | number = req.url!.split("/")[2];
            if (isNaN(Number(isbn))) {
                RestResponse.BadRequest.apply(res);
                return;
            }
            isbn = Number(isbn);
            let serviceResult = await bookService.delete(isbn);
            BookEndpoints.handleDeleteResult(res, serviceResult);
            console.log(`${req.method}: ${req.url}: Handled`);
        }
        catch (ex) {
            console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
            RestResponse.InternalServerError.apply(res);
        }
    }

    private static handleDeleteResult(res: http.ServerResponse, serviceResult: ServiceResult<boolean>) {
        if (serviceResult.isValid)
            RestResponse.Success.apply(res, "Success");

        let isbnNotFound = serviceResult.validationResults.filter(x => x.fieldName === "Isbn" && x.type === ValidationType.Exists && !x.isValid).length > 0;
        if (isbnNotFound)
            RestResponse.ResourceNotFound.apply(res);

        console.log(`INVALIDDATA: Validation error found:\n${serviceResult}`)
        RestResponse.BadRequest.apply(res);
    }

    public async get(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            let isbn: string = req.url!.split("/")[2];
            if (isbn === undefined) {
                let serviceResult = await bookService.findAll();
                RestResponse.Success.apply(res, serviceResult.data);
            }
            else {
                let serviceResult = await bookService.find(isbn);
                BookEndpoints.handleFindResult(res, serviceResult);
            }
            console.log(`${req.method}: ${req.url}: Handled`);
        }
        catch (ex) {
            console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
            RestResponse.InternalServerError.apply(res);
        }
    }

    private static handleFindResult(res: http.ServerResponse, serviceResult: ServiceResult<BookDto | undefined>) {
        if (serviceResult.isValid)
            if (serviceResult.data)
                RestResponse.Success.apply(res, serviceResult.data);
            else
                RestResponse.ResourceNotFound.apply(res);

        console.log(`INVALIDDATA: Validation error found:\n${serviceResult}`)
        RestResponse.BadRequest.apply(res);
    }

    public async post(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        req.on("data", async chunk => {
            try {
                let book = JSON.parse(chunk.toString()) as BookDto;
                let serviceResult = await bookService.insert(book);
                BookEndpoints.handleInsertResult(res, serviceResult);
                console.log(`${req.method}: ${req.url}: Handled`);
            }
            catch (ex) {
                console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
                RestResponse.InternalServerError.apply(res);
            }
        });
    }

    private static handleInsertResult(res: http.ServerResponse, serviceResult: ServiceResult<BookDto>) {
        if (serviceResult.isValid)
            RestResponse.Success.apply(res, serviceResult.data);

        console.log(`INVALIDDATA: Validation error found:\n${serviceResult}`)
        RestResponse.BadRequest.apply(res);
    }

    public async put(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        req.on("data", async chunk => {
            try {
                let book = JSON.parse(chunk.toString()) as BookDto;
                let serviceResult = await bookService.update(book);
                BookEndpoints.handleUpdateResult(res, serviceResult);
                console.log(`${req.method}: ${req.url}: Handled`);
            }
            catch (ex) {
                console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
                RestResponse.InternalServerError.apply(res);
            }
        });
    }

    private static handleUpdateResult(res: http.ServerResponse, serviceResult: ServiceResult<BookDto>) {
        if (serviceResult.isValid)
            RestResponse.Success.apply(res, serviceResult.data);

        let isbnNotFound = serviceResult.validationResults.filter(x => x.fieldName === "Isbn" && x.type === ValidationType.Exists && !x.isValid).length > 0;
        if (isbnNotFound)
            RestResponse.ResourceNotFound.apply(res);

        console.log(`INVALIDDATA: Validation error found:\n${serviceResult}`)
        RestResponse.BadRequest.apply(res);
    }
}

export const endpoints = new BookEndpoints();