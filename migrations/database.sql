CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username varchar(60) NOT NULL UNIQUE,
    password varchar(60) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password) VALUES ('admin', '$2b$10$yEXlq6v7ojqzIvccg.cyh.oDliQEGztsWYmq5H2bc.rIZwPytV76a');
