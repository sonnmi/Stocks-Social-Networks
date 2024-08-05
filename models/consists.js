export const createConsistsTableQuery = `
    CREATE TABLE IF NOT EXISTS Consists (
        stocklist VARCHAR(30),
        owner VARCHAR(30),
        stock VARCHAR(5),
        PRIMARY KEY (owner, stocklist, stock),
        FOREIGN KEY (stocklist, owner) REFERENCES StockList(name, owner) ON DELETE CASCADE,
        FOREIGN KEY (stock) REFERENCES Stock(symbol)
    );`;

// assume stock is never deleted in the purpose of our project and symbol is primary key of stock so non-null
// same thing as Holds