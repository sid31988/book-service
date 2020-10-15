import { config } from "./config";
import { BookBo, bookDal } from "./db";
import { BookDto } from "./model";
import {BookMapper} from "./BookMapper";

class BookService {
    public async findAll(): Promise<Array<BookDto>> {
        let bookBos: Array<BookBo> = await bookDal.findAll();
        let bookDtos: Array<BookDto> = bookBos.map(x => BookMapper.transformToDto(x));
        bookDtos.forEach(x => x.resource = `${config.rest.baseUrl}/books/${x.isbn}`);
        return bookDtos;
    }

    public async find(isbn: number): Promise<BookDto | undefined> {
        let bookBo: BookBo = await bookDal.find(isbn);
        if (bookBo === undefined) return undefined;
        let bookDto: BookDto = BookMapper.transformToDto(bookBo);
        bookDto.resource = `${config.rest.baseUrl}/books/${bookDto.isbn}`;
        return bookDto;
    }

    public async insert(bookDto: BookDto): Promise<BookDto> {
        let bookBo = BookMapper.transformToBo(bookDto);
        await bookDal.insert(bookBo);
        let _bookDto = BookMapper.transformToDto(bookBo);
        _bookDto.resource = `${config.rest.baseUrl}/books/${_bookDto.isbn}`;
        return _bookDto;
    }

    public async update(bookDto: BookDto): Promise<BookDto> {
        let bookBo = BookMapper.transformToBo(bookDto);
        await bookDal.update(bookBo);
        let _bookDto = BookMapper.transformToDto(bookBo);
        _bookDto.resource = `${config.rest.baseUrl}/books/${_bookDto.isbn}`;
        return _bookDto;
    }

    public async delete(isbn: number): Promise<boolean> {
        return await bookDal.delete(isbn);
    }
}
export const bookService = new BookService();
