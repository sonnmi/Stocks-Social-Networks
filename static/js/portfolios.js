(function () {
  "use strict";

  const state = {
    portfolios: []
  }
  
  const createPortfolioComponent = (data) => {
    const username = JSON.parse(localStorage.getItem("userInfo")).username
    const elmt = document.createElement("div");
    elmt.className = "";
    elmt.innerHTML = `<div class="portfolio-item">
                            <h3>${data.name}</h3>
                        </div>
                    `;

    elmt.querySelector(".portfolio-item").addEventListener("click", () => {
        location.href="./portfolio.html?name=" + data.name}) // "&username="+username;
    
    // elmt.innerHTML +=
    //     '<div class="delete-icon"></div>';
    // elmt.querySelector(".symbol").onclick = () => viewStock(data.symbol);

    console.log(elmt)
    return elmt;
  }


  const updatePortfolio = () => {
        const username = JSON.parse(localStorage.getItem("userInfo")).username
      apiService
        .getPortfoliosOfUser(username)
        .then((response) => {
          if (response.error) {
            console.log(response.error)
          } else {
            state.portfolios = response.portfolios
            document.querySelector(".card.portfolio-container").innerHTML = "";
            if (state.portfolios.length > 0) {
                state.portfolios.map((portfolio) => {
                    const newPortf = createPortfolioComponent(
                        portfolio
                    );
                    console.log(newPortf)
                    document.querySelector(".card.portfolio-container").appendChild(newPortf);
                });
            }}
            
        })
    }
    


  window.addEventListener("load", function(event) {
    console.log('sdf')
    updatePortfolio();

    document.querySelector(".add-btn").addEventListener("click", () => {
        if (document.querySelector(".portfolio .add-portfolio-form").classList.contains("hidden"))
            document.querySelector(".portfolio .add-portfolio-form").classList.remove("hidden");
        else
            document.querySelector(".portfolio .add-portfolio-form").classList.add("hidden");
    })

    document.querySelector(".add-portfolio-form .btn")
      .addEventListener("click", function (e) {
        e.preventDefault();
        const name = document.querySelector("form [name=name]").value;
        const username = JSON.parse(localStorage.getItem("userInfo")).username
        apiService.createPortfolio(username, name).then((res) => {
            if (res.error)
                console.log(res.error)
            else {
                document.querySelector(".portfolio .add-portfolio-form").classList.add("hidden");
                updatePortfolio();
            }
                
        })
      });
    })

})();