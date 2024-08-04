export const userQuery = (function () {
    "use strict";
    let module = {};

    module.getAllUsers = () => {
        return "SELECT * FROM Users"
    }

    module.getUserIdQuery = () => {
        return `SELECT userId FROM Users WHERE username = $1`
    }

    module.getUserInfoQuery = () => {
        return `SELECT userId, username, email FROM Users WHERE username = $1`
    }

    module.insertUserQuery = () => {
        return `INSERT INTO Users(username, password, email)
                VALUES ($1, $2, $3)`
    }

    module.deleteAllUsers = () => {
        return `DELETE FROM Users;`
    }

    module.loginQuery = () => {
        return `SELECT userId, username, email FROM Users WHERE username = $1 AND password = $2`
    }

    module.getUserIdQuery = () => {
        return `SELECT userId FROM Users WHERE username = $1`
    }

    return module;
})();