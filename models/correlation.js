export const createCorrelationQuery = `
    CREATE TABLE IF NOT EXISTS correlation (
        stock1 VARCHAR(5),
        stock2 VARCHAR(5),
        interval VARCHAR(10),
        LASTUPDATED TIMESTAMP,
        CORR FLOAT,
        Foreign Key (stock1) references stock(symbol),
        Foreign Key (stock2) references stock(symbol),
        PRIMARY KEY (stock1, stock2),
        CHECK (stock1 <= stock2)
    );`;