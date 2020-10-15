import { BookBo } from "./db"
import { BookDto } from "./model";

export class BookMapper {
    public static transformToBo(dto: BookDto): BookBo {
        return {
            Author: dto.author,
            Isbn: dto.isbn,
            ReleaseDate: dto.releaseDate,
            Title: dto.title
        };
    }

    public static transformToDto(bo: BookBo): BookDto {
        return {
            author: bo.Author,
            isbn: bo.Isbn,
            releaseDate: bo.ReleaseDate,
            title: bo.Title
        };
    }
}
