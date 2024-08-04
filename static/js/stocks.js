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
                        <td>${data.high}</td>
                        <td class="price-change negative">${data.low}</td>
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
                                                                    <th>Highest</th>
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
                  console.log(this);
                }
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


    document.querySelector(".stocklist-add").addEventListener("click", (event) => {
        if (state.lastClicked) {
          state.showPopup = !state.showPopup;

          if (state.showPopup) {
      document.querySelector(".popup-container").classList.remove("hidden");
      
          const userId = JSON.parse(localStorage.getItem("userInfo")).userid;

      const res = apiService.getStockListByUser(userId).then((res) => {
        if (res.error) {
          console.log(res.error);
          onError(res.error);
        } else {
          // Clear existing content in the stocks-popup
          const stocksPopup = document.querySelector(".stocks-popup");
          stocksPopup.innerHTML = "Choose One of the stocklist.";

          // Create container for portfolio options
          const elmt_ = document.createElement("div");
          elmt_.className = "choose-portfolio-container";

          res.map(portfolio => {
            const elmt = document.createElement("div");
            elmt.className = "choose-stocklist";
            elmt.innerHTML = portfolio.name;
            elmt_.appendChild(elmt);
          });

          // Append the container with portfolio options to the popup
          stocksPopup.appendChild(elmt_);
        }
      });
    } else {
      document.querySelector(".popup-container").classList.add("hidden");
    }
  }
});

    document.querySelector(".buy-btn").addEventListener("click", () => {
  if (state.lastClicked) {
    state.showPopup = !state.showPopup;

    if (state.showPopup) {
      document.querySelector(".popup-container").classList.remove("hidden");

      const userId = JSON.parse(localStorage.getItem("userInfo")).userid;

      const res = apiService.getPortfoliosOfUser(userId).then((res) => {
        if (res.error) {
          console.log(res.error);
          onError(res.error);
        } else {
          // Clear existing content in the stocks-popup
          const stocksPopup = document.querySelector(".stocks-popup");
          stocksPopup.innerHTML = "Choose One of the portfolio.";

          // Create container for portfolio options
          const elmt_ = document.createElement("div");
          elmt_.className = "choose-portfolio-container";

          res.portfolios.map(portfolio => {
            const elmt = document.createElement("div");
            elmt.className = "choose-portfolio";
            elmt.innerHTML = portfolio.name;
            elmt_.appendChild(elmt);
          });

          // Append the container with portfolio options to the popup
          stocksPopup.appendChild(elmt_);

          // Add input field for the number of shares
          stocksPopup.innerHTML += `
            <input type="text" class="portfolio-share" placeholder="How many shares of ${state.lastClicked.value} do you want to buy?"></input>`;
        }
      });
    } else {
      document.querySelector(".popup-container").classList.add("hidden");
    }
  }
});

// Event delegation for dynamically created choose-portfolio elements
document.querySelector(".stocks-popup").addEventListener("click", (event) => {
  if (event.target.classList.contains("choose-portfolio")) {
    const shares = document.querySelector(".portfolio-share").value;
    console.log(shares)
    if (shares) {
      const userId = JSON.parse(localStorage.getItem("userInfo")).userid;
      apiService.buyStock(event.target.innerHTML, userId, state.lastClicked.value, shares, state.lastClicked.price).then((res) => {
        console.log(res)
      });
    }
  }
});

document.querySelector(".stocks-popup").addEventListener("click", (event) => {
  if (event.target.classList.contains("choose-stocklist")) {
      const userId = JSON.parse(localStorage.getItem("userInfo")).userid;
      console.log(event.target.innerHTML)
      apiService.addStockStocklist(state.lastClicked.value, userId, event.target.innerHTML).then((res) => {
        console.log(res)
      });
  }
});




  });
})();
