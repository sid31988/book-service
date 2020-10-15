import { BookBo, bookDal } from "../db";
import { ValidationResults } from "./ValidationResults";
import { ValidationResult } from "./ValidationResult";

class Validator {
    async validate(book: Partial<BookBo>, checkIsbnExists: boolean, checkDuplicateIsbn: boolean): Promise<ValidationResults> {
        let results = new ValidationResults();
        results.push(this.checkMandatory(book, "Author"));
        results.push(this.checkMandatory(book, "Isbn"));
        results.push(this.checkMandatory(book, "Title"));
        results.push(this.checkNumeric(book, "Isbn"));
        results.push(this.checkDate(book, "ReleaseDate"));
        if (checkIsbnExists) results.push(await this.checkIsbnExists(book.Isbn!));
        if (checkDuplicateIsbn) results.push(await this.checkDuplicateIsbn(book.Isbn!));
        return results;
    }
    async validateIsbn(isbn: string | number | undefined, checkIsbnExists: boolean): Promise<ValidationResults> {
        let results = new ValidationResults();
        results.push(this.checkMandatory({ Isbn: isbn as number }, "Isbn"));
        results.push(this.checkNumeric({ Isbn: isbn as number }, "Isbn"));
        if (checkIsbnExists) results.push(await this.checkIsbnExists(Number(isbn)));
        return results;
    }
    private async checkIsbnExists(isbn: number): Promise<ValidationResult> {
        let isbnExists = await bookDal.exists(isbn);
        if (!isbnExists)
            return ValidationResult.ExistsCheckFailed.setFieldName("Isbn");
        return ValidationResult.ExistsCheckSuccess.setFieldName("Isbn");
    }
    private async checkDuplicateIsbn(isbn: number): Promise<ValidationResult> {
        let isbnExists = await bookDal.exists(isbn);
        if (isbnExists)
            return ValidationResult.DuplicateCheckFailed.setFieldName("Isbn");
        return ValidationResult.DuplicateCheckSuccess.setFieldName("Isbn");
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

export const validator = new Validator();
