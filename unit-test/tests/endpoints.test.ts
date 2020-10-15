import { config } from "../../src/config";
import * as assert from "assert";
import { bookService } from "../../src/bookService";
import { BookDto } from "../../src/model";

describe("On successful POST request", () => {
    it("it saves the Book in database", async () => {
        let book: BookDto = {
            isbn: 2222,
            author: "Siddharth Chaudhary",
            title: "Book Service v3",
            releaseDate: "2020-10-14T09:12:59.297Z"
        };
        let actual = await bookService.insert(book);
        let expected: BookDto = { ...book, resource: `${config.rest.baseUrl}/books/${book.isbn}` };
        assert.deepStrictEqual(actual, expected);
    });
});

describe("On successful GET request", () => {
    it("it returns the Book object", async () => {
        let book: BookDto = {
            isbn: 2222,
            author: "Siddharth Chaudhary",
            title: "Book Service v3",
            releaseDate: "2020-10-14T09:12:59.297Z"
        };
        let actual = await bookService.find(book.isbn!);
        let expected: BookDto = { ...book, resource: `${config.rest.baseUrl}/books/${book.isbn}` };
        assert.deepStrictEqual(actual, expected);
    });
});