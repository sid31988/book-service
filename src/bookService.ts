import { config } from "./config";
import { BookBo, bookDal } from "./db";
import { BookDto } from "./model";
import { BookMapper } from "./BookMapper";
import { ServiceResult } from "./ServiceResult";
import { validator } from "./validator";

class BookService {
    public async findAll(): Promise<ServiceResult<Array<BookDto>>> {
        let serviceResult = new ServiceResult<Array<BookDto>>();
        let bookBos: Array<BookBo> = await bookDal.findAll();
        let bookDtos: Array<BookDto> = bookBos.map(x => BookMapper.transformToDto(x));
        bookDtos.forEach(x => x.resource = `${config.rest.baseUrl}/books/${x.isbn}`);
        serviceResult.data = bookDtos;
        return serviceResult;
    }

    public async find(isbn: string): Promise<ServiceResult<BookDto | undefined>> {
        let serviceResult = new ServiceResult<BookDto | undefined>();
        serviceResult.validationResults = await validator.validateIsbn(isbn as string, false);
        if (serviceResult.isValid) {
            let bookBo: BookBo = await bookDal.find(Number(isbn));
            if (bookBo === undefined) serviceResult.data = undefined;
            else {
                let bookDto: BookDto = BookMapper.transformToDto(bookBo);
                bookDto.resource = `${config.rest.baseUrl}/books/${bookDto.isbn}`;
                serviceResult.data = bookDto
            }
        }
        return serviceResult;
    }

    public async insert(bookDto: BookDto): Promise<ServiceResult<BookDto>> {
        let bookBo = BookMapper.transformToBo(bookDto);
        let serviceResult = new ServiceResult<BookDto>();
        serviceResult.validationResults = await validator.validate(bookBo, false, true);
        if (serviceResult.isValid) {
            await bookDal.insert(bookBo);
            let _bookDto = BookMapper.transformToDto(bookBo);
            _bookDto.resource = `${config.rest.baseUrl}/books/${_bookDto.isbn}`;
            serviceResult.data = _bookDto;
        }
        return serviceResult;
    }

    public async update(bookDto: BookDto): Promise<ServiceResult<BookDto>> {
        let bookBo = BookMapper.transformToBo(bookDto);
        let serviceResult = new ServiceResult<BookDto>();
        serviceResult.validationResults = await validator.validate(bookBo, true, false);
        if (serviceResult.isValid) {
            await bookDal.update(bookBo);
            let _bookDto = BookMapper.transformToDto(bookBo);
            _bookDto.resource = `${config.rest.baseUrl}/books/${_bookDto.isbn}`;
            serviceResult.data = _bookDto;
        }
        return serviceResult;
    }

    public async delete(isbn: number): Promise<ServiceResult<boolean>> {
        let serviceResult = new ServiceResult<boolean>();
        serviceResult.validationResults = await validator.validateIsbn(isbn, true);
        if (serviceResult.isValid)
            serviceResult.data = await bookDal.delete(isbn);
        return serviceResult;
    }
}
export const bookService = new BookService();
