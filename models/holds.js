export const createHoldsTableQuery = `
	CREATE TABLE IF NOT EXISTS Holds(
		portfolio VARCHAR(30),
		owner VARCHAR(30),
		stock VARCHAR(5),
		shares INT,
		PRIMARY KEY (owner, portfolio, stock),
		FOREIGN KEY (portfolio, owner) REFERENCES Portfolios(name, owner) ON DELETE CASCADE,
		FOREIGN KEY (stock) REFERENCES Stock(symbol)
	);`;

// assume stock is never deleted in the purpose of our project and symbol is primary key of stock so non-null
// same thing as Consists
