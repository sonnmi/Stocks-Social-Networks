import { Router } from "express";
import { client } from "../datasource.js";
import { stockListQuery } from "../queries/stockList_query.js";

export const StockListRouter = Router();

StockListRouter.get("/byUser/:username", async (req, res) => {
  const username = req.params.username;
  client.query(
    stockListQuery.getStockListByUserQuery(),
    [username],
    (err, data) => {
      console.log("in get stock list", username);
      if (err) {
        console.log(err);
        return res.json({ error: "Error getting stock list" });
      } else if (!data || data.rows.length === 0) {
        console.log("No stock list found");
        return res.json({ error: "No stock list found" });
      } else {
        return res.json(data.rows);
      }
    },
  );
});

StockListRouter.post("/addStock", async (req, res) => {
  const username = req.body.username;
  const symbol = req.body.symbol;
  const name = req.body.name;
  console.log("in add stock", username, symbol, name);
  try {
    client.query(
      stockListQuery.addStockStockListQuery(),
      [username, symbol, name],
      (err, response) => {
        if (err) {
          console.log(err);
          return res.json({
            error: "Cannot insert to stocklist",
          });
        } else {
          return res.json({ stockList: res.rows });
        }
      },
    );
  } catch (e) {
    console.log("Cannot insert to stocklist");
  }
});

StockListRouter.post("/add", async (req, res) => {
  try {
    const username = req.body.username;
    const stock = req.body.stock;
    const visibility = req.body.visibility;
    client.query(
      stockListQuery.insertStockListQuery(),
      [username, visibility, stock],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ error: "Error adding stock to list" });
        } else {
          return res.json({
            message: "StockList added.",
            username: username,
            isPublic: visibility,
            stock: stock,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

StockListRouter.delete("/delete", async (req, res) => {
  try {
    const username = req.body.username;
    const name = req.body.name;
    client.query(
      stockListQuery.deleteStockListQuery(),
      [username, name],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ error: "Error deleting stock from list" });
        } else {
          return res.json({
            message: "StockList deleted.",
            username: username,
            name: name,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

// StockListRouter.put("/update", async (req, res) => {
//   try {
//     const username = req.body.username;
//     const stock = req.body.stock;
//     const visibility = req.body.visibility;
//     client.query(
//       stockListQuery.updateStockListQuery(),
//       [visibility, username, stock],
//       (err, data) => {
//         if (err) {
//           console.log(err);
//           return res.json({ error: "Error updating stock list" });
//         } else {
//           return res.json({
//             message: "StockList updated.",
//             username: username,
//             stock: stock,
//             visibility: visibility,
//           });
//         }
//       },
//     );
//   } catch (err) {
//     console.log(err);
//   }
// });

StockListRouter.get("/public", async (req, res) => {
  try {
    console.log("in get public stock list");
    client.query(stockListQuery.getPublicStockListsQuery(), (err, data) => {
      console.log("in get public stock list 135", data);
      if (err) {
        console.log("Error getting public stock list 136", err);
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
});

StockListRouter.get("/shared", async (req, res) => {
  try {
    client.query(stockListQuery.getSharedStockListsQuery(), (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ error: "Error getting shared stock list" });
      } else if (!data || data.rows.length === 0) {
        console.log("No shared stock list found");
        return res.json({ error: "No shared stock list found" });
      } else {
        return res.json(data.rows);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// StockListRouter.get("/getOneStockList/:username/:stock", async (req, res) => {
//   console.log("in get one stock list");
//   const username = req.params.username;
//   const stock = req.params.stock;
//   client.query(
//     stockListQuery.getStockListByNameAndOwnerQuery(),
//     [username, stock],
//     (err, data) => {
//       if (err) {
//         console.log(err);
//         return res.json({ error: "Error getting stock list" });
//       } else if (!data || data.rows.length === 0) {
//         console.log("No stock list found");
//         return res.json({ error: "No stock list found" });
//       } else {
//         return res.json(data.rows);
//       }
//     },
//   );
// });
