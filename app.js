import express from "express";
import bodyParser from "body-parser";
import { client } from "./datasource.js";
import { createUserTableQuery } from "./models/users.js";
import { createFriendsTableQuery } from "./models/friends.js";
import { createStockHistoryTableQuery } from "./models/stockHistory.js";
import { createStockTableQuery } from "./models/stock.js";
import { usersRouter } from "./routers/users_router.js";
import { StockRouter } from "./routers/stock_router.js";
import { HistoryRouter } from "./routers/stock_history_router.js";
import { StockListRouter } from "./routers/stockList_router.js";
import { ConsistRouter } from "./routers/consist_router.js";
import { PortfolioRouter } from "./routers/portfolio_router.js";
import { HoldsRouter } from "./routers/holds_router.js";
import { StockListAccessRouter } from "./routers/stocklistAccess_router.js";
import { StockListCommentsRouter } from "./routers/stocklistComments_router.js";
import { createStockListTableQuery } from "./models/stockList.js";
import { createConsistsTableQuery } from "./models/consists.js";
import { createPortfoliosTableQuery } from "./models/portfolios.js";
import { creatStockListAccessTableQuery } from "./models/stocklistAccess.js";
import {createStocklistCommentsTableQuery} from "./models/stocklistComments.js";

import { commonQueryExecute } from "./queries/common.js";
import { createRequestsTableQuery } from "./models/requests.js";
import { FriendRouter } from "./routers/friend_router.js";
import { RequestRouter } from "./routers/request_router.js";
import { createHoldsTableQuery } from "./models/holds.js";

export const app = express();
const PORT = 3000;

client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Connection error", err.stack));

// commonQueryExecute.getAttributes();

const createTable = (table, query) => {
  try {
    console.log("creating", table);
    if ((!table) in ["StockHistory"]) commonQueryExecute.dropTable(table);
    client.query(query);
    commonQueryExecute.getAllData(table);
  } catch (err) {
    console.log("Error executing creation of table", err, table);
  }
};

// commonQueryExecute.dropTable("Stock")
commonQueryExecute.getAllTableNames();
// createTable("Holds", createHoldsTableQuery);
// createTable("Portfolios", createPortfoliosTableQuery);
// createTable("Users", createUserTableQuery);
// createTable("Friends", createFriendsTableQuery);
// createTable("Stock", createStockTableQuery);
// createTable("StockHistory", createStockHistoryTableQuery);
// createTable("StockList", createStockListTableQuery);
// createTable("Consists", createConsistsTableQuery);

// createTable("Requests", createRequestsTableQuery);

// createTable("Requests", createRequestsTableQuery);
// createTable("Consists", createConsistsTableQuery);
// createTable("StockListAccess", creatStockListAccessTableQuery);
// createTable("StockListComments", createStocklistCommentsTableQuery);


// commonQueryExecute.dropTable("StockList")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("static"));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use("/api/users", usersRouter);
app.use("/api/stocks", StockRouter);
app.use("/api/history", HistoryRouter);
app.use("/api/stockList", StockListRouter);
app.use("/api/stocklistConsist", ConsistRouter);
app.use("/api/stocklistAccess", StockListAccessRouter);
app.use("/api/stocklistComments", StockListCommentsRouter);

app.use("/api/holds", HoldsRouter);
app.use("/api/portfolios", PortfolioRouter);
app.use("/api/friends", FriendRouter);
app.use("/api/requests", RequestRouter);
app.use("/api/history", HistoryRouter);


app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

// client.end();
