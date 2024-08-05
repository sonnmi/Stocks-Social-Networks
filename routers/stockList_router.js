import { Router } from "express";
import { client } from "../datasource.js";
import { stockListQuery } from "../queries/stockList_query.js";

export const StockListRouter = Router();

StockListRouter.get("/:username", async (req, res) => {
    const username = req.params.username;
    client.query(stockListQuery.getStockListByUserQuery(), [username], (err, data) => {
        console.log("in get stock list", username)
        if (err) {
        console.log(err);
        return res.json({ error: "Error getting stock list" });
        } else if (!data || data.rows.length === 0) {
        console.log("No stock list found");
        return res.json({ error: "No stock list found" });
        } else {
        return res.json(data.rows);
        }
    });
    }
);

StockListRouter.post("/addStock", async (req, res) => {
  const username = parseInt(req.body.username);
  const symbol = req.body.symbol;
  const name = req.body.name;
  console.log("in add stock", username, symbol, name)
  try {
    client.query(
      stockListQuery.addStockStockListQuery(),
      [username, symbol, name],
      (err, response) => {
        if (err) {
            console.log(err)
          return res.json({
            error: "Cannot insert to stocklist",
          });
        }  else {
            return res.json({stockList: res.rows,
          });
        }
    })} catch (e) {
        console.log("Cannot insert to stocklist")
    }
})

StockListRouter.post("/add", async (req, res) => {
    try {
        const userId = req.body.userId;
        const stock = req.body.stock;
        const visibility = req.body.visibility;
        client.query(stockListQuery.insertStockListQuery(), [userId, visibility, stock], (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ error: "Error adding stock to list" });
        } else {
            return res.json({
            message: "StockList added.",
            userId: userId,
            visibility: visibility,
            stock: stock,
            });
        }
        });
    } catch (err) {
        console.log(err);
    }
    }
);

StockListRouter.delete("/delete", async (req, res) => {
    try {
        const userId = req.body.userId;
        const stock = req.body.stock;
        client.query(stockListQuery.deleteStockListQuery(), [userId, stock], (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ error: "Error deleting stock from list" });
        } else {
            return res.json({
            message: "StockList deleted.",
            userId: userId,
            stock: stock,
            });
        }
        });
    } catch (err) {
        console.log(err);
    }
    }
);

StockListRouter.put("/update", async (req, res) => {
    try {
        const userId = req.body.userId;
        const stock = req.body.stock;
        const visibility = req.body.visibility;
        client.query(stockListQuery.updateStockListQuery(), [visibility, userId, stock], (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ error: "Error updating stock list" });
        } else {
            return res.json({
            message: "StockList updated.",
            userId: userId,
            stock: stock,
            visibility: visibility,
            });
        }
        });
    } catch (err) {
        console.log(err);
    }
    });

StockListRouter.get("/public", async (req, res) => {
    try {
        client.query(stockListQuery.getPublicStockListsQuery(), (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ error: "Error getting public stock list" });
        } else if (!data || data.rows.length === 0) {
            console.log("No public stock list found");
            return res.json({ error: "No public stock list found" });
        } else {
            return res.json(data.rows);
        }
        });
    } catch (err) {
        console.log(err);
    }
}
);

StockListRouter.get("/getOneStockList/:userId/:stock", async (req, res) => {
    console.log("in get one stock list")
    const userId = req.params.userId;
    const stock = req.params.stock;
    client.query(stockListQuery.getStockListByNameAndOwnerQuery(), [userId, stock], (err, data) => {
        if (err) {
        console.log(err);
        return res.json({ error: "Error getting stock list" });
        } else if (!data || data.rows.length === 0) {
        console.log("No stock list found");
        return res.json({ error: "No stock list found" });
        } else {
        return res.json(data.rows);
        }
    });
    }
);