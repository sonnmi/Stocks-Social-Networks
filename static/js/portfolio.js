(function () {
    "use strict";

    const state = {
        portfolio: {name: "", cash: ""},
        userInfos: {}
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

    window.addEventListener("load", function(event) {
        state.userInfos = JSON.parse(localStorage.getItem("userInfo"));
        state.portfolio.name = new URLSearchParams(window.location.search).get("name");
        updatePortfolio();
        const balance = document.querySelector(".balance");
        apiService.getPortfolioCash(state.userInfos.userid, state.portfolio.name).then((response) => {
            console.log(response);
            if (response.error) {
                console.log(response.error)
            } else {
                balance.innerHTML = `<h2>Total Balance: $ ${response.cash} </h2>`;
                state.portfolio.cash = response.cash;
            }
        });
        const addBtn = document.querySelector(".add-btn");
        addBtn.addEventListener("click", () => {
            if (document.querySelector(".portfolio .add-portfolio-form").classList.contains("hidden"))
                document.querySelector(".portfolio .add-portfolio-form").classList.remove("hidden");
        });
        const addPortfolio = document.querySelector(".add-portfolio-form");
        addPortfolio.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(addPortfolio);
            const name = formData.get("name");
            apiService.addPortfolio(state.userInfos.userid, name, cash).then((response) => {
                if (response.error) {
                    console.log(response.error)
                } else {
                    updatePortfolio();
                    document.querySelector(".portfolio .add-portfolio-form").classList.add("hidden");
                }
            })
        });
    });
})();
