import { config } from "./config";
import { BookBo, bookDal } from "./db";
import { BookDto } from "./model";
import { BookMapper } from "./BookMapper";

export class ServiceResult<T> {
    data!: T;
    validationResults!: ValidationResults;

    get isValid() {
        if (this.validationResults) return this.validationResults!.isValid
        return true;
    }

    toString() {
        let failed = this.validationResults.filter(x => !x.isValid).map(x => x.validationMessage);
        return `\t${failed.join("\n\t")}`;
    }
}

export enum ValidationType {
    Mandatory = "Mandatory",
    Numeric = "Numeric",
    Date = "Date",
    Exists = "Exists"
}

class ValidationResult {
    public fieldName!: string;
    constructor(public type: ValidationType, public isValid: boolean, public validationMessage: string) { }

    setFieldName(fieldName: string) {
        this.fieldName = fieldName;
        this.validationMessage = this.validationMessage.replace("[fieldName]", fieldName);
        return this;
    }

    static get MandatoryCheckSuccess() {
        return new ValidationResult(ValidationType.Mandatory, true, "Success");
    }
    static get MandatoryCheckFailed() {
        return new ValidationResult(ValidationType.Mandatory, false, "Missing mandatory field '[fieldName]'");
    }
    static get NumericCheckSuccess() {
        return new ValidationResult(ValidationType.Numeric, true, "Success");
    }
    static get NumericCheckFailed() {
        return new ValidationResult(ValidationType.Numeric, false, "Expected numeric value for field '[fieldName]'");
    }
    static get ExistsCheckSuccess() {
        return new ValidationResult(ValidationType.Exists, true, "Success");
    }
    static get ExistsCheckFailed() {
        return new ValidationResult(ValidationType.Exists, false, "No record exists for field '[fieldName]'");
    }
    static get DateCheckSuccess() {
        return new ValidationResult(ValidationType.Date, true, "Success");
    }
    static get DateCheckFailed() {
        return new ValidationResult(ValidationType.Date, false, "Expected date value for field '[fieldName]'");
    }
}

class ValidationResults extends Array<ValidationResult> {
    get isValid() {
        return this.length === this.filter(x => x.isValid).length;
    }
}

class InputValidator {
    validate(book: Partial<BookBo>, checkIsbnExists: boolean): ValidationResults {
        let results = new ValidationResults();
        results.push(this.checkMandatory(book, "Author"));
        results.push(this.checkMandatory(book, "Isbn"));
        results.push(this.checkMandatory(book, "Title"));
        results.push(this.checkNumeric(book, "Isbn"));
        results.push(this.checkDate(book, "ReleaseDate"));
        if (checkIsbnExists) results.push(this.checkIsbnExists(book.Isbn!));
        return results;
    }
    validateIsbn(isbn: string | number | undefined, checkIsbnExists: boolean): ValidationResults {
        let results = new ValidationResults();
        results.push(this.checkMandatory({ Isbn: isbn as number }, "Isbn"));
        results.push(this.checkNumeric({ Isbn: isbn as number }, "Isbn"));
        if (checkIsbnExists) results.push(this.checkIsbnExists(Number(isbn)));
        return results;
    }
    private checkIsbnExists(isbn: number): ValidationResult {
        if (!bookDal.exists(isbn))
            return ValidationResult.ExistsCheckFailed.setFieldName("isbn");
        return ValidationResult.ExistsCheckSuccess.setFieldName("isbn");
    }
    private checkMandatory(book: Partial<BookBo>, fieldName: keyof BookBo): ValidationResult {
        if (book[fieldName] === undefined || book[fieldName] === null)
            return ValidationResult.MandatoryCheckFailed.setFieldName(fieldName);
        return ValidationResult.MandatoryCheckSuccess.setFieldName(fieldName);
    }
    private checkNumeric(book: Partial<BookBo>, fieldName: keyof BookBo): ValidationResult {
        if (isNaN(Number(book[fieldName])))
            return ValidationResult.NumericCheckFailed.setFieldName(fieldName);
        return ValidationResult.NumericCheckSuccess.setFieldName(fieldName);
    }
    private checkDate(book: Partial<BookBo>, fieldName: keyof BookBo): ValidationResult {
        let value = book[fieldName];
        if (value !== undefined && (!isNaN(Number(`${value}`)) || isNaN(Date.parse(`${value}`))))
            return ValidationResult.DateCheckFailed.setFieldName(fieldName);
        return ValidationResult.DateCheckSuccess.setFieldName(fieldName);
    }
}
const inputValidator = new InputValidator();

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
        serviceResult.validationResults = inputValidator.validateIsbn(isbn as string, false);
        if (serviceResult.validationResults.isValid) {
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
        serviceResult.validationResults = inputValidator.validate(bookBo, false);
        if (serviceResult.validationResults.isValid) {
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
        serviceResult.validationResults = inputValidator.validate(bookBo, true);
        if (serviceResult.validationResults.isValid) {
            await bookDal.update(bookBo);
            let _bookDto = BookMapper.transformToDto(bookBo);
            _bookDto.resource = `${config.rest.baseUrl}/books/${_bookDto.isbn}`;
            serviceResult.data = _bookDto;
        }
        return serviceResult;
    }

    public async delete(isbn: number): Promise<ServiceResult<boolean>> {
        let serviceResult = new ServiceResult<boolean>();
        serviceResult.validationResults = inputValidator.validateIsbn(isbn, true);
        if (serviceResult.validationResults.isValid)
            serviceResult.data = await bookDal.delete(isbn);
        return serviceResult;
    }
}
export const bookService = new BookService();
