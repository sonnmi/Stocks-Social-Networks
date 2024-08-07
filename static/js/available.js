(function () {
    "use strict";
  
    const state = {
      userInfo: {},
      stocklists: [],
    };
  
    const onError = (err) => {
      console.log(err);
    };
    
  
    const getPublicStockList = () => {
      apiService.getPublicStockLists().then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          state.stocklists = response;
          if (state.stocklists.length > 0) {
            renderStockList();
          }
        }
      });
    };
  
    const renderStockList = () => {
      const stockList = document.querySelector(".stocklist-container");
      stockList.innerHTML = "";
      state.stocklists.forEach((stocklist) => {
        const stockListElement = document.createElement("div");
        stockListElement.classList.add("stocklist-item");
        console.log(stocklist)
        stockListElement.innerHTML = `
          <div class="stocklist-item inner s${stocklist.name}" href="#">
              <h3 class="stocklist-name">${stocklist.name}</h3>
              <p class="stocklist-visibility">${stocklist.ispublic ? "public" : "private"}</p>
              <p class="stocklist-owner">Owned by: ${stocklist.owner}</p>
          </div>
          `;
        stockList.appendChild(stockListElement);
        const stockListElementInner = stockList.querySelector(
          ".stocklist-item.inner.s" + stocklist.name,
        );
  
        stockListElement.querySelector(".stocklist-name").addEventListener("click", (event) => {
          const stocklistName = stocklist.name;
          const stocklistOwner = stocklist.owner;
            // event.target.querySelector(".stocklist-owner").textContent;
          const stocklistVisibility = stocklist.ispublic ? "public" : "private";
          localStorage.setItem(
            "stocklistInfo",
            JSON.stringify({
              name: stocklistName,
              owner: stocklistOwner,
              visibility: stocklistVisibility,
            }),
          );
          location.href = "./stocklist.html";
        });
      });
    };
  
    window.addEventListener("load", function (event) {
      console.log("sdf");
      state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      getPublicStockList();
  
    });
  })();
  