import { client } from "../datasource.js";

export const portfolioQuery = (function () {
  "use strict";
  let module = {};

  module.getPortfoliosByUser = () => {
    return "SELECT name, cash FROM Portfolios WHERE owner = $1";
  };

  module.getPortfoliosHoldsByUser = () => {
    return "SELECT close, symbol FROM Portfolios, Holds WHERE owner = $1 AND portfolio = $2 AND stock = symbol";
  };

  module.createPortfolio = () => {
    return "INSERT INTO Portfolios(name, owner, cash) values ($1,$2,$3)";
  };

  module.getPortfolioCash = () => {
    return `SELECT cash FROM Portfolios WHERE name = $1 AND owner = $2`;
  };

  module.addStock = () => {
    return `INSERT INTO Holds (portfolio, stock, owner)
                SELECT CAST($1 AS text), CAST($2 AS text), CAST($3 AS integer)
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM Holds
                    WHERE portfolio = $1 AND stock = $2 AND owner = $3
                );`
  }

  module.minusCash = () => {
    return "UPDATE Portfolios SET cash = $1 WHERE cash >= $2 AND owner = $3 AND name = $4;"
  }

  module.getPortfolioValue = () => {
    return `SELECT SUM(holding) AS total_holding FROM (
        SELECT h.stock, h.amount, sh.close, (h.amount * sh.close) AS holding
        FROM (
            SELECT stock, amount
            FROM holds
            WHERE owner=1 AND portfolio='P1'
        ) AS h
        LEFT JOIN (
            SELECT s1.symbol, s1.close, s1.date
            FROM stockhistory s1
            JOIN (
                SELECT symbol, MAX(date) AS max_date
                FROM stockhistory
                GROUP BY symbol
            ) s2 ON s1.symbol = s2.symbol AND s1.date = s2.max_date
        ) AS sh ON sh.symbol = h.stock
    ) AS subquery;`
  }


  return module;
})();
