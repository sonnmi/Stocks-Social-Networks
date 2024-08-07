export const consistsQuery = (function () {
  "use strict";
  let module = {};

  module.stockListsConsistQuery = () => {
    return `SELECT stocklist, owner, stock, shares FROM Consists WHERE stocklist = $1 AND owner = $2`;
  };

  module.insertConsistQuery = () => {
    return `INSERT INTO Consists(stocklist, owner, stock, shares) VALUES ($1, $2, $3, $4)`;
  };

  module.deleteConsistQuery = () => {
    return `DELETE FROM Consists WHERE stocklist = $1 AND owner = $2 AND stock = $3`;
  };

  return module;
})();
