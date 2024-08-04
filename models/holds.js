export const createHoldsTableQuery = `
CREATE TABLE Holds(
	portfolio VARCHAR(30),
	stock VARCHAR(5) UNIQUE,
	owner INTEGER,
	FOREIGN KEY (portfolio, owner) REFERENCES Portfolios(name, owner)ON DELETE CASCADE
);`