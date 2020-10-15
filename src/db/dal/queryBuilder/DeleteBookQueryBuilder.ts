import { BookQueryBuilder } from "./BookQueryBuilder";

export class DeleteBookQueryBuilder extends BookQueryBuilder {
    readonly queryFormat: string = `Delete from public."Book" [whereClause]`;
    constructor() {
        super();
        this.query = this.queryFormat;
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
