import { QueryBuilder } from "./QueryBuilder";
import { BookBo } from "../../model";

export class InsertBookQueryBuilder extends QueryBuilder {
    readonly queryFormat: string = `INSERT into public."Book" ("Author", "Isbn", "ReleaseDate", "Title") values ([Author], [Isbn], [ReleaseDate], [Title])`;
    constructor() {
        super();
        this.query = this.queryFormat;
    }
    withValues(values: BookBo) {
        this.query = this.query.replace("[Author]", `'${values.Author!}'`);
        this.query = this.query.replace("[Isbn]", `${values.Isbn!}`);
        this.query = this.query.replace("[ReleaseDate]", values.ReleaseDate ? `'${values.ReleaseDate!}'` : `NULL`);
        this.query = this.query.replace("[Title]", `'${values.Title!}'`);
        return this;
    }
}
