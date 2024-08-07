import { Router } from "express";
import { client } from "../datasource.js";
import { consistsQuery } from "../queries/consists_query.js";

export const ConsistRouter = Router();

ConsistRouter.get("/:owner/:stocklist", async (req, res) => {
  try {
    const owner = req.params.owner;
    const stocklist = req.params.stocklist;
    client.query(
      consistsQuery.stockListsConsistQuery(),
      [stocklist, owner],
      (err, data) => {
        if (err) {
          console.log(err);
        } else if (!data || data.rows.length === 0) {
          console.log("No stocks found in list");
          return res.json({ error: "No stocks found in list" });
        } else {
          return res.json(data.rows);
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

ConsistRouter.post("/add", async (req, res) => {
  try {
    const owner = req.body.owner;
    const stocklist = req.body.stocklist;
    const stock = req.body.stock;
    const shares = req.body.shares;
    client.query(
      consistsQuery.insertConsistQuery(),
      [stocklist, owner, stock, shares],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json({
            error: `Cannot add the stock to the stocklist ${stocklist}`
          })
        } else {
          return res.json({
            message: "Stock added to list.",
            owner: owner,
            stocklist: stocklist,
            stock: stock,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

ConsistRouter.delete("/delete", async (req, res) => {
  try {
    const owner = req.body.owner;
    const stocklist = req.body.stocklist;
    const stock = req.body.stock;
    client.query(
      consistsQuery.deleteConsistQuery(),
      [owner, stocklist, stock],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return res.json({
            message: "Stock deleted from list.",
            owner: owner,
            stocklist: stocklist,
            stock: stock,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});