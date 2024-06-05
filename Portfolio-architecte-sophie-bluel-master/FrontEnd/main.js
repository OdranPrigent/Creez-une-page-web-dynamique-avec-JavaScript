let projets;
let categories = [];

function filtre(id){
    createGalery (projets, id);
}

function main () {
    fetch("http://localhost:5678/api/works")
    .then ((reponse) => reponse.json())
    .then ((reponse) => {createGalery(reponse, 0)})
    .catch ((error) => {})
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
            if (categories[j] == works[i].category.name){
                j = categories.length+1;
            }
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
    }
}

function modifier(){
    document.querySelector(".modeEdition").innerHTML = '<img src="assets/icons/Fa-Team-Fontawesome-Regular-FontAwesome-Regular-Pen-to-Square.svg" alt="icon pinceau sur une feuille" class="svgIcon">Mode édition';
    document.querySelector(".modeEdition").style.display = "flex";
    document.querySelector(".filtres").innerHTML = "";
    document.querySelector(".modifier").innerHTML = '<h2 id="mesProjets">Mes Projets</h2><div class="box"><a class="button" href="#popup1"><img src="assets/icons/Fa-Team-Fontawesome-Regular-FontAwesome-Regular-Pen-to-Square.svg" alt="icon pinceau sur une feuille" class="svgIcon">modifier</a></div>';
    document.querySelector(".aLogin").innerHTML = '<a onclick="logout()" >logout</a>';
    document.querySelector(".aLogin").style.fontWeight = 'bold';
    document.querySelector(".innerPopup").innerHTML = '<div class="galerieTitle">Galerie photo</div><a class="close" href="#">&times;</a><div class ="galeryModif"></div><span class="txtDecor"></span><a class="buttonAjoutPhoto" onclick="ajoutPhoto()">Ajouter une photo</a>';
    document.getElementById('mesProjets').style.marginLeft = "120px";
    ajoutGalleryModif();
}

function logout(){
    sessionStorage.setItem("tokenSophieBluel", "");
    document.location.href="index.html";
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
    for (let j =0; j<projets.length; j++){
        if (i == projets[j].id)
            projets.splice(j,1);
    }
    fetch("http://localhost:5678/api/works/"+i, 
      {method: 'DELETE',
      headers: {
        'Authorization': 'password ' + sessionStorage.getItem("tokenSophieBluel")
        }})
      .then(reponse => {createGalery(projets, 0)})
      .catch ((error) => {})
}

function ajoutPhoto(){
    document.querySelector(".innerPopup").innerHTML = '<a class="back" onclick="modifier()"><img src="assets/icons/arrow-left-solid.svg" alt="icon fleche"></a><div class="galerieTitle">Ajout photo</div><a class="close" href="#">&times;</a><div class ="galeryModif"></div>';
    let modfiG =  document.querySelector(".galeryModif");
    modfiG.innerHTML = '<div class="imageToAdd"><span class="iconImgInput"><img src="assets/icons/image-regular.svg" alt="icon image"></span><form class="innerInputImage"><input type="file" accept="image/*" id="uploadImage"><label for="uploadImage" class="addImage">+ Ajouter photo</label></form><p class="inputImgInfo">jpg, png : 4mo max</p></div><form class="modifWork"><label for="titre">Titre</label><input type="text" name="titre" id="titre" class="inputForm"><label for="category">Catégorie</label><select name="category" id="categorySelect" class="inputForm"><option value=""/></select></form><span class="txtDecor"></span><div class="valider" onclick="addWork()">Valider</div>';
    modfiG.style.flexDirection = 'column';
    for (let i =0; i<categories.length;i++)
        document.getElementById('categorySelect').innerHTML += '<option value="'+categories[i]+'">'+categories[i]+'</option>';
    inputImg();
    verifTitle();
}

let image = new Image();
let file ;
let fileLoad = false;
function inputImg(){
  const inputPhoto = document.getElementById('uploadImage');
  inputPhoto.onchange = function(event) {
      file = event.target.files[0];
      const reader = new FileReader();
      if (imageValid(file))
        reader.onload = function(e) {
            document.querySelector(".imageToAdd").innerHTML = '<img id="image" src="'+e.target.result+'" alt="Votre photo"></img>';
            document.querySelector(".imageToAdd").style.flexDirection = 'row';
            let img = document.querySelector(".imageToAdd img");
            img.style.filter='';
            img.style.width='150px';
            img.style.marginTop = '-20px';
            img.style.marginBottom = '-20px';
            fileLoad = true;
            verifValid();
        };
      else
        document.querySelector(".imageToAdd").innerHTML += '<p class="imageNonValid">Image non valide, veuillez recharger la page</p>';
    reader.readAsDataURL(file);
  }
}

function imageValid(file){
    if (file.type == "image/jpeg" || file.type == "image/png")
        if ((file.size / 1048576) < 4)
            return true;
    return false;
}

function createFiltre(j){
    let filtres = document.querySelector(".filtres");
    if (j == -1)
        filtres.innerHTML += '<p class="filtre" onclick="filtre(' +0+ ')">Tous</p>';
    else{
        for (let i=0; i<projets.length;i++)
            if (categories[j] == projets[i].category.name){
                filtres.innerHTML += '<p class="filtre" onclick="filtre(' +projets[i].category.id+ ')">' + categories[j] + '</p>';
                i = projets.length;
            }
    }
        
}


function addWork(){
    if (valid){
        if (!document.getElementById('titre').value)
            return;
        let formData = new FormData();
        formData.append("image", file);
        formData.append("title",document.getElementById('titre').value);
        for (j=0; j<categories.length; j++){
            if (categories[j] == document.getElementById('categorySelect').value){
                formData.append("category",j+1);
                j = categories.length;
            }          
        }
        let w = { category:{id:j+1, name:categories[j]}, categoryId:j+1, title:document.getElementById('titre').value, imageUrl:URL.createObjectURL(file)};
        projets.push(w);
        fetch("http://localhost:5678/api/works", 
          {method: 'POST',
          headers: {
            'Authorization': 'password ' + sessionStorage.getItem("tokenSophieBluel")
            },body: formData})
          .then(reponse => {createGalery(projets, 0)})
          .catch ((error) => {})
    }
}

function verifTitle() {
    const inputForm = document.getElementById('categorySelect');
    inputForm.onchange = function(event) {
        verifValid();
    }
    const titre = document.getElementById('titre');
    titre.onchange = function(event) {
        verifValid();
    }
}

let valid = false;
function verifValid(){
    valid = false;
    if (fileLoad)
        if (document.getElementById('titre').value)
            if (document.getElementById('categorySelect').value != ""){
                document.querySelector(".valider").style.backgroundColor = "#1D6154";
                valid = true;
                return;
            }
    document.querySelector(".valider").style.backgroundColor = "#A7A7A7";
    valid = false;
}

main();

