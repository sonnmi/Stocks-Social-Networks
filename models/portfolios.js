export const createPortfoliosTableQuery = `
    CREATE TABLE IF NOT EXISTS Portfolios (
        owner INT,
        name VARCHAR(30),
        cash REAL,
        PRIMARY KEY (owner, name),
        FOREIGN KEY (owner) REFERENCES Users(userID) ON DELETE CASCADE
    );`;