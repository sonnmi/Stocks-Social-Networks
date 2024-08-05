export const creatStockListAccessTableQuery = `
    CREATE TABLE IF NOT EXISTS StockListAccess (
        stocklist VARCHAR(30),
        owner VARCHAR(30),
        viewer VARCHAR(30),
        PRIMARY KEY (owner, stocklist, viewer),
        FOREIGN KEY (stocklist, owner) REFERENCES StockList(name, owner) ON DELETE CASCADE,
        FOREIGN KEY (viewer) REFERENCES Users(username) ON DELETE CASCADE
    );`;
