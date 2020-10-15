import { config } from "../../src/config";
import * as assert from "assert";
import { bookService } from "../../src/bookService";
import { BookDto } from "../../src/model";
import { bookDal } from "../../src/db";
import { bookBos, bookDtos } from "../test-data";
import { MockHelper } from "../helpers";

describe("On successful GET request", () => {
    it("with existing isbn, it returns the Book record", async () => {
        let bookDto = bookDtos[0];
        let bookBo = bookBos[0];
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBo] });
        let actual = await bookService.find(`${bookDto.isbn!}`);
        let expected: BookDto = { ...bookDto, resource: `${config.rest.baseUrl}/books/${bookDto.isbn}` };
        assert.deepStrictEqual(actual.data, expected);
        mockedPgQuery.restore();
    });
    it("with non-existing isbn, it doesn't return any Book record", async () => {
        let isbn = 0;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [] });
        let actual = await bookService.find(`${isbn}`);
        assert.deepStrictEqual(actual.data, undefined);
        mockedPgQuery.restore();
    });
    it("with existing isbn, it returns true if the isbn is found", async () => {
        let isbn = bookDtos[0].isbn!;
        let bookBo = bookBos[0];
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBo] });
        let actual = await bookDal.exists(isbn);
        assert.deepStrictEqual(actual, true);
        mockedPgQuery.restore();
    });
    it("with non-existing isbn, it returns false if the isbn is not found", async () => {
        let isbn = 0;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [] });
        let actual = await bookDal.exists(isbn);
        assert.deepStrictEqual(actual, false);
        mockedPgQuery.restore();
    });
    it("without isbn, it returns all Book records", async () => {
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: bookBos });
        let actual = await bookService.findAll();
        let expected: Array<BookDto> = bookDtos.map(x => {
            x.resource = `${config.rest.baseUrl}/books/${x.isbn}`;
            return x;
        });
        assert.deepStrictEqual(actual.data, expected);
        mockedPgQuery.restore();
    });
    it("with invalid isbn, it doesn't return any Book record", async () => {
        let isbn = "invalid";
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [] });
        let actual = await bookService.find(`${isbn}`);
        let invalidResults = actual.validationResults.filter(x => x.fieldName === "Isbn" && !x.isValid);
        assert.strictEqual(invalidResults.length > 0, true);
        mockedPgQuery.restore();
    });
});