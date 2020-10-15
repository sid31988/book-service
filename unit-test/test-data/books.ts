import { BookDto } from "../../src/model";
import { BookBo } from "../../src/db";

export const bookDtos: Array<BookDto> = [
    {
        isbn: 2222,
        author: "Siddharth Chaudhary",
        title: "Book Service v3",
        releaseDate: "2020-10-14T09:12:59.297Z"
    },
    {
        isbn: 2223,
        author: "Siddharth Chaudhary",
        title: "Book Service v3",
        releaseDate: undefined
    }
];

export const bookBos: Array<BookBo> = [
    {
        Isbn: 2222,
        Author: "Siddharth Chaudhary",
        Title: "Book Service v3",
        ReleaseDate: new Date(Date.parse("2020-10-14T09:12:59.297Z"))
    },
    {
        Isbn: 2223,
        Author: "Siddharth Chaudhary",
        Title: "Book Service v3"
    }
];
