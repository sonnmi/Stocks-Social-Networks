export const createRequestsTableQuery = `
    CREATE TABLE IF NOT EXISTS Requests(
        sender VARCHAR(30),
        receiver VARCHAR(30),
        requestType VARCHAR(20),
        requestStatus VARCHAR(20),
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        requestTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(sender, receiver, requestStatus, requestTime),
        FOREIGN KEY (sender) REFERENCES Users(username) ON DELETE CASCADE,
        FOREIGN KEY (receiver) REFERENCES Users(username) ON DELETE CASCADE
    );`;
