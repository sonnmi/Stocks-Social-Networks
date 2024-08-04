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

  window.addEventListener("load", function (event) {
    state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.document.querySelector(".profile .username").innerHTML =
      state.userInfo.username;
  });
})();
