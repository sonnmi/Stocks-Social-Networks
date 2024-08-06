export const createStockListTableQuery = `
    CREATE TABLE IF NOT EXISTS StockList (
        owner VARCHAR(30),
        name VARCHAR(30),
        isPublic BOOLEAN NOT NULL,
        PRIMARY KEY (owner, name),
        FOREIGN KEY (owner) REFERENCES Users(username) ON DELETE CASCADE
    );`;
