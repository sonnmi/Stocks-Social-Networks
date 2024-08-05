import { Router } from "express";
import { client } from "../datasource.js";
import { portfolioQuery } from "../queries/portfolio_query.js";
import { commonQueryExecute } from "../queries/common.js";

export const PortfolioRouter = Router();

PortfolioRouter.get("/cash", async (req, res) => {
  const portfolio = req.query.portfolio
  const username = req.query.owner;
  console.log(portfolio, username)
  try {
    client.query(
      portfolioQuery.getPortfolioCash(),
      [portfolio, username],
      (err, response) => {
        if (err){
          console.log(err.message)
            return res.json(err)
        }
        else {
          console.log(response)
            return res.json(response.rows[0])
        }}
    )} catch {
        return res.json({"error": "Could not get cash of the portfolio" + portfolio})
    }
  })

  PortfolioRouter.post("/withdraw", async (req, res) => {
  const portfolio = req.query.portfolio
  const username = req.query.owner;
  const money = req.query.money;
  try {
    client.query(
      portfolioQuery.withdrawCash(),
      [username, portfolio, money],
      (err, response) => {
        if (err || response.rowCount !== 1)
          return res.json({"error": `Could not withdraw from portfolio ${portfolio}. Check balance.`})
        else {
          return res.json(response.rows[0])
        }}
    )} catch {
        return res.json({"error": `Could not withdraw from portfolio ${portfolio}.`})
    }
  })

  PortfolioRouter.post("/deposit", async (req, res) => {
  const portfolio = req.query.portfolio
  const username = req.query.owner;
  const money = req.query.money;
  if (money <= 0) {
    return res.json({"error": `Cannot deposit ${money} dollars to portfolio ${portfolio}.`})
  }
  try {
    client.query(
      portfolioQuery.depositCash(),
      [username, portfolio, money],
      (err, response) => {
        if (err || response.rowCount !== 1)
          return res.json({"error": `Could not deposit to portfolio ${portfolio}.`})
        else {
          return res.json(response.rows[0])
        }}
    )} catch {
        return res.json({"error": `Could not deposit to portfolio ${portfolio}.`})
    }
  })

PortfolioRouter.get("/:username", async (req, res) => {
  const username = req.params.username;
  const limit = req.query.limit;
  client.query(
    portfolioQuery.getPortfoliosByUser(limit),
    [username],
    (err, data) => {
      if (err) {
        console.log(err);
      } else if (!data || data.rows.length === 0) {
        return res.json({
          error: "You are not registered. You can't buy any stock.",
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
  const portfolioname = req.query.portfolio;
  const username = req.query.owner;
  try {
    client.query(
      portfolioQuery.createPortfolio(),
      [portfolioname, username, 0],
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



PortfolioRouter.post("/addStock", async (req, res) => {
  const portfolioname = req.query.portfolioname
  const username = req.query.username;
  const symbol = req.query.symbol;
  const shares = parseInt(req.query.shares);
  const price = parseInt(req.query.price);
  var cash = 0;
  console.log(portfolioname, username, symbol, shares, price)
  // try {
  //   client.query(
  //     portfolioQuery.getPortfolioCash(),
  //     [portfolioname, 1],
  //     (err, response) => {
  //       if (err) {
  //           console.log(err)
  //         return res.json({
  //           error: "Not found",
  //         });
  //       } else {
  //           console.log(response.rows)
  //           cash = response.rows[0].cash
          try {
            // if (cash >= shares * price) {
                client.query(
                    portfolioQuery.addStock(),
                    [portfolioname, symbol, username, price],
                    (err, r) => {
                        if (err) {
                            console.log(err)
                        return res.json({
                            error: "Buying stocks failed.",
                        });
                        } else {
                            client.query(
                                portfolioQuery.withdrawCash(),
                                [username, portfolioname, shares * price],
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
                // } else {
                //     res.json({
                //             error: "No cash to buy",
                //         });
                // }
            } catch (err) {
                return res.status(422).json({ error: "Buying stocks failed." });
            }
        // }
      // },
    // );
// } catch(e) {
//     console.log(e)
// }
  });
