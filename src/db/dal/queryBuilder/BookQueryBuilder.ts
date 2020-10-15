import { SelectBookQueryBuilder } from "./SelectBookQueryBuilder";
import { InsertBookQueryBuilder } from "./InsertBookQueryBuilder";
import { UpdateBookQueryBuilder } from "./UpdateBookQueryBuilder";
import { DeleteBookQueryBuilder } from "./DeleteBookQueryBuilder";

export class BookQueryBuilder {
    public static select(): SelectBookQueryBuilder {
        return new SelectBookQueryBuilder();
    }

    public static insert(): InsertBookQueryBuilder {
        return new InsertBookQueryBuilder();
    }

    public static update(): UpdateBookQueryBuilder {
        return new UpdateBookQueryBuilder();
    }

    public static delete(): DeleteBookQueryBuilder {
        return new DeleteBookQueryBuilder();
    }
} 