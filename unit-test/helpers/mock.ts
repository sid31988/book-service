import * as pg from "pg";
import { config } from "../../src/config";
import { pgHelper } from "../../src/db/dal/pgHelper"
import { BookBo } from "../../src/db";

export type MockedFunction = { restore: () => void };

export class MockHelper {
    static mock<TObj extends object, TMethod>(obj: TObj, method: keyof TObj, newMethod: TMethod): MockedFunction {
        let _oldMethod = obj[method];
        obj[method] = newMethod as unknown as typeof _oldMethod;
        return {
            restore: () => {
                obj[method] = _oldMethod;
            }
        };
    }

    static mockPgQuery(queryResult: Partial<pg.QueryResult<BookBo>>): MockedFunction {
        return MockHelper.mock(pgHelper, "connect", async (cb: (client: pg.Client) => Promise<boolean>) => {
            let client: pg.Client | undefined = undefined;
            let mockedQuery: MockedFunction | undefined = undefined;
            try {
                client = new pg.Client(config.db);
                mockedQuery = MockHelper.mock(client, "query", async (): Promise<Partial<pg.QueryResult<BookBo>>> => {
                    return queryResult;
                });
                return await cb(client);
            }
            finally {
                mockedQuery && mockedQuery.restore();
            }
        });
    }
}