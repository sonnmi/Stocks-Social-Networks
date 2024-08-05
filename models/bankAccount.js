export const createBankAccountTableQuery = `
    CREATE TABLE IF NOT EXISTS BankAccount (
        owner VARCHAR(30),
        name VARCHAR(30),
        cash REAL,
        PRIMARY KEY (owner, name),
        FOREIGN KEY (owner) REFERENCES Users(username) ON DELETE CASCADE
    );`;