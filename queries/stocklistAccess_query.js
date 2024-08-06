export const stockListAccessQuery = (function () {
  "use strict";

  let module = {};

  module.getStockListAccessByUserQuery = () => {
    return `SELECT * FROM StockListAccess WHERE stocklist = $1 AND owner = $2`;
  };

  module.insertStockListAccessQuery = () => {
    return `INSERT INTO StockListAccess(stocklist, owner, viewer) VALUES ($1, $2, $3)`;
  };

  module.deleteStockListAccessQuery = () => {
    return `DELETE FROM StockListAccess WHERE stocklist = $1 AND owner = $2 AND viewer = $3`;
  };

  module.getStockListAccessByOwnerViewerQuery = () => {
    return `SELECT * FROM StockListAccess WHERE owner = $1 AND viewer = $2`;
  };

  module.getAllSharedStockListsQuery = () => {
    return `SELECT Stocklist.name, Stocklist.owner, Stocklist.isPublic FROM StockListAccess JOIN StockList ON StockListAccess.stocklist = StockList.name AND StockListAccess.owner = StockList.owner WHERE viewer = $1`;
  };

  return module;
})();
