import { ValidationResults } from "./validator";

export class ServiceResult<T> {
    data!: T;
    validationResults!: ValidationResults;

    get isValid() {
        return this.validationResults!.isValid
    }

    toString() {
        let failed = this.validationResults.filter(x => !x.isValid).map(x => x.validationMessage);
        return `\t${failed.join("\n\t")}`;
    }
}
