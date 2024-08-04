import { client } from "../datasource.js";

export const stockQuery = (function () {
  "use strict";
  let module = {};

  module.getStockBySymbol = () => {
    return "SELECT * FROM Stock WHERE symbol = $1";
  };

  module.getAllStocks = () => {
    return "SELECT symbol FROM Stock";
  };

  module.getStocks = (limit, offset) => {
    return `WITH RecentStockHistory AS (
                    SELECT SH.*
                    FROM StockHistory SH
                    JOIN (
                        SELECT symbol, MAX(date) AS max_date
                        FROM StockHistory
                        GROUP BY symbol
                    ) Recent ON SH.symbol = Recent.symbol AND SH.date = Recent.max_date
                )
                SELECT S.symbol, RSH.*
                FROM Stock S
                JOIN RecentStockHistory RSH ON S.symbol = RSH.symbol
                 LIMIT ${limit} OFFSET ${offset}
                `;
  };

  module.getStocksCount = () => {
    // return client.query(`SELECT COUNT(DISTINCT symbol) FROM Stock`, (err, res) => {
    //     return res.rows[0].count
    // })
    return `SELECT COUNT(DISTINCT symbol) FROM Stock`;
  };

  module.insertStock = () => {
    return "INSERT INTO Stock(symbol) VALUES ($1)";
  };

  module.insertStockFromStockList = () => {
    return "INSERT INTO Stock(symbol) VALUES ($1)";
  };

  module.deleteStock = () => {
    return "DELETE FROM Stock WHERE symbol = $1";
  };

  module.updateCOV = () => {
    return "UPDATE Stock SET cov = $1 WHERE symbol = $2";
  };

  module.updateBeta = () => {
    return "UPDATE Stock SET beta = $1 WHERE symbol = $2";
  };

  module.getVariance1week = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL \'1 week\' ORDER BY date;";
  };

  module.getVariance1month = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL \'1 month\' ORDER BY date;";
  };

  module.getVariance3month = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL \'3 months\' ORDER BY date;";
  };

  module.getVariance6month = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL \'6 months\' ORDER BY date;";
  };

  module.getVariance1year = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL \'1 year\' ORDER BY date;";
  };

  module.getVariance5year = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL \'5 years\' ORDER BY date;";
  };

  return module;
})();
