export const userQuery = (function () {
  "use strict";
  let module = {};

  module.getAllUsers = () => {
    return "SELECT username, email FROM Users";
  };

  module.insertUserQuery = () => {
    return `INSERT INTO Users(username, password, email)
                VALUES ($1, $2, $3)`;
  };

  module.deleteAllUsers = () => {
    return `DELETE FROM Users;`;
  };

  module.loginQuery = () => {
    return `SELECT username, email FROM Users WHERE username = $1 AND password = $2`;
  };

  return module;
})();
