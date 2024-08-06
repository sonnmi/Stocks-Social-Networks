import { Router } from "express";
import { client } from "../datasource.js";
import { holdsQuery } from "../queries/hold_query.js";

export const HoldsRouter = Router();

HoldsRouter.get("/:owner/:portfolio", async (req, res) => {
  try {
    const portfolio = req.params.portfolio;
    const owner = req.params.owner;
    client.query(
      holdsQuery.getUserHoldsQuery(),
      [portfolio, owner],
      (err, data) => {
        if (err) {
          console.log(err);
        } else if (!data || data.rows.length === 0) {
          console.log("No holds found");
          return res.json({ error: "No holds found" });
        } else {
          return res.json(data.rows);
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

HoldsRouter.post("/add", async (req, res) => {
  try {
    const owner = req.body.owner;
    const portfolio = req.body.portfolio;
    const stock = req.body.stock;
    client.query(
      holdsQuery.insertHoldQuery(),
      [owner, portfolio, stock, quantity],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return res.json({
            message: "Stock added to portfolio.",
            owner: owner,
            portfolio: portfolio,
            stock: stock,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

HoldsRouter.delete("/delete", async (req, res) => {
  try {
    const owner = req.body.owner;
    const portfolio = req.body.portfolio;
    const stock = req.body.stock;
    client.query(
      holdsQuery.deleteHoldQuery(),
      [owner, portfolio, stock],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return res.json({
            message: "Stock deleted from portfolio.",
            owner: owner,
            portfolio: portfolio,
            stock: stock,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});
