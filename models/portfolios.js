export const createPortfoliosTableQuery = `
    CREATE TABLE IF NOT EXISTS StockList (
        owner INTEGER,
        visibility VARCHAR(20),
        name VARCHAR(30) UNIQUE,
        PRIMARY KEY (owner, name),
        FOREIGN KEY (owner) REFERENCES Users(userID)
    );
`;