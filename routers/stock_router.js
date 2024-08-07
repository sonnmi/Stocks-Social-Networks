import { Router } from "express";
import { client } from "../datasource.js";
import { stockQuery } from "../queries/stock_query.js";
import { commonQueryExecute } from "../queries/common.js";

export const StockRouter = Router();

StockRouter.get("/filtered", async (req, res) => {
  if ("limit" in req.query && "page" in req.query) {
    const limit = req.query.limit;
    const offset = req.query.page * limit;
    const filtered = req.query.filter;
    client.query(stockQuery.getFilteredStock(limit, offset), [`${filtered}%`], (err, data) => {
      if (err) {
        console.log(err);
      } else if (!data || data.rows.length === 0) {
        console.log("No stock history found for", symbol);
      } else {
        client.query(stockQuery.getStocksCount(), (err, count_) => {
          return res.json({
            total: Math.floor((count_.rows[0].count - 1) / limit) + 1,
            stocks: data.rows,
          });
        });
      }
    });
  } else {
    return res.status(422).json({
      error: "Missing required query. Expected both limit and page number.",
    });
  }
});

StockRouter.get("/:symbol", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stock.html"));
});

StockRouter.get("/", async (req, res) => {
  if ("limit" in req.query && "page" in req.query) {
    const limit = req.query.limit;
    const offset = req.query.page * limit;
    client.query(stockQuery.getStocks(limit, offset), (err, data) => {
      if (err) {
        console.log(err);
      } else if (!data || data.rows.length === 0) {
        console.log("No stock history found for", symbol);
      } else {
        client.query(stockQuery.getStocksCount(), (err, count_) => {
          return res.json({
            total: Math.floor((count_.rows[0].count - 1) / limit) + 1,
            stocks: data.rows,
          });
        });
      }
    });
  } else {
    return res.status(422).json({
      error: "Missing required query. Expected both limit and page number.",
    });
  }
});
