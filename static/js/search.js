(function () {
  "use strict";

    const state = {
        active: 0
    }

    const updateactive = (i) => {
        document.querySelectorAll('.link')[state.active].classList.remove("active")
        state.active = i;
        document.querySelectorAll('.link')[state.active].classList.add("active")
    }


    window.addEventListener("load", function (event) {

    document.querySelector('.search-bar').addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
            alert(document.querySelector('.search-bar').value);
        }
    })

    document.querySelectorAll('.link').forEach((link, i) => {
        link.addEventListener("click", () => {
            console.log(i)
            updateactive(i)
            location.href = link.getAttribute("link")
        })
    })

    })
})()