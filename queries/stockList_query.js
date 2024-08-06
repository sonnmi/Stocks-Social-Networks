export const stockListQuery = (function () {
  "use strict";

  let module = {};

  module.getStockListByUserQuery = () => {
    return `SELECT name, isPublic FROM StockList WHERE owner = $1`;
  };

  module.insertStockListQuery = () => {
    return `INSERT INTO StockList(owner, visibility, name) VALUES ($1, $2, $3)`;
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
    return `UPDATE StockList SET visibility = $1 WHERE owner = $2 AND name = $3`;
  };

  module.getPublicStockListsQuery = () => {
    return `SELECT * FROM StockList WHERE isPublic = true`;
  };

  return module;
})();
