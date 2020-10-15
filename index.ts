import * as http from "http";
import * as pg from "pg";

const config = {
    db: {
        database: "BookDb",
        host: "book-db",
        user: "postgres",
        password: "admin"
    },
    rest: {
        port: 8080,
        hostname: "localhost",
        protocol: "http",
        baseUrl: ""
    }
};
config.rest.baseUrl = `${config.rest.protocol}://${config.rest.hostname}:${config.rest.port}`;
type Config = typeof config;
type HttpMethods = "get" | "put" | "post" | "delete";

class RestResponse {
    code?: number;
    message?: string;
    constructor() {
        this.code = undefined;
        this.message = undefined;
    }
    public static create(code: number, message: string): RestResponse {
        let restResponse = new RestResponse();
        restResponse.code = code;
        restResponse.message = message;
        return restResponse
    }
    toString() {
        return JSON.stringify(this);
    }
    public apply(res: http.ServerResponse, str?: string | object, doEnd: boolean = true) {
        res.statusCode = this.code!;
        str = str || this;
        if (str && typeof str === "object")
            str = JSON.stringify(str);
        res.setHeader("Content-Type", "application/json");
        res.write(str);
        if (doEnd) res.end();
    }

    static BadRequest = RestResponse.create(400, "Bad Request");
    static ResourceNotFound = RestResponse.create(400, "Resource not found");
    static InternalServerError = RestResponse.create(500, "Internal Server Error");
    static Success = RestResponse.create(200, "");
}

class BookBo {
    Id?: number;
    Author?: string;
    Title?: string;
    Isbn?: number;
    ReleaseDate?: number;

    constructor() {
        this.Author = undefined;
        this.Title = undefined;
        this.Isbn = undefined;
        this.ReleaseDate = undefined;
    }
}

class BookDto {
    id?: number;
    author?: string;
    title?: string;
    isbn?: number;
    releaseDate?: number;
    resource?: string;

    constructor() {
        this.author = undefined;
        this.title = undefined;
        this.isbn = undefined;
        this.releaseDate = undefined;
        this.resource = undefined;
    }
}

class BookQueryBuilder {
    query!: string;

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

    public build(): string {
        return this.query;
    }
}

class SelectBookQueryBuilder extends BookQueryBuilder {
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

class InsertBookQueryBuilder extends BookQueryBuilder {
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

class UpdateBookQueryBuilder extends BookQueryBuilder {
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

class DeleteBookQueryBuilder extends BookQueryBuilder {
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

class PgHelper {
    constructor(private config: Config) { }
    async connect<T>(cb: (client: pg.Client) => Promise<T>) {
        let client: pg.Client | undefined = undefined;
        try {
            client = new pg.Client(this.config.db);
            client.connect();
            return await cb(client);
        }
        finally {
            if (client) client.end();
        }
    }
}
const pgHelper = new PgHelper(config);

class BookDal {
    pgClient: pg.Client;

