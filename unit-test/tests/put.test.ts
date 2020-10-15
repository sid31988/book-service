import { config } from "../../src/config";
import * as assert from "assert";
import { bookService, ValidationType } from "../../src/bookService";
import { BookDto } from "../../src/model";
import { bookBos, bookDtos } from "../test-data";
import { MockHelper } from "../helpers";

describe("On successful PUT request", () => {
    it("with releaseDate, it saves the Book record", async () => {
        let bookDto = bookDtos[0];
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.update(bookDto);
        let expected: BookDto = { ...bookDto, resource: `${config.rest.baseUrl}/books/${bookDto.isbn}` };
        assert.deepStrictEqual(actual.data, expected);
        mockedPgQuery.restore();
    });
    it("without releaseDate, it saves the Book record", async () => {
        let bookDto = bookDtos[1];
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[1]] });
        let actual = await bookService.update(bookDto);
        let expected: BookDto = { ...bookDto, resource: `${config.rest.baseUrl}/books/${bookDto.isbn}` };
        assert.deepStrictEqual(actual.data, expected);
        mockedPgQuery.restore();
    });
    it("for invalid data with missing field 'author', it returns a failed validation result", async () => {
        let book = { ...bookDtos[0] } as BookDto;
        book.author = undefined;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.update(book);
        let invalidResults = actual.validationResults.filter(x => x.fieldName === "Author" && x.type === ValidationType.Mandatory && !x.isValid);
        assert.strictEqual(invalidResults.length > 0, true);
        mockedPgQuery.restore();
    });
    it("for invalid data with missing field 'isbn', it returns a failed validation result", async () => {
        let book = { ...bookDtos[0] } as BookDto;
        book.isbn = undefined;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.insert(book);
        let invalidResults = actual.validationResults.filter(x => x.fieldName === "Isbn" && x.type === ValidationType.Mandatory && !x.isValid);
        assert.strictEqual(invalidResults.length > 0, true);
        mockedPgQuery.restore();
    });
    it("for invalid data with non-numeric field 'isbn', it returns a failed validation result", async () => {
        let book = { ...bookDtos[0] } as BookDto;
        book.isbn = "invalid" as unknown as number;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.insert(book);
        let invalidResults = actual.validationResults.filter(x => x.fieldName === "Isbn" && x.type === ValidationType.Numeric && !x.isValid);
        assert.strictEqual(invalidResults.length > 0, true);
        mockedPgQuery.restore();
    });
    it("for invalid data with missing field 'title', it returns a failed validation result", async () => {
        let book = { ...bookDtos[0] } as BookDto;
        book.title = undefined;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.insert(book);
        let invalidResults = actual.validationResults.filter(x => x.fieldName === "Title" && x.type === ValidationType.Mandatory && !x.isValid);
        assert.strictEqual(invalidResults.length > 0, true);
        mockedPgQuery.restore();
    });
    it("for invalid data with non-date field 'releaseDate', it returns a failed validation result", async () => {
        let book = { ...bookDtos[0] } as BookDto;
        book.releaseDate = "invalid";
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.insert(book);
        let invalidResults = actual.validationResults.filter(x => x.fieldName === "ReleaseDate" && x.type === ValidationType.Date && !x.isValid);
        assert.strictEqual(invalidResults.length > 0, true);
        mockedPgQuery.restore();
    });
    it("for invalid data with numeric field 'releaseDate', it returns a failed validation result", async () => {
        let book = { ...bookDtos[0] } as BookDto;
        book.releaseDate = 1234 as unknown as string;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.insert(book);
        let invalidResults = actual.validationResults.filter(x => x.fieldName === "ReleaseDate" && x.type === ValidationType.Date && !x.isValid);
        assert.strictEqual(invalidResults.length > 0, true);
        mockedPgQuery.restore();
    });
    it("for invalid data with html tags in field 'title', it html encodes and saves the Book record", async () => {
        let book = { ...bookDtos[0] } as BookDto;
        let title = book.title!;
        book.title = `<${title!}>`;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.insert(book);
        let expected: BookDto = { ...book, resource: `${config.rest.baseUrl}/books/${book.isbn}` };
        expected.title = `&lt;${title}&gt;`;
        assert.deepStrictEqual(actual.data, expected);
        mockedPgQuery.restore();
    });
});