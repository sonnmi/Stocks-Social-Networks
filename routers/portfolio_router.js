import { Router } from "express";
import { client } from "../datasource.js";
import { portfolioQuery } from "../queries/portfolio_query.js";
import { commonQueryExecute } from "../queries/common.js";

export const PortfolioRouter = Router();

PortfolioRouter.get("/:userId", async (req, res) => {
  const id = req.params.userId;
  client.query(
    portfolioQuery.getPortfoliosByUser(),
    [parseInt(id)],
    (err, data) => {
      if (err) {
        console.log(err);
      } else if (!data || data.rows.length === 0) {
        return res.json({
          error: "You don't have a portfolio. You can't buy any stock.",
        });
      } else {
        return res.json({
          portfolios: data.rows,
        });
      }
    },
  );
});

PortfolioRouter.post("/", async (req, res) => {
  const portfolioname = req.query.name;
  const userId = req.query.userId;
  try {
    client.query(
      portfolioQuery.createPortfolio(),
      [portfolioname, userId, 0],
      (err, response) => {
        if (err) {
          return res.json({
            error: "Check name restriction.",
          });
        } else {
          return res.json({
            portfolio: response.rows,
          });
        }
      },
    );
  } catch (err) {
    return res.status(422).json({ error: "Portfolio creation failed." });
  }
});

PortfolioRouter.get("/cash/:owner/:portfolio", async (req, res) => {
  const portfolio = req.params.portfolio
const userId = parseInt(req.params.owner);
console.log(portfolio, userId) ;
try {
  client.query(
    portfolioQuery.getPortfolioCash(),
    [portfolio, userId],
    (err, response) => {
      if (err)
          return res.json(err)
      else {
          
          return res.json(response.rows[0])
      }}
  )} catch {
      return res.json({"error": "Not updating cash"})
  }
  })

PortfolioRouter.post("/addStock", async (req, res) => {
    const portfolioname = req.query.portfolioname
  const userId = parseInt(req.query.userId);
  const symbol = req.query.symbol;
  const shares = parseInt(req.query.shares);
  const price = parseInt(req.query.price);
  var cash = 0;
    console.log(portfolioname, userId, symbol, shares, price)
  try {
    client.query(
      portfolioQuery.getPortfolioCash(),
      [portfolioname, 1],
      (err, response) => {
        if (err) {
            console.log(err)
          return res.json({
            error: "Not found",
          });
        } else {
            console.log(response.rows)
            cash = response.rows[0].cash
          try {
            if (cash >= shares * price) {
                client.query(
                    portfolioQuery.addStock(),
                    [portfolioname, symbol, userId],
                    (err, r) => {
                        if (err) {
                            console.log(err)
                        return res.json({
                            error: "Buying stocks failed.",
                        });
                        } else {
                            client.query(
                                portfolioQuery.minusCash(),
                                [cash - shares * price, shares * price, userId, portfolioname],
                                (err, rs) => {
                                    if (err) {
                                        console.log(err)
                                        return res.json({
                                            error: "Buying stocks failed.",})
                                    }
                                    res.json({
                                        portfolio: r.rows,
                                    });
                                }
                            )
                        }
                    },
                    );
                } else {
                    res.json({
                            error: "No cash to buy",
                        });
                }
            } catch (err) {
                return res.status(422).json({ error: "Buying stocks failed." });
            }
        }
      },
    );
} catch(e) {
    console.log(e)
}
  });
