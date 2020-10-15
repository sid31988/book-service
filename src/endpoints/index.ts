import * as http from "http";
import { IRestCallable } from "./EndpointHandlers";
import { bookDal } from "../db";
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
            if (bookDal.exists(isbn)) {
                await bookService.delete(isbn);
                RestResponse.Success.apply(res, "Success");
            }
            else
                RestResponse.ResourceNotFound.apply(res);
            console.log(`${req.method}: ${req.url}: Handled`);
        }
        catch (ex) {
            console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
            RestResponse.InternalServerError.apply(res);
        }
    }

    public async get(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            let isbn: string = req.url!.split("/")[2];
            if (isbn !== undefined && isNaN(Number(isbn))) {
                RestResponse.BadRequest.apply(res);
                return;
            }
            else {
                if (isbn === undefined) {
                    let books = await bookService.findAll();
                    RestResponse.Success.apply(res, books);
                }
                else {
                    let book = await bookService.find(Number(isbn));
                    if (book)
                        RestResponse.Success.apply(res, book);
                    else
                        RestResponse.ResourceNotFound.apply(res);
                }
            }
            console.log(`${req.method}: ${req.url}: Handled`);
        }
        catch (ex) {
            console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
            RestResponse.InternalServerError.apply(res);
        }
    }

    public async post(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        req.on("data", async chunk => {
            try {
                let book = JSON.parse(chunk.toString()) as BookDto;
                book = await bookService.insert(book);
                RestResponse.Success.apply(res, book);
                console.log(`${req.method}: ${req.url}: Handled`);
            }
            catch (ex) {
                console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
                RestResponse.InternalServerError.apply(res);
            }
        });
    }

    public async put(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        req.on("data", async chunk => {
            try {
                let book = JSON.parse(chunk.toString()) as BookDto;
                if (bookDal.exists(book.isbn!)) {
                    book = await bookService.update(book);
                    RestResponse.Success.apply(res, book);
                }
                else
                    RestResponse.BadRequest.apply(res);
                console.log(`${req.method}: ${req.url}: Handled`);
            }
            catch (ex) {
                console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
                RestResponse.InternalServerError.apply(res);
            }
        });
    }
}

export const endpoints = new BookEndpoints();