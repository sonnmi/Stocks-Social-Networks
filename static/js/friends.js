(function () {
    "use strict";

    // Create a custom event target for database changes
    const databaseEventTarget = new EventTarget();

    const state = {
      userInfo: {},
      friends: [],
    };

    function onError(err) {
      const error = document.querySelector(".error");
      error.innerHTML = err;
      error.classList.remove("hidden");
    }

    function getFriends() {
      console.log("getFriends", state.userInfo.username);
      apiService.getUserFriends(state.userInfo.username).then((data) => {
        console.log("getFriends data", data);
        if (data.error) {
          if (data.error === "No friends found") {
            state.friends = [];
            console.log("after friend remove", state.friends);
            renderFriends();
          }
        } else {
          state.friends = data;
          renderFriends();
        }
      });
    }

    function renderFriends() {
      const friendsList = document.querySelector(".friends-list");
      friendsList.innerHTML = "";
      state.friends.forEach((friend) => {
        const friendContainer = document.createElement("div");
        friendContainer.classList.add("friend-item-container");
        const friendElement = document.createElement("div");
        friendElement.classList.add("friend-item");
        friendElement.innerHTML = `
          <div class="friend-image-container">
              <div class="friend-image"></div>
          </div>
          <div class="friend-info">
              <div class="friend-name">${friend.friend}</div>
          </div>
          <div class="friend-action-btns">
              <button type="submit" class="remove-friend-btn">
                  Remove
              </button>
          </div>
          `;
        apiService.getSharedStockLists(friend.friend, state.userInfo.username).then((data) => {
          console.log("getSharedStockLists", data);
          if (data.error) {
            console.log("No shared stock lists found");
            friendContainer.appendChild(friendElement);
            return;
          }
          const sharedStockListsElement = document.createElement("div");
          sharedStockListsElement.classList.add("shared-stocklists");
          sharedStockListsElement.innerHTML = `<div class="shared-stocklists-title">Shared Stock Lists</div>
              <div class="shared-stocklists-btn"></div>`;

          const dropdown = document.createElement("div");
          dropdown.classList.add("shared-stocklists-dropdown");
          dropdown.classList.add("hidden");
          data.forEach((stocklist) => {
            const stockListElement = document.createElement("div");
            stockListElement.classList.add("stocklist-item");
            stockListElement.innerHTML = `
                  <div class="stocklist-item inner s${stocklist.stocklist}" href="#">
                      <p class="stocklist-name">${stocklist.stocklist}</p>
                  </div>
                  `;
            dropdown.appendChild(stockListElement);

            stockListElement.querySelector(`.s${stocklist.stocklist}`).addEventListener("click", (event) => {
              const stocklistName = stocklist.stocklist;
              const stocklistOwner = friend.friend;
              console.log("stocklistName", stocklistName);
              console.log("stocklistOwner", stocklistOwner);
              window.location.href = `/stocklist.html`;
              localStorage.setItem(
                "stocklistInfo",
                JSON.stringify({
                  name: stocklistName,
                  owner: stocklistOwner,
                  visibility: stocklist.ispublic ? "public" : "private",
                }),
              );
            });

          });
          friendElement.appendChild(sharedStockListsElement);
          friendContainer.appendChild(friendElement);
          friendContainer.appendChild(dropdown);
          const dropdownBtn = friendContainer.querySelector(".shared-stocklists-btn");

          dropdownBtn.addEventListener("click", () => {
            const dropdown = friendContainer.querySelector(".shared-stocklists-dropdown");
            dropdown.classList.toggle("hidden");
          });

        });
        friendsList.appendChild(friendContainer);
      });
    }

    function sendFriendRequest() {
      const friendUsername = document.querySelector(".friend-request-form-username").value;
      document.querySelector(".friend-request-form-username").value = "";
      apiService.sendRequest(
        state.userInfo.username,
        friendUsername,
        "friend",
        "pending",
        new Date(),
      ).then(() => {
        // Dispatch custom event when a friend request is sent
        databaseEventTarget.dispatchEvent(new Event("databaseChanged"));
      });
    }

    function getFriendRequests() {
      apiService.getUserPendingRequests(state.userInfo.username).then((data) => {
        if (data.error) {
          if (data.error === "No requests found") {
            renderFriendRequests([]);
          }
        } else {
          renderFriendRequests(data);
        }
      });
    }

    function renderFriendRequests(requests) {
      const friendRequests = document.querySelector(".friend-requests");
      friendRequests.innerHTML = "";
      requests.forEach((request) => {
        const requestElement = document.createElement("div");
        requestElement.classList.add("request-item");
        requestElement.innerHTML = `
          <div class="friend-image-container">
              <div class="friend-image"></div>
          </div>
          <div class="friend-info">
              <div class="friend-name">${request.sender}</div>
          </div>
          <div class="friend-action-btns">
              <button type="submit" class="accept-friend-btn">
                  Accept
              </button>
              <button type="submit" class="decline-friend-btn">
                  Decline
              </button>
          </div>
          `;
        friendRequests.appendChild(requestElement);
      });
    }

    function getOutgoingRequests() {
      apiService.getUserOutgoingRequests(state.userInfo.username).then((data) => {
        if (data.error) {
          if (data.error === "No requests found") {
            renderOutgoingRequests([]);
          }
        } else {
          renderOutgoingRequests(data);
        }
      });

    }

    function renderOutgoingRequests(requests) {
      const friendRequests = document.querySelector(".outgoing-requests");
      friendRequests.innerHTML = "";
      requests.forEach((request) => {
        const requestElement = document.createElement("div");
        requestElement.classList.add("request-item");
        requestElement.innerHTML = `
          <div class="friend-image-container">
              <div class="friend-image"></div>
          </div>
          <div class="friend-info">
              <div class="friend-name">${request.receiver}</div>
          </div>
          <div class="friend-action-btns">
              <button type="submit" class="cancel-friend-btn">
                  Cancel
              </button>
          </div>
          `;
        friendRequests.appendChild(requestElement);
      });
    }

    // Listen for the custom event and trigger updates
    databaseEventTarget.addEventListener("databaseChanged", () => {
      getFriends();
      getFriendRequests();
      getOutgoingRequests();
    });

    window.addEventListener("load", function (event) {
      state.userInfo = JSON.parse(localStorage.getItem("userInfo"));

      document.querySelector(".profile .username").innerHTML =
        state.userInfo.username;
      getFriends();
      getFriendRequests();
      getOutgoingRequests();

      const friendRequestForm = document.querySelector(".friend-request-form");
      friendRequestForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendFriendRequest();
      });

      const friendsList = document.querySelector(".friends-list");
      friendsList.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-friend-btn")) {
          const friendElement = event.target.closest(".friend-item");
          const friendName = friendElement.querySelector(".friend-name").innerHTML;
          apiService
            .updateRequest("deleted", state.userInfo.username, friendName)
            .then(() => {
              apiService
                .deleteFriend(state.userInfo.username, friendName)
                .then(() => {
                  // Dispatch custom event when a friend is removed
                  databaseEventTarget.dispatchEvent(new Event("databaseChanged"));
                });
            });
        }
      });

      const friendRequests = document.querySelector(".friend-requests");
      friendRequests.addEventListener("click", function (event) {
        if (event.target.classList.contains("accept-friend-btn")) {
          const requestElement = event.target.closest(".request-item");
          const requestSender = requestElement.querySelector(".friend-name").innerHTML;
          apiService
            .updateRequest("accepted", requestSender, state.userInfo.username)
            .then(() => {
              apiService
                .addFriend(state.userInfo.username, requestSender)
                .then(() => {
                  // Dispatch custom event when a friend request is accepted
                  databaseEventTarget.dispatchEvent(new Event("databaseChanged"));
                });
            });
        } else if (event.target.classList.contains("decline-friend-btn")) {
          const requestElement = event.target.closest(".request-item");
          const requestSender = requestElement.querySelector(".friend-name").innerHTML;
          apiService
            .updateRequest("rejected", requestSender, state.userInfo.username)
            .then(() => {
              // Dispatch custom event when a friend request is declined
              databaseEventTarget.dispatchEvent(new Event("databaseChanged"));
            });
        }
      });

      const outgoingRequests = document.querySelector(".outgoing-requests");
      outgoingRequests.addEventListener("click", function (event) {
        if (event.target.classList.contains("cancel-friend-btn")) {
          const requestElement = event.target.closest(".request-item");
          const requestReceiver = requestElement.querySelector(".friend-name").innerHTML;
          apiService
            .updateRequest("deleted", state.userInfo.username, requestReceiver)
            .then(() => {
              // Dispatch custom event when an outgoing request is canceled
              databaseEventTarget.dispatchEvent(new Event("databaseChanged"));
            });
        }
      });
    });
  })();
