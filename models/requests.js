export const createRequestsTableQuery = `
    CREATE TABLE IF NOT EXISTS Requests(
        sender INT,
        receiver INT,
        requestType VARCHAR(20),
        requestStatus VARCHAR(20),
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        requestTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(sender, receiver, requestStatus, requestTime),
        FOREIGN KEY (sender) REFERENCES Users(userId) ON DELETE CASCADE,
        FOREIGN KEY (receiver) REFERENCES Users(userId) ON DELETE CASCADE
    );`;