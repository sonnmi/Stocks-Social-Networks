import { client } from "../datasource.js";

export const stockHistoryQuery = (function () {
  "use strict";
  let module = {};

  module.getStockHistoryBySymbol = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 ORDER BY date DESC";
  };

  module.getLatestStockHistoryBySymbol = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 ORDER BY date DESC LIMIT 1";
  };

  module.getStockHistoryBySymbolAndDate = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date = $2";
  };

  module.getStockHistoryBySymbolAndDateRange = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= $2 AND date <= $3 ORDER BY date";
  };

  module.addStockHistory = () => {
    return "INSERT INTO stockhistory(symbol, date, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  };

  module.deleteStockHistory = () => {
    return "DELETE FROM stockhistory WHERE symbol = $1 and date = $2";
  };

  module.modifyStockHistory = () => {
    return "UPDATE stockhistory SET open = $3, high = $4, low = $5, close = $6, volume = $7 WHERE symbol = $1 and date = $2";
  };

  module.getStockHistory1week = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 week' ORDER BY date";
  };

  module.getStockHistory1month = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 month' ORDER BY date";
  };

  module.getStockHistory3months = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '3 months' ORDER BY date";
  };

  module.getStockHistory6months = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '6 months' ORDER BY date";
  };

  module.getStockHistory1year = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '1 year' ORDER BY date";
  };

  module.getStockHistory5years = () => {
    return "SELECT date, open, high, low, close, volume FROM stockhistory WHERE symbol = $1 AND date >= NOW() - INTERVAL '5 years' ORDER BY date";
  };

  return module;
})();
