import { client } from "../datasource.js";

export const portfolioQuery = (function () {
  "use strict";
  let module = {};

  module.getPortfoliosByUser = (limit) => {
    if (limit)
      return `SELECT name, cash FROM Portfolios WHERE owner = $1 LIMIT ${limit}`; // OFFSET ${offset}
    return "SELECT name, cash FROM Portfolios WHERE owner = $1"
  };

  module.getPortfoliosHoldsByUser = () => {
    return "SELECT close, symbol FROM Portfolios, Holds WHERE owner = $1 AND portfolio = $2";
  };

  module.createPortfolio = () => {
    return "INSERT INTO Portfolios(name, owner, cash) values ($1,$2,$3)";
  };

  module.getPortfolioCash = () => {
    return `SELECT cash FROM Portfolios WHERE name = $1 AND owner = $2`;
  };

  module.addStock = () => {
    return `INSERT INTO Holds (portfolio, stock, owner)
            SELECT CAST($1 AS VARCHAR), CAST($2 AS VARCHAR), CAST($3 AS VARCHAR)
            FROM Portfolios p
            WHERE p.name = $1
              AND p.owner = $3
              AND p.cash >= $4
              AND NOT EXISTS (
                  SELECT 1
                  FROM Holds
                  WHERE portfolio = $1 AND stock = $2 AND owner = $3
              )
            RETURNING $1;`
  }

  module.withdrawCash = () => {
    return `UPDATE Portfolios
            SET cash = cash - $3
            WHERE owner = $1 AND name = $2 AND cash >= $3
            RETURNING cash;`
  }

  module.depositCash = () => {
    return `UPDATE Portfolios
            SET cash = cash + $3
            WHERE owner = $1 AND name = $2
            RETURNING cash;`
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
