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
    var type = "bank-accounts";
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
    balance.innerHTML = `<h2>Total Balance: $ ${cash} </h2>`;
    state.portfolio.cash = cash;
  };

  const updateMarketValue = () => {
    const value = document.querySelector(".market-value");
    apiService.getPortfolioMarketValue(state.userInfos.username, state.portfolio.name).then(res => {
      console.log(res)
      value.innerHTML = `<h2>Market Value: $ ${res.total_holding ? res.total_holding.toFixed(2) : 0} </h2>`;
    })
  }

  const updatePortfolio = () => {
    const username = JSON.parse(localStorage.getItem("userInfo")).username;
    const horizontal = document.querySelector(".horizontal-container");
    horizontal.innerHTML = "";
    apiService.getPortfolioHolds(username, state.portfolio.name).then((res) => {
      if (res.error) {
        console.log(res.error);
      } else {
        console.log(res)
        const holds = res.symbols
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
          })
          const elem = holdElement.querySelector(".sell-stock-btn")
          elem.addEventListener("click", () => {
            console.log("SELLLLLLL", elem.getAttribute("value"))
            state.showDeletePopup = !state.showDeletePopup;
            if (state.showDeletePopup) {
                const stock = elem.getAttribute("value");
                document.querySelector(".dark").classList.remove("hidden")
                document.querySelector(".popup-container").classList.remove("hidden")

                document.querySelector(".popup-container .submit-btn").addEventListener("click", () => {
                    const amount = document.querySelector(".sell-amount").value;
                    console.log(stock, amount)
                    apiService.sellStock(state.portfolio.name, state.userInfos.username, stock, amount).then(res => {
                        if (res.error)
                            onError(res.error)
                        else {
                            console.log(res);
                            document.querySelector(".dark").classList.add("hidden")
                            document.querySelector(".popup-container").classList.add("hidden")
                            document.querySelector(".sell-amount").value = "";
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
                        }
                    })
                })
            }
          })
          horizontal.appendChild(holdElement);
        });
      }
    });
  };

  document.querySelector(".close-btn").addEventListener("click", () => {
      state.showDeletePopup = false;
      document.querySelector(".popup-container").classList.add("hidden");
      document.querySelector(".dark").classList.add("hidden");
      document.querySelector(".error").classList.add("hidden");
      document.querySelector(".error").innerHTML = "";
      document.querySelector(".sell-amount").value = "";
    });


  document.querySelectorAll('input[name="depositOption"]').forEach((elem) => {
    elem.addEventListener("change", function (event) {
      const selectedValue = document.querySelector(
        'input[name="depositOption"]:checked',
      ).value;
      state.selectedDepositMethod = selectedValue;
      if (selectedValue === "transfer") {
        document
          .querySelector(".cash-account-dropdown")
          .classList.remove("hidden");
        document
          .querySelector(".bank-account-dropdown")
          .classList.add("hidden");
        changeCashAccountDropDown();
      } else {
        document
          .querySelector(".cash-account-dropdown")
          .classList.add("hidden");
        document
          .querySelector(".bank-account-dropdown")
          .classList.remove("hidden");
        // changeBankAccountDropDown();
      }
    });
  });

  window.addEventListener("load", function (event) {
    state.userInfos = JSON.parse(localStorage.getItem("userInfo"));
    state.portfolio.name = new URLSearchParams(window.location.search).get(
      "name",
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
          updateMarketValue()
        }
      });
    const depositBtn = document.querySelector(".deposit-btn");
    const formContainer = this.document.querySelectorAll(
      ".form-container-style",
    );
    formContainer[0].querySelector(".submit-btn").onclick = () => {
      const amount = this.document.querySelector("#transfer-amount").value;
      console.log(amount);
      const selectedAccount = getSelectedAccount();
      console.log("account", selectedAccount);
      if (state.selectedDepositMethod === "transfer") {
        apiService
          .withdrawPortfolioCash(
            state.userInfos.username,
            selectedAccount,
            parseFloat(amount),
          )
          .then((res) => {
            if (res.error) {
              onError(
                "Could not transfer money. Check the balance of the account.",
                "deposit",
              );
            } else {
              onError("Deposit Success", "deposit");
              if (amount)
                apiService
                  .depositPortfolioCash(
                    state.userInfos.username,
                    state.portfolio.name,
                    parseFloat(amount),
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
        apiService
          .withdrawBankAccount(
            state.userInfos.username,
            state.portfolio.name,
            parseFloat(amount),
          )
          .then((res) => {
            if (res.error) {
              onError(res.error, "deposit");
            } else {
              onError(
                "Could not load money. Check the balance of the bank account.",
                "deposit",
              );
              if (amount)
                apiService
                  .depositPortfolioCash(
                    state.userInfos.username,
                    state.portfolio.name,
                    parseFloat(amount),
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
      }
    };
    formContainer[1].querySelector(".submit-btn").onclick = () => {
      const amount = this.document.querySelector("#withdraw-amount").value;
      console.log(amount);
      if (amount)
        apiService
          .withdrawPortfolioCash(
            state.userInfos.username,
            state.portfolio.name,
            parseFloat(amount),
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
          'input[name="depositOption"]:checked',
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
  });
})();
