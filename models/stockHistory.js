export const createStockHistoryTableQuery = `
    CREATE TABLE IF NOT EXISTS StockHistory(
        date DATE,
        open REAL,
        high REAL,
        low REAL,
        close REAL,
        volume INT,
        symbol VARCHAR(5),
        PRIMARY KEY(symbol, date)
    );`;

// export const csvLoadStockHistory = `
//     COPY StockHistory(date, open, high, low, close, volume, symbol) FROM '/home/yesom/project/SP500History.csv' DELIMITER ',' CSV HEADER;
// `