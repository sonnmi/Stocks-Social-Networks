import { Router } from "express";
import { client } from "../datasource.js";
import { stockListAccessQuery } from "../queries/stocklistAccess_query.js";
import { userQuery } from "../queries/users_query.js";

export const StockListAccessRouter = Router();

StockListAccessRouter.get("/:stocklist/:owner", async (req, res) => {
  try {
    const stocklist = req.params.stocklist;
    const owner = req.params.owner;
    client.query(
      stockListAccessQuery.getStockListAccessByUserQuery(),
      [stocklist, owner],
      (err, data) => {
        if (err) {
          console.log(err);
        } else if (!data || data.rows.length === 0) {
          console.log("No stocklist access found");
          return res.json({ error: "No stocklist access found" });
        } else {
          return res.json(data.rows);
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

StockListAccessRouter.get("/friendView/:owner/:viewer", async (req, res) => {
  try {
    const owner = req.params.owner;
    const viewer = req.params.viewer;

    client.query(
      stockListAccessQuery.getStockListAccessByOwnerViewerQuery(),
      [owner, viewer],
      (err, data) => {
        if (err) {
          console.log(err);
        } else if (!data || data.rows.length === 0) {
          console.log("No stocklist access found");
          return res.json({ error: "No stocklist access found" });
        } else {
          return res.json(data.rows);
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

StockListAccessRouter.post("/add", async (req, res) => {
  try {
    const stocklist = req.body.stocklist;
    const owner = req.body.owner;
    const viewer = req.body.viewer;
    client.query(
      stockListAccessQuery.insertStockListAccessQuery(),
      [stocklist, owner, viewer],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return res.json({
            message: "Stocklist access added.",
            stocklist: stocklist,
            owner: owner,
            viewer: viewer,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

StockListAccessRouter.delete("/delete", async (req, res) => {
  try {
    const stocklist = req.body.stocklist;
    const owner = req.body.owner;
    const viewer = req.body.viewer;
    client.query(
      stockListAccessQuery.deleteStockListAccessQuery(),
      [stocklist, owner, viewer],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return res.json({
            message: "Stocklist access deleted.",
            stocklist: stocklist,
            owner: owner,
            viewer: viewer,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});
