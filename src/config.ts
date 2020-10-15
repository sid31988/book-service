export const config = {
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

export type Config = typeof config;