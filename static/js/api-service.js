let apiService = (function () {
  "use strict";
  let module = {};

  /* USER MANAGEMENT */
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

  /* PORTFOLIO */
  module.getPortfoliosOfUser = (username, limit = null) => {
    return fetch(`/api/portfolios/${username}?limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  module.createPortfolio = (owner, portfolio) => {
    return fetch(`/api/portfolios?owner=${owner}&portfolio=${portfolio}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  module.getPortfolio = (owner, portfolio) => {
    return fetch(`/api/portfolios?owner=${owner}&portfolio=${portfolio}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  module.getPortfolioCash = (owner, portfolio) => {
    return fetch(`/api/portfolios/cash?owner=${owner}&portfolio=${portfolio}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.withdrawPortfolioCash = (owner, portfolio, money) => {
    return fetch(
      `/api/portfolios/withdraw?owner=${owner}&portfolio=${portfolio}&money=${money}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    ).then((res) => res.json());
  };

  module.depositPortfolioCash = (owner, portfolio, money) => {
    return fetch(
      `/api/portfolios/deposit?owner=${owner}&portfolio=${portfolio}&money=${money}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    ).then((res) => res.json());
  };

  /* FRIEND MANAGEMENT */
  module.deleteRequest = (sender, receiver) => {
    return fetch("/api/requests/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, receiver }),
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

  module.getUserOutgoingRequests = (sender) => {
    return fetch(`/api/requests/outgoing/${sender}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  /* STOCKS */
  module.getStocks = (page = 0, limit = 10) => {
    return fetch(`/api/stocks?limit=${limit}&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  module.getStockHistory = (symbol) => {
    return fetch(`/api/history/${symbol}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.buyStock = (portfolioname, username, symbol, shares, price) => {
    return fetch(
      `/api/portfolios/addStock?portfolioname=${portfolioname}&username=${username}&symbol=${symbol}&shares=${shares}&price=${price}`,
      {
        method: "POST",
      },
    ).then((res) => res.json());
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

  module.addStockStocklist = (symbol, username, name) => {
    console.log("in add stock", username, symbol, name);
    return fetch(`/api/stockList/addStock`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ username, symbol, name }),
    }).then((res) => res.json());
  };

  module.getPortfolioMarketValue = (owner, portfolio) => {
    return fetch(`/api/portfolios/marketValue?owner=${owner}&portfolio=${portfolio}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getStockListMarketValue = (owner, portfolio) => {
    return fetch(`/api/stockList/addStock?owner=${owner}&portfolio=${portfolio}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

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

  module.calculateCorrelation = (stock1, stock2, time) => {
    return fetch(`/api/correlation/${stock1}/${stock2}/${time}`, {
        headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };


  module.getCorrelation = (stock1, stock2) => {
    return fetch(`/api/correlation/${stock1}/${stock2}`, {
        headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

  module.addCorrelation = (stock1, stock2, time) => {
    return fetch(`/api/correlation/add/${stock1}/${stock2}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    module.calculateCovariance = (stock1, stock2, time) => {
        return fetch(`/api/covariance/${stock1}/${stock2}/${time}`, {
            headers: { "Content-Type": "application/json" },
            }).then((res) => res.json());
        };


    module.getCovariance = (stock1, stock2) => {
        return fetch(`/api/covariance/${stock1}/${stock2}`, {
            headers: { "Content-Type": "application/json" },
            }).then((res) => res.json());
        };

    module.addCovariance = (stock1, stock2, time) => {
        return fetch(`/api/covariance/add/${stock1}/${stock2}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            }).then((res) => res.json());
        };

    module.getCorrMatrix = () => {
        return fetch(`/api/correlation/matrix`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            }).then((res) => res.json());
        };

    module.getCorrMatrix = () => {
        return fetch(`/api/covariance/matrix`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            }).then((res) => res.json());
        };


  module.getStockListByUser = (username) => {
    return fetch(`/api/stockList/byUser/${username}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.createStockList = (username, stock, visibility) => {
    return fetch("/api/stockList/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, stock, visibility }),
    }).then((res) => res.json());
  };

  module.deleteStockList = (username, name) => {
    return fetch("/api/stockList/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name }),
    }).then((res) => res.json());
  };

  module.updateStockList = (username, stock, visibility) => {
    return fetch("/api/stockList/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, stock, visibility }),
    }).then((res) => res.json());
  };

  module.getStocklist = (owner, stocklist) => {
    return fetch(`/api/stocklistConsist/${owner}/${stocklist}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.addStockToStockList = (owner, stocklist, stock, shares) => {
    return fetch("/api/stocklistConsist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, stocklist, stock, shares }),
    }).then((res) => res.json());
  };

  module.getFilteredStocks = (filtered, page = 0, limit = 10) => {
    return fetch(`/api/stocks/filtered?limit=${limit}&page=${page}&filter=${filtered}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  }

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

  module.getAllSharedStockLists = (viewer) => {
    return fetch(`/api/stocklistAccess/${viewer}`, {
      headers: { "Content-Type": "application/json" },
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
    return fetch(
      `/api/stocklistComments/own/${stocklist}/${owner}/${reviewer}`,
      {
        headers: { "Content-Type": "application/json" },
      },
    ).then((res) => res.json());
  };

  module.editStockListComment = (
    stocklist,
    owner,
    comment,
    reviewer,
    newComment,
  ) => {
    return fetch("/api/stocklistComments/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stocklist, owner, comment, reviewer, newComment }),
    }).then((res) => res.json());
  };


  // module.getPortfolioInfo = (owner, portfolio) => {
  //   return fetch(`/api/holds/${owner}/${portfolio}`, {
  //     headers: { "Content-Type": "application/json" },
  //   }).then((res) => res.json());
  // };

  module.getPortfolioHolds = (owner, portfolio) => {
    return fetch(
      `/api/portfolios/holds?owner=${owner}&portfolio=${portfolio}`,
      {
        headers: { "Content-Type": "application/json" },
      },
    ).then((res) => res.json());
  };

  // module.addHoldsToPortfolio = (owner, portfolio, stock) => {
  //   return fetch("/api/holds/add", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ owner, portfolio, stock }),
  //   }).then((res) => res.json());
  // };

  // module.deleteHoldsFromPortfolio = (owner, portfolio, stock) => {
  //   return fetch("/api/holds/delete", {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ owner, portfolio, stock }),
  //   }).then((res) => res.json());
  // };

  module.sellStock = (portfolio, owner, stock, amount) => {
    return fetch("/api/portfolios/sellStock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, portfolio, stock, amount }),
    }).then((res) => res.json());
  };

  module.getPublicStockLists = () => {
    return fetch("/api/stockList/public", {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.getCOVRate = (symbol) => {
    return fetch(`/api/stocks/covRate/${symbol}`, {
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.updateCOVRate = (symbol, cov) => {
    return fetch(`/api/stocks/covRate/update/${symbol}/${cov}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  return module;
})();
