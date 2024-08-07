import { client } from "../datasource.js";

export const stockHistoryQuery = (function () {
  "use strict";
  let module = {};

  module.getStockHistoryBySymbol = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 ORDER BY date DESC";
  };

  module.getLatestStockHistoryBySymbol = () => {
    return "SELECT date, open, high, low, close, volume, beta, cov FROM stockhistory as sh JOIN stock as s ON s.symbol = sh.symbol WHERE s.symbol = $1 ORDER BY date DESC LIMIT 1;";
  };

  module.getStockHistoryBySymbolAndDate = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date = $2";
  };

  module.getStockHistoryBySymbolAndDateRange = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= $2 AND date <= $3 ORDER BY date";
  };

  module.addStockHistory = () => {
    return "INSERT INTO stockhistory(symbol, date, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  };

  module.deleteStockHistory = () => {
    return "DELETE FROM stockhistory WHERE symbol = $1 and date = $2";
  };

  module.modifyStockHistory = () => {
    return "UPDATE stockhistory SET open = $3, high = $4, low = $5, close = $6, volume = $7 WHERE symbol = $1 and date = $2";
  };

  module.getStockHistory1week = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 week' ORDER BY date";
  };

  module.getStockHistory1month = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 month' ORDER BY date";
  };

  module.getStockHistory3months = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '3 months' ORDER BY date";
  };

  module.getStockHistory6months = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '6 months' ORDER BY date";
  };

  module.getStockHistory1year = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 year' ORDER BY date";
  };

  module.getStockHistory5years = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '5 years' ORDER BY date";
  };

  module.calculateCorrelation = () => {
    return `WITH StockData1 AS (
        SELECT
            date,
            close AS close1
        FROM
            StockHistory
        WHERE
            symbol = $1
            AND date >= (
                SELECT
                    CASE $3
                        WHEN '1week' THEN max_date - INTERVAL '7 days'
                        WHEN '1month' THEN max_date - INTERVAL '1 month'
                        WHEN '3month' THEN max_date - INTERVAL '3 months'
                        WHEN '1year' THEN max_date - INTERVAL '1 year'
                        WHEN '5year' THEN max_date - INTERVAL '5 years'
                    END
                FROM (
                    SELECT MAX(date) AS max_date
                    FROM StockHistory
                    WHERE symbol = $1
                ) AS LatestDate1
            )
    ),
    StockData2 AS (
        SELECT
            date,
            close AS close2
        FROM
            StockHistory
        WHERE
            symbol = $2
            AND date >= (
                SELECT
                    CASE $3
                        WHEN '1week' THEN max_date - INTERVAL '7 days'
                        WHEN '1month' THEN max_date - INTERVAL '1 month'
                        WHEN '3month' THEN max_date - INTERVAL '3 months'
                        WHEN '1year' THEN max_date - INTERVAL '1 year'
                        WHEN '5year' THEN max_date - INTERVAL '5 years'
                    END
                FROM (
                    SELECT MAX(date) AS max_date
                    FROM StockHistory
                    WHERE symbol = $2
                ) AS LatestDate2
            )
    ),
    CombinedData AS (
        SELECT
            StockData1.date,
            StockData1.close1,
            StockData2.close2
        FROM
            StockData1
        JOIN
            StockData2 ON StockData1.date = StockData2.date
    )
    SELECT
        CORR(close1, close2) AS correlation
    FROM
        CombinedData`;
  };

  return module;
})();
