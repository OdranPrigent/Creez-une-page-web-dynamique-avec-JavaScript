
const form = document.getElementById('connect');
let admin = false;
let tok = "";

function connection(e) {
    e.preventDefault();
  const m = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.mail.value);
  if (m)
    if (form.password.value != ''){
      fetch("http://localhost:5678/api/users/login", 
      {method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },body: JSON.stringify({"email": form.mail.value,
        "password": form.password.value})})
      .then(reponse => {
        if(reponse.status!=200){
          document.getElementById('mdp').innerHTML = "Nom d'utilisateur ou email invalide.";
          admin = false;
        }
        else{
          admin = true;
          return reponse.json()
        }
          })
      .then(reponse => {testReponse(reponse)})
      .catch ((error) => {console.log(error)})
    }
    else
      document.getElementById('mdp').innerHTML = "champ mdp vide";
  else
    document.getElementById('mdp').innerHTML = "e-mail non conforme";
}

form.addEventListener("submit", connection);

function testReponse(reponse){
  if (admin){
    tok = reponse.token;
    document.getElementById('mdp').innerHTML = "Connexion...";
    sessionStorage.setItem("tokenSophieBluel", reponse.token);
    document.location.href="index.html";
  }
 
}