import { client } from "../datasource.js";

export const portfolioQuery = (function () {
  "use strict";
  let module = {};

  module.getPortfoliosByUser = (limit) => {
    if (limit)
      return `SELECT name, cash FROM Portfolios WHERE owner = $1 ORDER BY name LIMIT ${limit}`; // OFFSET ${offset}
    return "SELECT name, cash FROM Portfolios WHERE owner = $1 ORDER BY name";
  };

  module.getPortfolioHoldsByUser = () => {
    return "SELECT stock, shares FROM Holds WHERE owner = $1 AND portfolio = $2";
  };

  module.createPortfolio = () => {
    return "INSERT INTO Portfolios(name, owner, cash) values ($1,$2,$3)";
  };

  module.getPortfolioCash = () => {
    return `SELECT cash FROM Portfolios WHERE name = $1 AND owner = $2`;
  };

  // We pulled close price when showing stocks which will not change.
  module.addStock = () => {
    return `INSERT INTO Holds (portfolio, stock, owner, shares)
            SELECT CAST($1 AS VARCHAR), CAST($2 AS VARCHAR), CAST($3 AS VARCHAR), $4
            ON CONFLICT (portfolio, stock, owner) 
            DO UPDATE
            SET shares = HOLDS.shares + EXCLUDED.shares
            RETURNING HOLDS.shares;`

    return `if EXISTS (
                  SELECT 1
                  FROM Holds
                  WHERE portfolio = $1 AND stock = $2 AND owner = $3
              ) then
              UPDATE Holds SET shares = $5 WHERE portfolio = $1 AND stock = $2 AND owner = $3;
            else
              INSERT INTO Holds (portfolio, stock, owner, shares)
              SELECT CAST($1 AS VARCHAR), CAST($2 AS VARCHAR), CAST($3 AS VARCHAR), $5
              FROM Portfolios p
              WHERE p.name = $1
                AND p.owner = $3
                AND p.cash >= $4;
            end if;`;
  };

  module.deleteHolds = () => {
    return `DELETE FROM Holds
            WHERE owner = $1 AND portfolio = $2 AND stock = $3
            RETURNING shares
    `
  }

  module.sellStocks = () => {
    return `WITH deleted AS (
                DELETE FROM Holds
                WHERE owner = $1 AND portfolio = $2 AND stock = $3 AND shares = $4
                RETURNING shares
            ), updated AS (
                UPDATE Holds
                SET shares = shares - $4
                WHERE owner = $1 AND portfolio = $2 AND stock = $3 AND shares > $4
                RETURNING shares
            )
            SELECT 
                (SELECT COUNT(shares) FROM updated) + (SELECT COUNT(shares) FROM deleted) as count;
    `
  }

  module.cashout = () => {
    return `SELECT close
            FROM (SELECT stock FROM Holds WHERE owner = $1 AND portfolio = $2 AND stock = $3 AND shares >= $4)
            CROSS JOIN (SELECT close FROM stockHistory WHERE symbol = $3 ORDER BY date DESC LIMIT 1);`
  }

  module.withdrawCash = () => {
    return `UPDATE Portfolios
            SET cash = cash - CAST($3 AS REAL)
            WHERE owner = $1 AND name = $2 AND cash >= $3
            RETURNING cash;`;
  };

  module.depositCash = () => {
    return `UPDATE Portfolios
            SET cash = cash + CAST($3 AS REAL)
            WHERE owner = $1 AND name = $2
            RETURNING cash;`;
  };

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
    ) AS subquery;`;
  };

  return module;
})();
