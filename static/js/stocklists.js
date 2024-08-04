(function () {
  "use strict";

  const state = {
    userInfo: {},
    stocklists: [],
  };

  const onError = (err) => {
    console.log(err);
  };

  const getStockList = () => {
    console.log("getStockList", state.userInfo.userid);
    apiService.getStockListByUser(state.userInfo.userid).then((data) => {
        console.log("getStockList data", data);
      if (data.error) {
        if (data.error === "No stock list found") {
          state.stocklists = [];
          console.log("after stocklist remove", state.stocklists);
          renderStockList();
        }
      } else {
        state.stocklists = data;
        renderStockList();
      }
    });
  };

  const renderStockList = () => {
    const stockList = document.querySelector(".stocklist-container");
    stockList.innerHTML = "";
    state.stocklists.forEach((stocklist) => {
      const stockListElement = document.createElement("div");
      stockListElement.classList.add("stocklist-item");
      stockListElement.innerHTML = `
        <div class="stocklist-item inner s${stocklist.name}" href="#">
            <h3 class="stocklist-name">${stocklist.name}</h3>
            <p class="stocklist-owner">${stocklist.owner}</p>
            <p class="stocklist-visibility">${stocklist.visibility}</p>
            <div class="chart"></div>
        </div>
        `;
        stockList.appendChild(stockListElement);
        const stockListElementInner = stockList.querySelector(".stocklist-item.inner.s" + stocklist.name);

        stockListElementInner.addEventListener("click", (event) => {
            const stocklistName = event.target.querySelector(".stocklist-name").textContent;
            const stocklistOwner = event.target.querySelector(".stocklist-owner").textContent;
            const stocklistVisibility =
                event.target.querySelector(".stocklist-visibility").textContent;
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
    getStockList();

    document.querySelector(".add-btn").addEventListener("click", () => {
      if (
        document
          .querySelector(".add-stocklist-form")
          .classList.contains("hidden")
      )
        document
          .querySelector(".add-stocklist-form")
          .classList.remove("hidden");
      else
        document.querySelector(".add-stocklist-form").classList.add("hidden");
    });

    document
      .querySelector(".add-stocklist-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.querySelector(".stocklist-form-name").value;
        const publicCheckbox = document.querySelector(
          ".visibility-checkbox.public",
        ).checked;
        const privateCheckbox = document.querySelector(
          ".visibility-checkbox.private",
        ).checked;
        const visibility = publicCheckbox
          ? "public"
          : privateCheckbox
            ? "private"
            : "public";
        apiService
          .createStockList(state.userInfo.userid, name, visibility)
          .then((data) => {
            if (data.error) {
              onError(data.error);
            } else {
              getStockList();
            }
          });
      });

    const publicCheckbox = document.querySelector(
      ".visibility-checkbox.public",
    );
    const privateCheckbox = document.querySelector(
      ".visibility-checkbox.private",
    );
    publicCheckbox.addEventListener("click", () => {
      if (privateCheckbox.checked) {
        privateCheckbox.checked = false;
      }
    });
    privateCheckbox.addEventListener("click", () => {
      if (publicCheckbox.checked) {
        publicCheckbox.checked = false;
      }
    });

    // document
    //   .querySelector(".stocklist-container")
    //   .addEventListener("click", (event) => {
        
    //       const stocklistName = event.target.querySelector(".stocklist-name").textContent;
    //       const stocklistOwner = event.target.querySelector(".stocklist-owner").textContent;
    //       const stocklistVisibility =
    //         event.target.querySelector(".stocklist-visibility").textContent;
    //       localStorage.setItem(
    //         "stocklistInfo",
    //         JSON.stringify({
    //           name: stocklistName,
    //           owner: state.userInfo.username,
    //           visibility: stocklistVisibility,
    //         }),
    //       );
    //       location.href = "./stocklist.html";
    //   });
  });
})();
