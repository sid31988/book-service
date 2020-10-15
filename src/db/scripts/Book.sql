BEGIN;

-- CREATE DATABASE "BookDb"

ALTER DATABASE "BookDb" SET timezone TO 'UTC';

-- Table: public."Book"

CREATE TABLE public."Book"
(
   "Id" BIGSERIAL PRIMARY KEY,
   "Isbn" INTEGER NOT NULL,
   "Author" CHARACTER VARYING(250) NOT NULL,
   "Title" CHARACTER VARYING(250) NOT NULL,
   "ReleaseDate" TIMESTAMP WITH TIME ZONE
)
WITH (
   OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Book"
   OWNER to postgres;

GRANT ALL ON TABLE public."Book" TO postgres;
 
COMMIT;