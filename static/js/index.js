(function () {
  "use strict";

  const state = {
    userInfo: {},
    portfolios: [],
    stocklists: [],
    sharedStocklists: [],
    publicStocklists: [],
  };

  function onError(err) {
    const error = document.querySelector(".error");
    error.innerHTML = err;
    error.classList.remove("hidden");
  }

  const createHomePortfolioComponent = (data) => {
    const elmt = document.createElement("div");
    elmt.className = "";
    elmt.innerHTML = `<div class="portfolio-item">
                            <h3>${data.name}</h3>
                            <p>$${data.cash}</p>
                            <div class="chart"></div>
                        </div>
                    `;
    elmt.querySelector(".portfolio-item").addEventListener("click", () => {
      location.href = "./portfolio.html?name=" + data.name;
    }); // "&username="+username;
    return elmt;
  };

  const updateHomePortfolio = () => {
    const username = state.userInfo.username;
    apiService.getPortfoliosOfUser(username, 4).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        state.portfolios = response.portfolios;
        document.querySelector(".card .portfolios-list-home").innerHTML = "";
        if (state.portfolios.length > 0) {
          state.portfolios.map((portfolio) => {
            const newPortf = createHomePortfolioComponent(portfolio);
            document
              .querySelector(".card .portfolios-list-home")
              .appendChild(newPortf);
          });
        }
      }
    });
  };

  const updateHomeStockList = () => {
    const username = state.userInfo.username;
    apiService.getStockListByUser(username).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        state.stocklists = response;
        document.querySelector(".card .stocklists-list-home").innerHTML = "";
        if (state.stocklists.length > 0) {
          state.stocklists.map((stocklist) => {
            const newStockList = createHomeStockListComponent(stocklist, true);
            document
              .querySelector(".card .stocklists-list-home")
              .appendChild(newStockList);
          });
        }
      }
    });
  };

  const createHomeStockListComponent = (data, isOwnLists) => {
    const elmt = document.createElement("div");
    let owner = data.owner;
    if (!data.owner) {
      owner = state.userInfo.username;
    }
    console.log("data", data);
    elmt.className = "";
    elmt.innerHTML = `<div class="stocklist-item-home">
                            <h3>${data.name}</h3>
                            <p>${owner}</p>
                            <p>${data.ispublic ? "Public" : "Private"}</p>
                        </div>
                    `;
    elmt.querySelector(".stocklist-item-home").addEventListener("click", () => {
      location.href = "./stocklist.html";
    localStorage.setItem("stocklistInfo", JSON.stringify({
      name: data.name,
      owner: data.owner,
      visibility: data.ispublic ? "public" : "private",
    }));
    });
    return elmt;
  };

  const updateHomeSharedStockList = () => {
    const username = state.userInfo.username;
    apiService.getAllSharedStockLists(username).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        state.sharedStocklists = response;
        document.querySelector(".card .shared-stocklists-list-home").innerHTML =
          "";
        if (state.sharedStocklists.length > 0) {
          state.sharedStocklists.map((stocklist) => {
            const newStockList = createHomeStockListComponent(stocklist, false);
            document
              .querySelector(".card .shared-stocklists-list-home")
              .appendChild(newStockList);
          });
        }
      }
    });
  };

  const updateHomePublicStockList = () => {
    apiService.getPublicStockLists().then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        state.publicStocklists = response;
        document.querySelector(".card .public-stocklists-list-home").innerHTML =
          "";
        if (state.publicStocklists.length > 0) {
          state.publicStocklists.map((stocklist) => {
            const newStockList = createHomeStockListComponent(stocklist, false);
            document
              .querySelector(".card .public-stocklists-list-home")
              .appendChild(newStockList);
          });
        }
      }
    });
  };

  

  window.addEventListener("load", function (event) {
    state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.document.querySelector(".profile .username").innerHTML =
      state.userInfo.username;
    updateHomePortfolio();
    updateHomeStockList();
    updateHomeSharedStockList();
    updateHomePublicStockList();
  });
})();
