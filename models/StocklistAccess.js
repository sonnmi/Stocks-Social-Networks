export const creatStockListAccessTableQuery = `
    CREATE TABLE IF NOT EXISTS StockListAccess (
        stocklist VARCHAR(30),
        owner INTEGER,
        viewer INT,
        PRIMARY KEY (owner, stocklist, viewer),
        FOREIGN KEY (stocklist, owner) REFERENCES StockList(name, owner),
        FOREIGN KEY (viewer) REFERENCES User(userId)
    );

`;
