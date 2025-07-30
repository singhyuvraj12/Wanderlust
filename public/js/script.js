// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");
  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const rating_value = document.querySelector("#rating-value");
const stars = document.querySelectorAll(".star");

//to show unsave rating before logged in
if (rating_value) {
  let previousStar = rating_value.getAttribute("value");
  for (let i = 0; i < previousStar; i++) {
    stars[i].classList.add("checked");
  }
}

stars.forEach((star) => {
  star.addEventListener("click", function () {
    let rating = this.getAttribute("id");
    score = rating - 1;
    for (let i = 0; i < 5; i++) {
      if (i <= score) stars[i].classList.add("checked");
      else stars[i].classList.remove("checked");
    }
    rating_value.setAttribute("value", rating);
  });
});

setTimeout(() => {
  document.querySelectorAll(".flash-message").forEach((msg) => {
    msg.style.display = "none";
  });
}, 4000);

let toggler = document.querySelector(".form-check-input");
if (toggler) {
  toggler.addEventListener("click", () => {
    let listingTaxes = document.querySelectorAll(".tax-info");
    for (listing of listingTaxes) {
      if (listing.classList.contains("hide-tax")) {
        listing.classList.remove("hide-tax");
      } else {
        listing.classList.add("hide-tax");
      }
    }
  });
}

let halfStars = document.querySelectorAll(".fa-star-half");
let averageStar = document.querySelector(".average-star");
let averageValue = averageStar.dataset.averageRating * 2 || 0;
for (let i = 0; i < averageValue; i++) {
  halfStars[i].classList.add("checked");
}

document.querySelectorAll('.bar-filled').forEach(bar => {
  bar.style.width = `${bar.dataset.width}%`;
});