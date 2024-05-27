let projets;
let categories = [];

function filtre(id){
    createGalery (projets, id);
}

function main () {
    fetch("http://localhost:5678/api/works")
    .then ((reponse) => reponse.json())
    .then ((reponse) => {createGalery(reponse, 0)})
    .catch ((error) => {console.log(error)})
}

let token ="";
function createGalery (works, id) {
    projets = works;
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    let filtres = document.querySelector(".filtres");
    filtres.innerHTML = "";
    for (let i =0; i<works.length; i++){
        let figure = document.createElement("figure");
        figure.setAttribute("categorie", works[i].categoryId);
        let image = document.createElement("img");
        image.src = works[i].imageUrl;
        image.alt = works[i].title;
        let j =0;
        
        for (j=0; j<categories.length; j++)
            if (categories[j] == works[i].category.name)
                j = categories.length+1;
        if (j == categories.length)
            categories.push(works[i].category.name);

        let figCaption = document.createElement("figcaption");
        figCaption.innerHTML = works[i].title;

        if (id == 0 || works[i].categoryId == id){
            figure.appendChild(image);
            figure.appendChild(figCaption);
            gallery.innerHTML += figure.outerHTML;
        } 
    }
    createFiltre(-1);


    if (sessionStorage.getItem("tokenSophieBluel"))
        modifier();
    else{
        for (let j =0; j<categories.length; j++)
            createFiltre(j);
    console.log(String(sessionStorage.getItem("tokenSophieBluel"))) 
    
    }
}

function modifier(){
    document.querySelector(".filtres").innerHTML = "";
    document.querySelector(".modifier").innerHTML = '<h2>Mes Projets</h2><div class="box"><a class="button" href="#popup1"><img src="assets/icons/Fa-Team-Fontawesome-Regular-FontAwesome-Regular-Pen-to-Square.svg" alt="icon pinceau sur une feuille" class="svgIcon">modifier</a></div>';
    document.querySelector(".aLogin").innerHTML = '<a onclick="logout()" >logout</a>';
    document.querySelector(".innerPopup").innerHTML = '<div class="galerieTitle">Galerie photo</div><a class="close" href="#">&times;</a><div class ="galeryModif"></div><span class="txtDecor"></span><a class="buttonAjoutPhoto" onclick="ajoutPhoto()">Ajouter une photo</a>';
    ajoutGalleryModif();
}

function logout(){
    sessionStorage.setItem("tokenSophieBluel", "");
    document.location.href="index.html";
}

function tokenT(t){
    this.token = t;
    console.log(token);   
}

function ajoutGalleryModif(){
    let works = projets;
    let gallery = document.querySelector(".galeryModif");
    gallery.innerHTML = "";
    for (let i =0; i<works.length; i++){
        let figure = document.createElement("figure");
        figure.setAttribute("categorie", works[i].categoryId);
        let image = document.createElement("img");
        image.src = works[i].imageUrl;
        image.alt = works[i].title;
        let j =0;
        figure.appendChild(image);
        figure.innerHTML += '<a onclick="deleteWork('+works[i].id+')"><i class="fa fa-trash-o"></i></a>';
        gallery.innerHTML +=  figure.outerHTML;
    }
}

function deleteWork(i){
    fetch("http://localhost:5678/api/works/"+i, 
      {method: 'DELETE',
      headers: {
        'Authorization': 'password ' + sessionStorage.getItem("tokenSophieBluel")
        }})
      .then(reponse => {console.log(reponse)})
      .catch ((error) => {console.log(error)})

      
      fetch("http://localhost:5678/api/works")
    .then ((reponse) => reponse.json())
    .then ((reponse) => {actualiser(reponse)})
    .catch ((error) => {console.log(error)})
}

function actualiser (reponse){
    projets = reponse;
    let gallery = document.querySelector(".galeryModif");
    gallery.innerHTML =  "";
    ajoutGalleryModif();
}

function ajoutPhoto(){
    document.querySelector(".innerPopup").innerHTML = '<a class="back" onclick="modifier()">B</a><div class="galerieTitle">Ajout photo</div><a class="close" href="#">&times;</a><div class ="galeryModif"></div>';
    let modfiG =  document.querySelector(".galeryModif");
        modfiG.innerHTML = '<div class="imageToAdd"></div><form class="modifWork"><input type="file" accept="image/*" id="uploadImage"><label for="uploadImage">+ Ajouter photo</label><br><label for="titre">Titre</label><input type="text" name="titre" id="titre"><label for="category">Catégorie</label>';
        modfiG.innerHTML += '<select name="category" id="categorySelect"><option value="test">test</option><option value="test">test</option></select><input type="submit" name="ajout"  value="Ajouter une photo" class="" onclick="testAdWork()"></form>';
    inputImg();
}

let image = new Image();
let file ;
function inputImg(){
  const inputPhoto = document.getElementById('uploadImage');

  inputPhoto.onchange = function(event) {
      file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        document.querySelector(".imageToAdd").innerHTML = '<img id="image" src="'+e.target.result+'" alt="Votre photo"></img>';
      };
      reader.readAsDataURL(file);
  }
}

function createFiltre(j){
    let filtres = document.querySelector(".filtres");
    if (j == -1)
        filtres.innerHTML += '<p class="filtre" onclick="filtre(' +0+ ')">Tous</p>';
    else 
        filtres.innerHTML += '<p class="filtre" onclick="filtre(' +(j+1)+ ')">' + categories[j] + '</p>';
}


function testAdWork(){
    let formData = new FormData();

    formData.append("image", file);
    formData.append("title","abc");
    formData.append("category",1);
    fetch("http://localhost:5678/api/works", 
      {method: 'POST',
      headers: {
        'Authorization': 'password ' + sessionStorage.getItem("tokenSophieBluel")
        },body: formData})
      .then(reponse => reponse.json())
      .then(reponse => {console.log(reponse)})
      .catch ((error) => {console.log(error)})
  } 

main()

