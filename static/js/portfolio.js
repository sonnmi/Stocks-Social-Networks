(function () {
    "use strict";

    const state = {
        portfolio: {name: "", cash: ""},
        userInfos: {},
        selectedDepositMethod: "",
        portfolios: []
    }

    function onError(err, type) {
        const error = document.querySelector(`.${type}.error`);
        error.classList.remove("hidden");
        console.log(err);
        error.innerHTML = err;
    }

    const createPortfolioComponent = (data) => {
        const userId = JSON.parse(localStorage.getItem("userInfo")).userid;
        const elmt = document.createElement("div");
        elmt.className = "";
        elmt.innerHTML = `<div class="portfolio-item">
                            <h3>${data}</h3>
                        </div>
                    `;

        console.log(elmt)
        return elmt;
    }

    const changeCashAccountDropDown = () => {
        if (state.portfolios.length === 0) {
            apiService.getPortfoliosOfUser(state.userInfos.username)
            .then((response) => {
                if (response.error) {
                    console.log(response.error)
                } else {
                    console.log(response)
                    state.portfolios = response.portfolios;
                }
                console.log(state.portfolios)
                document.querySelector("#cash-accounts").innerHTML = "";
                if (state.portfolios.length > 0) {
                    state.portfolios.map((portfolio) => {
                        console.log(portfolio)
                        if (portfolio.name !== state.portfolio.name) {
                            const newPortf = `<option value="${portfolio.name}">${portfolio.name} ($${portfolio.cash})</option>`
                            document.querySelector("#cash-accounts").innerHTML+=newPortf;
                        }
                    });
                }
            })
        } else {
            document.querySelector("#cash-accounts").innerHTML = "";
                if (state.portfolios.length > 0) {
                    state.portfolios.map((portfolio) => {
                        console.log(portfolio)
                        const newPortf = `<option value="${portfolio.name}">${portfolio.name} ($${portfolio.cash})</option>`
                        document.querySelector("#cash-accounts").innerHTML+=newPortf;
                    });
                }
        }}
    

    const getSelectedAccount = () => { // cash-accounts / bank-accounts
        var type = "bank-accounts"
        if (state.selectedDepositMethod === "transfer") {
            type = "cash-accounts"
        }
        const selectElement = document.getElementById(type);
        const selectedValue = selectElement.value;
        console.log('Selected value:', selectedValue);
        return selectedValue;
    }

    const updateBalance = (cash) => {
        const balance = document.querySelector(".balance");
        balance.innerHTML = `<h2>Total Balance: $ ${cash} </h2>`;
        state.portfolio.cash = cash;
    }

    const updatePortfolio = () => {
        const userId = JSON.parse(localStorage.getItem("userInfo")).userid;
        const horizontal = document.querySelector(".horizontal-container");
        horizontal.innerHTML = "";
        apiService.getPortfolioInfo(userId, state.portfolio.name).then((holds) => {
            if (holds.error) {
                console.log(holds.error)
            } else {
            holds.forEach(hold => {
                const holdElement = document.createElement("div");
                holdElement.classList.add("stock-item");
                holdElement.innerHTML = `
                    <div class="stock-item>
                        <h3>${hold.stock}</h3>
                        <p>${hold.price}</p>
                    </div>
                `;
                horizontal.appendChild(holdElement);
                
                
            });
        }
        })
    }

    document.querySelectorAll('input[name="depositOption"]').forEach((elem) => {
        elem.addEventListener('change', function(event) {
            const selectedValue = document.querySelector('input[name="depositOption"]:checked').value;
            state.selectedDepositMethod = selectedValue;
            if (selectedValue === "transfer") {
                document.querySelector(".cash-account-dropdown").classList.remove("hidden");
                document.querySelector(".bank-account-dropdown").classList.add("hidden");
                changeCashAccountDropDown();
            } else {
                document.querySelector(".cash-account-dropdown").classList.add("hidden");
                document.querySelector(".bank-account-dropdown").classList.remove("hidden");
                // changeBankAccountDropDown();
            }
        });
    });

    window.addEventListener("load", function(event) {
        state.userInfos = JSON.parse(localStorage.getItem("userInfo"));
        state.portfolio.name = new URLSearchParams(window.location.search).get("name");
        document.querySelector(".portfolio-name").innerHTML = state.portfolio.name;
        updatePortfolio();
        apiService.getPortfolioCash(state.userInfos.username, state.portfolio.name).then((response) => {
            console.log(response);
            if (response.error) {
                console.log(response.error)
            } else {
                updateBalance(response.cash)
            }
        });
        const depositBtn = document.querySelector(".deposit-btn");
        const formContainer = this.document.querySelectorAll(".form-container-style");
        formContainer[0].querySelector(".submit-btn").onclick = () => {
            const amount = this.document.querySelector("#transfer-amount").value;
            console.log(amount)
            const selectedAccount = getSelectedAccount();
            console.log("account", selectedAccount)
            if (state.selectedDepositMethod === "transfer") {
                apiService.withdrawPortfolioCash(state.userInfos.username, selectedAccount, parseFloat(amount)).then(res => {
                    if (res.error) {
                        onError("Could not transfer money. Check the balance of the account.", "deposit");
                    } else {
                        onError("Deposit Success", "deposit");
                        if (amount)
                            apiService.depositPortfolioCash(state.userInfos.username, state.portfolio.name, parseFloat(amount)).then(res => {
                                if (res.error) {
                                    onError(res.error, "deposit");
                                } else {
                                    onError("Deposit Success", "deposit");
                                    updateBalance(res.cash);
                                }
                            })
                    }
                })
            } else {
                apiService.withdrawBankAccount(state.userInfos.username, state.portfolio.name, parseFloat(amount)).then(res => {
                    if (res.error) {
                        onError(res.error, "deposit");
                    } else {
                        onError("Could not load money. Check the balance of the bank account.", "deposit");
                        if (amount)
                            apiService.depositPortfolioCash(state.userInfos.username, state.portfolio.name, parseFloat(amount)).then(res => {
                                if (res.error) {
                                    onError(res.error, "deposit");
                                } else {
                                    onError("Deposit Success", "deposit");
                                    updateBalance(res.cash);
                                }
                            })
                    }
                })
            }
        }
        formContainer[1].querySelector(".submit-btn").onclick = () => {
            const amount = this.document.querySelector("#withdraw-amount").value;
            console.log(amount)
            if (amount)
                apiService.withdrawPortfolioCash(state.userInfos.username, state.portfolio.name, parseFloat(amount)).then(res => {
                    if (res.error) {
                        onError(res.error, "withdraw");
                    } else {
                        onError("Withdraw Success", "withdraw");
                        updateBalance(res.cash);
                    }
                })
        }
        depositBtn.addEventListener("click", () => {
            if (formContainer[0].classList.contains("hidden")) {
                formContainer[1].classList.add("hidden");
                formContainer[0].classList.remove("hidden");
                document.querySelector(".deposit-container").classList.remove("hidden");
                document.querySelector(".withdraw-container").classList.add("hidden");

                const selectedValue = document.querySelector('input[name="depositOption"]:checked').value;
                console.log('Initially selected option:', selectedValue);
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
                document.querySelector(".withdraw-container").classList.remove("hidden");
                document.querySelector(".deposit-container").classList.add("hidden");
            } else {
                formContainer[1].classList.add("hidden");
                document.querySelector(".deposit-container").classList.add("hidden");
                document.querySelector(".withdraw-container").classList.add("hidden");
            }
        });
    });
})();
