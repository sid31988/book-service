import { QueryBuilder } from "./QueryBuilder";

export class SelectBookQueryBuilder extends QueryBuilder {
    readonly queryFormat: string = `SELECT [columns] from public."Book" [whereClause]`;
    constructor() {
        super();
        this.query = this.queryFormat;
    }
    withColumns(include: { Author: boolean, Isbn: boolean, ReleaseDate: boolean, Title: boolean }) {
        let columns = new Array();
        include.Author && columns.push(`Author`);
        include.Isbn && columns.push(`Isbn`);
        include.ReleaseDate && columns.push(`ReleaseDate`);
        include.Title && columns.push(`Title`);
        this.query = columns.length > 0
            ? this.query.replace("[columns]", `"${columns.join("\", \"")}"`)
            : this.query.replace("[columns]", `1`);
        return this;
    }
    withAllColumns() {
        return this.withColumns({ Author: true, Isbn: true, ReleaseDate: true, Title: true });
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
