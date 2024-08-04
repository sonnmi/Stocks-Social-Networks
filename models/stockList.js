export const createStockListTableQuery = `
    CREATE TABLE IF NOT EXISTS StockList (
        owner INT,
        name VARCHAR(30),
        visibility VARCHAR(20),
        PRIMARY KEY (owner, name),
        FOREIGN KEY (owner) REFERENCES Users(userID) ON DELETE CASCADE
    );`;