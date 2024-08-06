(function () {
  "use strict";

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
      const friendElement = document.createElement("div");
      friendElement.classList.add("friend-item");
      friendElement.innerHTML = `
        <div class="friend-image-container">
            <div class="friend-image"></div>
        </div>
        <div class="friend-info">
            <div class="friend-name">${friend.username}</div>
        </div>
        <div class="friend-action-btns">
            <button type="submit" class="remove-friend-btn">
                Remove
            </button>
        </div>
        `;
      friendsList.appendChild(friendElement);
    });
  }

  function sendFriendRequest() {
    const friendUsername = document.querySelector(
      ".friend-request-form-username",
    ).value;
    document.querySelector(".friend-request-form-username").value = "";
    apiService.sendRequest(
      state.userInfo.username,
      friendUsername,
      "friend",
      "pending",
      new Date(),
    );
  }

  function getFriendRequests() {
    apiService.getUserPendingRequests(state.userInfo.username).then((data) => {
      if (data.error) {
        console.log("after accept 62", data.error);
        if (data.error === "No requests found") {
          console.log("after accept 63");
          renderFriendRequests([]);
        }
      } else {
        console.log(data);
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
            <div class="friend-name">${request.username}</div>
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

  window.addEventListener("load", function (event) {
    state.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    this.document.querySelector(".profile .username").innerHTML =
      state.userInfo.username;
    getFriends();
    getFriendRequests();

    const friendRequestForm = document.querySelector(".friend-request-form");
    friendRequestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendFriendRequest();
    });

    const friendsList = document.querySelector(".friends-list");
    friendsList.addEventListener("click", function (event) {
      if (event.target.classList.contains("remove-friend-btn")) {
        const friendElement = event.target.closest(".friend-item");
        const friendName =
          friendElement.querySelector(".friend-name").innerHTML;
        apiService
          .updateRequest("deleted", state.userInfo.username, friendName)
          .then(() => {
            apiService
              .deleteFriend(state.userInfo.username, friendName)
              .then(() => {
                getFriends();
              });
          });
      }
    });

    const friendRequests = document.querySelector(".friend-requests");
    friendRequests.addEventListener("click", function (event) {
      if (event.target.classList.contains("accept-friend-btn")) {
        const requestElement = event.target.closest(".request-item");
        const requestSender =
          requestElement.querySelector(".friend-name").innerHTML;
        apiService
          .updateRequest("accepted", requestSender, state.userInfo.username)
          .then(() => {
            apiService
              .addFriend(state.userInfo.username, requestSender)
              .then(() => {
                getFriends();
                getFriendRequests();
              });
          });
      } else if (event.target.classList.contains("decline-friend-btn")) {
        const requestElement = event.target.closest(".request-item");
        const requestSender =
          requestElement.querySelector(".friend-name").innerHTML;
        apiService
          .updateRequest("rejected", requestSender, state.userInfo.username)
          .then(() => {
            getFriendRequests();
          });
      }
    });
  });
})();
