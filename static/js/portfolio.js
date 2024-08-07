(function () {
    "use strict";

    const state = {
      portfolio: { name: "", cash: "" },
      userInfos: {},
      selectedDepositMethod: "",
      portfolios: [],
      showDeletePopup: false,
    };

    function onError(err, type) {
      const error = document.querySelector(`.${type}.error`);
      error.classList.remove("hidden");
      console.log(err);
      error.innerHTML = err;
    }

    const changeCashAccountDropDown = () => {
      if (state.portfolios.length === 0) {
        apiService
          .getPortfoliosOfUser(state.userInfos.username)
          .then((response) => {
            if (response.error) {
              console.log(response.error);
            } else {
              console.log(response);
              state.portfolios = response.portfolios;
            }
            console.log(state.portfolios);
            document.querySelector("#cash-accounts").innerHTML = "";
            if (state.portfolios.length > 0) {
              state.portfolios.map((portfolio) => {
                console.log(portfolio);
                if (portfolio.name !== state.portfolio.name) {
                  const newPortf = `<option value="${portfolio.name}">${portfolio.name} ($${portfolio.cash})</option>`;
                  document.querySelector("#cash-accounts").innerHTML += newPortf;
                }
              });
            }
          });
      } else {
        document.querySelector("#cash-accounts").innerHTML = "";
        if (state.portfolios.length > 0) {
          state.portfolios.map((portfolio) => {
            console.log(portfolio);
            const newPortf = `<option value="${portfolio.name}">${portfolio.name} ($${portfolio.cash})</option>`;
            document.querySelector("#cash-accounts").innerHTML += newPortf;
          });
        }
      }
    };

    const getSelectedAccount = () => {
      // cash-accounts / bank-accounts
      var type = "cash-accounts";
      if (state.selectedDepositMethod === "transfer") {
        type = "cash-accounts";
      }
      const selectElement = document.getElementById(type);
      const selectedValue = selectElement.value;
      console.log("Selected value:", selectedValue);
      return selectedValue;
    };

    const updateBalance = (cash) => {
      const balance = document.querySelector(".balance");
      balance.innerHTML = `<h2>Total Balance: $ ${cash.toFixed(2)} </h2>`;
      state.portfolio.cash = cash;
    };

    const updateMarketValue = () => {
      const value = document.querySelector(".market-value");
      apiService
        .getPortfolioMarketValue(state.userInfos.username, state.portfolio.name)
        .then((res) => {
          console.log(res);
          value.innerHTML = `<h2>Market Value: $ ${
            res.total_holding ? res.total_holding.toFixed(2) : 0
          } </h2>`;
        });
    };

    const updatePortfolio = () => {
      const username = JSON.parse(localStorage.getItem("userInfo")).username;
      const horizontal = document.querySelector(".horizontal-container");
      horizontal.innerHTML = "";
      apiService.getPortfolioHolds(username, state.portfolio.name).then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
          console.log(res);
          const holds = res.symbols;
          holds.map((hold) => {
            const holdElement = document.createElement("div");
            holdElement.classList.add("stock-item");
            holdElement.innerHTML = `
                          <h3 class="stock-a">${hold.stock}</h3>
                          <p>Shares: ${hold.shares}</p>
                          <div class="container-sell-btn"><div class="sell-stock-btn" value=${hold.stock}>SELL</div></div>
                  `;
            // <p>${hold.price}</p>
            holdElement.querySelector(".stock-a").addEventListener("click", () => {
              window.location.href = `stock.html?symbol=${hold.stock}`;
            });
            const elem = holdElement.querySelector(".sell-stock-btn");
            elem.addEventListener("click", () => {
              console.log("SELLLLLLL", elem.getAttribute("value"));
              state.showDeletePopup = !state.showDeletePopup;
              if (state.showDeletePopup) {
                const stock = elem.getAttribute("value");
                document.querySelector(".dark").classList.remove("hidden");
                document.querySelector(".popup-container").classList.remove("hidden");

                document
                  .querySelector(".popup-container .submit-btn")
                  .addEventListener("click", () => {
                    const amount = document.querySelector(".sell-amount").value;
                    console.log(stock, amount);
                    apiService
                      .sellStock(
                        state.portfolio.name,
                        state.userInfos.username,
                        stock,
                        amount
                      )
                      .then((res) => {
                        if (res.error) onError(res.error);
                        else {
                          console.log(res);
                          document
                            .querySelector(".dark")
                            .classList.add("hidden");
                          document
                            .querySelector(".popup-container")
                            .classList.add("hidden");
                          document.querySelector(".sell-amount").value = "";
                          updatePortfolio();
                          apiService
                            .getPortfolioCash(
                              state.userInfos.username,
                              state.portfolio.name
                            )
                            .then((response) => {
                              console.log(response);
                              if (response.error) {
                                console.log(response.error);
                              } else {
                                updateBalance(response.cash);
                                updateMarketValue();
                                updateMatrix();
                              }
                            });
                        }
                      });
                  });
              }
            });
            horizontal.appendChild(holdElement);
          });
        }
      });
    };

    document
      .querySelector(".close-btn")
      .addEventListener("click", () => {
        state.showDeletePopup = false;
        document.querySelector(".popup-container").classList.add("hidden");
        document.querySelector(".dark").classList.add("hidden");
        document.querySelector(".error").classList.add("hidden");
        document.querySelector(".error").innerHTML = "";
        document.querySelector(".sell-amount").value = "";
      });

    document
      .querySelectorAll('input[name="depositOption"]')
      .forEach((elem) => {
        elem.addEventListener("change", function (event) {
          const selectedValue = document.querySelector(
            'input[name="depositOption"]:checked'
          ).value;
          state.selectedDepositMethod = selectedValue;
          if (selectedValue === "transfer") {
            document
              .querySelector(".cash-account-dropdown")
              .classList.remove("hidden");
            // document
            //   .querySelector(".bank-account-dropdown")
            //   .classList.add("hidden");
            changeCashAccountDropDown();
          } else {
            document.querySelector(".cash-account-dropdown").classList.add("hidden");
            // document
            //   .querySelector(".bank-account-dropdown")
            //   .classList.remove("hidden");
            // changeBankAccountDropDown();
          }
        });
      });

    // Add event listener for DOMContentLoaded to initialize the portfolio and correlation matrix
    document.addEventListener("DOMContentLoaded", function (event) {
      initializePortfolio(); // Initialize portfolio data
      setupCorrelationMatrix(); // Setup correlation matrix
    });

    // Initialize portfolio information
    async function initializePortfolio() {
      state.userInfos = JSON.parse(localStorage.getItem("userInfo"));
      state.portfolio.name = new URLSearchParams(window.location.search).get(
        "name"
      );
      document.querySelector(".portfolio-name").innerHTML = state.portfolio.name;
      updatePortfolio();
      apiService
        .getPortfolioCash(state.userInfos.username, state.portfolio.name)
        .then((response) => {
          console.log(response);
          if (response.error) {
            console.log(response.error);
          } else {
            updateBalance(response.cash);
            updateMarketValue();
          }
        });
      const depositBtn = document.querySelector(".deposit-btn");
      const formContainer = document.querySelectorAll(".form-container-style");
      formContainer[0].querySelector(".submit-btn").onclick = () => {
        const amount = document.querySelector("#transfer-amount").value;
        console.log(amount);
        const selectedAccount = getSelectedAccount();
        console.log("account", selectedAccount);
        if (state.selectedDepositMethod === "transfer") {
          apiService
            .withdrawPortfolioCash(
              state.userInfos.username,
              selectedAccount,
              parseFloat(amount)
            )
            .then((res) => {
              if (res.error) {
                onError(
                  "Could not transfer money. Check the balance of the account.",
                  "deposit"
                );
              } else {
                onError("Deposit Success", "deposit");
                if (amount)
                  apiService
                    .depositPortfolioCash(
                      state.userInfos.username,
                      state.portfolio.name,
                      parseFloat(amount)
                    )
                    .then((res) => {
                      if (res.error) {
                        onError(res.error, "deposit");
                      } else {
                        onError("Deposit Success", "deposit");
                        updateBalance(res.cash);
                      }
                    });
              }
            });
        } else {
          if (amount)
            apiService
              .depositPortfolioCash(
                state.userInfos.username,
                state.portfolio.name,
                parseFloat(amount)
              )
              .then((res) => {
                if (res.error) {
                  onError(res.error, "deposit");
                } else {
                  onError("Deposit Success", "deposit");
                  updateBalance(res.cash);
                }
              });
        }
      };
      formContainer[1].querySelector(".submit-btn").onclick = () => {
        const amount = document.querySelector("#withdraw-amount").value;
        console.log(amount);
        if (amount)
          apiService
            .withdrawPortfolioCash(
              state.userInfos.username,
              state.portfolio.name,
              parseFloat(amount)
            )
            .then((res) => {
              if (res.error) {
                onError(res.error, "withdraw");
              } else {
                onError("Withdraw Success", "withdraw");
                updateBalance(res.cash);
              }
            });
      };
      depositBtn.addEventListener("click", () => {
        if (formContainer[0].classList.contains("hidden")) {
          formContainer[1].classList.add("hidden");
          formContainer[0].classList.remove("hidden");
          document.querySelector(".deposit-container").classList.remove("hidden");
          document.querySelector(".withdraw-container").classList.add("hidden");

          const selectedValue = document.querySelector(
            'input[name="depositOption"]:checked'
          ).value;
          console.log("Initially selected option:", selectedValue);
        } else {
          formContainer[0].classList.add("hidden");
          document.querySelector(".deposit-container").classList.add("hidden");
          document.querySelector(".withdraw-container").classList.add("hidden");
        }
      });
      const withdrawBtn = document.querySelector(".withdraw-btn");
      withdrawBtn.addEventListener("click", () => {
        if (formContainer[1].classList.contains("hidden")) {
          formContainer[0].classList.add("hidden");
          formContainer[1].classList.remove("hidden");
          document
            .querySelector(".withdraw-container")
            .classList.remove("hidden");
          document.querySelector(".deposit-container").classList.add("hidden");
        } else {
          formContainer[1].classList.add("hidden");
          document.querySelector(".deposit-container").classList.add("hidden");
          document.querySelector(".withdraw-container").classList.add("hidden");
        }
      });
    }

    // Function to setup and update the correlation matrix
    function setupCorrelationMatrix() {
      const refreshButton = document.getElementById("refreshCorrelation");
      if (!refreshButton) {
        console.error("Refresh button not found!");
        return;
      }
      refreshButton.addEventListener("click", updateMatrix);
      updateMatrix(); // Initial load
    }

    // Function to fetch correlation between two stocks
    async function updateCorrelation(stock1, stock2) {
        try {
          const response = await fetch(`http://localhost:3000/api/history/correlation/${stock1}/${stock2}/1week`);
          const correlationData = await response.json();
          // Store the correlation value in the database
          await fetch(`http://localhost:3000/api/correlation/add/${stock1}/${stock2}/1week`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ correlation: correlationData.correlation })
          });
          return correlationData.correlation;
          } catch (error) {
              console.error("Error fetching correlation data:", error);
              return 0;
          }
      }

    // Function to update the correlation matrix
    async function updateMatrix() {
      const stockList = await fetchPortfolioStocks();
      if (stockList.length === 0) {
        console.error("No stocks available to fetch correlations.");
        return;
      }

      var correlationTable;
      // For Loop to fetch correlation for each stock pair
      for (let i = 0; i < stockList.length; i++) {
        for (let j = i + 1; j < stockList.length; j++) {
            updateCorrelation(stockList[i], stockList[j]).then((correlation) => {
                document.getElementById(stockList[i]+stockList[j]).innerHTML = correlation;
                document.getElementById(stockList[j]+stockList[i]).innerHTML = correlation;
            });
        }
      }

      try {
        const response = await fetch("http://localhost:3000/api/correlation/matrix", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stocks: stockList })
        });

        const correlationData = await response.json();
        console.log("Correlation data:", correlationData);
        generateCorrelationMatrix(stockList, correlationData);
      } catch (error) {
        console.error("Error fetching correlation data:", error);
      }
    }

    // Function to fetch portfolio stocks
    async function fetchPortfolioStocks() {
      const username = JSON.parse(localStorage.getItem("userInfo")).username;
      const stocks = await apiService.getPortfolioHolds(username, state.portfolio.name)
        .then((res) => {
          if (res.error) {
            console.log(res.error);
            return [];
          } else {
            console.log(res);
            return res.symbols.map((hold) => hold.stock);
          }
        });
      console.log("Fetched Portfolio Stocks:", stocks);
      return stocks;
    }

    // Function to generate the correlation matrix table
    function generateCorrelationMatrix(stockList, correlationData) {
      const matrixTable = document.getElementById("correlationMatrix");
      if (!matrixTable) {
        console.error("Correlation matrix table not found!");
        return;
      }

      updateMatrix(); // Initial load

      let tableHTML = "<thead><tr><th></th>";

      // Table headers
      stockList.forEach(stock => {
        tableHTML += `<th>${stock}</th>`;
      });

      tableHTML += "</tr></thead><tbody>";

      // Table body
      stockList.forEach((stock1, i) => {
        tableHTML += `<tr><td>${stock1}</td>`;
        stockList.forEach((stock2, j) => {
          if (i === j) {
            tableHTML += "<td>1.00</td>"; // Correlation with itself
          } else {
            const correlation = correlationData[stock1][stock2] || 0; // Use 0 if no data
            tableHTML += `<td>${correlation.toFixed(2)}</td>`;
          }
        });
        tableHTML += "</tr>";
      });

      tableHTML += "</tbody>";
      matrixTable.innerHTML = tableHTML;
      console.log("Correlation matrix updated.");
    }
  })();
