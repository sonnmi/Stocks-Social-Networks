export const createStockTableQuery = `
    CREATE TABLE IF NOT EXISTS Stock (
        symbol VARCHAR(5) PRIMARY KEY
    );
    INSERT INTO Stock(symbol)
        SELECT DISTINCT symbol
        FROM StockHistory
        WHERE symbol NOT IN (SELECT symbol FROM Stock);
`;


// INSERT INTO Stock(symbol)
//         SELECT DISTINCT symbol   Todo: DISTINCT 없어도 되지 않나
//         FROM StockHistory
//         WHERE symbol NOT IN (SELECT symbol FROM Stock);

// Todo: We might need to alter Stock table when we add new stock history of stocks not listed in Stock
