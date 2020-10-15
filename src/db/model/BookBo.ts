export class BookBo {
    Id?: number;
    Author?: string;
    Title?: string;
    Isbn?: number;
    ReleaseDate?: number;

    constructor() {
        this.Author = undefined;
        this.Title = undefined;
        this.Isbn = undefined;
        this.ReleaseDate = undefined;
    }
}