    constructor() {
        this.pgClient = new pg.Client(config.db);
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
const bookDal = new BookDal();

class BookMapper {
    public static transformToBo(dto: BookDto): BookBo {
        return {
            Author: dto.author,
            Isbn: dto.isbn,
            ReleaseDate: dto.releaseDate,
            Title: dto.title
        };
    }

    public static transformToDto(bo: BookBo): BookDto {
        return {
            author: bo.Author,
            isbn: bo.Isbn,
            releaseDate: bo.ReleaseDate,
            title: bo.Title
        };
    }
}

class BookService {
    public async findAll(): Promise<Array<BookDto>> {
        let bookBos: Array<BookBo> = await bookDal.findAll();
        let bookDtos: Array<BookDto> = bookBos.map(x => BookMapper.transformToDto(x));
        bookDtos.forEach(x => x.resource = `${config.rest.baseUrl}/books/${x.isbn}`);
        return bookDtos;
    }

    public async find(isbn: number): Promise<BookDto | undefined> {
        let bookBo: BookBo = await bookDal.find(isbn);
        if (bookBo === undefined) return undefined;
        let bookDto: BookDto = BookMapper.transformToDto(bookBo);
        bookDto.resource = `${config.rest.baseUrl}/books/${bookDto.isbn}`;
        return bookDto;
    }

    public async insert(bookDto: BookDto): Promise<BookDto> {
        let bookBo = BookMapper.transformToBo(bookDto);
        await bookDal.insert(bookBo);
        let _bookDto = BookMapper.transformToDto(bookBo);
        _bookDto.resource = `${config.rest.baseUrl}/books/${_bookDto.isbn}`;
        return _bookDto;
    }

    public async update(bookDto: BookDto): Promise<BookDto> {
        let bookBo = BookMapper.transformToBo(bookDto);
        await bookDal.update(bookBo);
        let _bookDto = BookMapper.transformToDto(bookBo);
        _bookDto.resource = `${config.rest.baseUrl}/books/${_bookDto.isbn}`;
        return _bookDto;
    }

    public async delete(isbn: number): Promise<boolean> {
        return await bookDal.delete(isbn);
    }
}
const bookService = new BookService();

type EndpointHandlers = { [key in HttpMethods]: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> };
const handlers: EndpointHandlers = {
    get: async (req, res) => {
        try {
            let isbn: string = req.url!.split("/")[2];
            if (isbn !== undefined && isNaN(Number(isbn))) {
                RestResponse.BadRequest.apply(res);
                return;
            }
            else {
                if (isbn === undefined) {
                    let books = await bookService.findAll();
                    RestResponse.Success.apply(res, books);
                }
                else {
                    let book = await bookService.find(Number(isbn));
                    if (book)
                        RestResponse.Success.apply(res, book);
                    else
                        RestResponse.ResourceNotFound.apply(res);
                }
            }
            console.log(`${req.method}: ${req.url}: Handled`);
        }
        catch (ex) {
            console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
            RestResponse.InternalServerError.apply(res);
        }
    },
    post: async (req, res) => {
        req.on("data", async chunk => {
            try {
                let book = JSON.parse(chunk.toString()) as BookDto;
                book = await bookService.insert(book);
                RestResponse.Success.apply(res, book);
                console.log(`${req.method}: ${req.url}: Handled`);
            }
            catch (ex) {
                console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
                RestResponse.InternalServerError.apply(res);
            }
        });
    },
    put: async (req, res) => {
        req.on("data", async chunk => {
            try {
                let book = JSON.parse(chunk.toString()) as BookDto;
                if (bookDal.exists(book.isbn!)) {
                    book = await bookService.update(book);
                    RestResponse.Success.apply(res, book);
                }
                else
                    RestResponse.BadRequest.apply(res);
                console.log(`${req.method}: ${req.url}: Handled`);
            }
            catch (ex) {
                console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
                RestResponse.InternalServerError.apply(res);
            }
        });
    },
    delete: async (req, res) => {
        try {
            let isbn: string | number = req.url!.split("/")[2];
            if (isNaN(Number(isbn))) {
                RestResponse.BadRequest.apply(res);
                return;
            }
            isbn = Number(isbn);
            if (bookDal.exists(isbn)) {
                await bookService.delete(isbn);
                RestResponse.Success.apply(res, "Success");
            }
            else
                RestResponse.ResourceNotFound.apply(res);
            console.log(`${req.method}: ${req.url}: Handled`);
        }
        catch (ex) {
            console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
            RestResponse.InternalServerError.apply(res);
        }
    }
};

const server = http.createServer((req, res) => {
    console.log(`${req.method}: ${req.url}`);
    if (req.method === undefined || req.url === undefined || req.url.split("/")[1] !== "books") {
        RestResponse.BadRequest.apply(res);
        return;
    }

    let method = handlers[req.method.toLowerCase() as HttpMethods];
    try {
        method(req, res);
    }
    catch (ex) {
        console.log("ENDPOINTERR: Error while invoking endpoint\n", ex);
        RestResponse.InternalServerError.apply(res);
    }
});

process.on("SIGINT", () => {
    console.info("Closing server.");
    server.close(err => {
        if (err)
            console.error("SERVERERR: Error while closing server");
        else
            console.info("Server closed.")
    });
});

server.listen(config.rest.port, () => {
    console.info(`Server listening on port ${config.rest.port}. \nPress Ctrl+C to stop the server.`);
});