(function () {
    "use strict";

    // Initialize the state object
    const state = {
      userInfo: {},
      stocklistInfo: "",
      stocks: [],
      friends: [],
    };

    function onError(err) {
      console.log(err);
    }

    // Function to fetch the stock list and update the state
    const getStockList = () => {
      console.log(
        "getStockList",
        state.userInfo.username,
        state.stocklistInfo.name,
      );

      return apiService
        .getStocklist(state.userInfo.username, state.stocklistInfo.name)
        .then((data) => {
          if (data.error) {
            console.log("Error fetching stock list:", data.error);
            if (data.error === "No stocks found in list") {
              state.stocks = [];
              renderStockList();
            }
          } else {
            state.stocks = data;
            renderStockList();
          }
        });
    };

    // Function to render the stock list
    const renderStockList = () => {
      const stockList = document.querySelector(".stocklist-container");
      console.log("renderStockList", state.stocks, stockList);
      stockList.innerHTML = "";
      state.stocks.forEach((stock) => {
        const stockElement = document.createElement("div");
        console.log("stock", stock);
        stockElement.classList.add("stock-item");
        stockElement.innerHTML = `
          <div class="stock-item">
              <h3>${stock.stock}</h3>
              <p>Shares: ${stock.shares}</p>
          </div>
          `;
        stockList.appendChild(stockElement);
      });
    };

    // Function to fetch comments
    const getComments = (isOwner, isPublic) => {
      console.log("getComments", state.stocklistInfo.name);
      if (isOwner || isPublic) {
        apiService
          .getStockListComments(
            state.stocklistInfo.name,
            state.stocklistInfo.owner,
          )
          .then((data) => {
            if (data.error) {
              console.log(data.error);
              renderComments([]);
            } else {
              renderComments(data);
            }
          });
      } else {
        apiService
          .getStockListOwnComments(
            state.stocklistInfo.name,
            state.stocklistInfo.owner,
            state.userInfo.username,
          )
          .then((data) => {
            if (data.error) {
              console.log(data.error);
              renderComments([]);
            } else {
              renderComments(data);
            }
          });
      }
    };

    // Function to render comments
    const renderComments = (comments) => {
      const commentsList = document.querySelector(".comment-list-container");
      commentsList.innerHTML = "";
      comments.forEach((comment) => {
        const commentContainer = document.createElement("div");
        commentContainer.classList.add("comment-container");
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `
                  <div class="comment-user">${comment.reviewer}</div>
                  <div class="comment-content">${comment.comment}</div>
              `;
        if (state.userInfo.username === comment.reviewer || state.userInfo.username === state.stocklistInfo.owner) {
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("comment-delete");
          deleteButton.classList.add("comment-button");
          deleteButton.innerHTML = "Delete";
          deleteButton.addEventListener("click", () => {
            apiService
              .deleteStockListComment(
                state.stocklistInfo.name,
                state.stocklistInfo.owner,
                comment.comment,
                comment.reviewer,
              )
              .then(() => {
                getComments(false, false);
              });
          });
          commentElement.appendChild(deleteButton);
          if (state.userInfo.username === comment.reviewer) {
            const editButton = document.createElement("button");
            editButton.classList.add("comment-edit");
            editButton.classList.add("comment-button");
            editButton.innerHTML = "Edit";
            editButton.addEventListener("click", () => {
              const editInput = document.createElement("input");
              editInput.classList.add("comment-edit-input");
              editInput.value = comment.comment;
              commentElement.appendChild(editInput);
              editButton.innerHTML = "Save";
              editButton.addEventListener("click", () => {
                const newComment = editInput.value;
                apiService
                  .editStockListComment(
                    state.stocklistInfo.name,
                    state.stocklistInfo.owner,
                    comment.comment,
                    comment.reviewer,
                    newComment,
                  )
                  .then(() => {
                    getComments(false, false);
                  });
              });
            });
            commentElement.appendChild(editButton);
          }
        }
        commentContainer.appendChild(commentElement);
        commentsList.appendChild(commentContainer);
      });
    };

    // Function to initialize the state before running the main logic
    async function initializeState() {
      try {
        // Load user info from local storage
        state.userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        state.stocklistInfo = JSON.parse(localStorage.getItem("stocklistInfo")) || {};

        console.log("State on initialization:", state);

        // Fetch the stock list and update state
        await getStockList();

        // Other initializations if needed
      } catch (error) {
        console.error("Error initializing state:", error);
      }
    }

    // Function to handle DOMContentLoaded event
    document.addEventListener("DOMContentLoaded", async function () {
      try {
        await initializeState(); // Wait for state to be initialized

        // Perform operations once state and DOM are ready
        const stockList = state.stocks.map(stock => stock.stock);
        console.log("Stock list:", stockList);

        if (stockList.length === 0) {
          console.error("No stocks available to fetch correlations.");
          return;
        }

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
    });

    // Generate the correlation matrix for the stocks
    function generateCorrelationMatrix(stockList, correlationData) {
      const matrixTable = document.getElementById("correlationMatrix");
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
            tableHTML += `<td id="${stock1 + stock2}">1.00</td>`; // Correlation with itself
          } else {
            const correlation = correlationData[stock1][stock2] || 0; // Use 0 if no data
            tableHTML += `<td id="${stock1 + stock2}">${correlation.toFixed(2)}</td>`;
          }
        });
        tableHTML += "</tr>";
      });

      tableHTML += "</tbody>";
      matrixTable.innerHTML = tableHTML;
    }

    // Initial load handler
    window.addEventListener("load", async function (event) {
      await initializeState(); // Ensure state is initialized on load
      console.log(state.stocklistInfo);

      // Set the stocklist name and owner in the UI
      document.querySelector(".stocklist-name").innerHTML = state.stocklistInfo.name || "Unnamed List";
      document.querySelector(".stocklist-owner").innerHTML = `Owned by: ${state.stocklistInfo.owner || "Unknown Owner"}`;

      if (state.userInfo.username === state.stocklistInfo.owner) {
        document.querySelector(".stocklist-edit-visibility").classList.remove("hidden");
        document.querySelector(".stocklist-edit-visibility").addEventListener("click", () => {
          document.querySelector(".stocklist-visibility").classList.toggle("hidden");
        });

        const publicCheckbox = document.querySelector(".visibility-checkbox.public");
        const privateCheckbox = document.querySelector(".visibility-checkbox.private");

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

        const visibilitySubmit = document.querySelector(".stocklist-visibility-submit");
        visibilitySubmit.addEventListener("click", () => {
          const isPublic = publicCheckbox.checked;
          apiService
            .updateStockList(state.stocklistInfo.owner, state.stocklistInfo.name, isPublic)
            .then((data) => {
              console.log(data);
              state.stocklistInfo.visibility = isPublic ? "public" : "private";
              document.querySelector(".stocklist-visibility").classList.add("hidden");
              if (isPublic) {
                document.querySelector(".stocklist-sharing").classList.add("hidden");
              } else {
                document.querySelector(".stocklist-sharing").classList.remove("hidden");
              }
            });
        });
      }

      if (state.stocklistInfo.visibility === "private") {
        if (state.userInfo.username === state.stocklistInfo.owner) {
          document.querySelector(".stocklist-sharing").classList.remove("hidden");
          document.querySelector(".comments-form-container").classList.add("hidden");
          getComments(true, false);

          state.friends = await apiService.getUserFriends(state.userInfo.username)
            .then((data) => {
              console.log(data);
              if (data.error) {
                return [];
              }
              return data;
            });

          const sharingDropdown = document.querySelector(".stocklist-sharing-dropdown");
          sharingDropdown.innerHTML = "";
          if (state.friends.length > 0) {
            state.friends.forEach((friend) => {
              console.log(friend.username);
              const friendElement = document.createElement("option");
              friendElement.classList.add("friend-item");
              friendElement.innerHTML = `
                <option class="stocklist-sharing-friend">${friend.friend}</option>
              `;
              sharingDropdown.appendChild(friendElement);
            });

            const submitButton = document.querySelector(".stocklist-sharing-submit");
            submitButton.addEventListener("click", () => {
              const friendName = document.querySelector(".stocklist-sharing-dropdown").value;
              apiService
                .shareStockList(state.stocklistInfo.owner, friendName, state.stocklistInfo.name)
                .then((data) => {
                  console.log(data);
                });
            });
          } else {
            const friendElement = document.createElement("option");
            friendElement.classList.add("friend-item");
            friendElement.innerHTML = `
              <option>Please add a friend to enable sharing</option>
            `;
            sharingDropdown.appendChild(friendElement);
          }
        } else {
          console.log("not owner");
          getComments(false, false);
          document.querySelector(".comments-form-container").classList.remove("hidden");
          document.querySelector(".comments-form-submit").addEventListener("click", (e) => {
            e.preventDefault();

            const comment = document.querySelector(".comments-form").value;
            console.log("submit comment", comment);
            apiService
              .addStockListComment(state.stocklistInfo.name, state.stocklistInfo.owner, comment, state.userInfo.username)
              .then(() => {
                getComments(false, false);
              });
          });
        }
      } else {
        getComments(false, true);
        if (state.userInfo.username === state.stocklistInfo.owner) {
          document.querySelector(".comments-form-container").classList.add("hidden");
        } else {
          document.querySelector(".comments-form-container").classList.remove("hidden");
          document.querySelector(".comments-form-submit").addEventListener("click", (e) => {
            e.preventDefault();

            const comment = document.querySelector(".comments-form").value;
            console.log("submit comment", comment);
            apiService
              .addStockListComment(state.stocklistInfo.name, state.stocklistInfo.owner, comment, state.userInfo.username)
              .then(() => {
                getComments(false, true);
              });
          });
        }
      }

      // Add event listener for the refresh button
      document.getElementById('refreshCorrelation').addEventListener('click', updateMatrix);
    });

    // Define the updateMatrix function
    function updateMatrix() {
      const stockList = state.stocks.map(stock => stock.stock);
      console.log("Stock list:", stockList);

      if (stockList.length === 0) {
        console.error("No stocks available to fetch correlations.");
        return;
      }

      for (let i = 0; i < stockList.length; i++) {
        for (let j = 0; j < stockList.length; j++) {
          const stock1 = stockList[i];
          const stock2 = stockList[j];
          if (i === j) {
            document.getElementById(stock1 + stock2).innerHTML = "1.00"; // Correlation with itself
          } else {
            // Update the correlation value
            updateCorrelation(stock1, stock2).then(correlation => {
              document.getElementById(stock1 + stock2).innerHTML = correlation.toFixed(2);
            });
          }
        }
      }
    }

    // Fetch updated correlation
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
})();
