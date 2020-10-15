export class BookBo {
    Id?: number;
    Author?: string;
    Title?: string;
    Isbn?: number;
    ReleaseDate?: Date | string;

    constructor() {
        this.Author = undefined;
        this.Title = undefined;
        this.Isbn = undefined;
        this.ReleaseDate = undefined;
    }
}
