import { Router } from "express";
import { client } from "../datasource.js";
import { portfolioQuery } from "../queries/portfolio_query.js";
import { commonQueryExecute } from "../queries/common.js";

export const PortfolioRouter = Router();
PortfolioRouter.get("/holds", async (req, res) => {
  const portfolioname = req.query.portfolio;
  const username = req.query.owner;
  try {
    client.query(
      portfolioQuery.getPortfolioHoldsByUser(),
      [username, portfolioname],
      (err, r) => {
        if (err) {
          console.log(err)
          return res.json({
                  error: "stocks failed.",
                });
              }
        else
          return res.json({
            symbols: r.rows,
          });
      }
    )
  } catch(e) {
    //
  }
})

PortfolioRouter.get("/cash", async (req, res) => {
  const portfolio = req.query.portfolio;
  const username = req.query.owner;
  console.log(portfolio, username);
  try {
    client.query(
      portfolioQuery.getPortfolioCash(),
      [portfolio, username],
      (err, response) => {
        if (err) {
          console.log(err.message);
          return res.json(err);
        } else {
          console.log(response);
          return res.json(response.rows[0]);
        }
      },
    );
  } catch {
    return res.json({
      error: "Could not get cash of the portfolio" + portfolio,
    });
  }
});

PortfolioRouter.post("/withdraw", async (req, res) => {
  const portfolio = req.query.portfolio;
  const username = req.query.owner;
  const money = req.query.money;
  try {
    client.query(
      portfolioQuery.withdrawCash(),
      [username, portfolio, money],
      (err, response) => {
        if (err || response.rowCount !== 1)
          return res.json({
            error: `Could not withdraw from portfolio ${portfolio}. Check balance.`,
          });
        else {
          return res.json(response.rows[0]);
        }
      },
    );
  } catch {
    return res.json({
      error: `Could not withdraw from portfolio ${portfolio}.`,
    });
  }
});

PortfolioRouter.post("/deposit", async (req, res) => {
  const portfolio = req.query.portfolio;
  const username = req.query.owner;
  const money = req.query.money;
  if (money <= 0) {
    return res.json({
      error: `Cannot deposit ${money} dollars to portfolio ${portfolio}.`,
    });
  }
  try {
    client.query(
      portfolioQuery.depositCash(),
      [username, portfolio, money],
      (err, response) => {
        if (err || response.rowCount !== 1)
          return res.json({
            error: `Could not deposit to portfolio ${portfolio}.`,
          });
        else {
          return res.json(response.rows[0]);
        }
      },
    );
  } catch {
    return res.json({ error: `Could not deposit to portfolio ${portfolio}.` });
  }
});

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

// PortfolioRouter.delete("/holds/delete", async (req, res) => {
//   try {
//     const owner = req.body.owner;
//     const portfolio = req.body.portfolio;
//     const stock = req.body.stock;
//     const amount = req.body.amount;
//     client.query(
//       portfolioQuery.deleteHolds(),
//       [owner, portfolio, stock, amount],
//       (err, data) => {
//         if (err) {
//             console.log(err);
//           } else if (!data || data.rows.length === 0) {
//             return res.json({
//               error: `Could not sell stocks. You do not own ${amount} ${stock}.`,
//             });
//           } else {
//             return res.json({
//               portfolios: data.rows,
//             });
//           }});
//   } catch (err) {
//     console.log(err);
//   }
// });

PortfolioRouter.post("/sellStock", async (req, res) => {
  try {
    const owner = req.body.owner;
    const portfolio = req.body.portfolio;
    const stock = req.body.stock;
    const amount = req.body.amount;
    client.query(
      portfolioQuery.cashout(),
      [owner, portfolio, stock, amount], 
      (err, data) => {
        if (err) {
          console.log(err.message)
          return res.json({error: "Selling stock failed"})
        } else if (!data || data.rows.length === 0) {
          return res.json({error: "Check amount of shares you have."})
        } else {
          const price = data.rows[0].close * amount;
          client.query(
            portfolioQuery.sellStocks(),
            [owner, portfolio, stock, amount],
            (err, data) => {
              if (err) {
                  console.log(err);
                } else {
                  console.log(price)
                  client.query(
                    portfolioQuery.depositCash(),
                    [owner, portfolio, price]
                  )
                  return res.json({
                    cash: data,
                  });
                }});
              }
          }
    )
  } catch (err) {
    console.log(err);
  }
});

PortfolioRouter.post("/addStock", async (req, res) => {
  const portfolioname = req.query.portfolioname;
  const username = req.query.username;
  const symbol = req.query.symbol;
  const shares = parseInt(req.query.shares);
  const price = parseFloat(req.query.price);
  console.log(portfolioname, username, symbol, shares, price);

  client.query(
      portfolioQuery.withdrawCash(),
      [username, portfolioname, shares * price],
      (err, response) => {
        if (err || response.rowCount !== 1)
          return res.json({
            error: `Could not withdraw from portfolio ${portfolioname}. Check balance.`,
          });
        else {
          client.query(
          portfolioQuery.addStock(),
          [portfolioname, symbol, username, shares],
          (err, r) => {
            if (err) {
              console.log(err);
              return res.json({
                error: "Buying stocks failed.",
              });
            } else {
              res.json({
                r,
              });
            }
          })}

      },
    );


        
  // } catch (err) {
  //   return res.status(422).json({ error: "Buying stocks failed." });
  // }
  // }
  // },
  // );
  // } catch(e) {
  //     console.log(e)
  // }
});
