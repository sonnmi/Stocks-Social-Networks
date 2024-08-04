// export const createStockHistoryTableQuery = `
//     CREATE TABLE IF NOT EXISTS CashAccount(
//         accountID SERIAL,
//         balance REAL,
//         portfolio VARCHAR(30),
//         owner INTEGER,
//         PRIMARY KEY (accountID, portfolio),
//         FOREIGN KEY (portfolio, owner) REFERENCES Portfolios(name, owner)ON DELETE CASCADE,
//     );
// `
