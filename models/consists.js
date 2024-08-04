export const createConsistsTableQuery = `
    CREATE TABLE IF NOT EXISTS Consists (
        stocklist VARCHAR(30),
        owner INTEGER,
        stock VARCHAR (5),
        PRIMARY KEY (owner, stocklist, stock),
        FOREIGN KEY (stocklist, owner) REFERENCES StockList(name, owner),
        FOREIGN KEY (stock) REFERENCES Stock(symbol)
    );

`;
