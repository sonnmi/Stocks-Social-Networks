export const createStockTableQuery = `
    CREATE TABLE IF NOT EXISTS Stock (
        symbol VARCHAR(5) PRIMARY KEY
    );
    INSERT INTO Stock (symbol) SELECT DISTINCT symbol FROM StockHistory;
`;

// `
//     CREATE TABLE Stock(
//         symbol VARCHAR(5) PRIMARY KEY,
//         var REAL DEFAULT 0
//     );
// `
