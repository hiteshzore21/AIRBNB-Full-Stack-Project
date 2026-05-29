
  (() => {
    'use strict';
    const form = document.querySelector('.needs-validation');
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  })();


const rating = document.getElementById("rating");
if(rating) {
    rating.value = 3;
    rating.addEventListener("input", () => {
        ratingValue.innerText = `${rating.value} ⭐`;
    });
}