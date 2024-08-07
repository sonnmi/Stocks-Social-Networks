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

  module.getFilteredStock = (limit, offset) => {
    return `WITH RecentStockHistory AS (
                    SELECT SH.*
                    FROM StockHistory SH
                    JOIN (
                        SELECT symbol, MAX(date) AS max_date
                        FROM StockHistory
                        GROUP BY symbol
                    ) Recent ON SH.symbol = Recent.symbol AND SH.date = Recent.max_date
                )
                SELECT *
                FROM RecentStockHistory
                WHERE symbol ILIKE $1
                LIMIT ${limit} OFFSET ${offset}
            `;
  }

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
            SELECT * 
            FROM RecentStockHistory
            LIMIT ${limit} OFFSET ${offset}`;
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

  module.getVariance1week = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 week' ORDER BY date;";
  };

  module.getVariance1month = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 month' ORDER BY date;";
  };

  module.getVariance3month = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '3 months' ORDER BY date;";
  };

  module.getVariance6month = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '6 months' ORDER BY date;";
  };

  module.getVariance1year = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 year' ORDER BY date;";
  };

  module.getVariance5year = () => {
    return "SELECT VARIANCE(close) FROM StockHistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '5 years' ORDER BY date;";
  };

  module.getCOV = () => {
    return `WITH LatestDate AS (
                SELECT
                    MAX(date) AS max_date
                FROM
                    StockHistory
                WHERE
                    symbol = $1
            ),
            FilteredStockData AS (
                SELECT
                    date,
                    close
                FROM
                    StockHistory
                WHERE
                    symbol = $1
                    AND date >= (
                        SELECT
                            CASE $2
                                WHEN '1week' THEN max_date - INTERVAL '7 days'
                                WHEN '1month' THEN max_date - INTERVAL '1 month'
                                WHEN '3month' THEN max_date - INTERVAL '3 months'
                                WHEN '1year' THEN max_date - INTERVAL '1 year'
                                WHEN '5year' THEN max_date - INTERVAL '5 years'
                            END
                        FROM
                            LatestDate
                    )
            )
            SELECT
                AVG(close) AS mean_close,
                STDDEV(close) AS stddev_close,
                (STDDEV(close) / AVG(close)) * 100 AS coefficient_of_variation
            FROM
                FilteredStockData`;
  }

  module.updateCOV = () => {
    return `UPDATE Stock SET cov = $2 WHERE symbol = $1`;
  }

  module.getCOVBySymbol = () => {
    return `SELECT cov FROM Stock WHERE symbol = $1`;
  }


//   module.getCorrelation = (duration) => {
//     return `SELECT CORR()`;
//   };

//   module.getVolatility = () => {
//     return `SELECT `
//   }

  return module;
})();
