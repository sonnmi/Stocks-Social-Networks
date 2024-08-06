(function () {
  "use strict";

  const state = {
    userInfo: {},
    portfolios: [],
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

  window.addEventListener("load", function (event) {
    state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.document.querySelector(".profile .username").innerHTML =
      state.userInfo.username;
    updateHomePortfolio();
  });
})();
