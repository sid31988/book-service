export default class BookDto {
    id?: number;
    author?: string;
    title?: string;
    isbn?: number;
    releaseDate?: string;
    resource?: string;

    constructor() {
        this.author = undefined;
        this.title = undefined;
        this.isbn = undefined;
        this.releaseDate = undefined;
        this.resource = undefined;
    }
}
