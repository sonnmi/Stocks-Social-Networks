export const createStockTableQuery = `
    CREATE TABLE IF NOT EXISTS Stock (
        symbol VARCHAR(5) PRIMARY KEY
    );
    INSERT INTO Stock (symbol) SELECT DISTINCT symbol FROM StockHistory;
`;

// Todo: We might need to alter Stock table when we add new stock history of stocks not listed in Stock
