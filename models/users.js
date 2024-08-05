export const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
        username VARCHAR(30) PRIMARY KEY,
        password VARCHAR(50),
        email VARCHAR(320) UNIQUE NOT NULL
    );`;
