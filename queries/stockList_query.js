export const stockListQuery = (function () {
  "use strict";

  let module = {};

  module.getStockListByUserQuery = () => {
    return `SELECT name, isPublic FROM StockList WHERE owner = $1`;
  };

  module.insertStockListQuery = () => {
    return `INSERT INTO StockList(owner, isPublic, name) VALUES ($1, $2, $3)`;
  };

  module.deleteStockListQuery = () => {
    return `DELETE FROM StockList WHERE owner = $1 AND name = $2`;
  };

  module.getStockListByNameAndOwnerQuery = () => {
    return `SELECT * FROM StockList WHERE owner = $1 AND name = $2`;
  };

  module.addStockStockListQuery = () => {
    return `INSERT INTO CONSISTS (owner, stock, stocklist)
                SELECT CAST($1 AS VARCHAR), CAST($2 AS VARCHAR), CAST($3 AS VARCHAR)
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM CONSISTS 
                    WHERE owner = $1 AND stocklist = $3 AND stock = $2
                );`;
  };

  module.updateStockListVisibilityQuery = () => {
    return `UPDATE StockList SET isPublic = $1 WHERE owner = $2 AND name = $3`;
  };

  module.getPublicStockListsQuery = () => {
    return `SELECT name, owner FROM StockList WHERE isPublic = true`;
  };

  module.getSharedStockListsQuery = () => {
    return `Select friend FROM (SELECT receiver as friend FROM requests WHERE sender = $1 and requestStatus = 'accepted'
            UNION
            SELECT sender as friend FROM requests WHERE receiver = $1 and requestStatus = 'accepted') as friends`
  }

  return module;
})();
