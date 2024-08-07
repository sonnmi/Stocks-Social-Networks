export const createCovarianceQuery = `
    CREATE TABLE IF NOT EXISTS covariance (
        stock1 VARCHAR(5),
        stock2 VARCHAR(5),
        interval VARCHAR(10),
        LASTUPDATED TIMESTAMP,
        COVAR FLOAT,
        Foreign Key (stock1) references stock(symbol),
        Foreign Key (stock2) references stock(symbol),
        PRIMARY KEY (stock1, stock2, interval),
        CHECK (stock1 < stock2)
    );`;