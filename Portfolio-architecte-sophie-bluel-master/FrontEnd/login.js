
const form = document.getElementById('connect');

function connection(e) {
    e.preventDefault();
  console.log(form.password.value);
}

form.addEventListener("submit", connection);
