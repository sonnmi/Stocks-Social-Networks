export const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
        userId serial PRIMARY KEY UNIQUE,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50),
        email VARCHAR(320) UNIQUE NOT NULL
    );`;
