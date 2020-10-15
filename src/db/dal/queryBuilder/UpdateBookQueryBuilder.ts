import { BookBo } from "../../model";
import { BookQueryBuilder } from "./BookQueryBuilder";

export class UpdateBookQueryBuilder extends BookQueryBuilder {
    readonly queryFormat: string = `UPDATE public."Book" set "Author" = [Author], "Isbn" = [Isbn], "ReleaseDate" = [ReleaseDate], "Title" = [Title] [whereClause]`;
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
    withWhereClause(whereClause: string) {
        this.query = this.query.replace("[whereClause]", `WHERE ${whereClause}`);
        return this;
    }
    withoutWhereClause() {
        this.query = this.query.replace("[whereClause]", "");
        return this;
    }
}
