export const createFriendsTableQuery = `
    CREATE TABLE IF NOT EXISTS Friends (
        user1 VARCHAR(30),
        user2 VARCHAR(30),
        PRIMARY KEY(user1, user2),
        FOREIGN KEY (user1) REFERENCES Users(username) ON DELETE CASCADE,
        FOREIGN KEY (user2) REFERENCES Users(username) ON DELETE CASCADE
    );`;
