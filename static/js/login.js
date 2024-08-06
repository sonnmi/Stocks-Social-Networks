(function () {
  "use strict";

  const state = {};

  function showStatus(err) {
    const status = document.querySelector(".status");
    status.innerHTML = err;
    status.classList.remove("hidden");
  }

  const signOut = () => {
    apiService.signout().then(() => {});
  };

  const signUp = () => {
    if (document.querySelector(".input-container").checkValidity()) {
      const username = document.querySelector("form [name=username]").value;
      const password = document.querySelector("form [name=password]").value;
      const email = document.querySelector("form [name=email]").value;
      apiService.signUp(username, password, email).then((data) => {
        if (data.error) {
          showStatus(data.error);
        } else {
          apiService.createPortfolio(data.username, "default").then(() => {
            console.log(data.username);
          });
          showStatus("Sign up successfully");
        }
      });
    }
  };

  const signIn = () => {
    if (document.querySelector(".input-container").checkValidity()) {
      const username = document.querySelector("form [name=username]").value;
      const password = document.querySelector("form [name=password]").value;
      apiService.signIn(username, password).then((data) => {
        if (data.error) {
          showStatus(data.error);
        } else {
          localStorage.setItem("userInfo", JSON.stringify(data.user));
          location.href = "/home.html";
        }
      });
    }
  };

  window.addEventListener("load", function (event) {
    document
      .querySelector(".login-nav .login")
      .addEventListener("click", () => {
        document.querySelector("form [name=action]").value = "login";
        document.querySelector(".login-container .btn").innerHTML = "Log in";
        document.querySelector(".status").innerHTML = "";
        document.querySelector(".login-nav .signup").classList.remove("active");
        document.querySelector(".login-nav .login").classList.add("active");
        document
          .querySelector(".input-container .email")
          .classList.add("hidden");
      });
    document
      .querySelector(".login-nav .signup")
      .addEventListener("click", () => {
        document.querySelector("form [name=action]").value = "signup";
        document.querySelector(".login-container .btn").innerHTML = "Sign up";
        document.querySelector(".status").innerHTML = "";
        document.querySelector(".login-nav .login").classList.remove("active");
        document.querySelector(".login-nav .signup").classList.add("active");
        document
          .querySelector(".input-container .email")
          .classList.remove("hidden");
      });
    document
      .querySelector(".login-container .btn")
      .addEventListener("click", function (e) {
        e.preventDefault();
        const action = document.querySelector("form [name=action]").value;
        if (action === "signup") {
          signUp();
        } else {
          signIn();
        }
      });
  });
})();
