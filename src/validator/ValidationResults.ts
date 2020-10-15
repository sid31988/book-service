import { ValidationResult } from "./ValidationResult";

export class ValidationResults extends Array<ValidationResult> {
    get isValid() {
        return this.length === this.filter(x => x.isValid).length;
    }
}
