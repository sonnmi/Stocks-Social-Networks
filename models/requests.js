export const createRequestsTableQuery = `
    CREATE TABLE IF NOT EXISTS Requests(
        sender INTEGER,
        receiver INTEGER,
        requestType VARCHAR(50),
        requestStatus VARCHAR(50),
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        requestTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(sender, receiver, requestStatus, requestTime),
        FOREIGN KEY (sender) REFERENCES Users(userId) ON DELETE CASCADE,
        FOREIGN KEY (receiver) REFERENCES Users(userId) ON DELETE CASCADE
    );`;

        // FOREIGN KEY (sender) REFERENCES Users(userID) ON DELETE CASCADE,
        // FOREIGN KEY (receiver) REFERENCES Users(userID) ON DELETE CASCADE