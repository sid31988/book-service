import { BookBo } from "./db"
import { BookDto } from "./model";

export class BookMapper {
    public static transformToBo(dto: BookDto): BookBo {
        return {
            Author: dto.author,
            Isbn: dto.isbn,
            ReleaseDate: dto.releaseDate!,
            Title: dto.title
        };
    }

    public static transformToDto(bo: BookBo): BookDto {
        let releaseDate: string | undefined = undefined;
        if (bo.ReleaseDate instanceof Date)
            releaseDate = bo.ReleaseDate.toISOString();
        else
            releaseDate = bo.ReleaseDate;

        return {
            author: bo.Author,
            isbn: bo.Isbn,
            releaseDate: releaseDate,
            title: bo.Title
        };
    }
}
