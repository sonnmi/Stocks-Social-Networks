export const createFriendsTableQuery = `
    CREATE TABLE IF NOT EXISTS Friends (
        id1 INT,
        id2 INT,
        PRIMARY KEY(id1, id2),
        FOREIGN KEY (id1) REFERENCES Users(userId) ON DELETE CASCADE,
        FOREIGN KEY (id2) REFERENCES Users(userId) ON DELETE CASCADE
    );`;
