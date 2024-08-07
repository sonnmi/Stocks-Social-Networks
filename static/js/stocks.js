(function () {
  "use strict";

  const state = {
    stocks: [],
    currentPage: 0,
    totalPageCount: 1,
    lastClicked: null,
    showPopup: false,
  };

  const viewStock = (symbol) => {
    window.location.href = `stock.html?symbol=${symbol}`;
  };

  function onError(err) {
    const error = document.querySelector(".error");
    error.classList.remove("hidden");
    console.log(err);
    error.innerHTML = err;
  }

  const updateStocksBtn = () => {
    // document.querySelector(".left-arrow-btn")
  };

  const createStockComponent = (data) => {
    const elmt = document.createElement("tbody");
    elmt.className = "comment row";
    elmt.innerHTML = `<tr>
                        <td class="checkbox"><input type="checkbox" value=${data.symbol} price=${data.close}></td>
                        <td class="symbol">${data.symbol}</td>
                        <td>${data.open}</td>
                        <td class="positive">${data.high}</td>
                        <td class="negative">${data.low}</td>
                        <td>${data.close}</td>
                        <td>${data.volume}</td>
                        <td>${data.date}</td>
                    </tr>
                    `;
    elmt.innerHTML += '<div class="delete-icon"></div>';
    elmt.querySelector(".symbol").onclick = () => viewStock(data.symbol);
    return elmt;
  };

  const updateStock = () => {
    apiService.getStocks(state.currentPage).then((response) => {
      if (response.error) {
        // updateStatus(false);
      } else {
        state.stocks = response.stocks;
        state.totalPageCount = response.total;
        document.querySelector(".stocks").innerHTML = `<thead>
                                                                <tr>
                                                                    <th class="checkbox"></th>
                                                                    <th class="view-btn">Symbol</th>
                                                                    <th>Open</th>
                                                                    <th>High</th>
                                                                    <th>Low</th>
                                                                    <th>Close</th>
                                                                    <th>Volume</th>
                                                                    <th>Last Updated</th>
                                                                </tr>
                                                            </thead>`;
        if (state.stocks.length > 0) {
          state.stocks.forEach(function (stock) {
            const newStock = createStockComponent(stock);
            document.querySelector(".stocks").appendChild(newStock);
          });
          document.querySelector(".current-page").innerHTML =
            `${state.currentPage + 1}`;
          document.querySelector(".total-page").innerHTML =
            `${state.totalPageCount}`;
          updateStocksBtn();

          const mySelectElements = document.querySelectorAll(
            "input[type=checkbox]",
          );
          mySelectElements.forEach((elem) => {
            elem.addEventListener("change", function (e) {
              if (this.checked) {
                if (this !== state.lastClicked) {
                  if (state.lastClicked) {
                    state.lastClicked.checked = false;
                  }
                  state.lastClicked = this;
                  document.querySelector(".buy-btn").classList.add("active");
                  document.querySelector(".stocklist-add").classList.add("active");
                  console.log(this);
                }
              } else {
                  document.querySelector(".buy-btn").classList.remove("active");
                  document.querySelector(".stocklist-add").classList.remove("active");
                  state.lastClicked = null;
              }
            });
          });
        }
      }
    });
  };

  window.addEventListener("load", () => {
    updateStock();
    document.querySelector(".left-arrow-btn").addEventListener("click", () => {
      if (state.currentPage > 0) {
        state.currentPage -= 1;
        updateStock();
      }
    });

    document.querySelector(".right-arrow-btn").addEventListener("click", () => {
      if (state.currentPage < state.totalPageCount) {
        state.currentPage += 1;
        updateStock();
      }
    });

    document.querySelector(".close-btn").addEventListener("click", () => {
      state.showPopup = false;
      document.querySelector(".popup-container").classList.add("hidden");
      document.querySelector(".dark").classList.add("hidden");
      document.querySelector(".container").innerHTML = "";
      document.querySelector("#portfolios-dropdown").innerHTML = "";
      document.querySelector(".error").classList.add("hidden");
      document.querySelector(".error").HTML = "";
    });

    document
      .querySelector(".stocklist-add")
      .addEventListener("click", (event) => {
        if (state.lastClicked) {
          state.showPopup = !state.showPopup;

          if (state.showPopup) {
            document
              .querySelector(".popup-container")
              .classList.remove("hidden");
            document.querySelector(".dark").classList.remove("hidden");

            const username = JSON.parse(
              localStorage.getItem("userInfo"),
            ).username;

            apiService.getStockListByUser(username).then((res) => {
              if (res.error) {
                console.log(res.error);
                onError(res.error);
                document
                  .querySelector(".portfolios-dropdown")
                  .classList.add("hidden");
              } else {
                document
                  .querySelector(".portfolios-dropdown")
                  .classList.remove("hidden");
                const stocksPopup = document.querySelector(".stocks-popup");
                stocksPopup.querySelector("#dropdown-label").innerHTML =
                  "Choose One of the stocklist.";

                const elmt_ = document.createElement("div");
                elmt_.className = "choose-portfolio-container";

                res.map((stocklist) => {
                  console.log(stocklist);
                  const newPortf = `<option value="${stocklist.name}">${stocklist.name}</option>`;
                  document.querySelector("#portfolios-dropdown").innerHTML +=
                    newPortf;
                });

                stocksPopup.appendChild(elmt_);

                const stocksPopup_ = document.querySelector(".container");
              
                stocksPopup_.innerHTML += `
                <input type="text" class="portfolio-share" placeholder="How many shares of ${state.lastClicked.value} do you want to buy?"></input>`;
                stocksPopup_.innerHTML += `
                <div class="submit-btn">Add</div>`;
                stocksPopup_.querySelector(".submit-btn").onclick = () => {
                  const stocklistname = document.querySelector(
                    "#portfolios-dropdown",
                  ).value;
                  const shares = document.querySelector(".portfolio-share").value;
                  const username = JSON.parse(
                    localStorage.getItem("userInfo"),
                  ).username;
                  apiService
                    .addStockToStockList(
                      username,
                      stocklistname,
                      state.lastClicked.value,
                      shares
                    )
                    .then((res) => {
                      console.log(res);
                      document
                        .querySelector(".popup-container")
                        .classList.add("hidden");
                      document.querySelector(".dark").classList.add("hidden");
                      stocksPopup_.innerHTML = "";
                      document.querySelector("#portfolios-dropdown").innerHTML = "";
                      state.showPopup = false;
                      document.querySelector(".error").classList.add("hidden");
                      document.querySelector(".error").HTML = "";
                    });
                };
              }
            });
          } else {
            document.querySelector(".popup-container").classList.add("hidden");
            document.querySelector(".dark").classList.add("hidden");
          }
        }
      });

    document.querySelector(".buy-btn").addEventListener("click", () => {
      if (state.lastClicked) {
        state.showPopup = !state.showPopup;

        if (state.showPopup) {
          document.querySelector(".popup-container").classList.remove("hidden");
          document.querySelector(".dark").classList.remove("hidden");

          const username = JSON.parse(
            localStorage.getItem("userInfo"),
          ).username;

          apiService.getPortfoliosOfUser(username).then((res) => {
            if (res.error) {
              console.log(res.error);
              onError(res.error);
                document
                  .querySelector(".portfolios-dropdown")
                  .classList.add("hidden");
            } else {
                document
                  .querySelector(".portfolios-dropdown")
                  .classList.remove("hidden");
              // Clear existing content in the stocks-popup
              const stocksPopup = document.querySelector(".stocks-popup");
              stocksPopup.querySelector("#dropdown-label").innerHTML =
                "Choose a portfolio cash account to buy stocks:";

              // Create container for portfolio options
              const elmt_ = document.createElement("div");
              elmt_.className = "choose-portfolio-container";
              // console.log(document.querySelector("#portfolios-dropdown"))

              res.portfolios.map((portfolio) => {
                console.log(portfolio);
                const newPortf = `<option value="${portfolio.name}">${portfolio.name} ($${portfolio.cash})</option>`;
                document.querySelector("#portfolios-dropdown").innerHTML +=
                  newPortf;
              });
              stocksPopup.appendChild(elmt_);

              const stocksPopup_ = document.querySelector(".container");
              
              stocksPopup_.innerHTML += `
                <input type="text" class="portfolio-share" placeholder="How many shares of ${state.lastClicked.value} do you want to buy?"></input>`;
              stocksPopup_.innerHTML += `
                <div class="submit-btn">Buy</div>`;
              stocksPopup_.querySelector(".submit-btn").onclick = () => {
                const portfolioname = document.querySelector(
                  "#portfolios-dropdown",
                ).value;
                const shares = document.querySelector(".portfolio-share").value;
                const price = state.lastClicked.getAttribute("price");
                console.log(
                  portfolioname,
                  username,
                  state.lastClicked.value,
                  shares,
                  price,
                );
                if (shares) {
                  const username = JSON.parse(
                    localStorage.getItem("userInfo"),
                  ).username;
                  apiService
                    .buyStock(
                      portfolioname,
                      username,
                      state.lastClicked.value,
                      shares,
                      price,
                    )
                    .then((res) => {
                      if (res.error) {
                        console.log(res.error)
                        onError(res.error)
                      } else {
                        console.log(res);
                        document
                          .querySelector(".popup-container")
                          .classList.add("hidden");
                        document.querySelector(".dark").classList.add("hidden");
                        stocksPopup_.innerHTML = "";
                        document.querySelector("#portfolios-dropdown").innerHTML = "";
                        state.showPopup = false;
                        document.querySelector(".error").classList.add("hidden");
                        document.querySelector(".error").HTML = "";
                      }
                    });
                }
              };
            }
          });
        } else {
          document.querySelector(".popup-container").classList.add("hidden");
          document.querySelector(".dark").classList.add("hidden");
        }
      }
    });

    document
      .querySelector(".stocks-popup")
      .addEventListener("click", (event) => {
        if (event.target.classList.contains("choose-stocklist")) {
          const username = JSON.parse(
            localStorage.getItem("userInfo"),
          ).username;
          console.log(event.target.innerHTML);
          apiService
            .addStockStocklist(
              state.lastClicked.value,
              username,
              event.target.innerHTML,
            )
            .then((res) => {
              console.log(res);
            });
        }
      });
  });
})();
