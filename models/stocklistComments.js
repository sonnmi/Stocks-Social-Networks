export const createStocklistCommentsTableQuery = `
    CREATE TABLE IF NOT EXISTS Reviews(
    reviewer INTEGER,
    reviewed VARCHAR(30),
    owner INTEGER,
    comment TEXT,
    FOREIGN KEY (reviewer) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (reviewed, owner) REFERENCES StockList(name, owner) ON DELETE CASCADE,
    PRIMARY KEY(reviewer, reviewed, owner) 
)`;