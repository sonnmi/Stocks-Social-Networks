export const createReviewsTableQuery = `
    CREATE TABLE IF NOT EXISTS Reviews(
        reviewer VARCHAR(30),
        reviewed VARCHAR(30),
        owner VARCHAR(30),
        comment TEXT,
        PRIMARY KEY(reviewer, reviewed, owner),
        FOREIGN KEY (reviewer) REFERENCES Users(username) ON DELETE CASCADE,
        FOREIGN KEY (reviewed, owner) REFERENCES StockList(name, owner) ON DELETE CASCADE
    )`;

    //change comment to VARCHAR(4000)
