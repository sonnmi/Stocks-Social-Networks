let apiService = (function () {
  "use strict";
  let module = {};

  module.signIn = (username, password) => {
    return fetch("/api/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  module.signUp = (username, password, email) => {
    return fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    }).then((res) => res.json());
  };

  module.signOut = () => {
    return fetch("/api/users/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.json();
    });
  };

  module.getStocks = (page = 0, limit = 10) => {
    return fetch(`/api/stocks?limit=${limit}&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  module.getPortfoliosOfUser = (userId) => {
    return fetch(`/api/portfolios/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  module.createPortfolio = (userId, name) => {
    return fetch(`/api/portfolios?userId=${userId}&name=${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  module.getPortfolio = (userId, name) => {
    return fetch(`/api/portfolios?userId=${userId}&name=${name}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };
  module.sendRequest = (
    sender,
    receiver,
    requestType,
    requestStatus,
    requestTime,
  ) => {
    return fetch("/api/requests/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender,
        receiver,
        requestType,
        requestStatus,
        requestTime,
      }),
    }).then((res) => res.json());
  };

  module.deleteRequest = (sender, receiver) => {
    return fetch("/api/requests/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, receiver }),
    }).then((res) => res.json());
  };

  module.updateRequest = (requestStatus, sender, receiver) => {
    return fetch("/api/requests/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestStatus, sender, receiver }),
    }).then((res) => res.json());
  };

  module.getUserPendingRequests = (receiver) => {
    console.log("getPending request was called", receiver);
    return fetch(`/api/Requests/pending/${receiver}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getUserFriends = (username) => {
    console.log("getFriends was called", username);
    return fetch(`/api/friends/${username}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.addFriend = (username, friendUsername) => {
    return fetch("/api/friends/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, friendUsername }),
    }).then((res) => res.json());
  };

  module.deleteFriend = (username, friendUsername) => {
    return fetch("/api/friends/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, friendUsername }),
    }).then((res) => res.json());
  };

  module.getStockHistory = (symbol) => {
    return fetch(`/api/history/${symbol}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };
  
  module.buyStock = (portfolioname, userId, symbol, shares, price) => {
    return fetch(`/api/portfolios/addStock?portfolioname=${portfolioname}&userId=${userId}&symbol=${symbol}&shares=${shares}&price=${price}`, {
      method: "POST",
    }).then((res) => res.json());
  };

  module.getLatestStockHistory = (symbol) => {
    return fetch(`/api/latest/${symbol}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getRangeStockHistory = (symbol, start, end) => {
    return fetch(`/api/history/${symbol}?start=${start}&end=${end}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getStockHistory1week = (symbol) => {
    return fetch(`/api/history/${symbol}/1week`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.addStockStocklist = (symbol, userId, name) => {
    console.log("in add stock", userId, symbol, name);
    return fetch(`/api/stockList/addStock`, {
      headers: { "Content-Type": "application/json" },
      method: "POST", 
      body: JSON.stringify({ userId, symbol, name }),
    }).then((res) => res.json());
  }

  module.getStockHistory1month = (symbol) => {
    return fetch(`/api/history/${symbol}/1month`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getStockHistory3months = (symbol) => {
    return fetch(`/api/history/${symbol}/3months`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getStockHistory6months = (symbol) => {
    return fetch(`/api/history/${symbol}/6months`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getStockHistory1year = (symbol) => {
    return fetch(`/api/history/${symbol}/1year`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getStockHistory5years = (symbol) => {
    return fetch(`/api/history/${symbol}/5years`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.addStockHistory = (symbol, date, open, high, low, close, volume) => {
    return fetch("/api/history/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, date, open, high, low, close, volume }),
    }).then((res) => res.json());
  };

  module.deleteStockHistory = (symbol, date) => {
    return fetch("/api/history/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, date }),
    }).then((res) => res.json());
  };

  module.getStockListByUser = (userId) => {
    return fetch(`/api/stockList/${userId}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.createStockList = (userId, stock, visibility) => {
    return fetch("/api/stockList/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, stock, visibility }),
    }).then((res) => res.json());
  };

  module.deleteStockList = (userId, stock) => {
    return fetch("/api/stockList/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, stock }),
    }).then((res) => res.json());
  };

  module.updateStockList = (userId, stock, visibility) => {
    return fetch("/api/stockList/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, stock, visibility }),
    }).then((res) => res.json());
  };

  module.getStocklist = (owner, stocklist) => {
    return fetch(`/api/stocklistConsist/${owner}/${stocklist}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.addStockToStockList = (owner, stocklist, stock) => {
    return fetch("/api/stocklistConsist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, stocklist, stock }),
    }).then((res) => res.json());
  };

  module.deleteStockFromStockList = (owner, stocklist, stock) => {
    return fetch("/api/stocklistConsist/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, stocklist, stock }),
    }).then((res) => res.json());
  };

  module.shareStockList = (owner, viewer, stocklist) => {
    return fetch("/api/stocklistAccess/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, stocklist, viewer }),
    }).then((res) => res.json());
  };

  module.getSharedStockLists = (owner, viewer) => {
    return fetch(`/api/stocklistAccess/friendView/${owner}/${viewer}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.deleteStockListAccess = (owner, viewer, stocklist) => {
    return fetch("/api/stocklistAccess/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, stocklist, viewer }),
    }).then((res) => res.json());
  };

  module.addStockListComment = (stocklist, owner, comment, reviewer) => {
    return fetch("/api/stocklistComments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stocklist, owner, comment, reviewer }),
    }).then((res) => res.json());
  };

  module.deleteStockListComment = (stocklist, owner, comment, reviewer) => {
    return fetch("/api/stocklistComments/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stocklist, owner, comment, reviewer }),
    }).then((res) => res.json());
  };

  module.getStockListComments = (stocklist, owner) => {
    return fetch(`/api/stocklistComments/${stocklist}/${owner}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getStockListOwnComments = (stocklist, owner, reviewer) => {
    return fetch(`/api/stocklistComments/own/${stocklist}/${owner}/${reviewer}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getPortfolioInfo = (owner, portfolio) => {
    return fetch(`/api/holds/${owner}/${portfolio}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  }

  module.addHoldsToPortfolio = (owner, portfolio, stock) => {
    return fetch("/api/holds/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, portfolio, stock }),
    }).then((res) => res.json());
  };

  module.deleteHoldsFromPortfolio = (owner, portfolio, stock) => {
    return fetch("/api/holds/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, portfolio, stock }),
    }).then((res) => res.json());
  };

  module.getPublicStockLists = () => {
    return fetch("/api/stockList/public", {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getPortfolioCash = (owner, portfolio) => {
    return fetch(`/api/portfolios/cash/${owner}/${portfolio}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };
    

  return module;
})();