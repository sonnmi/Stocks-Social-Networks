(function () {
  "use strict";

  const state = {
    userInfo: {},
    stocklistInfo: "",
    stocks: [],
    friends: [],
  };

  function onError(err) {
    console.log(err);
  }

  const getStockList = () => {
    console.log(
      "getStockList",
      state.userInfo.username,
      state.stocklistInfo.name,
    );
    apiService
      .getStocklist(state.userInfo.username, state.stocklistInfo.name)
      .then((data) => {
        if (data.error) {
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
            <h3>Owned by: ${stock.owner}</h3>
            <p>Stock: ${stock.stock}</p>
        </div>
        `;
      stockList.appendChild(stockElement);
    });
  };

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
      if (state.userInfo.username === comment.reviewer) {
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("comment-delete");
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener("click", () => {
          apiService
            .deleteStockListComment(
              state.stocklistInfo.name,
              state.stocklistInfo.owner,
              comment.comment,
              comment.reviewer,
            )
            .then((data) => {
              getComments(false, false);
            });
        });
        commentElement.appendChild(deleteButton);

        const editButton = document.createElement("button");
        editButton.classList.add("comment-edit");
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
              .then((data) => {
                getComments(false, false);
              });
          });
        });
        commentElement.appendChild(editButton);
      }
      commentContainer.appendChild(commentElement);
      commentsList.appendChild(commentContainer);
    });
  };

  window.addEventListener("load", function (event) {
    state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    state.stocklistInfo = JSON.parse(localStorage.getItem("stocklistInfo"));
    document.querySelector(".stocklist-name").innerHTML =
      state.stocklistInfo.name;
    getStockList();
    console.log(state.userInfo.username, state.stocklistInfo.owner);
    if (state.stocklistInfo.visibility === "private") {
      if (state.userInfo.username === state.stocklistInfo.owner) {
        console.log("owner 111");
        document.querySelector(".stocklist-sharing").classList.remove("hidden");
        document
          .querySelector(".comments-form-container")
          .classList.add("hidden");
        getComments(true, false);
        state.friends = apiService
          .getUserFriends(state.userInfo.username)
          .then((data) => {
            console.log(data);
            if (data.error) {
              state.friends = [];
            } else {
              state.friends = data;
            }

            const sharingDropdown = document.querySelector(
              ".stocklist-sharing-dropdown",
            );
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

              const submitButton = document.querySelector(
                ".stocklist-sharing-submit",
              );
              submitButton.addEventListener("click", () => {
                const friendName = document.querySelector(
                  ".stocklist-sharing-dropdown",
                ).value;
                apiService
                  .shareStockList(
                    state.stocklistInfo.owner,
                    friendName,
                    state.stocklistInfo.name,
                  )
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
          });
      } else {
        console.log("not owner");
        getComments(false, false);
        document
          .querySelector(".comments-form-container")
          .classList.remove("hidden");
        document
          .querySelector(".comments-form-submit")
          .addEventListener("click", (e) => {
            e.preventDefault();

            const comment = document.querySelector(".comments-form").value;
            console.log("submit comment", comment);
            apiService
              .addStockListComment(
                state.stocklistInfo.name,
                state.stocklistInfo.owner,
                comment,
                state.userInfo.username,
              )
              .then((data) => {
                console.log(data);
                getComments(false, false);
              });
          });
      }
    } else {
      getComments(false, true);
      if (state.userInfo.username === state.stocklistInfo.owner) {
        document
          .querySelector(".comments-form-container")
          .classList.add("hidden");
      } else {
        document
          .querySelector(".comments-form-container")
          .classList.remove("hidden");
        document
          .querySelector(".comments-form-submit")
          .addEventListener("click", (e) => {
            e.preventDefault();

            const comment = document.querySelector(".comments-form").value;
            console.log("submit comment", comment);
            apiService
              .addStockListComment(
                state.stocklistInfo.name,
                state.stocklistInfo.owner,
                comment,
                state.userInfo.username,
              )
              .then((data) => {
                getComments(false, true);
              });
          });
      }
    }
  });
})();
