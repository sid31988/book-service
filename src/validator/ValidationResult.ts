import { ValidationType } from "./ValidationType";

export class ValidationResult {
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
    static get DuplicateCheckSuccess() {
        return new ValidationResult(ValidationType.Duplicate, true, "Success");
    }
    static get DuplicateCheckFailed() {
        return new ValidationResult(ValidationType.Duplicate, false, "Another entry for field '[fieldName]' already exists.");
    }
    static get DateCheckSuccess() {
        return new ValidationResult(ValidationType.Date, true, "Success");
    }
    static get DateCheckFailed() {
        return new ValidationResult(ValidationType.Date, false, "Expected date value for field '[fieldName]'");
    }
}
