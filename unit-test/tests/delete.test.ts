import * as assert from "assert";
import { bookService } from "../../src/bookService";
import { bookBos, bookDtos } from "../test-data";
import { MockHelper } from "../helpers";

describe("On successful DELETE request", () => {
    it("it deletes the Book record", async () => {
        let isbn = bookDtos[0].isbn!;
        let mockedPgQuery = MockHelper.mockPgQuery({ rowCount: 1, rows: [bookBos[0]] });
        let actual = await bookService.delete(isbn);
        let expected = true;
        assert.deepStrictEqual(actual.data, expected);
        mockedPgQuery.restore();
    });
});
