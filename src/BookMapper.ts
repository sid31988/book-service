import { BookBo } from "./db"
import { BookDto } from "./model";

export class BookMapper {
    private static htmlEncode(str?: string): string | undefined {
        if (str === undefined) return undefined;
        let tags = [
            { char: '&', htmlEncode: '&amp;' },
            { char: '<', htmlEncode: '&lt;' },
            { char: '>', htmlEncode: '&gt;' },
            { char: "'", htmlEncode: '&#39;' },
            { char: '"', htmlEncode: '&quot;' }
        ];
        tags.forEach(x => {
            str = str!.split(x.char).join(x.htmlEncode);
        })
        return str;
    }

    public static transformToBo(dto: BookDto): BookBo {
        return {
            Author: BookMapper.htmlEncode(dto.author),
            Isbn: dto.isbn,
            ReleaseDate: dto.releaseDate!,
            Title: BookMapper.htmlEncode(dto.title)
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
