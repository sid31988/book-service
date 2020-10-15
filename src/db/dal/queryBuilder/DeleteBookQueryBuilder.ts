import { QueryBuilder } from "./QueryBuilder";

export class DeleteBookQueryBuilder extends QueryBuilder {
    readonly queryFormat: string = `Delete from public."Book" [whereClause]`;
    constructor() {
        super();
        this.query = this.queryFormat;
    }
    withWhereClause(whereClause: string) {
        this.query = this.query.replace("[whereClause]", `WHERE ${whereClause}`);
        return this;
    }
}
