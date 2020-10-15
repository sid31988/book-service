import { Client } from "pg";
import { config } from "../../config";
import { BookBo } from "../model";
import {BookQueryBuilder} from "./queryBuilder";
import {pgHelper} from "./pgHelper";

export class BookDal {
    pgClient: Client;

    constructor() {
        this.pgClient = new Client(config.db);
    }

    async insert(book: BookBo): Promise<boolean> {
        return await pgHelper.connect(async client => {
            let query = BookQueryBuilder.insert().withValues(book).build();
            let queryResult = await client.query(query);
            return queryResult.rowCount > 0;
        });
    }

    async update(book: BookBo): Promise<boolean> {
        return await pgHelper.connect(async client => {
            let query = BookQueryBuilder
                .update()
                .withValues(book)
                .withWhereClause(`"Isbn" = ${book.Isbn}`)
                .build();
            let queryResult = await client.query(query);
            return queryResult.rowCount > 0;
        });
    }

    async delete(isbn: number): Promise<boolean> {
        return await pgHelper.connect(async client => {
            let query = BookQueryBuilder
                .delete()
                .withWhereClause(`"Isbn" = ${isbn}`).build();
            let queryResult = await client.query(query);
            return queryResult.rowCount > 0;
        });
    }

    async find(isbn: number): Promise<BookBo> {
        return await pgHelper.connect(async client => {
            let query = BookQueryBuilder
                .select()
                .withAllColumns()
                .withWhereClause(`"Isbn" = ${isbn}`)
                .build();
            let queryResult = await client.query(query);
            return queryResult.rows[0] as BookBo;
        });
    }

    async findAll(): Promise<Array<BookBo>> {
        return await pgHelper.connect(async client => {
            let query = BookQueryBuilder
                .select()
                .withAllColumns()
                .withoutWhereClause()
                .build();
            let queryResult = await client.query(query);
            return queryResult.rows as Array<BookBo>;
        });
    }

    async exists(isbn: number): Promise<boolean> {
        let book = await this.find(isbn);
        return book !== undefined;
    }
}
export const bookDal = new BookDal();
